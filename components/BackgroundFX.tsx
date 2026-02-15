"use client";

/**
 * Soft UI background: flat light grey canvas.
 */

export function BackgroundFX() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
      suppressHydrationWarning
    >
      <div
        className="absolute inset-0 bg-soft-base"
      />
    </div>
  );
}
