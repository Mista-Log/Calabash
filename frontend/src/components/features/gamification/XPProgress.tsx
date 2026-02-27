"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "@/lib/motion-foundations";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { Copy01Icon } from "@/lib/icons/material-icons";
import { Card, CardContent } from "@/components/core";
import { ProgressRing } from "@/components/core/progress-ring";

interface XPProgressProps {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  title?: string;
  streak?: {
    current: number;
    best: number;
  };
  size?: "sm" | "md" | "lg";
}

const LEVEL_TITLES = {
  1: "Novice Learner",
  2: "Apprentice",
  3: "Scholar",
  4: "Knowledge Seeker",
  5: "Academic Explorer",
  6: "Study Warrior",
  7: "Learning Guardian",
  8: "Wisdom Keeper",
  9: "Master Scholar",
  10: "Legendary Mind",
};

const getLevelTitle = (level: number): string => {
  const titles = Object.entries(LEVEL_TITLES).map(([k, v]) => ({
    level: parseInt(k),
    title: v,
  }));
  const applicable = titles.filter((t) => level >= t.level);
  if (applicable.length === 0) return "Beginner";
  return applicable[applicable.length - 1].title;
};

export function XPProgress({
  level,
  currentXP,
  xpToNextLevel,
  totalXP,
  title,
  streak,
  size = "md",
}: XPProgressProps) {
  const percentage = (currentXP / xpToNextLevel) * 100;
  const displayTitle = title || getLevelTitle(level);
  const sizeConfig = {
    sm: { ringSize: "sm" as const },
    md: { ringSize: "md" as const },
    lg: { ringSize: "lg" as const },
  };

  const { ringSize } = sizeConfig[size];

  return (
    <Card
      className={cn(
        "m3-surface m3-surface--elevated rounded-[28px] border-[color:var(--md-sys-color-outline-variant)]",
      )}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Level Badge */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <ProgressRing
                progress={percentage}
                size={ringSize}
                strokeWidth={size === "sm" ? 6 : 8}
                showLabel={false}
              />

              {/* Level number */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary)]"
                >
                  <span className="text-[18px] font-black text-[color:var(--md-sys-color-on-primary)]">
                    {level}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* XP info */}
            <div className="text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[color:var(--md-sys-color-on-surface-variant)]">
                Level {level}
              </p>
              <p className="text-[13px] font-bold text-[color:var(--md-sys-color-primary)]">
                {currentXP} / {xpToNextLevel} XP
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-4">
            {/* Title */}
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <MaterialSymbol
                  icon={Copy01Icon}
                  size={16}
                  className="text-[color:var(--md-sys-color-primary)]"
                />
                <h3 className="text-[15px] font-black text-[color:var(--md-sys-color-on-surface)]">
                  {displayTitle}
                </h3>
              </div>
              <p className="text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                Total XP Earned:{" "}
                <span className="font-bold text-[color:var(--md-sys-color-primary)]">
                  {totalXP}
                </span>
              </p>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                <span className="text-[color:var(--md-sys-color-on-surface-variant)]">
                  Progress to Level {level + 1}
                </span>
                <span className="text-[color:var(--md-sys-color-on-surface-variant)]">
                  {Math.round(percentage)}%
                </span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-[color:var(--md-sys-color-surface-container-high)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute inset-0 bg-[color:var(--md-sys-color-primary)]"
                  style={{ borderRadius: "9999px" }}
                />
              </div>
            </div>

            {/* Streak */}
            {streak && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary-container)]">
                  <MaterialSymbol
                    icon={Copy01Icon}
                    size={18}
                    className="text-[color:var(--md-sys-color-on-primary-container)]"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[18px] font-black text-[color:var(--md-sys-color-on-surface)]">
                      {streak.current}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--md-sys-color-on-surface-variant)]">
                      Day Streak
                    </span>
                  </div>
                  <p className="text-[11px] text-[color:var(--md-sys-color-on-surface-variant)]">
                    Best:{" "}
                    <span className="font-bold text-[color:var(--md-sys-color-primary)]">
                      {streak.best} days
                    </span>
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
