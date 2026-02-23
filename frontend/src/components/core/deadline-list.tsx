"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";

export interface Deadline {
  title: string;
  due: string;
  dueDate: Date | string;
  color?: "red" | "orange" | "green" | "amber" | "sage";
  courseCode?: string;
}

export interface DeadlineListProps {
  deadlines: Deadline[];
  className?: string;
  limit?: number;
  onDismiss?: (id: string) => void;
}

function getPriorityColor(deadline: Deadline): {
  bg: string;
  text: string;
  icon: string;
  border: string;
} {
  const dueDate = deadline.dueDate instanceof Date ? deadline.dueDate : new Date(deadline.dueDate);
  const now = new Date();
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    // Overdue
    return {
      bg: "bg-[color:var(--md-sys-color-error-container)]",
      text: "text-[color:var(--md-sys-color-on-error-container)]",
      icon: "error",
      border: "border-[color:var(--md-sys-color-error)]",
    };
  }
  if (diffDays <= 2) {
    // Urgent
    return {
      bg: "bg-[color:var(--md-sys-color-error-container)]",
      text: "text-[color:var(--md-sys-color-on-error-container)]",
      icon: "priority_high",
      border: "border-[color:var(--md-sys-color-error)]",
    };
  }
  if (diffDays <= 7) {
    // Soon
    return {
      bg: "bg-[color:var(--md-sys-color-tertiary-container)]",
      text: "text-[color:var(--md-sys-color-on-tertiary-container)]",
      icon: "schedule",
      border: "border-[color:var(--md-sys-color-tertiary)]",
    };
  }
  // Normal
  return {
    bg: "bg-[color:var(--md-sys-color-primary-container)]",
    text: "text-[color:var(--md-sys-color-on-primary-container)]",
    icon: "event",
    border: "border-[color:var(--md-sys-color-primary)]",
  };
}

function getRelativeTime(dueDate: Date | string): string {
  const due = dueDate instanceof Date ? dueDate : new Date(dueDate);
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)}d overdue`;
  }
  if (diffDays === 0) {
    return "Due today";
  }
  if (diffDays === 1) {
    return "Due tomorrow";
  }
  if (diffDays <= 7) {
    return `Due in ${diffDays}d`;
  }
  return due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Enhanced Deadline List with priority indicators
 */
export function DeadlineList({
  deadlines,
  className,
  limit = 3,
  onDismiss,
}: DeadlineListProps) {
  const displayedDeadlines = deadlines.slice(0, limit);

  if (deadlines.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MaterialSymbol
            icon="event"
            size={18}
            className="text-[color:var(--md-sys-color-primary)]"
          />
          <h3 className="text-[16px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
            Upcoming Deadlines
          </h3>
        </div>
        {deadlines.length > limit && (
          <span className="text-[12px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
            +{deadlines.length - limit} more
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {displayedDeadlines.map((deadline, index) => {
          const colors = getPriorityColor(deadline);
          const relativeTime = getRelativeTime(deadline.dueDate);

          return (
            <div
              key={`${deadline.title}-${index}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-4 transition-all",
                "hover:shadow-md",
                colors.bg,
                colors.border
              )}
            >
              {/* Priority indicator bar */}
              <div
                className={cn(
                  "absolute left-0 top-0 h-full w-1",
                  colors.border.replace("border", "bg")
                )}
              />

              <div className="flex items-start justify-between gap-3 pl-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <MaterialSymbol
                      icon={colors.icon}
                      size={16}
                      className={colors.text}
                    />
                    {deadline.courseCode && (
                      <span
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-[0.12em]",
                          colors.text
                        )}
                      >
                        {deadline.courseCode}
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-2 truncate text-[14px] font-semibold",
                      colors.text
                    )}
                  >
                    {deadline.title}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-[12px] font-medium",
                      colors.text
                    )}
                  >
                    {relativeTime}
                  </p>
                </div>

                {onDismiss && (
                  <button
                    onClick={() => onDismiss(deadline.title)}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Dismiss deadline"
                  >
                    <MaterialSymbol
                      icon="close"
                      size={16}
                      className={colors.text}
                    />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
