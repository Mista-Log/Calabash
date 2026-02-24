import * as React from "react";
<<<<<<< HEAD

const Separator = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    orientation?: "horizontal" | "vertical";
    decorative?: boolean;
    inset?: boolean;
    insetStart?: boolean;
    insetEnd?: boolean;
  }
>(
  (
    {
      orientation = "horizontal",
      decorative = true,
      inset,
      insetStart,
      insetEnd,
      style,
      ...props
    },
    ref,
  ) =>
    React.createElement("md-divider", {
      ...props,
      ref,
      role:
        decorative || orientation === "vertical" ? undefined : "separator",
      "aria-orientation":
        decorative || orientation === "horizontal" ? undefined : "vertical",
      inset: inset || undefined,
      "inset-start": insetStart || undefined,
      "inset-end": insetEnd || undefined,
      style:
        orientation === "vertical"
          ? { ...style, width: "1px", height: "100%" }
          : style,
    }),
);
Separator.displayName = "Separator";
=======
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border/40",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
>>>>>>> origin/main

export { Separator };
