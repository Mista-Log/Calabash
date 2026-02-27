"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type DashboardTileSpan = "hero" | "rail" | "wide" | "narrow" | "full";

const spanClassMap: Record<DashboardTileSpan, string> = {
  hero: "col-span-12 lg:col-span-8",
  rail: "col-span-12 lg:col-span-4",
  wide: "col-span-12 xl:col-span-7",
  narrow: "col-span-12 xl:col-span-5",
  full: "col-span-12",
};

interface DashboardMasonrySectionProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function DashboardMasonrySection({
  as: Component = "div",
  className,
  children,
  ...props
}: DashboardMasonrySectionProps) {
  return (
    <Component
      className={cn(
        "grid grid-cols-12 gap-5 sm:gap-6 [grid-auto-flow:dense]",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

interface DashboardTileProps extends React.HTMLAttributes<HTMLDivElement> {
  span: DashboardTileSpan;
}

export function DashboardTile({ span, className, children, ...props }: DashboardTileProps) {
  return (
    <div className={cn(spanClassMap[span], className)} {...props}>
      {children}
    </div>
  );
}
