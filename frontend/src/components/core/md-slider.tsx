"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MdSliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  ticks?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

/**
 * Material 3 Slider Component
 */
export const MdSlider = React.forwardRef<HTMLElement, MdSliderProps>(
  ({ value = 0, min = 0, max = 100, step = 1, disabled, label, ticks, onChange, className }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLElement>) => {
      const target = event.currentTarget as HTMLElement & { value?: number };
      if (target.value !== undefined) {
        onChange?.(target.value);
      }
    };

    return (
      <md-slider
        ref={ref}
        className={cn("md-slider-styled", className)}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled || undefined}
        labeled={label ? true : undefined}
        label={label}
        ticks={ticks || undefined}
        onChange={handleChange}
      >
        {label}
      </md-slider>
    );
  },
);
MdSlider.displayName = "MdSlider";
