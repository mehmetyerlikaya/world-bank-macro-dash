"use client";

import { useEffect, useState } from "react";

const DURATION_MS = 700;
const TICK_MS = 30;

export function CountUp({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = Math.round(value);
    if (target === 0) {
      setDisplay(0);
      return;
    }
    setDisplay(0);
    const start = performance.now();
    const timer = setInterval(() => {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      setDisplay(Math.round(target * eased));
      if (progress >= 1) clearInterval(timer);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [value]);

  return <span className={className}>{display}</span>;
}
