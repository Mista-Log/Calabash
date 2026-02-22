"use client";

import React from "react";
import Link from "next/link";
import { motion } from "@/lib/motion-foundations";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useMockDataStore } from "@/store/useMockDataStore";
import { useToast } from "@/components/core/toast";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  BookOpen01Icon,
  Calendar03Icon,
  Clock02Icon,
  Pdf01Icon,
  VideoReplayIcon,
  FileZipIcon,
  Tick01Icon,
} from "@/lib/icons/material-icons";
import { M3Button } from "@/components/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/core";
import { EmptyState } from "@/components/core/empty-state";
import {
  AchievementBadge,
  XPProgress,
} from "@/components/features/gamification";
import { AchievementsModal } from "@/components/features/dashboard/AchievementsModal";
import type {
  StudentActivityCardVM,
  StudentDashboardView,
  StudentPathCardVM,
  StudentProgressSummaryVM,
} from "@/types/dashboard";
import type { Achievement, Material } from "@/services/api";
import { useCourseStore } from "@/store/useCourseStore";

interface StudentDashboardProps {
  view: StudentDashboardView;
  onRefresh?: () => Promise<void> | void;
}

const materialIcons: Record<Material["type"], string> = {
  pdf: Pdf01Icon,
  video: VideoReplayIcon,
  "past-question": BookOpen01Icon,
  zip: FileZipIcon,
  image: Pdf01Icon,
};

const materialTypeLabel: Record<Material["type"], string> = {
  pdf: "PDF",
  video: "Video",
  "past-question": "Past Question",
  zip: "Archive",
  image: "Image",
};

const dashboardSurfaceCard =
  "m3-surface m3-surface--elevated rounded-[28px] border-[color:var(--md-sys-color-outline-variant)]";

const COPY = {
  focusKicker: "Current Course Focus",
  focusDescription:
    "Continue from your latest study checkpoint and maintain academic continuity.",
  continueCoursework: "Continue Coursework",
  reviewCalendar: "Review Academic Calendar",
  noCoursesTitle: "No active course registrations",
  noCoursesDescription:
    "Register for a course to initialize your academic dashboard records.",
  tabs: {
    activity: "Learning Activity",
    pathways: "Course Pathways",
  },
  chipActivity: "Learning Activity",
  chipPathway: "Pathway",
  chipCourse: "Course",
  noActivityTitle: "No recent academic activity",
  noActivityDescription:
    "Recently published academic resources will appear here.",
  activityDescriptionDatePrefix: "Academic resource published",
  activityCta: "Open Resource",
  noPathwaysTitle: "No course pathways available",
  noPathwaysDescription:
    "Registered courses will appear here when enrollment records are available.",
  pathwayFallback:
    "Continue this course pathway to strengthen academic mastery outcomes.",
  pathwayCta: "Open Course Pathway",
  deadlinesTitle: "Upcoming Academic Deadlines",
  gamificationUnavailableTitle: "Milestone data unavailable",
  gamificationUnavailableDescription:
    "Academic milestone and progression records are temporarily unavailable.",
  milestonesTitle: "Academic Milestones",
  milestoneEmptyTitle: "No milestone records",
  milestoneEmptyDescription:
    "Milestone records will appear as academic criteria are completed.",
  milestoneFilterAll: (count: number) => `All (${count})`,
  milestoneFilterAwarded: (count: number) => `Awarded (${count})`,
  milestoneFilterInProgress: (count: number) => `In Progress (${count})`,
  claimAll: (count: number) => `Record All Eligible Milestones (${count})`,
  progressTitle: "Academic Progress Summary",
  coursesInProgress: "Courses In Progress",
  coursesCompleted: "Courses Completed",
  resourcesReviewed: "Resources Reviewed",
  consistency: "Consistency (Current/Best)",
  viewProgress: "Review Academic Progress",
  openActivityAria: "Open academic activity",
  expandMilestonesAria: "Expand academic milestones",
};

const isAchievementClaimable = (achievement: Achievement) =>
  !achievement.unlocked &&
  typeof achievement.progress === "number" &&
  typeof achievement.target === "number" &&
  achievement.target > 0 &&
  achievement.progress >= achievement.target;

