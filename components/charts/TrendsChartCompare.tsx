"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMemo } from "react";
import { TREND_CHART_INDICATORS } from "@/lib/worldbank";
import { COUNTRIES } from "@/lib/worldbank";
import type { ApiResponse } from "@/lib/worldbank-api";

const COUNTRY_COLORS = ["#FF7A6C", "#2d5a4a", "#3d7a65", "#6b5344", "#5c4033"];

function formatTooltipVal(val: number, code: string): string {
  if (code.includes("GINI")) return val.toFixed(1);
  if (code.includes("ZS") || code.includes("USER") || code.includes("ELC")) return `${val.toFixed(1)}%`;
  if (code.includes("GDP") || code.includes("GROWTH") || code.includes("ZG")) return `${val.toFixed(1)}%`;
  if (code.includes("LE00")) return `${val.toFixed(1)} yrs`;
  return val.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

function getCountryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

interface TrendsChartCompareProps {
  data: ApiResponse[];
  indicatorCode: string;
  indicatorLabel: string;
}

export function TrendsChartCompare({
  data,
  indicatorCode,
  indicatorLabel,
}: TrendsChartCompareProps) {
  const chartData = useMemo(() => {
    const yearMap = new Map<string, Record<string, string | number>>();
    data.forEach((d, i) => {
      const countryCode = d.country;
      d.timeSeries.forEach((row) => {
        const year = String(row.year);
        const val = row[indicatorCode];
        if (val == null || val === "") return;
        let entry = yearMap.get(year);
        if (!entry) {
          entry = { year };
          yearMap.set(year, entry);
        }
        entry[countryCode] = typeof val === "number" ? val : parseFloat(String(val));
      });
    });
    return [...yearMap.entries()]
      .sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10))
      .map(([, row]) => row);
  }, [data, indicatorCode]);

  const hasData = chartData.some((row) =>
    data.some((d) => row[d.country] != null && !Number.isNaN(Number(row[d.country])))
  );

  if (!hasData) return null;

  return (
    <div className="rounded-xl border border-soft-border shadow-soft-card bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-soft-card-hover">
      <h4 className="text-soft-accent text-xs font-semibold uppercase tracking-wider mb-4 truncate">
        {indicatorLabel}
      </h4>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" vertical={false} />
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B6B6B", fontSize: 10 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B6B6B", fontSize: 10 }}
              dx={-8}
              tickFormatter={(v) => (Number(v) % 1 === 0 ? String(v) : v.toFixed(1))}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length || !label) return null;
                return (
                  <div className="rounded-xl border border-soft-border shadow-soft-card bg-white px-4 py-3">
                    <p className="text-soft-accent text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
                    <div className="space-y-1">
                      {payload
                        .filter((p) => p.value != null && !Number.isNaN(Number(p.value)))
                        .map((p) => (
                          <div key={p.name} className="flex items-center gap-2 text-sm">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  COUNTRY_COLORS[data.findIndex((d) => d.country === p.name)] ??
                                  "#6B6B6B",
                              }}
                            />
                            <span className="text-soft-ink-muted">{getCountryName(p.name)}:</span>
                            <span className="text-soft-ink font-semibold tabular-nums">
                              {formatTooltipVal(Number(p.value), indicatorCode)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              }}
              cursor={{ stroke: "#FF7A6C", strokeOpacity: 0.2 }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 8 }}
              formatter={(value) => (
                <span className="text-soft-ink-muted text-xs">{getCountryName(value)}</span>
              )}
              iconType="line"
              iconSize={8}
            />
            {data.map((d, i) => (
              <Line
                key={d.country}
                type="monotone"
                dataKey={d.country}
                name={d.country}
                stroke={COUNTRY_COLORS[i] ?? "#6B6B6B"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: COUNTRY_COLORS[i], stroke: "#fff", strokeWidth: 1 }}
                connectNulls
                isAnimationActive
                animationDuration={800}
                animationEasing="ease-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
