/**
 * World Bank API proxy with Zod validation and caching.
 * Query params: country, from, to
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  INDICATORS,
  INDICATOR_LABELS,
  TREND_CHART_INDICATORS,
  DIFF_CHART_INDICATORS,
  buildWorldBankUrl,
} from "@/lib/worldbank";
import {
  normalizeIndicator,
  computeBucketScore,
  BUCKETS,
  type NormalizedIndicator,
} from "@/lib/scoring";

/** World Bank API returns [metadata, data[]]. Data entries have indicator, country, value, date. */
const WorldBankEntrySchema = z.object({
  indicator: z.object({ id: z.string(), value: z.string().optional() }),
  country: z.object({ id: z.string(), value: z.string().optional() }).optional(),
  value: z.union([z.string(), z.number(), z.null()]),
  date: z.string(),
});

const WorldBankResponseSchema = z.tuple([
  z.object({ total: z.number().optional(), page: z.number().optional() }),
  z.array(WorldBankEntrySchema),
]);

/** Normalized internal format for API response */
export interface ApiIndicator {
  indicator: string;
  label: string;
  unit?: string;
  values: Array<{ year: string; value: number }>;
  latestYear?: string;
  latestValue?: number;
  score: number;
  previousScore?: number;
  delta?: number;
}

export interface ApiBucket {
  id: string;
  name: string;
  score: number;
  delta?: number;
  indicators: Array<{
    code: string;
    label: string;
    latestValue?: number;
    latestYear?: string;
  }>;
}

export interface ApiResponse {
  country: string;
  from: string;
  to: string;
  latestYear: string;
  indicators: ApiIndicator[];
  buckets: ApiBucket[];
  momentumFriction: {
    momentum: Array<{ indicator: string; label: string; score: number; values: DataPoint[]; latestYear?: string }>;
    friction: Array<{ indicator: string; label: string; score: number; values: DataPoint[]; latestYear?: string }>;
  };
  /** Full time-series for trend charts (year ascending) */
  timeSeries: Array<Record<string, string | number>>;
  /** Year-over-year absolute change for diff chart */
  yearOverYearDiffs: Array<Record<string, string | number>>;
}

interface DataPoint {
  year: string;
  value: number;
}

const MOMENTUM_INDICATORS = [
  { ind: INDICATORS.GDP_GROWTH, label: INDICATOR_LABELS[INDICATORS.GDP_GROWTH] },
  { ind: INDICATORS.INTERNET, label: INDICATOR_LABELS[INDICATORS.INTERNET] },
];
// 5 rows total: 2 momentum + 3 friction. Inflation preferred; CO2 used if Inflation sparse.
const FRICTION_INDICATORS = [
  { ind: INDICATORS.UNEMPLOYMENT, label: INDICATOR_LABELS[INDICATORS.UNEMPLOYMENT] },
  { ind: INDICATORS.INFLATION, label: INDICATOR_LABELS[INDICATORS.INFLATION] },
  { ind: INDICATORS.GINI, label: INDICATOR_LABELS[INDICATORS.GINI] },
];

