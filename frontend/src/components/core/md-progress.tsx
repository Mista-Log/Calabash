"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MdProgressIndicatorProps {
  type?: "circular" | "linear";
  value?: number;
  indeterminate?: boolean;
  size?: number;
  className?: string;
}

/**
 * Material 3 Progress Indicator Component
 * Supports both circular and linear variants
 */
export const MdProgressIndicator = React.forwardRef<
  HTMLElement,
  MdProgressIndicatorProps
>(({ type = "circular", value, indeterminate = true, size = 40, className }, ref) => {
  if (type === "linear") {
    return (
      <md-linear-progress
        ref={ref}
        className={cn("md-linear-progress-styled", className)}
        buffer={indeterminate ? undefined : (value ?? 0) / 100}
        value={indeterminate ? undefined : (value ?? 0) / 100}
      />
    );
  }

  return (
    <md-circular-progress
      ref={ref}
      className={cn("md-circular-progress-styled", className)}
      style={
        {
          "--md-circular-progress-size": `${size}px`,
          "--md-circular-progress-active-indicator-width": "4px",
        } as React.CSSProperties
      }
      value={indeterminate ? undefined : value ?? 0}
      indeterminate={indeterminate || undefined}
    />
  );
});
MdProgressIndicator.displayName = "MdProgressIndicator";
