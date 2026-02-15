"use client";

import * as Popover from "@radix-ui/react-popover";
import { COUNTRIES } from "@/lib/worldbank";

export function CountryMultiSelect({
  value,
  onValueChange,
  maxCount = 5,
}: {
  value: string[];
  onValueChange: (v: string[]) => void;
  maxCount?: number;
}) {
  const toggle = (code: string) => {
    if (value.includes(code)) {
      onValueChange(value.filter((c) => c !== code));
    } else if (value.length < maxCount) {
      onValueChange([...value, code].sort());
    }
  };

  const display =
    value.length === 0
      ? "Select countries"
      : value.length <= 2
        ? value.map((c) => COUNTRIES.find((x) => x.code === c)?.name ?? c).join(", ")
        : `${value.length} countries`;

  return (
    <Popover.Root>
      <Popover.Trigger
        className="flex h-10 min-w-[180px] items-center justify-between gap-2 rounded-xl border border-soft-border bg-white px-4 py-2 text-sm text-soft-ink transition-all duration-250 hover:border-soft-accent/40 focus:outline-none focus:ring-2 focus:ring-soft-accent/20 data-[state=open]:border-soft-accent"
        aria-label="Select countries to compare"
      >
        <span className={value.length === 0 ? "text-soft-ink-faint" : ""}>
          {display}
        </span>
        <ChevronDown />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 max-h-[300px] min-w-[240px] overflow-y-auto rounded-xl border border-soft-border bg-white p-2 shadow-soft-card data-[state=open]:animate-fade-in"
          sideOffset={6}
          align="start"
        >
          {COUNTRIES.map((c) => {
            const isSelected = value.includes(c.code);
            const disabled = !isSelected && value.length >= maxCount;
            return (
              <button
                key={c.code}
                type="button"
                disabled={disabled}
                onClick={() => toggle(c.code)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-soft-base disabled:cursor-not-allowed disabled:opacity-50 ${
                  isSelected ? "bg-soft-accent/10 text-soft-ink" : "text-soft-ink-muted"
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    isSelected ? "border-soft-accent bg-soft-accent" : "border-soft-border"
                  }`}
                >
                  {isSelected && <Check />}
                </span>
                {c.name}
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden className="text-soft-accent">
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5l2 2 4-4" />
    </svg>
  );
}
