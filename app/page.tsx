import Link from "next/link";

const SECTIONS = [
  {
    id: "trajectories",
    title: "Indicator Trajectories",
    description: "GDP growth, internet penetration, unemployment, inflation, Gini—raw levels over your chosen window. The basics, but seeing them together often reveals patterns you’d miss in a spreadsheet.",
    term: "Time-series",
  },
  {
    id: "deltas",
    title: "Annual Deltas",
    description: "Year-over-year change for each indicator. Green = improvement for growth-type metrics; red = worsening for unemployment, inflation, inequality (those are all \"bad when high\" so the sign flips).",
    term: "YoY change",
  },
  {
    id: "indices",
    title: "Dimension Indices",
    description: "Composite scores 0–100 for Prosperity, Employment, Connectivity, Inequality. Min-max normalized within country over your range—so you’re comparing across years, not across countries. Gini is inverted so higher = better everywhere.",
    term: "Composite index",
  },
  {
    id: "levers",
    title: "Growth Levers and Headwinds",
    description: "GDP growth and internet adoption on one side; unemployment, inflation, Gini on the other. A simple way to see what’s pulling the economy forward versus what’s holding it back.",
    term: "Momentum vs friction",
  },
];

const CONCEPTS = [
  {
    term: "Min-max normalization",
    desc: "Each indicator is scaled 0–100 using the min and max for that country in your selected range. Lets you compare years within one country without mixing in cross-country level differences.",
  },
  {
    term: "Inverted indicators",
    desc: "Unemployment, inflation, Gini—all \"bad when high.\" I invert them so a higher score means better everywhere, same as the rest. Keeps the interpretation consistent.",
  },
  {
    term: "Data source",
    desc: "World Bank Open Data, no API key needed. Data can lag a year or two; missing values stay visible. Treat as exploratory—handy for digging in, not for formal policy work.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen pt-14">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-16 sm:pt-24 pb-32">
        {/* Hero */}
        <header className="mb-20 animate-fade-in-up">
          <p className="text-soft-accent text-sm font-semibold tracking-wider uppercase mb-4 animate-fade-in-up" style={{ animationDelay: "0ms", animationFillMode: "both" }}>
            Powered by World Bank Open Data
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-soft-ink leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "80ms", animationFillMode: "both" }}>
            Country Facts
          </h1>
          <p className="text-soft-ink-muted text-lg leading-relaxed mb-6 animate-fade-in-up" style={{ animationDelay: "160ms", animationFillMode: "both" }}>
            I put this together to explore how macro indicators move across countries—something I kept coming back to during my thesis. Personal project, but the data and methodology are sound. Useful if you’re into development economics or comparative growth.
          </p>
          <p className="text-soft-ink-muted text-[15px] leading-relaxed mb-8 max-w-xl animate-fade-in-up" style={{ animationDelay: "240ms", animationFillMode: "both" }}>
            Pick a country and date range → trajectories, annual changes, composite indices, and a levers-versus-headwinds breakdown. Everything pulls from the World Bank; no API key required.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "320ms", animationFillMode: "both" }}>
            <Link
              href="/report"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-gradient text-white font-medium text-sm rounded-xl shadow-soft-card transition-all duration-200 hover:shadow-soft-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-soft-accent focus-visible:ring-offset-2 focus-visible:ring-offset-soft-base"
            >
              View Report
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </header>

        {/* What you will find */}
        <section className="mb-20" aria-labelledby="sections">
          <h2 id="sections" className="font-display text-2xl font-bold text-soft-ink mb-2 animate-fade-in-up" style={{ animationDelay: "50ms", animationFillMode: "both" }}>
            What’s in the report
          </h2>
          <p className="text-soft-ink-muted mb-10 animate-fade-in-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
            Four sections—pick a country and range, and everything updates from there.
          </p>
          <div className="space-y-8">
            {SECTIONS.map((section, i) => (
              <article
                key={section.id}
                className="border-l-4 border-soft-accent/30 pl-6 py-2 animate-fade-in-up hover:border-soft-accent/50 transition-colors duration-300"
                style={{ animationDelay: `${150 + i * 80}ms`, animationFillMode: "both" }}
              >
                <p className="text-soft-accent text-xs font-semibold uppercase tracking-wider mb-1">
                  {section.term}
                </p>
                <h3 className="font-display text-xl font-bold text-soft-ink mb-2">
                  {section.title}
                </h3>
                <p className="text-soft-ink-muted text-[15px] leading-relaxed">
                  {section.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Key concepts */}
        <section className="mb-20 py-10 border-t-2 border-soft-border" aria-labelledby="concepts">
          <h2 id="concepts" className="font-display text-2xl font-bold text-soft-ink mb-6 animate-fade-in-up" style={{ animationDelay: "50ms", animationFillMode: "both" }}>
            Behind the numbers
          </h2>
          <dl className="space-y-6">
            {CONCEPTS.map((c, i) => (
              <div
                key={c.term}
                className="animate-fade-in-up"
                style={{ animationDelay: `${100 + i * 60}ms`, animationFillMode: "both" }}
              >
                <dt className="font-semibold text-soft-ink mb-1">{c.term}</dt>
                <dd className="text-soft-ink-muted text-[15px] leading-relaxed">{c.desc}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <div className="text-center py-12 border-t-2 border-soft-border animate-fade-in-up">
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-soft-accent text-soft-accent font-medium text-sm rounded-xl hover:bg-accent-gradient hover:text-white hover:border-transparent transition-all duration-200"
          >
            View Report
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
