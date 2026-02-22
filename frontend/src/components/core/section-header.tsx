import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  kicker?: string;
  id?: string;
  className?: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export function SectionHeader({
  title,
  description,
  kicker,
  id,
  className,
  action,
  compact = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div>
        {kicker ? (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--md-sys-color-primary)]">
            {kicker}
          </p>
        ) : null}
        <h2
          id={id}
          className={cn(
            "tracking-tight text-foreground",
            compact ? "text-[16px] font-semibold" : "text-[24px] font-semibold",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-1 text-[color:var(--md-sys-color-on-surface-variant)]",
              compact ? "text-[13px] font-medium" : "text-[15px] font-medium",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
