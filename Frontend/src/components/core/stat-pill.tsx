import React from "react";
import { cn } from "@/lib/utils";

interface StatPillProps {
  label: string;
  value: string | number;
  variant?: "default" | "primary" | "accent";
  className?: string;
}

const variantStyles = {
  default: "bg-muted/30 text-foreground border-border/40 hover:bg-muted/50",
  primary: "bg-primary/5 text-primary border-primary/20 hover:bg-primary/10",
  accent:
    "bg-accent/10 text-accent-foreground border-accent/30 hover:bg-accent/20",
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
        "inline-flex flex-col gap-1 px-5 py-3 rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        variantStyles[variant],
        className,
      )}
    >
      <span className="text-[10px] font-black opacity-50 uppercase tracking-[0.2em] leading-none">
        {label}
      </span>
      <span className="text-xl font-extrabold leading-none tracking-tight">{value}</span>
    </div>
  );
}
