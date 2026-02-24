<<<<<<< HEAD
﻿import React from "react";
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
=======
import React from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder01Icon } from "@hugeicons/core-free-icons";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any | React.ReactNode; // Accepting ReactNode for flexibility
  title: string;
  description?: string;
  action?: React.ReactNode;
>>>>>>> origin/main
}

export function EmptyState({
  icon: Icon = Folder01Icon,
  title,
  description,
  action,
<<<<<<< HEAD
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[220px] flex-col items-center justify-center px-4 py-12 text-center",
=======
  className,
  ...props
}: EmptyStateProps) {
  const renderIcon = () => {
    if (React.isValidElement(Icon)) {
      return Icon; // Render as ReactNode directly
    }
    // Assume it's a HugeiconsIcon component type
    return (
      <HugeiconsIcon
        icon={Icon}
        className="h-14 w-14 text-muted-foreground/40" // Larger default icon
      />
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center animate-in fade-in-50",
>>>>>>> origin/main
        className,
      )}
      {...props}
    >
<<<<<<< HEAD
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
=======
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted/40 mb-6 ring-1 ring-border/50"> {/* Larger container */}
        {renderIcon()}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-base text-muted-foreground max-w-sm mb-8 text-balance">
          {description}
        </p>
      )}
      {action}
>>>>>>> origin/main
    </div>
  );
}
