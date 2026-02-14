"use client";

/**
 * Manuscript / ledger aesthetic: warm paper texture, subtle rule lines.
 */

export function BackgroundFX() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
      suppressHydrationWarning
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #f7f3eb 0%, #f0ebe0 50%, #f5f0e8 100%)",
        }}
      />
      {/* Subtle horizontal rule lines - ledger feel */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(transparent, transparent 0px, #2c2822 1px, transparent 2px)",
          backgroundSize: "1px 32px",
          backgroundPosition: "0 0",
        }}
      />
    </div>
  );
}
