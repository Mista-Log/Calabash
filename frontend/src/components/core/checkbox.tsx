<<<<<<< HEAD
﻿"use client";

import { CheckmarkCircle02Icon } from "@/lib/icons/material-icons";
import * as React from "react";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    const isChecked = typeof checked === 'boolean' ? checked : false;

    return (
      <div className="relative flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={isChecked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          disabled={disabled}
          className={cn("peer sr-only", className)}
          {...props}
        />
        <div
          className={cn(
            "pointer-events-none flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 outline-none transition-all duration-200",
            "border-outline hover:border-on-surface",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
            "peer-disabled:cursor-not-allowed peer-disabled:border-on-surface/38",
            isChecked && "bg-primary border-primary text-on-primary",
            className
          )}
          role="checkbox"
          aria-checked={isChecked}
        >
          {isChecked && (
            <MaterialSymbol
              icon={CheckmarkCircle02Icon}
              size={18}
              className="stroke-2"
            />
          )}
        </div>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
=======
"use client";

import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-md border border-border/70 bg-background/50 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary transition-all duration-200 hover:border-primary",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current h-full w-full")}
    >
      <HugeiconsIcon
        icon={CheckmarkCircle02Icon}
        size={14} // Increased size for better visibility
        className="stroke-2"
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
>>>>>>> origin/main

export { Checkbox };
