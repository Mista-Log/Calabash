import React from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: "xs" | "sm" | "md" | "lg";
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

const sizeMap = {
  xs: { diameter: 40, label: "text-[10px]" },
  sm: { diameter: 60, label: "text-xs" },
  md: { diameter: 80, label: "text-sm" },
  lg: { diameter: 120, label: "text-lg" },
};

export function ProgressRing({
  progress,
  size = "md",
  strokeWidth = 8,
  className,
  showLabel = true,
}: ProgressRingProps) {
  const { diameter, label } = sizeMap[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      <svg width={diameter} height={diameter} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />

        {/* Progress circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-1000 ease-out"
          style={{
            filter: "drop-shadow(0 0 4px rgba(var(--primary), 0.3))",
          }}
        />
      </svg>

      {showLabel && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center font-black text-primary",
            label,
          )}
        >
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}
