"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";

export interface LastUpdatedProps {
  timestamp: string | Date;
  className?: string;
  showIcon?: boolean;
  format?: "relative" | "absolute";
}

/**
 * Last Updated Timestamp Component
 * Shows relative or absolute time with Material 3 styling
 */
export function LastUpdated({
  timestamp,
  className,
  showIcon = true,
  format = "relative",
}: LastUpdatedProps) {
  const date = React.useMemo(() => {
    return timestamp instanceof Date ? timestamp : new Date(timestamp);
  }, [timestamp]);

  const formattedTime = React.useMemo(() => {
    if (format === "absolute") {
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    }

    // Relative time
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }, [date, format]);

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]",
        className
      )}
    >
      {showIcon && (
        <MaterialSymbol icon="schedule" size={14} />
      )}
      <span>Updated {formattedTime}</span>
    </div>
  );
}
