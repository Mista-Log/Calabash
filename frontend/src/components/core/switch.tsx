<<<<<<< HEAD
﻿"use client";
=======
"use client";
>>>>>>> origin/main

import * as React from "react";
import { cn } from "@/lib/utils";

<<<<<<< HEAD
interface SwitchProps extends React.HTMLAttributes<HTMLElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
=======
interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
>>>>>>> origin/main
}

export function Switch({
  checked = false,
  onCheckedChange,
  className,
  disabled,
  ...props
}: SwitchProps) {
<<<<<<< HEAD
  return React.createElement("md-switch", {
    className: cn("m3-button", className),
    selected: checked,
    disabled,
    onInput: (event: Event) => {
      const target = event.target as { selected?: boolean };
      onCheckedChange?.(Boolean(target.selected));
    },
    onClick: () => onCheckedChange?.(!checked),
    ...props,
  });
=======
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "bg-primary border-transparent"
          : "bg-muted border-muted-foreground/20",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
>>>>>>> origin/main
}
