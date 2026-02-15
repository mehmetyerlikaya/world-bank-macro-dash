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
            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-soft-accent after:transition-transform after:duration-150 after:origin-center ${
              pathname === "/"
                ? "text-soft-accent bg-soft-accent/10 after:scale-x-100"
                : "text-soft-ink-muted hover:text-soft-ink after:scale-x-0 hover:after:scale-x-100"
            }`}
          >
            Home
          </Link>
          <Link
            href="/report"
            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-soft-accent after:transition-transform after:duration-150 after:origin-center ${
              pathname === "/report"
                ? "text-soft-accent bg-soft-accent/10 after:scale-x-100"
                : "text-soft-ink-muted hover:text-soft-ink after:scale-x-0 hover:after:scale-x-100"
            }`}
          >
            Country Report
          </Link>
        </div>
      </div>
    </nav>
  );
}
