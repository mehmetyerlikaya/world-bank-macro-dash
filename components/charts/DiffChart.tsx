"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { useMemo } from "react";
import { DIFF_CHART_INDICATORS } from "@/lib/worldbank";

interface DiffChartProps {
  data: Array<Record<string, string | number>>;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length || !label) return null;
  return (
    <div className="rounded-xl border border-soft-border shadow-soft-card bg-white px-4 py-3 ">
      <p className="text-soft-accent text-xs font-semibold uppercase tracking-wider mb-2">
        YoY change ({label})
      </p>
      <div className="space-y-1">
        {payload
          .filter((p) => p.value != null && !Number.isNaN(Number(p.value)))
          .map((p) => {
            const cfg = DIFF_CHART_INDICATORS.find((c) => c.code === p.name);
            if (!cfg) return null;
            const val = Number(p.value);
            const isPositive = val >= 0;
            const isGood = cfg.improveUp ? isPositive : !isPositive;
            return (
              <div key={p.name} className="flex items-center justify-between gap-4 text-sm">
                <span className="text-soft-ink-muted">{cfg.label}:</span>
                <span
                  className={`font-semibold tabular-nums ${
                    isGood ? "text-soft-positive" : "text-soft-negative"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {val.toFixed(2)}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export function DiffChart({ data }: DiffChartProps) {
  const indicators = useMemo(() => [...DIFF_CHART_INDICATORS], []);

  const chartData = useMemo(() => {
    return data.map((row) => {
      const out: Record<string, string | number> = { year: row.year };
      indicators.forEach(({ code }) => {
        const v = row[code];
        if (v != null && v !== "" && !Number.isNaN(Number(v))) {
          out[code] = Number(v);
        }
      });
      return out;
    });
  }, [data, indicators]);

  const flattened = useMemo(() => {
    const rows: Array<{ year: string; indicator: string; label: string; value: number; improveUp: boolean }> = [];
    chartData.forEach((row) => {
      indicators.forEach(({ code, label, improveUp }) => {
        const v = row[code];
        if (v != null && !Number.isNaN(Number(v))) {
          rows.push({
            year: String(row.year),
            indicator: code,
            label,
            value: Number(v),
            improveUp,
          });
        }
      });
    });
    return rows;
  }, [chartData, indicators]);

  const byYear = useMemo(() => {
    const map = new Map<string, typeof flattened>();
    flattened.forEach((r) => {
      const list = map.get(r.year) ?? [];
      list.push(r);
      map.set(r.year, list);
    });
    return [...map.entries()].sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10));
  }, [flattened]);

  if (byYear.length === 0) {
    return (
      <div className="rounded-xl border border-soft-border shadow-soft-card bg-white p-8 h-[320px] flex items-center justify-center">
        <p className="text-soft-ink-muted text-sm">No YoY deltas here—check a different range.</p>
      </div>
    );
  }

  const maxAbs = Math.max(
    ...flattened.map((r) => Math.abs(r.value)),
    0.1
  );

  return (
    <div className="rounded-xl border border-soft-border shadow-soft-card bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-soft-card-hover">
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 60, bottom: 8 }}
            barCategoryGap="20%"
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" horizontal={false} />
            <XAxis
              type="number"
              domain={[-maxAbs, maxAbs]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B6B6B", fontSize: 11 }}
              tickFormatter={(v) => (v >= 0 ? `+${v}` : String(v))}
            />
            <YAxis
              type="category"
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B6B6B", fontSize: 11 }}
              width={44}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,122,108,0.06)" }} />
            <ReferenceLine x={0} stroke="#6B6B6B" strokeOpacity={0.3} strokeWidth={1} />
            {indicators.map(({ code, label }) => (
              <Bar
                key={code}
                dataKey={code}
                name={label}
                maxBarSize={24}
                radius={[0, 2, 2, 0]}
                isAnimationActive
                animationDuration={800}
                animationEasing="ease-out"
              >
                {chartData.map((entry, i) => {
                  const v = entry[code];
                  if (v == null || Number.isNaN(Number(v))) return null;
                  const val = Number(v);
                  return (
                    <Cell
                      key={`${entry.year}-${i}`}
                      fill={val >= 0 ? "rgba(94,235,132,0.6)" : "rgba(255,122,108,0.6)"}
                    />
                  );
                })}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
