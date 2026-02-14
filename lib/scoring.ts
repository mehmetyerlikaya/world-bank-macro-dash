/**
 * Scoring and normalization logic for World Bank indicators.
 * Min-max normalization over available values, inverted for "bad" indicators.
 */

import { INDICATORS, INVERSED_INDICATORS } from "./worldbank";

export interface DataPoint {
  year: string;
  value: number;
}

export interface NormalizedIndicator {
  indicator: string;
  label: string;
  unit?: string;
  values: DataPoint[];
  latestYear?: string;
  latestValue?: number;
  score: number; // 0-100
  previousScore?: number;
  delta?: number;
}

/** Min-max normalize a single value within [min, max]. Result 0-100. */
function minMaxNorm(value: number, min: number, max: number): number {
  const range = max - min;
  if (range <= 0) return 50;
  const raw = ((value - min) / range) * 100;
  return Math.max(0, Math.min(100, raw));
}

/** Score 0-100 for "good" indicators; invert for "bad" (unemployment, gini, CO2). */
function toScore(
  value: number,
  min: number,
  max: number,
  inverse: boolean
): number {
  const raw = minMaxNorm(value, min, max);
  return inverse ? 100 - raw : raw;
}

/** Compute min/max from numeric values, ignore NaN/undefined. */
function getMinMax(values: number[]): { min: number; max: number } {
  const valid = values.filter((v) => typeof v === "number" && !Number.isNaN(v));
  if (valid.length === 0) return { min: 0, max: 1 };
  return { min: Math.min(...valid), max: Math.max(...valid) };
}

/** Normalize indicator values to 0-100 score. Returns null if no valid data. */
export function normalizeIndicator(
  indicator: string,
  label: string,
  values: DataPoint[]
): NormalizedIndicator | null {
  const numeric = values
    .filter((v) => v.value != null && !Number.isNaN(Number(v.value)))
    .map((v) => ({ year: v.year, value: Number(v.value) }));

  if (numeric.length === 0)
    return { indicator, label, values: [], score: 0 };

  const numbers = numeric.map((n) => n.value);
  const { min, max } = getMinMax(numbers);
  const inverse = (INVERSED_INDICATORS as Set<string>).has(indicator);

  const sorted = [...numeric].sort(
    (a, b) => parseInt(b.year, 10) - parseInt(a.year, 10)
  );
  const latest = sorted[0];
  const previous = sorted[1];

  const latestScore = toScore(latest.value, min, max, inverse);
  const previousScore = previous
    ? toScore(previous.value, min, max, inverse)
    : undefined;
  const delta = previousScore != null ? latestScore - previousScore : undefined;

  return {
    indicator,
    label,
    values: numeric,
    latestYear: latest.year,
    latestValue: latest.value,
    score: Math.round(latestScore),
    previousScore,
    delta: delta != null ? Math.round(delta * 10) / 10 : undefined,
  };
}

/** Bucket definitions for Signal Distribution cards */
export interface BucketConfig {
  id: string;
  name: string;
  indicators: string[];
  weights?: number[]; // default equal
}

export const BUCKETS: BucketConfig[] = [
  {
    id: "prosperity",
    name: "Prosperity",
    indicators: [INDICATORS.GDP_PCAP, INDICATORS.GDP_GROWTH],
    weights: [0.7, 0.3],
  },
  {
    id: "employment",
    name: "Employment",
    indicators: [INDICATORS.UNEMPLOYMENT],
    weights: [1],
  },
  {
    id: "connectivity",
    name: "Connectivity",
    indicators: [INDICATORS.INTERNET],
    weights: [1],
  },
  {
    id: "inequality",
    name: "Inequality",
    indicators: [INDICATORS.GINI],
    weights: [1],
  },
];

/** Compute bucket score from normalized indicators. Returns null if no data. */
export function computeBucketScore(
  bucket: BucketConfig,
  normalized: Map<string, NormalizedIndicator | null>
): {
  score: number;
  delta?: number;
  indicators: Array<{ code: string; label: string; latestValue?: number; latestYear?: string }>;
} | null {
  const weights = bucket.weights ?? bucket.indicators.map(() => 1);
  let totalWeight = 0;
  let weightedSum = 0;
  const indicators: Array<{
    code: string;
    label: string;
    latestValue?: number;
    latestYear?: string;
  }> = [];

  for (let i = 0; i < bucket.indicators.length; i++) {
    const ind = bucket.indicators[i];
    const norm = normalized.get(ind);
    if (!norm || norm.values.length === 0) continue;

    const w = weights[i] ?? 1;
    totalWeight += w;
    weightedSum += norm.score * w;
    indicators.push({
      code: ind,
      label: norm.label,
      latestValue: norm.latestValue,
      latestYear: norm.latestYear,
    });
  }

  if (totalWeight === 0) return null;

  const score = Math.round(weightedSum / totalWeight);
  const deltas = indicators
    .map((ind) => {
      const n = normalized.get(ind.code);
      return n?.delta;
    })
    .filter((d): d is number => d != null);
  const delta =
    deltas.length > 0
      ? Math.round((deltas.reduce((a, b) => a + b, 0) / deltas.length) * 10) / 10
      : undefined;

  return {
    score: Math.max(0, Math.min(100, score)),
    delta,
    indicators,
  };
}
