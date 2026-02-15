"use client";

/** Skeleton loaders — Ledger design */

function SkeletonCard() {
  return (
    <div className="rounded border border-soft-border bg-soft-base rounded-xl p-6 overflow-hidden">
      <div className="h-3 w-20 bg-soft-border rounded animate-shimmer mb-4" />
      <div className="h-10 w-14 bg-soft-border rounded animate-shimmer mb-6" />
      <div className="grid grid-cols-10 gap-[2px]">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-sm bg-soft-border/60" />
        ))}
      </div>
    </div>
  );
}

export function SignalCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function MirrorChartSkeleton() {
  return (
    <div className="rounded border border-soft-border bg-soft-base rounded-xl p-8 overflow-hidden">
      <div className="h-3 w-48 bg-soft-border rounded animate-shimmer mb-8" />
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-5">
            <div className="h-4 w-40 bg-soft-border rounded animate-shimmer flex-shrink-0" />
            <div className="flex-1 flex gap-2 h-7">
              <div className="flex-[0_0_45%] bg-soft-border/60 rounded-l" />
              <div className="flex-[0_0_45%] bg-soft-border/60 rounded-r ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded border border-soft-border bg-soft-base rounded-xl p-8 overflow-hidden">
      <div className="h-3 w-40 bg-soft-border rounded animate-shimmer mb-6" />
      <div className="h-[280px] bg-soft-border/40 rounded animate-shimmer" />
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse">
      <div>
        <div className="h-7 w-48 bg-soft-base rounded mb-2" />
        <div className="h-4 w-64 bg-soft-base rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-32 bg-soft-base rounded" />
        <div className="h-9 w-36 bg-soft-base rounded" />
        <div className="h-9 w-24 bg-soft-base rounded" />
      </div>
    </div>
  );
}
