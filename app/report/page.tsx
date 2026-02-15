"use client";

import useSWR from "swr";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { CountrySelect } from "@/components/controls/CountrySelect";
import { RangeSelect } from "@/components/controls/RangeSelect";
import { SignalCard } from "@/components/SignalCard";
import { MirrorChart } from "@/components/MirrorChart";
import { TrendsChart } from "@/components/charts/TrendsChart";
import { DiffChart } from "@/components/charts/DiffChart";
import {
  SignalCardsSkeleton,
  MirrorChartSkeleton,
  ChartSkeleton,
} from "@/components/Skeletons";

interface ApiBucket {
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

interface ApiResponse {
  country: string;
  from: string;
  to: string;
  latestYear: string;
  indicators: Array<{
    indicator: string;
    label: string;
    values: Array<{ year: string; value: number }>;
    latestYear?: string;
    latestValue?: number;
    score: number;
    delta?: number;
  }>;
  buckets: ApiBucket[];
  momentumFriction: {
    momentum: Array<{
      indicator: string;
      label: string;
      score: number;
      values: Array<{ year: string; value: number }>;
      latestYear?: string;
    }>;
    friction: Array<{
      indicator: string;
      label: string;
      score: number;
      values: Array<{ year: string; value: number }>;
      latestYear?: string;
    }>;
  };
  timeSeries: Array<Record<string, string | number>>;
  yearOverYearDiffs: Array<Record<string, string | number>>;
}

const BUCKET_INTERPRETATIONS: Record<string, string> = {
  prosperity: "GDP per capita and growth combined—higher score means stronger output per person.",
  employment: "Inverted unemployment rate; higher = fewer people out of work.",
  connectivity: "Share of population online. Rough proxy for digital readiness.",
  inequality: "Inverted Gini—higher = more even income distribution.",
};

async function fetcher(url: string): Promise<ApiResponse> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export default function ReportPage() {
  const [mounted, setMounted] = useState(false);
  const [country, setCountry] = useState("DEU");
  const [range, setRange] = useState("2014-2024");
  const [from, to] = useMemo(() => {
    const [f, t] = range.split("-");
    return [f ?? "2014", t ?? "2024"];
  }, [range]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const url = `/api/worldbank?country=${country}&from=${from}&to=${to}`;
  const { data, error, isLoading } = useSWR<ApiResponse>(url, fetcher);

  if (!mounted) {
    return (
      <main className="min-h-screen pt-14">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
          <div className="h-24 mb-16 animate-pulse bg-soft-base rounded max-w-md" />
          <div className="space-y-20">
            <div className="h-[320px] animate-pulse bg-soft-base rounded" />
            <div className="h-[320px] animate-pulse bg-soft-base rounded" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 animate-pulse bg-soft-base rounded" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="rounded-xl border border-soft-negative/40 bg-white p-8 shadow-soft-card text-soft-ink">
            <p className="font-display font-bold text-lg">Couldn’t fetch data</p>
            <p className="text-sm mt-2 text-soft-ink-muted leading-relaxed">
              World Bank API might be down. Give it another try.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-14">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
        {/* Header */}
        <header className="mb-16 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
            <div>
              <p className="text-soft-accent text-xs font-semibold tracking-wider uppercase mb-2">
                Country Report
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-soft-ink tracking-tight">
                Country Facts
              </h1>
              <p className="mt-2 text-soft-ink-muted text-sm">
                Pick a country and range—everything updates from there
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <CountrySelect value={country} onValueChange={setCountry} />
              <RangeSelect value={range} onValueChange={setRange} />
              <Link
                href={`/report/compare?countries=${country}`}
                className="text-sm font-medium text-soft-accent hover:text-soft-accent/80 transition-colors"
              >
                Compare with others →
              </Link>
              {data ? (
                <span className="text-xs text-soft-ink-muted px-3 py-2 rounded-xl border border-soft-border bg-soft-base font-medium">
                  Latest: {data.latestYear}
                </span>
              ) : (
                <span className="text-xs text-soft-ink-faint px-3 py-2 rounded-xl border border-soft-border bg-soft-base animate-pulse">
                  Loading…
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Section: Indicator Trajectories */}
        <section className="mb-20" aria-labelledby="section-trends">
          <h2 id="section-trends" className="sr-only">
            Indicator Trajectories
          </h2>
          <div className="mb-6 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "50ms" }}>
            <h3 className="text-soft-accent text-xs font-semibold uppercase tracking-wider">
              Indicator Trajectories
            </h3>
          </div>
          {isLoading ? (
            <ChartSkeleton />
          ) : data ? (
            <div className="animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "50ms" }}>
              <TrendsChart data={data.timeSeries} />
            </div>
          ) : null}
        </section>

        {/* Section: Annual Deltas */}
        <section className="mb-20" aria-labelledby="section-diff">
          <h2 id="section-diff" className="sr-only">
            Annual Deltas
          </h2>
          <div className="mb-6 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "80ms" }}>
            <h3 className="text-soft-accent text-xs font-semibold uppercase tracking-wider">
              Annual Deltas
            </h3>
          </div>
          {isLoading ? (
            <ChartSkeleton />
          ) : data ? (
            <div className="animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "100ms" }}>
              <DiffChart data={data.yearOverYearDiffs} />
            </div>
          ) : null}
        </section>

        {/* Section: Dimension Indices */}
        <section className="mb-20" aria-labelledby="section-indices">
          <h2 id="section-indices" className="sr-only">
            Dimension Indices
          </h2>
          <div className="mb-6 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "120ms" }}>
            <h3 className="text-soft-accent text-xs font-semibold uppercase tracking-wider">
              Dimension Indices
            </h3>
          </div>
          {isLoading ? (
            <SignalCardsSkeleton />
          ) : data ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "220ms" }}>
              {data.buckets.map((bucket) => (
                <SignalCard
                  key={bucket.id}
                  name={bucket.name}
                  score={bucket.score}
                  delta={bucket.delta}
                  indicators={bucket.indicators}
                  interpretation={
                    BUCKET_INTERPRETATIONS[bucket.id] ??
                    "Normalized score—min-max over your range."
                  }
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* Section: Growth Levers and Headwinds */}
        <section className="mb-20" aria-labelledby="section-levers">
          <h2 id="section-levers" className="sr-only">
            Growth Levers and Headwinds
          </h2>
          <div className="mb-6 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "160ms" }}>
            <h3 className="text-soft-accent text-xs font-semibold uppercase tracking-wider">
              Growth Levers and Headwinds
            </h3>
          </div>
          {isLoading ? (
            <MirrorChartSkeleton />
          ) : data ? (
            <div className="animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "200ms" }}>
              <MirrorChart
                momentum={data.momentumFriction.momentum}
                friction={data.momentumFriction.friction}
              />
            </div>
          ) : null}
        </section>

        {/* Footer */}
        <footer className="pt-10 border-t-2 border-soft-border animate-fade-in-up" style={{ animationDelay: "350ms", animationFillMode: "both" }}>
          <p className="text-sm text-soft-ink-muted leading-relaxed max-w-2xl">
            Scores: min-max normalized within country over your range. Trajectories = raw levels; deltas = YoY absolute change. Missing data is left blank on purpose.
          </p>
          <p className="text-xs text-soft-ink-faint mt-3">
            Exploratory tool—use for curiosity, not formal policy decisions.
          </p>
        </footer>
      </div>
    </main>
  );
}
