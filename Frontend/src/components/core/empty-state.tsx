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
}

export function EmptyState({
  icon: Icon = Folder01Icon,
  title,
  description,
  action,
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
        className,
      )}
      {...props}
    >
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
    </div>
  );
}
