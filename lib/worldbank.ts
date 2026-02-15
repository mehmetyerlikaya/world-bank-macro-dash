/**
 * World Bank API utilities, indicator definitions, and country list.
 * Uses public API (no key required): https://api.worldbank.org/v2/...
 */

export const WORLD_BANK_API = "https://api.worldbank.org/v2";

/** Indicator codes used across the dashboard */
export const INDICATORS = {
  GDP_PCAP: "NY.GDP.PCAP.CD", // GDP per capita (current US$)
  GDP_GROWTH: "NY.GDP.PCAP.KD.ZG", // GDP per capita growth
  INTERNET: "IT.NET.USER.ZS", // Individuals using the Internet (% of population)
  UNEMPLOYMENT: "SL.UEM.TOTL.ZS", // Unemployment, total (% of labor force)
  INFLATION: "FP.CPI.TOTL.ZG", // Inflation, consumer prices (annual %)
  CO2_PC: "EN.ATM.CO2E.PC", // CO2 emissions (metric tons per capita)
  GINI: "SI.POV.GINI", // Gini index
  TRADE_OPEN: "NE.TRD.GNFS.ZS", // Trade (% of GDP)
  FERTILITY: "SP.DYN.TFRT.IN", // Fertility rate
  POP_GROWTH: "SP.POP.GROW", // Population growth (annual %)
  SCHOOL_ENROLL: "SE.SEC.ENRR", // Secondary school enrollment
  HEALTH_EXP: "SH.XPD.CHEX.GD.ZS", // Current health expenditure (% of GDP)
  LIFE_EXPECTANCY: "SP.DYN.LE00.IN", // Life expectancy at birth (years)
  ELECTRICITY: "EG.ELC.ACCS.ZS", // Access to electricity (% of population)
} as const;

/** Human-readable labels for indicators */
export const INDICATOR_LABELS: Record<string, string> = {
  [INDICATORS.GDP_PCAP]: "GDP per capita",
  [INDICATORS.GDP_GROWTH]: "GDP per capita growth",
  [INDICATORS.INTERNET]: "Internet users (% population)",
  [INDICATORS.UNEMPLOYMENT]: "Unemployment rate",
  [INDICATORS.INFLATION]: "Inflation (consumer prices)",
  [INDICATORS.CO2_PC]: "CO2 emissions per capita",
  [INDICATORS.GINI]: "Gini coefficient",
  [INDICATORS.TRADE_OPEN]: "Trade (% of GDP)",
  [INDICATORS.FERTILITY]: "Fertility rate",
  [INDICATORS.POP_GROWTH]: "Population growth",
  [INDICATORS.SCHOOL_ENROLL]: "Secondary enrollment",
  [INDICATORS.HEALTH_EXP]: "Health expenditure (% GDP)",
  [INDICATORS.LIFE_EXPECTANCY]: "Life expectancy (years)",
  [INDICATORS.ELECTRICITY]: "Access to electricity (%)",
};

/** Indicators for trend-line charts (core macro + structural) */
export const TREND_CHART_INDICATORS = [
  { code: INDICATORS.GDP_GROWTH, label: INDICATOR_LABELS[INDICATORS.GDP_GROWTH], color: "#2d5a4a" },
  { code: INDICATORS.INTERNET, label: INDICATOR_LABELS[INDICATORS.INTERNET], color: "#3d7a65" },
  { code: INDICATORS.UNEMPLOYMENT, label: INDICATOR_LABELS[INDICATORS.UNEMPLOYMENT], color: "#8b3a3a" },
  { code: INDICATORS.INFLATION, label: INDICATOR_LABELS[INDICATORS.INFLATION], color: "#6b5344" },
  { code: INDICATORS.GINI, label: INDICATOR_LABELS[INDICATORS.GINI], color: "#5c4033" },
  { code: INDICATORS.LIFE_EXPECTANCY, label: INDICATOR_LABELS[INDICATORS.LIFE_EXPECTANCY], color: "#2d5a4a" },
  { code: INDICATORS.ELECTRICITY, label: INDICATOR_LABELS[INDICATORS.ELECTRICITY], color: "#3d7a65" },
] as const;

/** Indicators for YoY diff chart (absolute change) */
export const DIFF_CHART_INDICATORS = [
  { code: INDICATORS.GDP_GROWTH, label: "GDP growth", improveUp: true },
  { code: INDICATORS.INTERNET, label: "Internet", improveUp: true },
  { code: INDICATORS.UNEMPLOYMENT, label: "Unemployment", improveUp: false },
  { code: INDICATORS.INFLATION, label: "Inflation", improveUp: false },
  { code: INDICATORS.GINI, label: "Gini", improveUp: false },
  { code: INDICATORS.TRADE_OPEN, label: "Trade openness", improveUp: true },
] as const;

/** Indicators that improve when value goes down (inverse score) */
export const INVERSED_INDICATORS = new Set([
  INDICATORS.UNEMPLOYMENT,
  INDICATORS.GINI,
  INDICATORS.CO2_PC,
]);

/** Countries available in dropdown (ISO 3-letter codes) */
export const COUNTRIES: { code: string; name: string }[] = [
  { code: "DEU", name: "Germany" },
  { code: "USA", name: "United States" },
  { code: "GBR", name: "United Kingdom" },
  { code: "FRA", name: "France" },
  { code: "JPN", name: "Japan" },
  { code: "CHN", name: "China" },
  { code: "IND", name: "India" },
  { code: "BRA", name: "Brazil" },
  { code: "CAN", name: "Canada" },
  { code: "ITA", name: "Italy" },
  { code: "ESP", name: "Spain" },
  { code: "NLD", name: "Netherlands" },
  { code: "SWE", name: "Sweden" },
  { code: "POL", name: "Poland" },
  { code: "KOR", name: "Korea, Rep." },
  { code: "AUS", name: "Australia" },
];

/** Build World Bank API URL for country + indicator */
export function buildWorldBankUrl(
  country: string,
  indicator: string,
  from: string,
  to: string
): string {
  return `${WORLD_BANK_API}/country/${country}/indicator/${indicator}?format=json&per_page=20000&date=${from}:${to}`;
}
