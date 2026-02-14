"use client";

import { TooltipCard } from "./TooltipCard";
import { WaffleGrid } from "./WaffleGrid";

interface IndicatorInfo {
  code: string;
  label: string;
  latestValue?: number;
  latestYear?: string;
}

interface SignalCardProps {
  name: string;
  score: number;
  delta?: number;
  indicators: IndicatorInfo[];
  interpretation: string;
}

function formatValue(val: number, code: string): string {
  if (code.includes("GINI")) return val.toFixed(1);
  if (code.includes("ZS") || code.includes("USER")) return `${val.toFixed(1)}%`;
  if (code.includes("GDP") && code.includes("CD")) return `$${Math.round(val).toLocaleString()}`;
  if (code.includes("GROWTH") || code.includes("ZG")) return `${val.toFixed(1)}%`;
  if (code.includes("CO2")) return `${val.toFixed(1)} t`;
  return val.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

export function SignalCard({
  name,
  score,
  delta,
  indicators,
  interpretation,
}: SignalCardProps) {
  const hasData = indicators.length > 0;
  const displayScore = hasData ? score : null;
  const displayDelta = hasData && delta != null ? delta : null;

  const tooltipContent = hasData ? (
    <div className="space-y-2">
      {indicators.map((ind) => (
        <div key={ind.code}>
          <span className="text-ledger-accent font-mono text-xs">{ind.code}</span>
          <br />
          <span className="text-ledger-ink">{ind.label}</span>
          {ind.latestValue != null && ind.latestYear && (
            <p className="text-ledger-ink-muted text-xs mt-0.5">
              {formatValue(ind.latestValue, ind.code)} ({ind.latestYear})
            </p>
          )}
        </div>
      ))}
      <p className="text-ledger-ink-muted text-xs pt-2 border-t border-ledger-border mt-2">
        {interpretation}
      </p>
    </div>
  ) : (
    <p className="text-ledger-ink-muted">No data for this period.</p>
  );

  const cardContent = (
    <div className="group relative rounded border-2 border-ledger-border bg-white p-6 transition-all duration-300 hover:border-ledger-accent/40 hover:shadow-md focus-within:ring-2 focus-within:ring-ledger-accent/30 focus-within:ring-offset-2 focus-within:ring-offset-ledger-paper cursor-help">
      <p className="text-ledger-accent text-xs font-semibold uppercase tracking-wider mb-3">
        {name}
      </p>
      {hasData ? (
        <>
          <div className="flex items-baseline gap-2 mb-5">
            <span className="font-display text-4xl font-bold text-ledger-ink tabular-nums">
              {displayScore}
            </span>
            {displayDelta != null && (
              <span
                className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                  displayDelta >= 0
                    ? "text-ledger-positive bg-ledger-positive/10"
                    : "text-ledger-negative bg-ledger-negative/10"
                }`}
              >
                {displayDelta >= 0 ? "+" : ""}
                {displayDelta}
              </span>
            )}
          </div>
          <WaffleGrid score={displayScore ?? 0} />
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="font-display text-lg text-ledger-ink-faint italic">No data</p>
          <div className="opacity-40">
            <WaffleGrid score={0} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <TooltipCard trigger={cardContent} title={hasData ? "Indicators" : undefined}>
      {tooltipContent}
    </TooltipCard>
  );
}
