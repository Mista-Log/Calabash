"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MdDividerProps {
  orientation?: "horizontal" | "vertical";
  inset?: boolean;
  className?: string;
}

/**
 * Material 3 Divider Component
 */
export const MdDivider = React.forwardRef<HTMLElement, MdDividerProps>(
  ({ orientation = "horizontal", inset, className }, ref) => {
    return (
      <md-divider
        ref={ref}
        className={cn(
          "md-divider-styled",
          orientation === "vertical" ? "vertical" : "horizontal",
          inset && "inset",
          className,
        )}
        role="separator"
      />
    );
  },
);
MdDivider.displayName = "MdDivider";
