"use client";

import useSWR from "swr";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CountryMultiSelect } from "@/components/controls/CountryMultiSelect";
import { RangeSelect } from "@/components/controls/RangeSelect";
import { MirrorChart } from "@/components/MirrorChart";
import { TrendsChartCompare } from "@/components/charts/TrendsChartCompare";
import { DiffChart } from "@/components/charts/DiffChart";
import {
  SignalCardsSkeleton,
  MirrorChartSkeleton,
  ChartSkeleton,
} from "@/components/Skeletons";
import { TREND_CHART_INDICATORS } from "@/lib/worldbank";
import { COUNTRIES } from "@/lib/worldbank";
import type { ApiResponse } from "@/lib/worldbank-api";

function getCountryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

async function fetcher(url: string): Promise<{ data: ApiResponse[] }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const countriesParam = searchParams.get("countries") ?? "DEU,USA";
  const rangeParam = searchParams.get("range") ?? "2014-2024";

  const initialCountries = useMemo(() => {
    return countriesParam
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length === 3)
      .slice(0, 5);
  }, [countriesParam]);

  const [countries, setCountries] = useState<string[]>(initialCountries);
  const [range, setRange] = useState(rangeParam);

  useEffect(() => {
    const fromUrl = countriesParam
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length === 3)
      .slice(0, 5);
    if (fromUrl.length >= 2 && JSON.stringify(fromUrl) !== JSON.stringify(countries)) {
      setCountries(fromUrl);
    }
    if (rangeParam !== range) setRange(rangeParam);
  }, [countriesParam, rangeParam, countries, range]);

  const [from, to] = useMemo(() => {
    const [f, t] = range.split("-");
    return [f ?? "2014", t ?? "2024"];
  }, [range]);

  useEffect(() => setMounted(true), []);

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (countries.length > 0) params.set("countries", countries.join(","));
    params.set("range", range);
    router.replace(`/report/compare?${params.toString()}`, { scroll: false });
  }, [countries, range, router]);

  useEffect(() => {
    if (mounted && countries.length > 0) syncUrl();
  }, [mounted, countries, range, syncUrl]);

  const apiCountries = countries.length >= 2 ? countries : [];
  const url = apiCountries.length >= 2
    ? `/api/worldbank/compare?countries=${apiCountries.join(",")}&from=${from}&to=${to}`
    : null;
  const { data, error, isLoading } = useSWR<{ data: ApiResponse[] }>(url, fetcher);

  if (!mounted) {
    return (
      <main className="min-h-screen pt-14">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
          <div className="h-24 mb-16 animate-pulse bg-soft-base rounded max-w-md" />
          <div className="space-y-20">
            <div className="h-[320px] animate-pulse bg-soft-base rounded" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <p className="font-display font-bold text-lg">Couldn&apos;t fetch data</p>
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
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
        {/* Header */}
        <header className="mb-16 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
            <div>
              <p className="text-soft-accent text-xs font-semibold tracking-wider uppercase mb-2">
                Country Comparison
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-soft-ink tracking-tight">
                Compare Countries
              </h1>
              <p className="mt-2 text-soft-ink-muted text-sm">
                Select 2–5 countries to compare side by side (same date range for all)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <CountryMultiSelect value={countries} onValueChange={setCountries} maxCount={5} />
              <RangeSelect value={range} onValueChange={setRange} />
              {data?.data?.length && (
                <span className="text-xs text-soft-ink-muted px-3 py-2 rounded-xl border border-soft-border bg-soft-base font-medium">
                  {data.data.length} countries
                </span>
              )}
            </div>
          </div>
        </header>

        {countries.length < 2 && (
          <div className="mb-12 rounded-xl border border-soft-accent/40 bg-soft-accent/5 p-6 animate-fade-in-up">
            <p className="text-soft-ink font-medium">Select at least 2 countries to compare</p>
            <p className="text-sm text-soft-ink-muted mt-1">
              Use the dropdown above to add Germany, USA, France, or any other available country.
            </p>
          </div>
        )}

        {countries.length >= 2 && (
          <>
            {/* Dimension Indices Table */}
            <section className="mb-20" aria-labelledby="section-indices">
              <h2 id="section-indices" className="sr-only">Dimension Indices</h2>
              <div className="mb-6 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "50ms" }}>
                <h3 className="text-soft-accent text-xs font-semibold uppercase tracking-wider">
                  Dimension Indices
                </h3>
              </div>
              {isLoading ? (
                <SignalCardsSkeleton />
              ) : data?.data ? (
                <div
                  className="overflow-x-auto rounded-xl border border-soft-border shadow-soft-card bg-white animate-fade-in-up"
                  style={{ animationFillMode: "both", animationDelay: "100ms" }}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-soft-border bg-soft-base/50">
                        <th className="text-left px-4 py-3 font-semibold text-soft-ink">Country</th>
                        {data.data[0]?.buckets.map((b) => (
                          <th key={b.id} className="text-center px-4 py-3 font-semibold text-soft-ink">
                            {b.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.map((d) => (
                        <tr key={d.country} className="border-b border-soft-border last:border-0 hover:bg-soft-base/30">
                          <td className="px-4 py-3 font-medium text-soft-ink">
                            {getCountryName(d.country)}
                          </td>
                          {d.buckets.map((b) => (
                            <td key={b.id} className="text-center px-4 py-3 tabular-nums">
                              <span className="font-semibold text-soft-ink">{Math.round(b.score)}</span>
                              {b.delta != null && (
                                <span
                                  className={`ml-1 text-xs ${
                                    b.delta >= 0 ? "text-soft-positive" : "text-soft-negative"
                                  }`}
                                >
                                  {b.delta >= 0 ? "+" : ""}
                                  {b.delta}
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>

            {/* Indicator Trajectories - per-indicator compare */}
            <section className="mb-20" aria-labelledby="section-trends">
              <h2 id="section-trends" className="sr-only">Indicator Trajectories</h2>
              <div className="mb-6 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "120ms" }}>
                <h3 className="text-soft-accent text-xs font-semibold uppercase tracking-wider">
                  Indicator Trajectories
                </h3>
                <p className="text-soft-ink-muted text-sm mt-1">
                  One chart per indicator—compare countries on the same scale
                </p>
              </div>
              {isLoading ? (
                <ChartSkeleton />
              ) : data?.data ? (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up"
                  style={{ animationFillMode: "both", animationDelay: "150ms" }}
                >
                  {TREND_CHART_INDICATORS.map(({ code, label }) => (
                    <TrendsChartCompare
                      key={code}
                      data={data.data}
                      indicatorCode={code}
                      indicatorLabel={label}
                    />
                  ))}
                </div>
              ) : null}
            </section>

            {/* Annual Deltas - one per country */}
            <section className="mb-20" aria-labelledby="section-diff">
              <h2 id="section-diff" className="sr-only">Annual Deltas</h2>
              <div className="mb-6 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "180ms" }}>
                <h3 className="text-soft-accent text-xs font-semibold uppercase tracking-wider">
                  Annual Deltas
                </h3>
                <p className="text-soft-ink-muted text-sm mt-1">
                  Year-over-year change per country
                </p>
              </div>
              {isLoading ? (
                <ChartSkeleton />
              ) : data?.data ? (
                <div
                  className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-in-up"
                  style={{ animationFillMode: "both", animationDelay: "200ms" }}
                >
                  {data.data.map((d) => (
                    <div key={d.country}>
                      <h4 className="text-soft-accent text-xs font-semibold uppercase tracking-wider mb-4">
                        {getCountryName(d.country)}
                      </h4>
                      <DiffChart data={d.yearOverYearDiffs} />
                    </div>
                  ))}
                </div>
              ) : null}
            </section>

            {/* Growth Levers and Headwinds - one per country */}
            <section className="mb-20" aria-labelledby="section-levers">
              <h2 id="section-levers" className="sr-only">Growth Levers and Headwinds</h2>
              <div className="mb-6 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "220ms" }}>
                <h3 className="text-soft-accent text-xs font-semibold uppercase tracking-wider">
                  Growth Levers and Headwinds
                </h3>
                <p className="text-soft-ink-muted text-sm mt-1">
                  Momentum vs friction per country
                </p>
              </div>
              {isLoading ? (
                <MirrorChartSkeleton />
              ) : data?.data ? (
                <div
                  className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-in-up"
                  style={{ animationFillMode: "both", animationDelay: "250ms" }}
                >
                  {data.data.map((d) => (
                    <div key={d.country}>
                      <h4 className="text-soft-accent text-xs font-semibold uppercase tracking-wider mb-4">
                        {getCountryName(d.country)}
                      </h4>
                      <MirrorChart
                        momentum={d.momentumFriction.momentum}
                        friction={d.momentumFriction.friction}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </section>

            {/* Footer */}
            <footer
              className="pt-10 border-t-2 border-soft-border animate-fade-in-up"
              style={{ animationDelay: "350ms", animationFillMode: "both" }}
            >
              <p className="text-sm text-soft-ink-muted leading-relaxed max-w-2xl">
                Scores: min-max normalized within each country over your range. Trajectories and deltas share the same date window. Dimension indices let you compare across countries.
              </p>
              <p className="text-xs text-soft-ink-faint mt-3">
                Share this comparison: the URL updates as you change countries or range.
              </p>
            </footer>
          </>
        )}
      </div>
    </main>
  );
}
