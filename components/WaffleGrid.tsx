"use client";

/**
 * 10x10 waffle grid: filled dots = score (0–100). Ledger aesthetic.
 */

export function WaffleGrid({ score }: { score: number }) {
  const filled = Math.round(Math.max(0, Math.min(100, score)));
  const cells = Array.from({ length: 100 }, (_, i) => i < filled);

  return (
    <div
      className="grid grid-cols-10 gap-[2px] w-full max-w-[132px]"
      role="img"
      aria-label={`Score ${filled} out of 100`}
    >
      {cells.map((filled, i) => (
        <div
          key={i}
          className={`aspect-square rounded-sm transition-colors duration-250 ${
            filled
              ? "bg-ledger-accent/60 group-hover:bg-ledger-accent/70"
              : "bg-ledger-border"
          }`}
        />
      ))}
    </div>
  );
}
