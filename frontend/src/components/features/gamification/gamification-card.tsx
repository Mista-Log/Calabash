"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { ProgressRing } from "@/components/core/progress-ring";
import type { Achievement, StudentGamificationProfile } from "@/services/api";

export interface GamificationCardProps {
  gamification: StudentGamificationProfile | null;
  className?: string;
  onExpand?: () => void;
}

/**
 * Enhanced Gamification Card with level progress and achievements preview
 */
export function GamificationCard({
  gamification,
  className,
  onExpand,
}: GamificationCardProps) {
  if (!gamification) {
    return (
      <div
        className={cn(
          "rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-6",
          className
        )}
      >
        <div className="flex flex-col items-center justify-center py-8">
          <MaterialSymbol
            icon="emoji_events"
            size={40}
            className="text-[color:var(--md-sys-color-on-surface-variant)] opacity-50"
          />
          <p className="mt-4 text-[14px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
            Milestone data unavailable
          </p>
        </div>
      </div>
    );
  }

  const { level, currentXP, xpToNextLevel, totalXP, streak, achievements } = gamification;
  const progressPercent = xpToNextLevel > 0 ? (currentXP / xpToNextLevel) * 100 : 0;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const recentAchievements = achievements.filter((a) => a.unlocked).slice(0, 3);

  return (
    <div
      className={cn(
        "rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] p-6",
        className
      )}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary)]">
            <MaterialSymbol icon="school" size={24} className="text-[color:var(--md-sys-color-on-primary)]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
              Level {level}
            </p>
            <p className="text-[18px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              {gamification.title || "Learner"}
            </p>
          </div>
        </div>
        <button
          onClick={onExpand}
          className="flex items-center gap-1 rounded-full bg-[color:var(--md-sys-color-surface-container-high)] px-3 py-1.5 text-[13px] font-semibold text-[color:var(--md-sys-color-primary)] transition-colors hover:bg-[color:var(--md-sys-color-surface-container-highest)]"
        >
          View All
          <MaterialSymbol icon="arrow_forward" size={16} />
        </button>
      </div>

      {/* XP Progress */}
      <div className="mb-6 flex items-center gap-4">
        <ProgressRing
          progress={progressPercent}
          size="md"
          strokeWidth={8}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">
              XP to Level {level + 1}
            </span>
            <span className="text-[14px] font-bold text-[color:var(--md-sys-color-on-surface)]">
              {currentXP} / {xpToNextLevel}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color:var(--md-sys-color-surface-container-high)]">
            <div
              className="h-full rounded-full bg-[color:var(--md-sys-color-primary)] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-[color:var(--md-sys-color-on-surface-variant)]">
            {xpToNextLevel - currentXP} XP remaining
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <MaterialSymbol icon="local_fire_department" size={16} className="text-[color:var(--md-sys-color-tertiary)]" />
            <span className="text-[18px] font-bold text-[color:var(--md-sys-color-on-surface)]">{streak.current}</span>
          </div>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--md-sys-color-on-surface-variant)]">
            Day Streak
          </p>
        </div>
        <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <MaterialSymbol icon="emoji_events" size={16} className="text-[color:var(--md-sys-color-secondary)]" />
            <span className="text-[18px] font-bold text-[color:var(--md-sys-color-on-surface)]">{unlockedCount}</span>
          </div>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--md-sys-color-on-surface-variant)]">
            Achievements
          </p>
        </div>
        <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <MaterialSymbol icon="star" size={16} className="text-[color:var(--md-sys-color-primary)]" />
            <span className="text-[18px] font-bold text-[color:var(--md-sys-color-on-surface)]">{totalXP}</span>
          </div>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--md-sys-color-on-surface-variant)]">
            Total XP
          </p>
        </div>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--md-sys-color-on-surface-variant)]">
              Recent Achievements
            </span>
          </div>
          <div className="flex gap-2">
            {recentAchievements.map((achievement) => (
              <AchievementBadgeMini key={achievement.id} achievement={achievement} />
            ))}
            {unlockedCount > 3 && (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--md-sys-color-surface-container-high)] text-[12px] font-bold text-[color:var(--md-sys-color-on-surface-variant)]">
                +{unlockedCount - 3}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface AchievementBadgeMiniProps {
  achievement: Achievement;
}

function AchievementBadgeMini({ achievement }: AchievementBadgeMiniProps) {
  const rarityColors: Record<Achievement["rarity"], { bg: string; border: string }> = {
    common: {
      bg: "bg-[color:var(--md-sys-color-surface-container-high)]",
      border: "border-[color:var(--md-sys-color-outline)]",
    },
    rare: {
      bg: "bg-[color:var(--md-sys-color-secondary-container)]",
      border: "border-[color:var(--md-sys-color-secondary)]",
    },
    epic: {
      bg: "bg-[color:var(--md-sys-color-tertiary-container)]",
      border: "border-[color:var(--md-sys-color-tertiary)]",
    },
    legendary: {
      bg: "bg-[color:var(--md-sys-color-primary-container)]",
      border: "border-[color:var(--md-sys-color-primary)]",
    },
  };

  const colors = rarityColors[achievement.rarity];

  return (
    <div
      className={cn(
        "flex h-14 w-14 flex-col items-center justify-center rounded-full border",
        colors.bg,
        colors.border
      )}
      title={achievement.title}
    >
      <MaterialSymbol icon={achievement.icon} size={20} className="text-[color:var(--md-sys-color-on-primary-container)]" />
    </div>
  );
}
