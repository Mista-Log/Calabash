"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MdSwitchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Material Web Switch Component
 */
export const MdSwitch = React.forwardRef<HTMLInputElement, MdSwitchProps>(
  (
    { label, description, checked, onCheckedChange, className, ...props },
    ref,
  ) => {
    const handleChange = React.useCallback(
      (e: React.FormEvent<HTMLElement>) => {
        const target = e.target as HTMLElement & { selected?: boolean };
        if (typeof target.selected === "boolean") {
          onCheckedChange?.(target.selected);
        }
      },
      [onCheckedChange],
    );

    const labelEl = label
      ? React.createElement(
          "label",
          { className: "text-sm font-medium text-foreground" },
          label,
          description && React.createElement(
            "div",
            { className: "text-xs text-muted-foreground font-normal" },
            description
          )
        )
      : null;

    return (
      <div className={cn("relative inline-flex flex-col gap-1", className)}>
        <div className="flex items-center gap-3">
          <md-switch
            ref={ref}
            selected={checked}
            onChange={handleChange}
            {...props}
          />
          {labelEl}
        </div>
      </div>
    );
  },
);
MdSwitch.displayName = "MdSwitch";
