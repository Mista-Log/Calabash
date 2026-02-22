"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MdTabsProps {
  activeIndex?: number;
  onInteraction?: (index: number) => void;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Material 3 Tabs Component
 * 
 * Wraps md-tabs with proper padding and styling
 */
export const MdTabs = React.forwardRef<HTMLElement, MdTabsProps>(
  ({ activeIndex = 0, onInteraction, children, className }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLElement>) => {
      const target = event.currentTarget as HTMLElement & {
        activeTabIndex?: number;
      };
      const tabIndex = target.activeTabIndex ?? 0;
      onInteraction?.(tabIndex);
    };

    return (
      <md-tabs
        ref={ref}
        active-index={activeIndex}
        className={cn(
          "md-tabs-styled",
          "[&>md-tab]:px-6 [&>md-tab]:py-3",
          "[&>md-tab]:m3-label-large",
          "md-tabs-padding-applied",
          className,
        )}
        onChange={handleChange}
      >
        {children}
      </md-tabs>
    );
  },
);
MdTabs.displayName = "MdTabs";

export interface MdTabProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Material 3 Tab Component
 * 
 * Wraps md-tab with proper styling
 */
export const MdTab = React.forwardRef<HTMLElement, MdTabProps>(
  ({ label, active, onClick, className }, ref) => {
    return (
      <md-tab
        ref={ref}
        label={label}
        active={active || undefined}
        className={cn(
          "md-tab-styled",
          "px-6 py-3",
          "m3-label-large",
          "tab-padding-applied",
          className,
        )}
        onClick={onClick}
      >
        {label}
      </md-tab>
    );
  },
);
MdTab.displayName = "MdTab";
