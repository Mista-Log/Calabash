"use client";

<<<<<<< HEAD
import React from "react";
import Link from "next/link";
import { motion } from "@/lib/motion-foundations";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/useSettingsStore";
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
import { AchievementBadge } from "@/components/features/gamification";
import { AchievementsModal } from "@/components/features/dashboard/AchievementsModal";
import { GamificationCard } from "@/components/features/gamification/gamification-card";
import { DeadlineList } from "@/components/core/deadline-list";
import { MetricStat } from "@/components/core/metric-stat";
import { APP_SURFACE_CARD } from "@/lib/ui-sync";
import type {
  StudentActivityCardVM,
  StudentDashboardView,
  StudentPathCardVM,
  StudentProgressSummaryVM,
} from "@/types/dashboard";
import type { Achievement, Material } from "@/services/api";
import { useCourseStore } from "@/store/useCourseStore";
import { useDashboardStore } from "@/store/useDashboardStore";

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

const dashboardSurfaceCard = APP_SURFACE_CARD;

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
  claimsReadOnly:
    "Milestone claims are currently read-only in live API mode.",
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
  const claimAchievement = useDashboardStore((state) => state.claimAchievement);
  const claimAllAchievements = useDashboardStore((state) => state.claimAllAchievements);
  const canPersistMilestoneClaims = useDashboardStore(
    (state) => state.canPersistMilestoneClaims,
  );
  const sharedCourseProgress = useCourseStore((state) => state.courseProgress);
  const loadedContext = useCourseStore((state) => state.loadedContext);

  const [activeTab, setActiveTab] = React.useState<"activities" | "paths">("activities");
  const [achievementFilter, setAchievementFilter] = React.useState<
    "all" | "unlocked" | "in-progress"
  >("all");
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = React.useState(false);
  const activeTabIndex = activeTab === "activities" ? 0 : 1;

  const handleTabChange = React.useCallback((event: React.FormEvent<HTMLElement>) => {
    const target = event.currentTarget as HTMLElement & {
      activeTabIndex?: number;
    };
    const nextIndex = target.activeTabIndex ?? 0;
    setActiveTab(nextIndex === 0 ? "activities" : "paths");
  }, []);

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

  const quickStats: Array<{
    label: string;
    value: string;
    trend?: { value: number; isPositive?: boolean };
  }> = [
    { label: "Avg Progress", value: `${averageProgress}%` },
    { label: "GPA", value: data.studentStats?.gpa || "N/A" },
    { label: "Attendance", value: data.studentStats?.attendance || "N/A" },
    { label: "Resources", value: recentMaterials.length.toString() },
  ];

  const handleClaimAchievement = async (achievementId: string) => {
    const userId = data.user.id;
    if (!userId || !gamification || !canPersistMilestoneClaims) return;

    const target = gamification.achievements.find((item) => item.id === achievementId);
    if (!target || !isAchievementClaimable(target)) return;

    try {
      const result = await claimAchievement(userId, achievementId);
      if (!result.ok) {
        addToast(result.message ?? "Unable to record milestone. Try again.", "error");
        return;
      }
      if (!result.persisted) {
        addToast(
          result.message ??
            "Milestone update is not persisted in API mode yet.",
          "info",
        );
        return;
      }
      addToast("Academic milestone recorded successfully.", "success");
      await onRefresh?.();
    } catch {
      addToast("Unable to record milestone. Try again.", "error");
    }
  };

  const handleClaimAllAchievements = async () => {
    const userId = data.user.id;
    if (
      !userId ||
      !gamification ||
      claimableAchievements.length === 0 ||
      !canPersistMilestoneClaims
    ) {
      return;
    }

    try {
      const result = await claimAllAchievements(
        userId,
        claimableAchievements.map((item) => item.id),
      );
      if (!result.ok) {
        addToast(
          result.message ?? "Unable to record all eligible milestones right now.",
          "error",
        );
        return;
      }
      if (!result.persisted) {
        addToast(
          result.message ??
            "Milestone updates are not persisted in API mode yet.",
          "info",
        );
        return;
      }
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
                    {quickStats.map((stat, index) => (
                      <MetricStat
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        trend={stat.trend}
                      />
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
            <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <md-tabs
                active-tab-index={activeTabIndex}
                onChange={handleTabChange}
                className="course-tabs"
                aria-label="Student dashboard sections"
              >
                <md-tab>{COPY.tabs.activity}</md-tab>
                <md-tab>{COPY.tabs.pathways}</md-tab>
              </md-tabs>
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
                              <Link
                                href={card.href}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)] transition-colors hover:bg-[color:var(--md-sys-color-primary)] hover:text-[color:var(--md-sys-color-on-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-sys-color-primary)] focus-visible:ring-offset-2"
                                aria-label={COPY.openActivityAria}
                              >
                                <MaterialSymbol icon={ArrowRight01Icon} size={18} />
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
              <DeadlineList
                deadlines={deadlines.map((d) => ({
                  title: d.title,
                  due: d.due,
                  dueDate: new Date(),
                  color: d.color as "orange" | "sage" | "green" | "red" | undefined,
                }))}
                limit={6}
              />
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
              <GamificationCard
                gamification={gamification}
                onExpand={() => setIsAchievementsModalOpen(true)}
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

                {!canPersistMilestoneClaims ? (
                  <p className="text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                    {COPY.claimsReadOnly}
                  </p>
                ) : null}

                {(claimableAchievements.length > 0 || !canPersistMilestoneClaims) ? (
                  <M3Button
                    className="w-full gap-2"
                    disabled={!canPersistMilestoneClaims || claimableAchievements.length === 0}
                    onClick={() => void handleClaimAllAchievements()}
                  >
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
        claimsEnabled={canPersistMilestoneClaims}
        claimsDisabledReason={COPY.claimsReadOnly}
      />
    </>
=======
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mortarboard01Icon,
  Clock02Icon,
  ArrowUpRight01Icon,
  BookOpen01Icon,
  VideoReplayIcon,
  FileZipIcon,
  PdfIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/core/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/core/card";
import { Timeline } from "@/components/core/timeline";
import { ProgressRing } from "@/components/core/progress-ring";
import { DashboardData } from "@/services/api";
import { useSettingsStore } from "@/store/useSettingsStore";

interface StudentDashboardProps {
  data: DashboardData;
}

const materialIcons: Record<string, any> = {
  pdf: PdfIcon,
  video: VideoReplayIcon,
  "past-question": BookOpen01Icon,
  zip: FileZipIcon,
};

export function StudentDashboard({ data }: StudentDashboardProps) {
  const { reducedMotion } = useSettingsStore();
  const [searchQuery] = useState("");

  const filteredMaterials = data.recentMaterials.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.courseCode.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Mock progress data - in real implementation, this would come from API
  const courseProgress = {
    [data.courses[0]?.id]: 45,
    [data.courses[1]?.id]: 78,
    [data.courses[2]?.id]: 23,
  };

  return (
    <div className="space-y-12">
      {/* Hero Section: Continue Learning + Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Continue Learning (60% -> 7 cols) */}
        {data.courses.length > 0 && (
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <Card className="h-full border border-primary/10 shadow-xl shadow-primary/5 bg-linear-to-br from-primary/3 via-background to-accent/3 relative overflow-hidden group">
              <div
                className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-[12rem] font-black hidden lg:block origin-top-right transform-gpu rotate-12"
                aria-hidden="true"
              >
                🎓
              </div>

              <CardHeader className="relative z-10">
                <CardTitle className="text-xs font-black text-primary/60 uppercase tracking-[0.2em] flex items-center justify-between">
                  <span>Resume Progress</span>
                  <span className="text-primary bg-primary/10 px-3 py-1 rounded-full text-xs ring-1 ring-primary/20">
                    {data.courses[0].code}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-8 relative z-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight text-balance">
                    {data.courses[0].title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm font-bold">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted/50">
                      <HugeiconsIcon
                        icon={Mortarboard01Icon}
                        size={14}
                        className="text-primary"
                      />
                      Semester {data.courses[0].semester}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted/50">
                      <HugeiconsIcon
                        icon={Clock02Icon}
                        size={14}
                        className="text-primary"
                      />
                      2h remaining
                    </span>
                  </div>
                </div>

                {/* Course Info Card */}
                <div className="p-6 rounded-2xl bg-background/40 backdrop-blur-md border border-white/20 shadow-sm space-y-4 ring-1 ring-black/5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center text-primary-foreground text-xl font-black">
                        <HugeiconsIcon icon={BookOpen01Icon} size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-primary/40 uppercase tracking-widest">
                          Next Up
                        </p>
                        <p className="text-base font-bold text-foreground leading-none mt-1">
                          Trees & Graphs
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                        Module 4
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        Advanced Structures
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/courses/${data.courses[0].id}`}
                  className="block"
                  aria-label={`Resume learning ${data.courses[0].title}`}
                >
                  <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                    Start Learning
                    <HugeiconsIcon
                      icon={ArrowUpRight01Icon}
                      size={20}
                      className="ml-2"
                    />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Upcoming & Overdue (40% -> 5 cols) */}
        {data.studentStats?.upcomingDeadlines && (
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <Card className="h-full border border-border/60 shadow-lg bg-muted/5 flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  Critical Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-3">
                  {data.studentStats.upcomingDeadlines.map((item, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left p-4 rounded-xl border border-border/40 hover:border-primary/40 bg-background hover:bg-primary/2 transition-all group shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Deadline for ${item.title} due ${item.due}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-10 w-1 min-w-[4px] rounded-full",
                            item.color === "orange"
                              ? "bg-orange-500"
                              : item.color === "sage"
                                ? "bg-accent"
                                : "bg-primary",
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5 font-bold uppercase tracking-wider">
                            Due {item.due}
                          </p>
                        </div>
                        <HugeiconsIcon
                          icon={ArrowUpRight01Icon}
                          size={14}
                          className="text-muted-foreground group-hover:text-primary transition-colors"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Link href="/calendar" className="block">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl font-black border-primary/10 hover:bg-primary/5 text-xs uppercase tracking-widest h-11"
                  >
                    View Schedule
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* My Courses Section */}
      <motion.section
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        aria-labelledby="my-courses-title"
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2
              id="my-courses-title"
              className="text-2xl font-black text-foreground mb-2"
            >
              Academic Focus
            </h2>
            <p className="text-base text-muted-foreground font-bold">
              Enrolled courses for Semester {data.user.semester}
            </p>
          </div>
          <Link href="/courses">
            <Button
              variant="ghost"
              size="sm"
              className="font-black text-primary hover:bg-primary/5"
            >
              Browse All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.courses.map((course, idx) => {
            const progress =
              courseProgress[course.id as keyof typeof courseProgress] || 0;
            return (
              <motion.div
                key={course.id}
                initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
              >
                <Link
                  href={`/courses/${course.id}`}
                  aria-label={`View ${course.title}`}
                >
                  <Card className="h-full hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer group border border-border/60 hover:border-primary/40 bg-background/40 hover:-translate-y-1">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex-1">
                          <div className="text-xs font-black text-primary mb-2 uppercase tracking-[0.2em]">
                            {course.code}
                          </div>
                          <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors leading-tight text-pretty">
                            {course.title}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-auto pt-6 border-t border-border/40">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-black text-xs text-primary/60 uppercase tracking-widest">
                            {Math.floor(Math.random() * 20) + 5} Resources
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-primary">
                              {progress}%
                            </span>
                          </div>
                        </div>
                        {/* Linear Progress Bar */}
                        <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden mb-6">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>

                        <Button
                          variant="subtle"
                          className="w-full rounded-xl h-11 font-black group-hover:bg-primary group-hover:text-primary-foreground transition-all text-xs uppercase tracking-widest"
                        >
                          Launch Module
                          <HugeiconsIcon
                            icon={ArrowUpRight01Icon}
                            size={14}
                            className="ml-2"
                          />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Recent Materials Timeline */}
      <motion.section
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        aria-labelledby="recent-materials-title"
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2
              id="recent-materials-title"
              className="text-2xl font-black text-foreground mb-2"
            >
              Learning Log
            </h2>
            <p className="text-base text-muted-foreground font-bold">
              Your most recent material interactions
            </p>
          </div>
          <Link href="/library">
            <Button
              variant="ghost"
              size="sm"
              className="font-black text-primary hover:bg-primary/5"
            >
              All Library Items
            </Button>
          </Link>
        </div>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <Timeline
              items={filteredMaterials.slice(0, 5).map((material) => {
                const Icon = materialIcons[material.type] || PdfIcon;
                return {
                  id: material.id,
                  title: material.title,
                  description: material.courseCode,
                  date: new Date(material.uploadDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    },
                  ),
                  icon: (
                    <HugeiconsIcon
                      icon={Icon}
                      size={18}
                      className="text-primary"
                    />
                  ),
                  metadata: `Uploaded by ${material.uploader}`,
                  action: (
                    <Link href={`/library/${material.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-bold text-sm h-9 px-4"
                      >
                        Open
                      </Button>
                    </Link>
                  ),
                };
              })}
            />

            {filteredMaterials.length === 0 && (
              <div className="text-center py-12">
                <HugeiconsIcon
                  icon={BookOpen01Icon}
                  size={36}
                  className="mx-auto text-muted-foreground/40 mb-4"
                />
                <p className="text-lg font-bold text-muted-foreground">
                  No materials found
                </p>
                <p className="text-sm text-muted-foreground/60 mt-2">
                  Check back later for new uploads
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.section>
    </div>
>>>>>>> origin/main
  );
}
