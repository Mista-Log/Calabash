import React from "react";
import { cn } from "@/lib/utils";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { Folder01Icon } from "@/lib/icons/material-icons";
import { M3Button } from "@/components/core";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }> | string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Folder01Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[220px] flex-col items-center justify-center px-4 py-12 text-center",
        className,
      )}
      {...props}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] text-[color:var(--md-sys-color-on-surface-variant)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
          <MaterialSymbol icon={Icon as string} size={24} strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="mb-2 text-2xl font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)]">
        {title}
      </h3>
      {description && (
        <p className="mx-auto max-w-[380px] text-base leading-relaxed text-[color:var(--md-sys-color-on-surface-variant)]">
          {description}
        </p>
      )}

      <div className="m3-action-row mt-6 w-full max-w-[360px] justify-center">
        {action ||
          (actionLabel && onAction && (
            <M3Button
              onClick={onAction}
              variant="outlined"
              layout="mobile-full"
            >
              {actionLabel}
            </M3Button>
          ))}
      </div>
    </div>
  );
}
