"use client";

import { TooltipCard } from "./TooltipCard";

interface RowData {
  indicator: string;
  label: string;
  score: number;
  values: Array<{ year: string; value: number }>;
  latestYear?: string;
  side: "momentum" | "friction";
  explanation: string;
}

const MOMENTUM_EXPLANATIONS: Record<string, string> = {
  "NY.GDP.PCAP.KD.ZG": "Real GDP per capita growth—the classic expansion and purchasing power metric.",
  "IT.NET.USER.ZS": "Internet adoption—captures digital access and information flows.",
};

const FRICTION_EXPLANATIONS: Record<string, string> = {
  "SL.UEM.TOTL.ZS": "Unemployment—labor market slack, fewer people earning income.",
  "FP.CPI.TOTL.ZG": "Inflation—erodes real incomes and can squeeze investment.",
  "EN.ATM.CO2E.PC": "Per capita emissions—resource intensity and transition pressure.",
  "SI.POV.GINI": "Inequality—how evenly gains are shared.",
};

function getExplanation(indicator: string, side: "momentum" | "friction"): string {
  if (side === "momentum") return MOMENTUM_EXPLANATIONS[indicator] ?? "Pulls growth in the right direction.";
  return FRICTION_EXPLANATIONS[indicator] ?? "Acts as a drag on growth.";
}

function formatCompactVal(val: number, ind: string): string {
  if (ind.includes("GINI")) return val.toFixed(1);
  if (ind.includes("ZS") || ind.includes("USER")) return `${val.toFixed(0)}%`;
  if (ind.includes("GDP")) return `${val.toFixed(1)}%`;
  if (ind.includes("CO2")) return val.toFixed(0);
  return val.toFixed(1);
}

export function MirrorChart({
  momentum,
  friction,
}: {
  momentum: Array<{ indicator: string; label: string; score: number; values: Array<{ year: string; value: number }>; latestYear?: string }>;
  friction: Array<{ indicator: string; label: string; score: number; values: Array<{ year: string; value: number }>; latestYear?: string }>;
}) {
  const momentumRows: RowData[] = momentum.map((m) => ({
    ...m,
    side: "momentum" as const,
    explanation: getExplanation(m.indicator, "momentum"),
  }));

  const frictionRows: RowData[] = friction.map((f) => ({
    ...f,
    side: "friction" as const,
    explanation: getExplanation(f.indicator, "friction"),
  }));

  const allRows: RowData[] = [...momentumRows, ...frictionRows];

  return (
    <div className="rounded-xl border border-soft-border bg-white p-8 shadow-soft-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-card-hover">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-soft-accent text-xs font-semibold uppercase tracking-wider">
          Growth Levers and Headwinds
        </h3>
        <div className="flex gap-4 text-xs text-soft-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-soft-positive" aria-hidden />
            Levers
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-soft-negative" aria-hidden />
            Headwinds
          </span>
        </div>
      </div>
      <div className="space-y-6">
        {allRows.map((row) => (
          <MirrorRow key={row.indicator} row={row} />
        ))}
      </div>
    </div>
  );
}

function MirrorRow({ row }: { row: RowData }) {
  const barWidth = row.score;

  const tooltipContent = (
    <div className="space-y-2">
      <p className="text-soft-ink font-semibold">{row.label}</p>
      {row.values.length > 0 ? (
        <>
          <p className="text-xs text-soft-ink-muted">Recent values:</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
            {row.values.map((v) => (
              <span
                key={v.year}
                className={
                  v.year === row.latestYear ? "text-soft-ink font-semibold" : "text-soft-ink-muted"
                }
              >
                {v.year}: {formatCompactVal(v.value, row.indicator)}
              </span>
            ))}
          </div>
        </>
      ) : (
        <p className="text-soft-ink-muted text-xs">No data</p>
      )}
      <p className="text-soft-ink-muted text-xs pt-2 border-t border-soft-border mt-2">
        {row.explanation}
      </p>
    </div>
  );

  return (
    <TooltipCard trigger={
      <div className="group/row flex items-center gap-5 cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-soft-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-soft-paper rounded py-1.5 -my-1.5 transition-colors duration-200 hover:bg-soft-base/50">
        <div className="w-40 sm:w-52 flex-shrink-0 text-sm text-soft-ink-muted truncate" title={row.label}>
          {row.label}
        </div>
        <div className="flex-1 flex items-stretch h-7 min-w-0">
          <div className="flex-1 flex justify-end pr-2">
            {row.side === "momentum" && barWidth > 0 ? (
              <div
                className="h-full bg-soft-positive/40 rounded-l transition-all duration-300 group-hover/row:bg-soft-positive/55"
                style={{ width: `${barWidth}%` }}
              />
            ) : (
              <div className="h-full w-0" />
            )}
          </div>
          <div className="w-px bg-soft-border flex-shrink-0" aria-hidden />
          <div className="flex-1 flex justify-start pl-2">
            {row.side === "friction" && barWidth > 0 ? (
              <div
                className="h-full bg-soft-negative/40 rounded-r ml-auto transition-all duration-300 group-hover/row:bg-soft-negative/55"
                style={{ width: `${barWidth}%` }}
              />
            ) : (
              <div className="h-full w-0" />
            )}
          </div>
        </div>
      </div>
    } title={row.side === "momentum" ? "Lever" : "Headwind"}>
      {tooltipContent}
    </TooltipCard>
  );
}