const toActivityCards = (materials: Material[]): StudentActivityCardVM[] =>
  materials.map((material) => ({
    id: material.id,
    title: material.title,
    subtitle: `${material.courseCode} • ${material.uploader}`,
    description: `${materialTypeLabel[material.type]} ${COPY.activityDescriptionDatePrefix.toLowerCase()} ${new Date(material.uploadDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`,
    typeLabel: materialTypeLabel[material.type],
    href: `/library/${material.id}`,
    ctaLabel: COPY.activityCta,
  }));

const toPathCards = (
  courses: StudentDashboardView["data"]["courses"],
  progressMap: Record<string, number>,
): StudentPathCardVM[] =>
  courses
    .map((course) => ({
      id: course.id,
      title: course.title,
      subtitle: `${course.code} • Semester ${course.semester}`,
      description:
        course.description ??
        COPY.pathwayFallback,
      progress: progressMap[course.id] ?? 0,
      href: `/courses/${course.id}`,
      ctaLabel: COPY.pathwayCta,
    }))
    .sort((a, b) => b.progress - a.progress);

export function StudentDashboard({ view, onRefresh }: StudentDashboardProps) {
  const { reducedMotion } = useSettingsStore();
  const { addToast } = useToast();
  const addXP = useMockDataStore((state) => state.addXP);
  const updateGamification = useMockDataStore((state) => state.updateGamification);
  const sharedCourseProgress = useCourseStore((state) => state.courseProgress);
  const loadedContext = useCourseStore((state) => state.loadedContext);

  const [activeTab, setActiveTab] = React.useState<"activities" | "paths">("activities");
  const [achievementFilter, setAchievementFilter] = React.useState<
    "all" | "unlocked" | "in-progress"
  >("all");
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = React.useState(false);

  const { data } = view;
  const courseProgress =
    loadedContext?.userId === data.user.id && loadedContext.role === "student"
      ? sharedCourseProgress
      : view.courseProgress;

  const orderedCourses = React.useMemo(
    () =>
      data.courses
        .map((course) => ({
          course,
          progress: courseProgress[course.id] ?? 0,
        }))
        .sort((left, right) => right.progress - left.progress),
    [courseProgress, data.courses],
  );

  const focusCourse =
    orderedCourses.find((entry) => entry.progress < 100)?.course ??
    data.courses[0] ??
    null;
  const focusCourseProgress = focusCourse ? courseProgress[focusCourse.id] ?? 0 : 0;

  const averageProgress =
    data.courses.length > 0
      ? Math.round(
          data.courses.reduce(
            (acc, course) => acc + (courseProgress[course.id] ?? 0),
            0,
          ) / data.courses.length,
        )
      : 0;

  const recentMaterials = view.recentMaterials;
  const deadlines = view.deadlines;
  const gamification = view.gamification;
  const continueCourseId = focusCourse?.id ?? view.continueCourseId;

  const activityCards = React.useMemo(
    () => toActivityCards(recentMaterials),
    [recentMaterials],
  );
  const pathCards = React.useMemo(
    () => toPathCards(data.courses, courseProgress),
    [courseProgress, data.courses],
  );

  const totalAchievements = gamification?.achievements ?? [];
  const unlockedAchievements = totalAchievements.filter((achievement) => achievement.unlocked);
  const inProgressAchievements = totalAchievements.filter(
    (achievement) => !achievement.unlocked,
  );
  const claimableAchievements = totalAchievements.filter((achievement) =>
    isAchievementClaimable(achievement),
  );

  const displayedAchievements =
    achievementFilter === "unlocked"
      ? unlockedAchievements
      : achievementFilter === "in-progress"
        ? inProgressAchievements
        : totalAchievements;

  const progressSummary: StudentProgressSummaryVM = {
    coursesInProgress: data.courses.filter((course) => {
      const progress = courseProgress[course.id] ?? 0;
      return progress > 0 && progress < 100;
    }).length,
    coursesCompleted: data.courses.filter((course) => (courseProgress[course.id] ?? 0) >= 100)
      .length,
    materialsReviewed: recentMaterials.length,
    activeStreak: gamification?.streak.current ?? 0,
    longestStreak: gamification?.streak.best ?? 0,
  };

  const quickStats = [
    { label: "Average Progress", value: `${averageProgress}%` },
    { label: "GPA", value: data.studentStats?.gpa || "N/A" },
    { label: "Attendance", value: data.studentStats?.attendance || "N/A" },
    { label: "Resources", value: recentMaterials.length.toString() },
  ];

  const handleClaimAchievement = async (achievementId: string) => {
    const userId = data.user.id;
    if (!userId || !gamification) return;

    const target = gamification.achievements.find((item) => item.id === achievementId);
    if (!target || !isAchievementClaimable(target)) return;

    try {
      const updatedAchievements = gamification.achievements.map((item) =>
        item.id === achievementId
          ? { ...item, unlocked: true, unlockedAt: new Date().toISOString() }
          : item,
      );
      updateGamification(userId, { achievements: updatedAchievements });
      addXP(userId, 15, "achievement-claim");
      addToast("Academic milestone recorded successfully.", "success");
      await onRefresh?.();
    } catch {
      addToast("Unable to record milestone. Try again.", "error");
    }
  };

  const handleClaimAllAchievements = async () => {
    const userId = data.user.id;
    if (!userId || !gamification || claimableAchievements.length === 0) return;

    try {
      const claimableIds = new Set(claimableAchievements.map((item) => item.id));
      const updatedAchievements = gamification.achievements.map((item) =>
        claimableIds.has(item.id)
          ? { ...item, unlocked: true, unlockedAt: new Date().toISOString() }
          : item,
      );
      updateGamification(userId, { achievements: updatedAchievements });
      addXP(userId, claimableAchievements.length * 15, "achievement-claim-all");
      addToast(`${claimableAchievements.length} academic milestones recorded.`, "success");
      await onRefresh?.();
    } catch {
      addToast("Unable to record all eligible milestones right now.", "error");
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-5 sm:gap-7">
        <section className="col-span-12 min-w-0 space-y-6 xl:col-span-8">
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04 }}
          >
            {focusCourse ? (
              <Card className={cn(dashboardSurfaceCard, "overflow-hidden")}>
                <CardContent className="space-y-6 p-6 sm:p-8">
                  <div className="space-y-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--md-sys-color-primary)]">
                      {COPY.focusKicker}
                    </p>
                    <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-[color:var(--md-sys-color-on-surface)] sm:text-[34px]">
                      {focusCourse.title}
                    </h2>
                    <p className="text-[14px] font-medium text-[color:var(--md-sys-color-on-surface-variant)] sm:text-[15px]">
                      {COPY.focusDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {quickStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
                          {stat.label}
                        </p>
                        <p className="mt-1 text-[20px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[12px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">
                      <span>Current Course Progress</span>
                      <span>{focusCourseProgress}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[color:var(--md-sys-color-surface-container-high)]">
                      <div
                        className="h-full rounded-full bg-[color:var(--md-sys-color-primary)] transition-all duration-500"
                        style={{ width: `${focusCourseProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/courses/${continueCourseId ?? focusCourse.id}`}
                      className="w-full sm:w-auto"
                    >
                      <M3Button className="w-full gap-2 px-6">
                        {COPY.continueCoursework}
                        <MaterialSymbol icon={ArrowRight01Icon} size={16} />
                      </M3Button>
                    </Link>
                    <Link href="/calendar" className="w-full sm:w-auto">
                      <M3Button variant="outlined" className="w-full gap-2 px-6">
                        <MaterialSymbol icon={Calendar03Icon} size={16} />
                        {COPY.reviewCalendar}
                      </M3Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className={dashboardSurfaceCard}>
                <CardContent className="p-8">
                  <EmptyState
                    icon={BookOpen01Icon}
                    title={COPY.noCoursesTitle}
                    description={COPY.noCoursesDescription}
                  />
                </CardContent>
              </Card>
            )}
          </motion.div>

          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className={cn(dashboardSurfaceCard, "p-5 sm:p-6")}
          >
            <div className="border-b border-[color:var(--md-sys-color-outline-variant)]">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("activities")}
                  className={cn(
                    "rounded-t-2xl px-4 py-2.5 text-[15px] font-semibold whitespace-nowrap transition-colors",
                    activeTab === "activities"
                      ? "bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-primary)]"
                      : "text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-on-surface)]",
                  )}
                >
                  {COPY.tabs.activity}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("paths")}
                  className={cn(
                    "rounded-t-2xl px-4 py-2.5 text-[15px] font-semibold whitespace-nowrap transition-colors",
                    activeTab === "paths"
                      ? "bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-primary)]"
                      : "text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-on-surface)]",
                  )}
                >
                  {COPY.tabs.pathways}
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {activeTab === "activities" ? (
                activityCards.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 [grid-auto-flow:dense]">
                    {activityCards.map((card) => {
                      const material = recentMaterials.find((item) => item.id === card.id);
                      const iconName = material ? materialIcons[material.type] : BookOpen01Icon;

                      return (
                        <Card key={card.id} className={cn(dashboardSurfaceCard, "h-full")}> 
                          <CardContent className="flex h-full flex-col gap-4 p-5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-[color:var(--md-sys-color-surface-container-high)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                                {card.typeLabel}
                              </span>
                              <span className="rounded-full bg-[color:var(--md-sys-color-primary-container)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--md-sys-color-on-primary-container)]">
                                {COPY.chipActivity}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <p className="text-[27px] leading-none">
                                <MaterialSymbol icon={iconName} size={18} />
                              </p>
                              <h3 className="line-clamp-2 text-[21px] font-semibold leading-tight text-[color:var(--md-sys-color-on-surface)]">
                                {card.title}
                              </h3>
                              <p className="text-[13px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                                {card.subtitle}
                              </p>
                              <p className="line-clamp-2 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                                {card.description}
                              </p>
                            </div>

                            <div className="mt-auto flex items-center justify-between">
                              <Link href={card.href}>
                                <M3Button size="sm" variant="outlined">
                                  {card.ctaLabel}
                                </M3Button>
                              </Link>
                              <Link href={card.href}>
                                <button
                                  type="button"
                                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]"
                                  aria-label={COPY.openActivityAria}
                                >
                                  <MaterialSymbol icon={ArrowRight01Icon} size={18} />
                                </button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    icon={BookOpen01Icon}
                    title={COPY.noActivityTitle}
                    description={COPY.noActivityDescription}
                  />
                )
              ) : pathCards.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 [grid-auto-flow:dense]">
                  {pathCards.map((card) => (
                    <Card key={card.id} className={cn(dashboardSurfaceCard, "h-full")}> 
                      <CardContent className="flex h-full flex-col gap-4 p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[color:var(--md-sys-color-surface-container-high)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                            {COPY.chipPathway}
                          </span>
                          <span className="rounded-full bg-[color:var(--md-sys-color-primary-container)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--md-sys-color-on-primary-container)]">
                            {COPY.chipCourse}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="line-clamp-2 text-[21px] font-semibold leading-tight text-[color:var(--md-sys-color-on-surface)]">
                            {card.title}
                          </h3>
                          <p className="text-[13px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                            {card.subtitle}
                          </p>
                          <p className="line-clamp-3 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                            {card.description}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[12px]">
                            <span className="text-[color:var(--md-sys-color-on-surface-variant)]">Progress</span>
                            <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">
                              {card.progress}%
                            </span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-[color:var(--md-sys-color-surface-container-high)]">
                            <div
                              className="h-full rounded-full bg-[color:var(--md-sys-color-primary)]"
                              style={{ width: `${card.progress}%` }}
                            />
                          </div>
                        </div>

                        <Link href={card.href} className="mt-auto">
                          <M3Button className="w-full gap-2">
                            {card.ctaLabel}
                            <MaterialSymbol icon={ArrowRight01Icon} size={16} />
                          </M3Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={BookOpen01Icon}
                  title={COPY.noPathwaysTitle}
                  description={COPY.noPathwaysDescription}
                />
              )}
            </div>
          </motion.div>

          {deadlines.length > 0 && (
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.14 }}
              className={cn(dashboardSurfaceCard, "p-5 sm:p-6")}
            >
                <div className="mb-3 flex items-center gap-2">
                  <MaterialSymbol icon={Clock02Icon} size={16} />
                <h3 className="text-[16px] font-semibold">{COPY.deadlinesTitle}</h3>
                </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {deadlines.slice(0, 3).map((item, idx) => (
                  <div
                    key={`${item.title}-${idx}`}
                    className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3"
                  >
                    <p className="text-[13px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                      Due {item.due}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </section>

        <aside className="col-span-12 min-w-0 space-y-6 xl:col-span-4">
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
          >
            {gamification ? (
              <XPProgress
                level={gamification.level}
                currentXP={gamification.currentXP}
                xpToNextLevel={gamification.xpToNextLevel}
                totalXP={gamification.totalXP}
                title={gamification.title}
                streak={{
                  current: gamification.streak.current,
                  best: gamification.streak.best,
                }}
              />
            ) : (
              <Card className={dashboardSurfaceCard}>
                <CardContent className="p-8">
                  <EmptyState
                    icon={Clock02Icon}
                    title={COPY.gamificationUnavailableTitle}
                    description={COPY.gamificationUnavailableDescription}
                  />
                </CardContent>
              </Card>
            )}
          </motion.div>

          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
          >
            <Card className={dashboardSurfaceCard}>
              <CardHeader className="space-y-3 pb-2">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-[22px] font-semibold">{COPY.milestonesTitle}</CardTitle>
                  <button
                    type="button"
                    onClick={() => setIsAchievementsModalOpen(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface-variant)] hover:bg-[color:var(--md-sys-color-surface-container)]"
                    aria-label={COPY.expandMilestonesAria}
                  >
                    <MaterialSymbol icon={ArrowUpRight01Icon} size={18} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <M3Button
                    size="sm"
                    variant={achievementFilter === "all" ? "filled" : "outlined"}
                    onClick={() => setAchievementFilter("all")}
                  >
                    {COPY.milestoneFilterAll(totalAchievements.length)}
                  </M3Button>
                  <M3Button
                    size="sm"
                    variant={achievementFilter === "unlocked" ? "filled" : "outlined"}
                    onClick={() => setAchievementFilter("unlocked")}
                  >
                    {COPY.milestoneFilterAwarded(unlockedAchievements.length)}
                  </M3Button>
                  <M3Button
                    size="sm"
                    variant={achievementFilter === "in-progress" ? "filled" : "outlined"}
                    onClick={() => setAchievementFilter("in-progress")}
                  >
                    {COPY.milestoneFilterInProgress(inProgressAchievements.length)}
                  </M3Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {displayedAchievements.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {displayedAchievements.slice(0, 6).map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex justify-center rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-2.5"
                      >
                        <AchievementBadge achievement={achievement} size="sm" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={BookOpen01Icon}
                    title={COPY.milestoneEmptyTitle}
                    description={COPY.milestoneEmptyDescription}
                    className="py-4"
                  />
                )}

                {claimableAchievements.length > 0 ? (
                  <M3Button className="w-full gap-2" onClick={() => void handleClaimAllAchievements()}>
                    <MaterialSymbol icon={Tick01Icon} size={14} />
                    {COPY.claimAll(claimableAchievements.length)}
                  </M3Button>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.16 }}
          >
            <Card className={dashboardSurfaceCard}>
              <CardHeader>
                <CardTitle className="text-[22px] font-semibold">{COPY.progressTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3">
                    <p className="text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">{COPY.coursesInProgress}</p>
                    <p className="text-[22px] font-semibold">{progressSummary.coursesInProgress}</p>
                  </div>
                  <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3">
                    <p className="text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">{COPY.coursesCompleted}</p>
                    <p className="text-[22px] font-semibold">{progressSummary.coursesCompleted}</p>
                  </div>
                  <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3">
                    <p className="text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">{COPY.resourcesReviewed}</p>
                    <p className="text-[22px] font-semibold">{progressSummary.materialsReviewed}</p>
                  </div>
                  <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3">
                    <p className="text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">{COPY.consistency}</p>
                    <p className="text-[22px] font-semibold">{progressSummary.activeStreak}/{progressSummary.longestStreak}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href="/courses" className="w-full">
                    <M3Button variant="outlined" className="w-full">
                      {COPY.viewProgress}
                    </M3Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </aside>
      </div>

      <AchievementsModal
        open={isAchievementsModalOpen}
        onOpenChange={setIsAchievementsModalOpen}
        achievements={totalAchievements}
        onClaimAchievement={handleClaimAchievement}
        onClaimAll={handleClaimAllAchievements}
      />
    </>
  );
}
