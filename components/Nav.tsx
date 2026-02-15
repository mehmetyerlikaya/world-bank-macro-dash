"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 border-b border-soft-border bg-white/95 backdrop-blur-panel shadow-soft-card"
      aria-label="Main navigation"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg font-bold text-soft-ink hover:text-soft-accent transition-colors duration-200"
        >
          Country Facts
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              pathname === "/"
                ? "text-soft-accent bg-soft-accent/10"
                : "text-soft-ink-muted hover:text-soft-ink"
            }`}
          >
            Home
          </Link>
          <Link
            href="/report"
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              pathname === "/report"
                ? "text-soft-accent bg-soft-accent/10"
                : "text-soft-ink-muted hover:text-soft-ink"
            }`}
          >
            Country Report
          </Link>
        </div>
      </div>
    </nav>
  );
}
