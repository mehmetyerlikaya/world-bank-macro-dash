# Country Facts

Interactive dashboard for World Bank macroeconomic indicators. Explore GDP, employment, connectivity, inequality, life expectancy, and more across 16 countries.

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
- Additional indicators: life expectancy, electricity access, trade, fertility, population growth, education, health

## Sections

1. **Indicator Trajectories** — Trend chart (GDP growth, Internet, Unemployment, Inflation, Gini, Life expectancy, Electricity)
2. **Annual Deltas** — Year-over-year change
3. **Dimension Indices** — Composite scores (Prosperity, Employment, Connectivity, Inequality)
4. **Growth Levers and Headwinds** — Momentum vs friction
