"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MdRadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  name: string;
  value: string;
}

/**
 * Material Web Radio Button Component
 */
export const MdRadio = React.forwardRef<HTMLInputElement, MdRadioProps>(
  ({ label, className, id, name, value, ...props }, ref) => {
    const radioId = id || `radio-${name}-${value}`;

    const labelEl = label
      ? React.createElement(
          "label",
          {
            htmlFor: radioId,
            className: "text-sm font-medium text-foreground cursor-pointer hover:text-primary/80 transition-colors",
          },
          label
        )
      : null;

    return (
      <div className={cn("relative inline-flex items-center gap-2", className)}>
        <md-radio ref={ref} id={radioId} name={name} value={value} {...props} />
        {labelEl}
      </div>
    );
  },
);
MdRadio.displayName = "MdRadio";

/**
 * Radio Group Helper Component
 */
export interface MdRadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

export const MdRadioGroup = React.forwardRef<HTMLDivElement, MdRadioGroupProps>(
  ({ children, value, onValueChange, disabled, className, ...props }, ref) => {
    const handleChange = React.useCallback(
      (e: React.FormEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement & { value?: string };
        if (target.tagName === "MD-RADIO" && target.value) {
          onValueChange?.(target.value);
        }
      },
      [onValueChange],
    );

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-3", disabled && "opacity-50", className)}
        onChange={handleChange}
        data-selected-value={value}
        {...props}
      >
        {children}
      </div>
    );
  },
);
MdRadioGroup.displayName = "MdRadioGroup";
