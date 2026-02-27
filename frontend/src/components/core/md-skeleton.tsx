"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MdSkeletonProps {
  variant?: "rectangular" | "circular" | "rounded" | "text";
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: "wave" | "pulse" | "none";
}

/**
 * Material 3 Skeleton Component
 * 
 * Loading placeholder with M3 styling and animations
 */
export function MdSkeleton({
  variant = "rectangular",
  width,
  height,
  className,
  animation = "wave",
}: MdSkeletonProps) {
  return React.createElement("div", {
    className: cn(
      "md-skeleton",
      `md-skeleton--${variant}`,
      `md-skeleton--${animation}`,
      className
    ),
    style: {
      width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
      height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
    },
  });
}

/**
 * Card Skeleton - For card loading states
 */
export function MdSkeletonCard({ className }: { className?: string }) {
  return React.createElement(
    "div",
    { className: cn("space-y-3", className) },
    React.createElement(MdSkeleton, { variant: "rounded", height: 160, className: "w-full" }),
    React.createElement("div", { className: "space-y-2" },
      React.createElement(MdSkeleton, { variant: "text", width: "60%", height: 20 }),
      React.createElement(MdSkeleton, { variant: "text", width: "80%", height: 16 })
    )
  );
}

/**
 * List Skeleton - For list loading states
 */
export function MdSkeletonList({ count = 4, className }: { count?: number; className?: string }) {
  const items = Array.from({ length: count });
  
  return React.createElement(
    "div",
    { className: cn("space-y-2", className) },
    items.map((_, i) =>
      React.createElement(
        "div",
        { key: i, className: "flex items-center gap-4" },
        React.createElement(MdSkeleton, { variant: "circular", width: 40, height: 40 }),
        React.createElement("div", { className: "flex-1 space-y-2" },
          React.createElement(MdSkeleton, { variant: "text", width: "40%", height: 16 }),
          React.createElement(MdSkeleton, { variant: "text", width: "60%", height: 14 })
        )
      )
    )
  );
}

/**
 * Table Skeleton - For table loading states
 */
export function MdSkeletonTable({ rows = 5, columns = 4, className }: { rows?: number; columns?: number; className?: string }) {
  return React.createElement(
    "div",
    { className: cn("space-y-3", className) },
    // Header
    React.createElement(
      "div",
      { className: "flex gap-4 border-b border-[color:var(--md-sys-color-outline-variant)] pb-2" },
      Array.from({ length: columns }).map((_, i) =>
        React.createElement(MdSkeleton, { key: i, variant: "text", width: 80, height: 16, className: "flex-1" })
      )
    ),
    // Rows
    Array.from({ length: rows }).map((_, rowIndex) =>
      React.createElement(
        "div",
        { key: rowIndex, className: "flex gap-4 py-2" },
        Array.from({ length: columns }).map((_, colIndex) =>
          React.createElement(MdSkeleton, { key: colIndex, variant: "text", width: 80, height: 16, className: "flex-1" })
        )
      )
    )
  );
}
