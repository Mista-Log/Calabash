"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MdBadgeProps {
  value?: string | number;
  max?: number;
  dot?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Material 3 Badge Component
 * Can be used standalone or wrapped around content
 */
export const MdBadge = React.forwardRef<HTMLElement, MdBadgeProps>(
  ({ value, max, dot, className, children }, ref) => {
    const displayValue =
      typeof value === "number" && max && value > max ? `${max}+` : value;

    if (children) {
      return (
        <span className={cn("relative inline-flex", className)}>
          {children}
          <md-badge
            ref={ref}
            className={cn("absolute -top-1 -right-1", dot && "hidden")}
            value={displayValue}
          />
        </span>
      );
    }

    return (
      <md-badge
        ref={ref}
        className={cn("md-badge-styled", dot && "md-badge-dot", className)}
        value={dot ? undefined : displayValue}
      />
    );
  },
);
MdBadge.displayName = "MdBadge";
