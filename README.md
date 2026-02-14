# Country Signals

Research-grade interactive dashboard for World Bank macroeconomic indicators. Atlas-inspired design with Cormorant Garamond + IBM Plex Sans typography. Explore GDP, employment, connectivity, inequality across 15+ countries.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000/report](http://localhost:3000/report).

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS, Radix UI primitives (Select, Tooltip)
- Recharts for time-series and diff visualizations
- SWR for client data fetching
- Zod for API response validation

## Data

- Source: World Bank Open Data API (no key required)
- Cached server-side with `revalidate: 3600`
- Scores min-max normalized over the selected date range per country
- Additional indicators: trade openness, fertility, population growth, education, health expenditure

## Sections

1. **Key Indicators Over Time** — Multi-line trend chart (GDP growth, Internet, Unemployment, Inflation, Gini)
2. **Year-over-Year Change** — Diverging bar chart of annual deltas
3. **Signal Distribution** — Composite scores (Prosperity, Employment, Connectivity, Inequality)
4. **Momentum vs Friction** — Relative positioning of drivers and drags
