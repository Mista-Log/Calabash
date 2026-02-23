"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MdIcon } from "./md-icon";

export interface MetricStatProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  icon?: string;
  compact?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Enhanced Metric Stat Component with trend indicators
 * Uses Material 3 design system colors
 */
export function MetricStat({
  label,
  value,
  trend,
  icon,
  compact = false,
  onClick,
  className,
}: MetricStatProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3 transition-colors",
        onClick && "cursor-pointer hover:bg-[color:var(--md-sys-color-surface-container)]",
        compact ? "space-y-1" : "space-y-2",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className={cn(
            "font-semibold uppercase tracking-[0.14em]",
            compact ? "text-[9px]" : "text-[10px]",
            "text-[color:var(--md-sys-color-on-surface-variant)]"
          )}>
            {label}
          </p>
          <p className={cn(
            "font-semibold text-[color:var(--md-sys-color-on-surface)]",
            compact ? "text-[16px]" : "text-[20px]"
          )}>
            {value}
          </p>
        </div>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-primary-container)]">
            <MdIcon className="text-[16px] text-[color:var(--md-sys-color-primary)]">
              {icon}
            </MdIcon>
          </div>
        )}
      </div>
      {trend && (
        <div className="flex items-center gap-1">
          <MdIcon
            className={cn(
              "text-[14px]",
              trend.isPositive !== false
                ? "text-[color:var(--md-sys-color-primary)]"
                : "text-[color:var(--md-sys-color-error)]"
            )}
          >
            {trend.isPositive !== false ? "trending_up" : "trending_down"}
          </MdIcon>
          <span className={cn(
            "font-semibold",
            compact ? "text-[10px]" : "text-[11px]",
            trend.isPositive !== false
              ? "text-[color:var(--md-sys-color-primary)]"
              : "text-[color:var(--md-sys-color-error)]"
          )}>
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>
        </div>
      )}
    </div>
  );
}
