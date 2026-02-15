/**
 * World Bank compare API: returns data for multiple countries.
 * Query params: countries (comma-separated, max 5), from, to
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchCountryData } from "@/lib/worldbank-api";
import { COUNTRIES } from "@/lib/worldbank";

const MAX_COUNTRIES = 5;

const VALID_CODES = new Set(COUNTRIES.map((c) => c.code));

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countriesParam = searchParams.get("countries") ?? "DEU,USA";
  const from = searchParams.get("from") ?? "2014";
  const to = searchParams.get("to") ?? "2024";

  const codes = countriesParam
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter((c) => c.length === 3 && VALID_CODES.has(c));
  const unique = [...new Set(codes)].slice(0, MAX_COUNTRIES);

  if (unique.length === 0) {
    return NextResponse.json(
      { error: "No valid country codes. Use countries=DEU,USA,FRA" },
      { status: 400 }
    );
  }

  const data = await Promise.all(
    unique.map((country) => fetchCountryData(country, from, to))
  );

  return NextResponse.json({ data });
}
