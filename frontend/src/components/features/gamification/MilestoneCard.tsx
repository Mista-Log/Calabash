"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "@/lib/motion-foundations";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  BookOpen01Icon,
  GraduationScrollIcon,
  Copy01Icon,
  GiftIcon,
  CheckmarkCircle01Icon,
  Locker01Icon,
} from "@/lib/icons/material-icons";
import { M3Button } from "@/components/core";
import { Card, CardContent } from "@/components/core";

interface MilestoneCardProps {
  milestone: {
    id: string;
    title: string;
    description: string;
    type: "course_completion" | "material_consumption" | "xp_threshold";
    progress: number;
    target: number;
    reward: {
      type: "xp" | "badge" | "title";
      value: number | string;
    };
    completed: boolean;
    claimed: boolean;
  };
  onClaim?: (milestoneId: string) => void;
  index?: number;
  reducedMotion?: boolean;
}

const typeIcons = {
  course_completion: GraduationScrollIcon,
  material_consumption: BookOpen01Icon,
  xp_threshold: Copy01Icon,
};

const typeColors = {
  course_completion: {
    bg: "bg-[color:var(--md-sys-color-surface-container-low)]",
    border: "border-[color:var(--md-sys-color-outline-variant)]",
    accent: "text-[color:var(--md-sys-color-primary)]",
    progress: "bg-[color:var(--md-sys-color-primary)]",
  },
  material_consumption: {
    bg: "bg-[color:var(--md-sys-color-surface-container-low)]",
    border: "border-[color:var(--md-sys-color-outline-variant)]",
    accent: "text-[color:var(--md-sys-color-secondary)]",
    progress: "bg-[color:var(--md-sys-color-secondary)]",
  },
  xp_threshold: {
    bg: "bg-[color:var(--md-sys-color-surface-container-low)]",
    border: "border-[color:var(--md-sys-color-outline-variant)]",
    accent: "text-[color:var(--md-sys-color-tertiary)]",
    progress: "bg-[color:var(--md-sys-color-tertiary)]",
  },
};

export function MilestoneCard({
  milestone,
  onClaim,
  index = 0,
  reducedMotion = false,
}: MilestoneCardProps) {
  const Icon = typeIcons[milestone.type];
  const colors = typeColors[milestone.type];
  const percentage = Math.min(
    (milestone.progress / milestone.target) * 100,
    100,
  );
  const isCompleted = milestone.completed;
  const isClaimed = milestone.claimed;

  const getRewardLabel = () => {
    switch (milestone.reward.type) {
      case "xp":
        return `+${milestone.reward.value} XP`;
      case "badge":
        return `Badge: ${milestone.reward.value}`;
      case "title":
        return `Title: "${milestone.reward.value}"`;
      default:
        return "Reward";
    }
  };

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        className={cn(
          "m3-surface m3-surface--elevated relative overflow-hidden border transition-all duration-300",
          colors.bg,
          colors.border,
          isCompleted ? (isClaimed ? "opacity-70" : "") : "opacity-90",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={cn(
                "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl",
                isCompleted
                  ? colors.accent
                  : "text-[color:var(--md-sys-color-on-surface-variant)]",
                "bg-[color:var(--md-sys-color-surface-container)]",
              )}
            >
              <MaterialSymbol
                icon={isCompleted && !isClaimed ? GiftIcon : Icon}
                size={24}
              />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3
                    className={cn(
                      "font-bold text-[15px]",
                      isCompleted
                        ? colors.accent
                        : "text-[color:var(--md-sys-color-on-surface)]",
                    )}
                  >
                    {milestone.title}
                  </h3>
                  <p className="text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                    {milestone.description}
                  </p>
                </div>

                {isCompleted && !isClaimed && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary)]">
                    <MaterialSymbol
                      icon={CheckmarkCircle01Icon}
                      size={14}
                      className="text-[color:var(--md-sys-color-on-primary)]"
                    />
                  </div>
                )}

                {isClaimed && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--md-sys-color-surface-container-high)]">
                    <MaterialSymbol
                      icon={Locker01Icon}
                      size={12}
                      className="text-[color:var(--md-sys-color-on-surface-variant)]"
                    />
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                  <span
                    className={cn(
                      isCompleted
                        ? colors.accent
                        : "text-[color:var(--md-sys-color-on-surface-variant)]",
                    )}
                  >
                    Progress
                  </span>
                  <span className="text-[color:var(--md-sys-color-on-surface-variant)]">
                    {milestone.progress} / {milestone.target}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--md-sys-color-surface-container-high)]">
                  <motion.div
                    initial={reducedMotion ? { width: `${percentage}%` } : { width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={cn(
                      "h-full rounded-full transition-all",
                      colors.progress,
                    )}
                  />
                </div>
              </div>

              {/* Reward and action */}
              <div className="flex items-center justify-between pt-1">
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2 py-1",
                    "bg-[color:var(--md-sys-color-surface-container-high)]",
                  )}
                >
                  <MaterialSymbol
                    icon={GiftIcon}
                    size={12}
                    className={colors.accent}
                  />
                  <span className="text-[11px] font-bold text-[color:var(--md-sys-color-on-surface)]">
                    {getRewardLabel()}
                  </span>
                </div>

                {isCompleted && !isClaimed && onClaim && (
                  <M3Button
                    size="sm"
                    onClick={() => onClaim(milestone.id)}
                    className="h-8 rounded-lg px-3 text-[12px] font-bold"
                  >
                    Claim Reward
                  </M3Button>
                )}

                {isClaimed && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--md-sys-color-on-surface-variant)]">
                    Claimed
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
