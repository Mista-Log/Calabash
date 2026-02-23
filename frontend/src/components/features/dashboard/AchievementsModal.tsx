"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { M3Button } from "@/components/core";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/core/dialog";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { AchievementBadge } from "@/components/features/gamification";
import {
  Cancel01Icon,
  Tick01Icon,
  Clock01Icon,
} from "@/lib/icons/material-icons";
import type { Achievement } from "@/services/api";

type AchievementFilter = "all" | "unlocked" | "in-progress";

interface AchievementsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievements: Achievement[];
  onClaimAchievement: (achievementId: string) => Promise<void> | void;
  onClaimAll: () => Promise<void> | void;
}

const COPY = {
  title: "Academic Milestones",
  subtitle:
    "Milestones are recorded when defined academic criteria are met. Eligible records can be posted to your progression history.",
  claimAll: (count: number) => `Record All Eligible Milestones (${count})`,
  filterAll: (count: number) => `All (${count})`,
  filterAwarded: (count: number) => `Awarded (${count})`,
  filterInProgress: (count: number) => `In Progress (${count})`,
  statusInProgress: "In Progress",
  statusAwardedRecently: "Awarded recently",
  statusNotAwarded: "Not yet awarded",
  actionRecordMilestone: "Record Milestone",
  emptyFilter: "No milestone records match this filter.",
};

const isClaimable = (achievement: Achievement) =>
  !achievement.unlocked &&
  typeof achievement.progress === "number" &&
  typeof achievement.target === "number" &&
  achievement.target > 0 &&
  achievement.progress >= achievement.target;

export function AchievementsModal({
  open,
  onOpenChange,
  achievements,
  onClaimAchievement,
  onClaimAll,
}: AchievementsModalProps) {
  const [filter, setFilter] = React.useState<AchievementFilter>("all");

  const unlocked = React.useMemo(
    () => achievements.filter((item) => item.unlocked),
    [achievements],
  );
  const inProgress = React.useMemo(
    () => achievements.filter((item) => !item.unlocked),
    [achievements],
  );
  const claimableCount = React.useMemo(
    () => achievements.filter((item) => isClaimable(item)).length,
    [achievements],
  );

  const visible = React.useMemo(() => {
    if (filter === "unlocked") return unlocked;
    if (filter === "in-progress") return inProgress;
    return achievements;
  }, [achievements, filter, inProgress, unlocked]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(96vw,64rem)] max-h-[calc(100dvh-2rem)] overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <DialogTitle className="text-[30px] font-semibold leading-tight">
                {COPY.title}
              </DialogTitle>
              <p className="max-w-2xl text-[14px] text-[color:var(--md-sys-color-on-surface-variant)] sm:text-[15px]">
                {COPY.subtitle}
              </p>
            </div>
            <DialogClose className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface-variant)] hover:bg-[color:var(--md-sys-color-surface-container)]">
              <MaterialSymbol icon={Cancel01Icon} size={20} />
            </DialogClose>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <M3Button
              size="sm"
              className="gap-2"
              disabled={claimableCount === 0}
              onClick={() => void onClaimAll()}
            >
              <MaterialSymbol icon={Tick01Icon} size={14} />
              {COPY.claimAll(claimableCount)}
            </M3Button>
            <M3Button
              size="sm"
              variant={filter === "all" ? "filled" : "outlined"}
              onClick={() => setFilter("all")}
            >
              {COPY.filterAll(achievements.length)}
            </M3Button>
            <M3Button
              size="sm"
              variant={filter === "unlocked" ? "filled" : "outlined"}
              onClick={() => setFilter("unlocked")}
            >
              {COPY.filterAwarded(unlocked.length)}
            </M3Button>
            <M3Button
              size="sm"
              variant={filter === "in-progress" ? "filled" : "outlined"}
              onClick={() => setFilter("in-progress")}
            >
              {COPY.filterInProgress(inProgress.length)}
            </M3Button>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(100dvh-16rem)] overflow-y-auto px-1 py-1">
          {visible.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((achievement) => {
                const claimable = isClaimable(achievement);
                return (
                  <div
                    key={achievement.id}
                    className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <AchievementBadge
                        achievement={achievement}
                        size="md"
                        showTooltip={false}
                      />
                      {!achievement.unlocked && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--md-sys-color-outline-variant)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                          <MaterialSymbol icon={Clock01Icon} size={12} />
                          {COPY.statusInProgress}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 space-y-1.5">
                      <p className="text-[15px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                        {achievement.title}
                      </p>
                      <p className="line-clamp-2 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                        {achievement.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-[12px]",
                          achievement.unlocked
                            ? "text-[color:var(--md-sys-color-primary)]"
                            : "text-[color:var(--md-sys-color-on-surface-variant)]",
                        )}
                      >
                        {achievement.unlocked
                          ? `Awarded ${achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString() : COPY.statusAwardedRecently}`
                          : typeof achievement.progress === "number" &&
                              typeof achievement.target === "number"
                            ? `${achievement.progress}/${achievement.target}`
                            : COPY.statusNotAwarded}
                      </p>
                      {!achievement.unlocked ? (
                        <M3Button
                          size="sm"
                          disabled={!claimable}
                          onClick={() => void onClaimAchievement(achievement.id)}
                        >
                          {COPY.actionRecordMilestone}
                        </M3Button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] p-8 text-center text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
              {COPY.emptyFilter}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
