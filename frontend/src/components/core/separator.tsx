import * as React from "react";

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

export { Separator };
