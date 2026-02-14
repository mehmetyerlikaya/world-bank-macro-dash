"use client";

import * as Select from "@radix-ui/react-select";
import { COUNTRIES } from "@/lib/worldbank";

const selectStyles =
  "flex h-10 min-w-[148px] items-center justify-between gap-2 rounded border-2 border-ledger-border bg-white px-4 py-2 text-sm text-ledger-ink transition-all duration-250 hover:border-ledger-accent/40 focus:outline-none data-[placeholder]:text-ledger-ink-faint data-[state=open]:border-ledger-accent data-[state=open]:ring-2 data-[state=open]:ring-ledger-accent/20";

export function CountrySelect({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (v: string) => void;
}) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger className={selectStyles} aria-label="Select country">
        <Select.Value placeholder="Country" />
        <Select.Icon className="text-ledger-accent">
          <ChevronDown />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="z-50 min-w-[200px] overflow-hidden rounded border-2 border-ledger-border bg-white shadow-xl data-[state=open]:animate-fade-in"
          position="popper"
          sideOffset={6}
        >
          <Select.Viewport>
            {COUNTRIES.map((c) => (
              <Select.Item
                key={c.code}
                value={c.code}
                className="relative flex cursor-default select-none items-center px-4 py-2.5 text-sm text-ledger-ink outline-none transition-colors duration-150 data-[highlighted]:bg-ledger-cream data-[state=checked]:bg-ledger-accent/10"
              >
                <Select.ItemText>{c.name}</Select.ItemText>
                <Select.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center text-ledger-accent">
                  <Check />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
