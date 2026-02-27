"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type MaterialSymbolName = string;

export interface MaterialSymbolProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  icon: MaterialSymbolName;
  size?: number | string;
  strokeWidth?: number;
  fill?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  grade?: -25 | 0 | 200;
  opticalSize?: 20 | 24 | 40 | 48;
}

function normalize(icon: string): string {
  return icon.trim().toLowerCase();
}

export function MaterialSymbol({
  icon,
  size = 20,
  className,
  style,
  strokeWidth,
  fill = false,
  weight = 400,
  grade = 0,
  opticalSize = 24,
  ...props
}: MaterialSymbolProps) {
  const explicitAriaHidden = props["aria-hidden"];
  const resolvedAriaHidden =
    explicitAriaHidden === false || explicitAriaHidden === "false"
      ? undefined
      : true;

  return (
    <span
      aria-hidden={resolvedAriaHidden}
      className={cn(
        "material-symbols-rounded inline-flex items-center justify-center select-none align-middle leading-none shrink-0 overflow-hidden whitespace-nowrap [word-wrap:normal] antialiased [text-rendering:optimizeLegibility]",
        className,
      )}
      style={{
        "--md-icon-size":
          typeof size === "number" ? `${size}px` : size,
        fontSize: "var(--md-icon-size, 24px)",
        width: "var(--md-icon-size, 24px)",
        height: "var(--md-icon-size, 24px)",
        color: "inherit",
        fontWeight: 400,
        fontStyle: "normal",
        letterSpacing: "normal",
        textTransform: "none",
        lineHeight: 1,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        fontVariationSettings: `'FILL' ${
          fill ? 1 : 0
        }, 'wght' ${strokeWidth && strokeWidth > 2 ? 300 : weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      {normalize(icon)}
    </span>
  );
}
