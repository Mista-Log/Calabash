"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MdIcon } from "./md-icon";

export interface MdStatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  description?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Material 3 Stat Card Component
 * 
 * Displays statistics with icon, value, and optional trend indicator
 */
export function MdStatCard({
  title,
  value,
  icon,
  trend,
  description,
  onClick,
  className,
}: MdStatCardProps) {
  return React.createElement(
    "div",
    {
      className: cn(
        "md-stat-card",
        "bg-[color:var(--md-sys-color-surface-container-low)]",
        "rounded-[28px]",
        "p-6",
        "border border-[color:var(--md-sys-color-outline-variant)]",
        onClick && "cursor-pointer hover:bg-[color:var(--md-sys-color-surface-container)]",
        "transition-colors",
        className
      ),
      onClick,
    },
    React.createElement(
      "div",
      { className: "flex items-start justify-between" },
      React.createElement(
        "div",
        { className: "space-y-2" },
        React.createElement(
          "p",
          { className: "m3-label-large text-[color:var(--md-sys-color-on-surface-variant)]" },
          title
        ),
        React.createElement(
          "p",
          { className: "m3-display-small text-[color:var(--md-sys-color-on-surface)]" },
          value
        ),
        trend && React.createElement(
          "div",
          { className: "flex items-center gap-1" },
          React.createElement(
            "md-icon",
            {
              className: cn(
                "text-[16px]",
                trend.positive !== false ? "text-[color:var(--md-sys-color-primary)]" : "text-[color:var(--md-sys-color-error)]"
              ),
            },
            trend.positive !== false ? "trending_up" : "trending_down"
          ),
          React.createElement(
            "span",
            { className: "m3-label-small text-[color:var(--md-sys-color-on-surface-variant)]" },
            `${trend.value}% ${trend.label}`
          )
        ),
        description && React.createElement(
          "p",
          { className: "m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]" },
          description
        )
      ),
      icon && React.createElement(
        "div",
        {
          className: cn(
            "flex items-center justify-center w-12 h-12 rounded-2xl",
            "bg-[color:var(--md-sys-color-primary-container)]"
          ),
        },
        React.createElement(
          MdIcon,
          { className: "text-[color:var(--md-sys-color-primary)]" },
          icon
        )
      )
    )
  );
}
