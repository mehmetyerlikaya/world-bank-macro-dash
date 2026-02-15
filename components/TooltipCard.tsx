"use client";

import * as Tooltip from "@radix-ui/react-tooltip";

interface TooltipCardProps {
  trigger: React.ReactNode;
  title?: string;
  children: React.ReactNode;
}

export function TooltipCard({ trigger, title, children }: TooltipCardProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{trigger}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={10}
          className="z-50 max-w-[300px] rounded border border-soft-border rounded-xl shadow-soft-card bg-white shadow-xl animate-fade-in"
        >
          <div className="p-5">
            {title && (
              <p className="text-soft-accent text-xs font-semibold uppercase tracking-wider mb-2">
                {title}
              </p>
            )}
            <div className="text-sm text-soft-ink-muted leading-relaxed">
              {children}
            </div>
          </div>
          <Tooltip.Arrow className="fill-white" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
