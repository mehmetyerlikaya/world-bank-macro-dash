/**
 * World Bank API proxy with Zod validation and caching.
 * Query params: country, from, to
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchCountryData } from "@/lib/worldbank-api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") ?? "DEU";
  const from = searchParams.get("from") ?? "2014";
  const to = searchParams.get("to") ?? "2024";

  const response = await fetchCountryData(country, from, to);
  return NextResponse.json(response);
}
