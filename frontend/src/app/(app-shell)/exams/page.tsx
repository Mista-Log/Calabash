"use client";

import * as React from "react";
import {
  Calendar03Icon,
  Timer02Icon,
  AnalyticsUpIcon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { Card, CardContent, M3Button, Badge } from "@/components/core";
import { useUserStore } from "@/store/useUserStore";
import { useCourseStore } from "@/store/useCourseStore";
import { courseRepository } from "@/services/course.repository";
import type { CourseSidebarFeed } from "@/types/courses";

const emptySidebar: CourseSidebarFeed = {
  deadlines: [],
  recentActivity: [],
};

function dueToDisplayDate(due: string): { month: string; day: string; full: string } {
  const parsed = new Date(due);
  if (!Number.isNaN(parsed.getTime())) {
    return {
      month: parsed.toLocaleDateString("en-US", { month: "short" }),
      day: parsed.toLocaleDateString("en-US", { day: "numeric" }),
      full: parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
  }

  if (/today/i.test(due)) {
    const today = new Date();
    return {
      month: today.toLocaleDateString("en-US", { month: "short" }),
      day: today.toLocaleDateString("en-US", { day: "numeric" }),
      full: "Today",
    };
  }

  return { month: "TBD", day: "--", full: due };
}

export default function ExamsPage() {
  const { user, hasHydrated } = useUserStore();
  const {
    courses,
    courseProgress,
    loadedContext,
    hydrateForContext,
    setError,
    clearError,
    status,
    error,
  } = useCourseStore();
  const [sidebarFeed, setSidebarFeed] = React.useState<CourseSidebarFeed>(emptySidebar);

  React.useEffect(() => {
    if (!hasHydrated || !user || user.role !== "student") {
      return;
    }

    const inContext =
      loadedContext?.userId === user.id && loadedContext.role === "student";
    if (inContext && status === "success") {
      if (sidebarFeed.deadlines.length === 0) {
        void courseRepository.getCourseSidebarFeed("student", user.id).then((result) => {
          if (result.ok) {
            setSidebarFeed(result.data);
          }
        });
      }
      return;
    }

    void courseRepository.getCoursesForUser("student", user.id).then((result) => {
      if (!result.ok) {
        setError(result.error);
        return;
      }
      clearError();
      hydrateForContext(
        { userId: user.id, role: "student" },
        result.data.courses,
        result.data.courseProgress,
      );
      setSidebarFeed(result.data.sidebar);
    });
  }, [
    clearError,
    hasHydrated,
    hydrateForContext,
    loadedContext?.role,
    loadedContext?.userId,
    setError,
    sidebarFeed.deadlines.length,
    status,
    user,
  ]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--md-sys-color-primary)] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[920px] items-center justify-center px-4">
        <Card className="w-full border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
          <CardContent className="p-8 text-center">
            <h1 className="text-[24px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              Sign in to view assessment records
            </h1>
            <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
              Assessment schedules are tied to your registered courses.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== "student") {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[920px] items-center justify-center px-4">
        <Card className="w-full border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
          <CardContent className="p-8 text-center">
            <h1 className="text-[24px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              Assessment view is student-focused
            </h1>
            <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
              Lecturer analytics and course operations are available in faculty routes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const upcomingAssessments = sidebarFeed.deadlines.map((deadline) => {
    const parsed = dueToDisplayDate(deadline.due);
    const submissionLike = /project|submission|assignment|report/i.test(deadline.title);
    return {
      id: deadline.id,
      title: deadline.title,
      courseCode: deadline.courseCode,
      dateLabel: parsed.full,
      month: parsed.month,
      day: parsed.day,
      timeLabel: submissionLike ? "11:59 PM" : "09:00 AM",
      mode: submissionLike ? "Submission" : "Assessment",
    };
  });

  const performanceRows = courses
    .map((course) => ({
      id: course.id,
      title: course.title,
      code: course.code,
      progress: courseProgress[course.id] ?? 0,
    }))
    .sort((left, right) => right.progress - left.progress)
    .slice(0, 6);

  return (
    <div className="w-full px-3 py-5 sm:px-5 sm:py-7 lg:px-7 lg:py-9">
      <div className="mx-auto max-w-[1360px] space-y-6 sm:space-y-8">
        <section className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-5 py-5 sm:px-6 sm:py-6">
          <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-[color:var(--md-sys-color-on-surface)] sm:text-[34px]">
            Assessment
          </h1>
          <p className="mt-1 text-[14px] font-medium text-[color:var(--md-sys-color-on-surface-variant)] sm:text-[15px]">
            Review upcoming assessments, submission timelines, and coursework readiness indicators.
          </p>
        </section>

        {error ? (
          <Card className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
            <CardContent className="space-y-2 p-4">
              <p className="text-[15px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                Unable to load assessment records
              </p>
              <p className="text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                {error}
              </p>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-6 lg:gap-7 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                Upcoming Assessments
              </h2>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[color:var(--md-sys-color-on-surface-variant)]">
                {upcomingAssessments.length} scheduled
              </span>
            </div>

            {upcomingAssessments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAssessments.map((assessment) => (
                  <Card
                    key={assessment.id}
                    className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] transition-colors hover:border-[color:var(--md-sys-color-primary)]"
                  >
                    <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                      <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
                        <span className="text-xs font-semibold leading-none">{assessment.day}</span>
                        <span className="text-xs font-semibold uppercase">{assessment.month}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <Badge className="border-none bg-[color:var(--md-sys-color-primary-container)] text-xs font-semibold text-[color:var(--md-sys-color-on-primary-container)]">
                            {assessment.courseCode}
                          </Badge>
                          <Badge className="border-none bg-[color:var(--md-sys-color-tertiary-container)] text-xs font-semibold text-[color:var(--md-sys-color-on-tertiary-container)]">
                            {assessment.mode}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-[color:var(--md-sys-color-on-surface)]">
                          {assessment.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-[color:var(--md-sys-color-on-surface-variant)]">
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            <MaterialSymbol icon={Timer02Icon} size={14} />
                            {assessment.timeLabel}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            <MaterialSymbol icon={Calendar03Icon} size={14} />
                            {assessment.dateLabel}
                          </div>
                        </div>
                      </div>
                      <M3Button variant="outlined" className="h-10 px-6 text-xs sm:ml-auto">
                        View Details
                      </M3Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
                <CardContent className="flex items-center gap-3 p-4 text-[color:var(--md-sys-color-on-surface-variant)]">
                  <MaterialSymbol icon={AnalyticsUpIcon} size={18} />
                  <p className="text-sm font-medium">
                    No scheduled assessments at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-[22px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              Coursework Readiness
            </h2>
            <Card className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
              <CardContent className="space-y-5 p-5">
                {performanceRows.length > 0 ? (
                  <div className="space-y-3">
                    {performanceRows.map((row) => (
                      <div
                        key={row.id}
                        className="flex items-center justify-between rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-3 py-2.5"
                      >
                        <span className="text-sm font-semibold">
                          {row.code}
                        </span>
                        <span className="text-sm font-semibold text-[color:var(--md-sys-color-primary)]">
                          {row.progress}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                    Course progress will appear after your first completed activity.
                  </p>
                )}
                <M3Button variant="text" className="w-full text-xs">
                  View Full Assessment Record
                </M3Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
