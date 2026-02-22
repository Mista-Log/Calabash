import React from "react";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: "xs" | "sm" | "md" | "lg";
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

const sizeMap = {
  xs: { diameter: 40, labelSize: 10 },
  sm: { diameter: 60, labelSize: 13 },
  md: { diameter: 80, labelSize: 14 },
  lg: { diameter: 120, labelSize: 18 },
};

export function ProgressRing({
  progress,
  size = "md",
  strokeWidth = 8,
  className,
  showLabel = true,
}: ProgressRingProps) {
  const { diameter, labelSize } = sizeMap[size];
  const boundedProgress = Math.max(0, Math.min(100, progress));
  const normalizedValue = boundedProgress / 100;
  const indicatorWidth = (strokeWidth / diameter) * 100;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {React.createElement("md-progress", {
        type: "circular",
        value: normalizedValue,
        style: {
          "--md-circular-progress-size": `${diameter}px`,
          "--md-circular-progress-active-indicator-width": indicatorWidth,
        } as React.CSSProperties,
      })}

      {showLabel ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: `${labelSize}px`,
          }}
        >
          {Math.round(boundedProgress)}%
        </div>
      ) : null}
    </div>
  );
}
