"use client";

import { useState, useEffect, type ReactNode } from "react";

/**
 * Wraps children to render only after client mount.
 * Prevents hydration mismatch when browser extensions (e.g. Bitdefender, Bitwarden)
 * inject attributes like bis_skin_checked into the DOM before React hydrates.
 */
export function HydrationSafe({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-soft-base" suppressHydrationWarning aria-hidden>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 h-14 flex items-center" suppressHydrationWarning />
        <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-24 animate-pulse" suppressHydrationWarning>
          <div className="h-8 bg-soft-border rounded w-48 mb-6" />
          <div className="h-12 bg-soft-border rounded w-full mb-4" />
          <div className="h-4 bg-soft-border rounded w-3/4" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
