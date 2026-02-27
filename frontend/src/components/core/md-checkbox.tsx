"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MdCheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  error?: boolean;
  helperText?: string;
}

/**
 * Material Web Checkbox Component
 */
export const MdCheckbox = React.forwardRef<HTMLInputElement, MdCheckboxProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const autoId = React.useId();
    const checkboxId = id || `checkbox-${autoId}`;

    const labelEl = label
      ? React.createElement(
          "label",
          {
            htmlFor: checkboxId,
            className:
              "text-sm font-medium text-foreground cursor-pointer hover:text-primary/80 transition-colors",
          },
          label,
        )
      : null;

    const helperTextEl = helperText
      ? React.createElement(
          "span",
          {
            className: cn(
              "text-xs ml-6",
              error ? "text-error" : "text-muted-foreground",
            ),
          },
          helperText,
        )
      : null;

    return (
      <div className={cn("relative inline-flex flex-col gap-1", className)}>
        <div className="flex items-center gap-2">
          <md-checkbox ref={ref} id={checkboxId} {...props} />
          {labelEl}
        </div>
        {helperTextEl}
      </div>
    );
  },
);
MdCheckbox.displayName = "MdCheckbox";
