"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MdChipProps {
  label?: string;
  selected?: boolean;
  disabled?: boolean;
  avatar?: React.ReactNode;
  icon?: string;
  onClose?: () => void;
  onClick?: () => void;
  className?: string;
}

/**
 * Material 3 Chip Component
 */
export const MdChip = React.forwardRef<HTMLElement, MdChipProps>(
  ({ label, selected, disabled, avatar, icon, onClose, onClick, className }, ref) => {
    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      onClose?.();
    };

    return (
      <md-chip
        ref={ref}
        className={cn("md-chip-styled", className)}
        selected={selected || undefined}
        disabled={disabled || undefined}
        label={label}
        onClick={onClick}
      >
        {avatar}
        {icon ? <md-icon slot="icon">{icon}</md-icon> : null}
        {label}
        {onClose ? (
          <md-icon slot="trailing-icon" onClick={handleClose}>
            cancel
          </md-icon>
        ) : null}
      </md-chip>
    );
  },
);
MdChip.displayName = "MdChip";

export interface MdChipSetProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Material 3 Chip Set Component
 */
export const MdChipSet = React.forwardRef<HTMLElement, MdChipSetProps>(
  ({ children, className }, ref) => {
    return (
      <md-chip-set
        ref={ref}
        className={cn("md-chip-set-styled flex flex-wrap gap-2", className)}
      >
        {children}
      </md-chip-set>
    );
  },
);
MdChipSet.displayName = "MdChipSet";
