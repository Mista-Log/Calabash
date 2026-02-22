import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "m3-chip inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]",
        secondary:
          "border-transparent bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)]",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
