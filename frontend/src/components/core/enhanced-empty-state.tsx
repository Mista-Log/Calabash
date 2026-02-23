"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { Folder01Icon } from "@/lib/icons/material-icons";
import { M3Button } from "@/components/core";

interface EnhancedEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }> | string;
  variant?: "default" | "illustrated";
  title: string;
  description?: string;
  action?: React.ReactNode;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onAction?: () => void;
  onSecondaryAction?: () => void;
  illustration?: React.ReactNode;
  tip?: string;
}

/**
 * Enhanced Empty State with illustrations, tips, and dual CTAs
 * Uses Material 3 design system colors
 */
export function EnhancedEmptyState({
  icon: Icon = Folder01Icon,
  variant = "default",
  title,
  description,
  action,
  actionLabel,
  secondaryActionLabel,
  onAction,
  onSecondaryAction,
  illustration,
  tip,
  className,
  ...props
}: EnhancedEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center",
        variant === "illustrated" && "min-h-[360px]",
        className
      )}
      {...props}
    >
      {/* Illustration/Icon */}
      {variant === "illustrated" ? (
        illustration || (
          <div className="mb-6 flex h-32 w-32 items-center justify-center">
            <div className="relative h-full w-full">
              {/* Decorative background circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-[color:var(--md-sys-color-primary-container)] opacity-50" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-[color:var(--md-sys-color-secondary-container)] opacity-60" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--md-sys-color-tertiary-container)]">
                  <MaterialSymbol icon={Icon as string} size={24} />
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] text-[color:var(--md-sys-color-on-surface-variant)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
            <MaterialSymbol icon={Icon as string} size={24} strokeWidth={1.5} />
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="mb-2 text-2xl font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)]">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mx-auto max-w-[420px] text-base leading-relaxed text-[color:var(--md-sys-color-on-surface-variant)]">
          {description}
        </p>
      )}

      {/* Tip */}
      {tip && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-4 py-3 text-left">
          <MaterialSymbol
            icon="lightbulb"
            size={18}
            className="mt-0.5 text-[color:var(--md-sys-color-tertiary)]"
          />
          <p className="text-[13px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
            {tip}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="m3-action-row mt-6 flex w-full max-w-[420px] flex-wrap items-center justify-center gap-3">
        {action ||
          (actionLabel && onAction && (
            <M3Button
              onClick={onAction}
              layout="mobile-full"
              className="min-w-[140px] px-6"
            >
              {actionLabel}
            </M3Button>
          ))}
        {secondaryActionLabel && onSecondaryAction && (
          <M3Button
            onClick={onSecondaryAction}
            variant="outlined"
            layout="mobile-full"
            className="min-w-[140px] px-6"
          >
            {secondaryActionLabel}
          </M3Button>
        )}
      </div>
    </div>
  );
}
