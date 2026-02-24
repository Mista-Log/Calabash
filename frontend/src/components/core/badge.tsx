<<<<<<< HEAD
﻿import * as React from "react";
=======
import * as React from "react";
>>>>>>> origin/main
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
<<<<<<< HEAD
  "m3-chip inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold",
=======
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2",
>>>>>>> origin/main
  {
    variants: {
      variant: {
        default:
<<<<<<< HEAD
          "border-transparent bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]",
        secondary:
          "border-transparent bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)]",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "bg-transparent text-foreground",
=======
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "text-foreground border-border bg-background/50 hover:bg-muted/50 hover:border-primary/20",
>>>>>>> origin/main
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
<<<<<<< HEAD
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
=======
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
>>>>>>> origin/main
}

export { Badge, badgeVariants };
