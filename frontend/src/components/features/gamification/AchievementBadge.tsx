"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "@/lib/motion-foundations";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Medal01Icon,
  Copy01Icon,
  CrownIcon,
  Locker01Icon,
} from "@/lib/icons/material-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/core/tooltip";

interface AchievementBadgeProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: "course" | "material" | "streak" | "milestone" | "special";
    rarity: "common" | "rare" | "epic" | "legendary";
    unlocked: boolean;
    unlockedAt?: string;
    progress?: number;
    target?: number;
  };
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

const rarityStyles = {
  common: {
    bg: "bg-[color:var(--md-sys-color-surface-container-high)]",
    border: "border-[color:var(--md-sys-color-outline-variant)]",
    icon: "text-[color:var(--md-sys-color-on-surface-variant)]",
    dot: "bg-[color:var(--md-sys-color-on-surface-variant)]",
    progress: "bg-[color:var(--md-sys-color-on-surface-variant)]",
  },
  rare: {
    bg: "bg-[color:var(--md-sys-color-primary-container)]",
    border: "border-[color:var(--md-sys-color-primary)]",
    icon: "text-[color:var(--md-sys-color-on-primary-container)]",
    dot: "bg-[color:var(--md-sys-color-primary)]",
    progress: "bg-[color:var(--md-sys-color-primary)]",
  },
  epic: {
    bg: "bg-[color:var(--md-sys-color-secondary-container)]",
    border: "border-[color:var(--md-sys-color-secondary)]",
    icon: "text-[color:var(--md-sys-color-on-secondary-container)]",
    dot: "bg-[color:var(--md-sys-color-secondary)]",
    progress: "bg-[color:var(--md-sys-color-secondary)]",
  },
  legendary: {
    bg: "bg-[color:var(--md-sys-color-tertiary-container)]",
    border: "border-[color:var(--md-sys-color-tertiary)]",
    icon: "text-[color:var(--md-sys-color-on-tertiary-container)]",
    dot: "bg-[color:var(--md-sys-color-tertiary)]",
    progress: "bg-[color:var(--md-sys-color-tertiary)]",
  },
};

const categoryIcons = {
  course: Medal01Icon,
  material: Copy01Icon,
  streak: Copy01Icon,
  milestone: CrownIcon,
  special: CrownIcon,
};

const sizeStyles = {
  sm: { container: "h-16 w-16", icon: 24 },
  md: { container: "h-20 w-20", icon: 32 },
  lg: { container: "h-24 w-24", icon: 40 },
};

export function AchievementBadge({
  achievement,
  size = "md",
  showTooltip = true,
}: AchievementBadgeProps) {
  const { container, icon: iconSize } = sizeStyles[size];
  const styles = rarityStyles[achievement.rarity];
  const CategoryIcon = categoryIcons[achievement.category];

  const badgeContent = (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative flex items-center justify-center rounded-2xl border-2 transition-all duration-300",
        container,
        styles.bg,
        styles.border,
        achievement.unlocked
          ? "hover:scale-[1.03]"
          : "opacity-60 grayscale",
      )}
    >
      {/* Icon */}
      <div className={cn("relative z-10", styles.icon)}>
        <MaterialSymbol icon={CategoryIcon} size={iconSize} />
      </div>

      {/* Lock overlay */}
      {!achievement.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20 backdrop-blur-[1px]">
          <MaterialSymbol
            icon={Locker01Icon}
            size={iconSize * 0.6}
            className="text-[color:var(--md-sys-color-inverse-on-surface)]"
          />
        </div>
      )}

      {/* Progress indicator for in-progress achievements */}
      {!achievement.unlocked &&
        achievement.progress !== undefined &&
        achievement.target && (
          <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[color:var(--md-sys-color-surface-container-high)] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[color:var(--md-sys-color-on-surface)]">
            {achievement.progress}/{achievement.target}
          </div>
        )}

      {/* Rarity indicator dots */}
      <div className="absolute -top-1.5 right-1.5 flex gap-0.5">
        {Array.from({
          length:
            achievement.rarity === "legendary"
              ? 3
              : achievement.rarity === "epic"
                ? 2
                : 1,
        }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              styles.dot,
            )}
          />
        ))}
      </div>
    </motion.div>
  );

  if (!showTooltip) {
    return badgeContent;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger>{badgeContent}</TooltipTrigger>
        <TooltipContent
          side="top"
          className={cn(
            "m3-surface m3-surface--elevated max-w-[220px] border border-[color:var(--md-sys-color-outline-variant)] p-3",
          )}
        >
          <div className="space-y-1.5 text-center">
            <p
              className={cn(
                "font-bold",
                achievement.unlocked
                  ? "text-[color:var(--md-sys-color-on-surface)]"
                  : "text-[color:var(--md-sys-color-on-surface-variant)]",
              )}
            >
              {achievement.title}
            </p>
            <p className="text-[11px] leading-tight text-[color:var(--md-sys-color-on-surface-variant)]">
              {achievement.description}
            </p>
            {achievement.unlockedAt && (
              <p className="text-[10px] font-medium text-[color:var(--md-sys-color-primary)]">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
            {!achievement.unlocked &&
              achievement.progress !== undefined &&
              achievement.target && (
                <div className="pt-1">
                  <div className="h-1.5 w-full rounded-full bg-[color:var(--md-sys-color-surface-container-high)]">
                    <div
                      className={cn("h-full rounded-full transition-all", styles.progress)}
                      style={{
                        width: `${((achievement.progress ?? 0) / achievement.target) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