async function fetchIndicator(
  country: string,
  indicator: string,
  from: string,
  to: string
): Promise<{ year: string; value: number }[]> {
  const url = buildWorldBankUrl(country, indicator, from, to);
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const json = await res.json();
  const parsed = WorldBankResponseSchema.safeParse(json);
  if (!parsed.success) return [];

  const [, data] = parsed.data;
  return data
    .filter((d): d is typeof d & { value: string | number } => d.value !== null && d.value !== "" && d.value !== undefined)
    .map((d) => {
      const num = typeof d.value === "string" ? parseFloat(d.value) : d.value;
      return { year: d.date, value: num };
    })
    .filter((v): v is { year: string; value: number } => !Number.isNaN(v.value))
    .sort((a, b) => parseInt(b.year, 10) - parseInt(a.year, 10));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") ?? "DEU";
  const from = searchParams.get("from") ?? "2014";
  const to = searchParams.get("to") ?? "2024";

  const allIndicators = [
    ...Object.values(INDICATORS),
    ...MOMENTUM_INDICATORS.map((m) => m.ind),
    ...FRICTION_INDICATORS.map((f) => f.ind),
    ...TREND_CHART_INDICATORS.map((t) => t.code),
    ...DIFF_CHART_INDICATORS.map((d) => d.code),
  ];
  const uniqueIndicators = [...new Set(allIndicators)];

  const rawData = await Promise.all(
    uniqueIndicators.map((ind) =>
      fetchIndicator(country, ind, from, to).then((values) => ({
        indicator: ind,
        values,
      }))
    )
  );

  const normalizedMap = new Map<string, NormalizedIndicator | null>();
  for (const { indicator, values } of rawData) {
    const label = INDICATOR_LABELS[indicator] ?? indicator;
    normalizedMap.set(
      indicator,
      normalizeIndicator(indicator, label, values)
    );
  }

  const indicators: ApiIndicator[] = rawData.map(({ indicator, values }) => {
    const norm = normalizedMap.get(indicator);
    const label = INDICATOR_LABELS[indicator] ?? indicator;
    if (!norm) {
      return {
        indicator,
        label,
        values,
        score: 0,
      };
    }
    return {
      indicator,
      label,
      values: norm.values,
      latestYear: norm.latestYear,
      latestValue: norm.latestValue,
      score: norm.score,
      previousScore: norm.previousScore,
      delta: norm.delta,
    };
  });

  const buckets: ApiBucket[] = BUCKETS.map((bucket) => {
    const result = computeBucketScore(bucket, normalizedMap);
    if (!result) {
      return {
        id: bucket.id,
        name: bucket.name,
        score: 0,
        indicators: [],
      };
    }
    return {
      id: bucket.id,
      name: bucket.name,
      score: result.score,
      delta: result.delta,
      indicators: result.indicators,
    };
  });

  const momentum = MOMENTUM_INDICATORS.map(({ ind, label }) => {
    const norm = normalizedMap.get(ind);
    const values = rawData.find((r) => r.indicator === ind)?.values ?? [];
    return {
      indicator: ind,
      label,
      score: norm?.score ?? 0,
      values: values.slice(0, 5).map((v) => ({ year: v.year, value: v.value })),
      latestYear: norm?.latestYear,
    };
  });

  const friction = FRICTION_INDICATORS.map(({ ind, label }) => {
    const norm = normalizedMap.get(ind);
    const values = rawData.find((r) => r.indicator === ind)?.values ?? [];
    return {
      indicator: ind,
      label,
      score: norm?.score ?? 0,
      values: values.slice(0, 5).map((v) => ({ year: v.year, value: v.value })),
      latestYear: norm?.latestYear,
    };
  });

  const allYears = indicators
    .flatMap((i) => (i.latestYear ? [i.latestYear] : []))
    .filter(Boolean);
  const latestYear =
    allYears.length > 0
      ? allYears.reduce((a, b) => (parseInt(a, 10) > parseInt(b, 10) ? a : b))
      : to;

  const valuesByIndicator = new Map(
    rawData.map((r) => [r.indicator, r.values])
  );

  const yearsSet = new Set<string>();
  rawData.forEach((r) => r.values.forEach((v) => yearsSet.add(v.year)));
  const sortedYears = [...yearsSet].sort(
    (a, b) => parseInt(a, 10) - parseInt(b, 10)
  );

  const timeSeries = sortedYears.map((year) => {
    const row: Record<string, string | number> = { year };
    TREND_CHART_INDICATORS.forEach(({ code }) => {
      const vals = valuesByIndicator.get(code) ?? [];
      const entry = vals.find((v) => v.year === year);
      if (entry) row[code] = entry.value;
    });
    return row;
  });

  const diffsByIndicator = new Map<string, Array<{ year: string; diff: number }>>();
  DIFF_CHART_INDICATORS.forEach(({ code }) => {
    const vals = (valuesByIndicator.get(code) ?? []).sort(
      (a, b) => parseInt(a.year, 10) - parseInt(b.year, 10)
    );
    const diffs: Array<{ year: string; diff: number }> = [];
    for (let i = 1; i < vals.length; i++) {
      diffs.push({
        year: vals[i].year,
        diff: vals[i].value - vals[i - 1].value,
      });
    }
    diffsByIndicator.set(code, diffs);
  });

  const diffYearsSet = new Set<string>();
  diffsByIndicator.forEach((diffs) =>
    diffs.forEach((d) => diffYearsSet.add(d.year))
  );
  const sortedDiffYears = [...diffYearsSet].sort(
    (a, b) => parseInt(a, 10) - parseInt(b, 10)
  );

  const yearOverYearDiffs = sortedDiffYears.map((year) => {
    const row: Record<string, string | number> = { year };
    DIFF_CHART_INDICATORS.forEach(({ code }) => {
      const diffs = diffsByIndicator.get(code) ?? [];
      const entry = diffs.find((d) => d.year === year);
      if (entry) row[code] = Math.round(entry.diff * 100) / 100;
    });
    return row;
  });

  const response: ApiResponse = {
    country,
    from,
    to,
    latestYear,
    indicators,
    buckets,
    momentumFriction: { momentum, friction },
    timeSeries,
    yearOverYearDiffs,
  };

  return NextResponse.json(response);
}
