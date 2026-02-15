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

const CHART_COLORS = ["#FF7A6C", "#FFB09C", "#5EEB84", "#6B6B6B", "#2B2B2B", "#FF7A6C", "#FFB09C"];

interface TrendsChartProps {
  data: Array<Record<string, string | number>>;
}

function formatTooltipVal(val: number, code: string): string {
  if (code.includes("GINI")) return val.toFixed(1);
  if (code.includes("ZS") || code.includes("USER") || code.includes("ELC")) return `${val.toFixed(1)}%`;
  if (code.includes("GDP") || code.includes("GROWTH") || code.includes("ZG")) return `${val.toFixed(1)}%`;
  if (code.includes("LE00")) return `${val.toFixed(1)} yrs`;
  return val.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value?: number; color?: string }>; label?: string }) => {
  if (!active || !payload?.length || !label) return null;
  return (
    <div className="rounded-xl border border-soft-border shadow-soft-card bg-white px-4 py-3 ">
      <p className="text-soft-accent text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((p) => {
          const cfg = TREND_CHART_INDICATORS.find((c) => c.code === p.name);
          if (!cfg || p.value == null) return null;
          return (
            <div key={p.name} className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
              <span className="text-soft-ink-muted">{cfg.label}:</span>
              <span className="text-soft-ink font-semibold tabular-nums">
                {formatTooltipVal(Number(p.value), p.name)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function TrendsChart({ data }: TrendsChartProps) {
  const lines = useMemo(
    () =>
      TREND_CHART_INDICATORS.map(({ code, label, color }, i) => ({
        code,
        label,
        color: CHART_COLORS[i] ?? color,
      })),
    []
  );

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const keys = Object.keys(row).filter((k) => k !== "year");
      return keys.some((k) => row[k] != null && row[k] !== "");
    });
  }, [data]);

  if (filteredData.length === 0) {
    return (
      <div className="rounded-xl border border-soft-border shadow-soft-card bg-white p-8 h-[320px] flex items-center justify-center">
        <p className="text-soft-ink-muted text-sm">No data for that range—try widening the years.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-soft-border shadow-soft-card bg-white p-8">
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" vertical={false} />
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B6B6B", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B6B6B", fontSize: 11 }}
              dx={-8}
              tickFormatter={(v) => (Number(v) % 1 === 0 ? String(v) : v.toFixed(1))}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#FF7A6C", strokeOpacity: 0.2 }} />
            <Legend
              wrapperStyle={{ paddingTop: 16 }}
              formatter={(value) => (
                <span className="text-soft-ink-muted text-xs">{value}</span>
              )}
              iconType="line"
              iconSize={8}
            />
            {lines.map(({ code, color }) => (
              <Line
                key={code}
                type="monotone"
                dataKey={code}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: color, stroke: "#fff", strokeWidth: 1 }}
                connectNulls
                isAnimationActive
                animationDuration={400}
                animationEasing="ease-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
