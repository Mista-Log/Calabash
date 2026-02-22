"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends React.HTMLAttributes<HTMLElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({
  checked = false,
  onCheckedChange,
  className,
  disabled,
  ...props
}: SwitchProps) {
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
}
