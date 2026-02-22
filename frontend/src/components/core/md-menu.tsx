"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MdMenuProps {
  open?: boolean;
  onClose?: () => void;
  anchor?: "top" | "bottom" | "left" | "right";
  children?: React.ReactNode;
  className?: string;
}

/**
 * Material 3 Menu Component
 */
export const MdMenu = React.forwardRef<HTMLElement, MdMenuProps>(
  ({ open, onClose, anchor = "top", children, className }, ref) => {
    const handleKeyDown = React.useCallback(
      (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose?.();
        }
      },
      [onClose],
    );

    React.useEffect(() => {
      if (open) {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
      }
    }, [open, handleKeyDown]);

    return (
      <md-menu
        ref={ref}
        className={cn("md-menu-styled", className)}
        open={open || undefined}
        anchor={anchor}
      >
        {children}
      </md-menu>
    );
  },
);
MdMenu.displayName = "MdMenu";

export interface MdMenuItemProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Material 3 Menu Item Component
 */
export const MdMenuItem = React.forwardRef<HTMLElement, MdMenuItemProps>(
  ({ onClick, disabled, children, className }, ref) => {
    return (
      <md-menu-item
        ref={ref}
        className={cn("md-menu-item-styled", className)}
        disabled={disabled || undefined}
        onClick={onClick}
      >
        {children}
      </md-menu-item>
    );
  },
);
MdMenuItem.displayName = "MdMenuItem";
