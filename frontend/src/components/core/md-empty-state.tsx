"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MdIcon } from "./md-icon";
import { MdFilledButton } from "./md-button";

export interface MdEmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  illustration?: React.ReactNode;
}

/**
 * Material 3 Empty State Component
 * 
 * Displays when there's no content to show
 */
export function MdEmptyState({
  icon = "inbox",
  title,
  description,
  actionLabel,
  onAction,
  className,
  illustration,
}: MdEmptyStateProps) {
  return React.createElement(
    "div",
    {
      className: cn(
        "md-empty-state",
        "flex flex-col items-center justify-center",
        "p-8 sm:p-12",
        "text-center",
        className
      ),
    },
    // Illustration or Icon
    illustration
      ? illustration
      : React.createElement(
          "div",
          {
            className: cn(
              "flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full",
              "bg-[color:var(--md-sys-color-surface-container-high)]",
              "mb-6"
            ),
          },
          React.createElement(
            MdIcon,
            {
              className: "text-[40px] sm:text-[48px] text-[color:var(--md-sys-color-on-surface-variant)]",
            },
            icon
          )
        ),
    // Title
    React.createElement(
      "h3",
      { className: "m3-headline-small text-[color:var(--md-sys-color-on-surface)] mb-2" },
      title
    ),
    // Description
    description && React.createElement(
      "p",
      { className: "m3-body-large text-[color:var(--md-sys-color-on-surface-variant)] max-w-md mb-6" },
      description
    ),
    // Action Button
    actionLabel && onAction && React.createElement(
      MdFilledButton,
      {
        onClick: onAction,
        icon: "add",
      },
      actionLabel
    )
  );
}
