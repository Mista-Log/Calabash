<<<<<<< HEAD
﻿import React from "react";
=======
import React from "react";
>>>>>>> origin/main
import { cn } from "@/lib/utils";

interface StatPillProps {
  label: string;
  value: string | number;
  variant?: "default" | "primary" | "accent";
  className?: string;
}

const variantStyles = {
<<<<<<< HEAD
  default:
    "bg-[color:var(--md-sys-color-surface-container-low)] text-[color:var(--md-sys-color-on-surface)] border-[color:var(--md-sys-color-outline-variant)]",
  primary:
    "bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)] border-[color:color-mix(in_oklab,var(--md-sys-color-primary)_30%,transparent)]",
  accent:
    "bg-[color:color-mix(in_oklab,var(--md-sys-color-tertiary)_14%,var(--md-sys-color-surface-container-low))] text-[color:var(--md-sys-color-on-surface)] border-[color:var(--md-sys-color-outline-variant)]",
=======
  default: "bg-muted/30 text-foreground border-border/40 hover:bg-muted/50",
  primary: "bg-primary/5 text-primary border-primary/20 hover:bg-primary/10",
  accent:
    "bg-accent/10 text-accent-foreground border-accent/30 hover:bg-accent/20",
>>>>>>> origin/main
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
<<<<<<< HEAD
        "inline-flex min-w-[120px] flex-col gap-1 rounded-3xl border px-5 py-3 transition-all duration-300",
        "hover:shadow-[0_8px_24px_color-mix(in_oklab,var(--md-sys-color-primary)_12%,transparent)]",
=======
        "inline-flex flex-col gap-1 px-5 py-3 rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5",
>>>>>>> origin/main
        variantStyles[variant],
        className,
      )}
    >
<<<<<<< HEAD
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] leading-none opacity-70">
        {label}
      </span>
      <span className="text-[22px] font-semibold leading-none tracking-tight">
        {value}
      </span>
=======
      <span className="text-[10px] font-black opacity-50 uppercase tracking-[0.2em] leading-none">
        {label}
      </span>
      <span className="text-xl font-extrabold leading-none tracking-tight">{value}</span>
>>>>>>> origin/main
    </div>
  );
}
