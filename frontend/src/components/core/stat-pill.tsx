import React from "react";
import { cn } from "@/lib/utils";

interface StatPillProps {
  label: string;
  value: string | number;
  variant?: "default" | "primary" | "accent";
  className?: string;
}

const variantStyles = {
  default:
    "bg-[color:var(--md-sys-color-surface-container-low)] text-[color:var(--md-sys-color-on-surface)] border-[color:var(--md-sys-color-outline-variant)]",
  primary:
    "bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)] border-[color:color-mix(in_oklab,var(--md-sys-color-primary)_30%,transparent)]",
  accent:
    "bg-[color:color-mix(in_oklab,var(--md-sys-color-tertiary)_14%,var(--md-sys-color-surface-container-low))] text-[color:var(--md-sys-color-on-surface)] border-[color:var(--md-sys-color-outline-variant)]",
};

export function StatPill({
  label,
  value,
  variant = "default",
  className,
}: StatPillProps) {
  return (
    <div
      className={cn(
        "inline-flex min-w-[120px] flex-col gap-1 rounded-3xl border px-5 py-3 transition-all duration-300",
        "hover:shadow-[0_8px_24px_color-mix(in_oklab,var(--md-sys-color-primary)_12%,transparent)]",
        variantStyles[variant],
        className,
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] leading-none opacity-70">
        {label}
      </span>
      <span className="text-[22px] font-semibold leading-none tracking-tight">
        {value}
      </span>
    </div>
  );
}
