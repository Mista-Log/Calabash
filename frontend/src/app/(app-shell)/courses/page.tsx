"use client";

import * as React from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { FilterIcon } from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { LecturerCourseCard } from "@/components/features/courses/LecturerCourseCard";
import { StudentCourseCard } from "@/components/features/courses/StudentCourseCard";
import { EmptyCoursesState } from "@/components/features/courses/EmptyCoursesState";
import { CoursesSidebar } from "@/components/features/courses/CoursesSidebar";
import { SearchInput, M3Button, Badge } from "@/components/core";
import { useCourseStore } from "@/store/useCourseStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useUserStore } from "@/store/useUserStore";
import { FilterModal } from "@/components/features/shared/FilterModal";
import { cn } from "@/lib/utils";
import { courseRepository } from "@/services/course.repository";
import type { CourseSidebarFeed } from "@/types/courses";
import { APP_PAGE_CONTAINER, APP_PAGE_SHELL } from "@/lib/ui-sync";

const emptySidebarFeed: CourseSidebarFeed = {
  deadlines: [],
  recentActivity: [],
};

export default function CoursesPage() {
  const {
    courses,
    courseProgress,
    status,
    error,
    loadedContext,
    hydrateForContext,
    resetForContext,
    setLoading,
    setError,
    clearError,
  } = useCourseStore();
  const {
    query,
    setQuery,
    filters,
    clearFilters,
    toggleCourse,
    toggleSemester,
  } = useSearchStore();
  const { user, hasHydrated } = useUserStore();
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);
  const [sidebarFeed, setSidebarFeed] =
    React.useState<CourseSidebarFeed>(emptySidebarFeed);

  const role = user?.role ?? "student";
  const isLoading = status === "loading";
  const hasHydratedContext =
    !!user?.id &&
    loadedContext?.userId === user.id &&
    loadedContext.role === role;

  const loadCourses = React.useCallback(async () => {
    if (!user?.id) return;

    setLoading();
    const result = await courseRepository.getCoursesForUser(role, user.id);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    hydrateForContext(
      { userId: user.id, role },
      result.data.courses,
      result.data.courseProgress,
    );
    setSidebarFeed(result.data.sidebar);
  }, [hydrateForContext, role, setError, setLoading, user]);

  React.useEffect(() => {
    if (!hasHydrated) return;

    if (!user?.id) {
      if (loadedContext || courses.length > 0) {
        resetForContext();
      }
      setSidebarFeed(emptySidebarFeed);
      return;
    }

    const contextMismatch =
      loadedContext &&
      (loadedContext.userId !== user.id || loadedContext.role !== role);
    if (contextMismatch) {
      resetForContext();
    }

    if (!hasHydratedContext && status !== "loading") {
      void loadCourses();
      return;
    }

    if (hasHydratedContext && status === "success" && !sidebarFeed.recentActivity.length) {
      void courseRepository.getCourseSidebarFeed(role, user.id).then((result) => {
        if (result.ok) {
          setSidebarFeed(result.data);
        }
      });
    }
  }, [
    courses.length,
    hasHydrated,
    hasHydratedContext,
    loadCourses,
    loadedContext,
    resetForContext,
    role,
    sidebarFeed.recentActivity.length,
    status,
    user?.id,
  ]);

  const fuse = React.useMemo(
    () =>
      new Fuse(courses, {
        keys: [
          { name: "title", weight: 2 },
          { name: "code", weight: 1.5 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [courses],
  );

  const filteredCourses = React.useMemo(() => {
    let filtered =
      query.trim().length > 0
        ? fuse.search(query.trim()).map((result) => result.item)
        : courses;

    if (filters.courses.length > 0) {
      filtered = filtered.filter((course) => filters.courses.includes(course.code));
    }

    if (filters.semesters.length > 0) {
      filtered = filtered.filter((course) =>
        filters.semesters.includes(course.semester),
      );
    }

    return filtered;
  }, [courses, filters.courses, filters.semesters, fuse, query]);

  const availableCourses = React.useMemo(
    () => Array.from(new Set(courses.map((course) => course.code))).sort(),
    [courses],
  );

  const availableSemesters = React.useMemo(
    () =>
      Array.from(new Set(courses.map((course) => course.semester)))
        .filter((semester) => Number.isFinite(semester))
        .sort((left, right) => left - right),
    [courses],
  );

  const activeFilterCount = filters.courses.length + filters.semesters.length;

  if (!hasHydrated) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--md-sys-color-primary)] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[920px] items-center justify-center px-4">
        <div className="w-full rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-8 text-center">
          <h1 className="text-[24px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
            Sign in to load courses
          </h1>
          <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
            Your course list is personalized by role and semester.
          </p>
          <Link href="/auth/login" className="mt-5 inline-block">
            <M3Button layout="mobile-full">
              Go to Login
            </M3Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={APP_PAGE_SHELL}>
        <div className={cn(APP_PAGE_CONTAINER, "grid grid-cols-1 gap-10 lg:grid-cols-12")}>
          <div className="space-y-8 lg:col-span-8">
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-secondary-container)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-secondary-container)]">
                  Academic Management
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)]">
                  {role === "lecturer" ? "My Taught Courses" : "My Enrolled Courses"}
                </h1>
                <p className="max-w-2xl text-lg font-medium leading-relaxed text-[color:var(--md-sys-color-on-surface-variant)]">
                  {role === "lecturer"
                    ? "Manage modules, publish materials, and monitor course health."
                    : "Access resources, track completion, and continue your current semester plan."}
                </p>
              </div>

              {role === "lecturer" && (
                <Link href="/courses/add">
                  <M3Button className="h-12 gap-2 rounded-xl px-8 font-semibold">
                    Add Course
                  </M3Button>
                </Link>
              )}
            </div>

            <div className="flex flex-col items-center gap-4 border-t border-[color:var(--md-sys-color-outline-variant)] pt-4 sm:flex-row">
              <SearchInput
                placeholder="Search courses..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 w-full flex-1 rounded-xl sm:w-auto"
              />
              <div className="flex w-full items-center gap-3 sm:w-auto">
                <M3Button
                  variant={isFilterModalOpen ? "filled" : "outlined"}
                  onClick={() => setIsFilterModalOpen((open) => !open)}
                  className="h-12 gap-2 rounded-xl px-6 font-semibold"
                >
                  <MaterialSymbol icon={FilterIcon} size={18} />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 flex h-5 min-w-5 items-center justify-center border-none bg-[color:var(--md-sys-color-on-primary)] p-0 text-xs font-semibold text-[color:var(--md-sys-color-primary)]"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </M3Button>
              </div>
            </div>
          </div>

          {status === "error" && (
            <div className="rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-5">
              <p className="text-[15px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                Unable to load courses
              </p>
              <p className="mt-1 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                {error ?? "Please try again."}
              </p>
              <div className="m3-action-row mt-4">
                <M3Button
                  variant="outlined"
                  layout="mobile-full"
                  onClick={() => {
                    clearError();
                    void loadCourses();
                  }}
                >
                  Retry
                </M3Button>
              </div>
            </div>
          )}

          {activeFilterCount > 0 && (
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-surface-variant)]">
                Active:
              </span>
              {filters.courses.map((courseCode) => (
                <Badge
                  key={`course-${courseCode}`}
                  variant="secondary"
                  className="gap-2 rounded-lg border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-secondary-container)] py-1 pl-3 pr-2 font-semibold text-[color:var(--md-sys-color-on-secondary-container)]"
                >
                  {courseCode}
                  <button
                    onClick={() => toggleCourse(courseCode)}
                    className="rounded-full p-0.5 transition-colors hover:bg-[color:var(--md-sys-color-surface-container-high)]"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {filters.semesters.map((semester) => (
                <Badge
                  key={`semester-${semester}`}
                  variant="secondary"
                  className="gap-2 rounded-lg border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-primary-container)] py-1 pl-3 pr-2 font-semibold text-[color:var(--md-sys-color-on-primary-container)]"
                >
                  Semester {semester}
                  <button
                    onClick={() => toggleSemester(semester)}
                    className="rounded-full p-0.5 transition-colors hover:bg-[color:var(--md-sys-color-surface-container-high)]"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <M3Button
                variant="text"
                size="sm"
                onClick={clearFilters}
                className="h-7 text-xs font-semibold uppercase tracking-widest"
              >
                Clear all
              </M3Button>
            </div>
          )}

          <div className="pt-4">
            {isLoading ? (
              <div className="flex h-[32vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--md-sys-color-primary)] border-t-transparent" />
                  <p className="text-sm font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                    Loading courses...
                  </p>
                </div>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div
                className={cn(
                  role === "student"
                    ? "grid grid-cols-1 gap-6 md:grid-cols-2"
                    : "flex flex-col gap-4",
                )}
              >
                {filteredCourses.map((course) =>
                  role === "lecturer" ? (
                    <LecturerCourseCard key={course.id} course={course} />
                  ) : (
                    <StudentCourseCard
                      key={course.id}
                      course={course}
                      progress={courseProgress[course.id] ?? 0}
                    />
                  ),
                )}
              </div>
            ) : (
              <div className="flex min-h-[48vh] items-center">
                <EmptyCoursesState role={role} />
              </div>
            )}
          </div>
          </div>

          <aside className="space-y-8 lg:col-span-4">
            <CoursesSidebar role={role} feed={sidebarFeed} />
          </aside>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Courses"
        description="Refine your course list by course code and semester."
        sections={[
          {
            id: "courses",
            label: "Course Code",
            type: "checkbox",
            options: availableCourses.map((courseCode) => ({
              value: courseCode,
              label: courseCode,
            })),
            selectedValues: filters.courses,
            onToggle: toggleCourse,
          },
          {
            id: "semesters",
            label: "Semester",
            type: "checkbox",
            options: availableSemesters.map((semester) => ({
              value: String(semester),
              label: `Semester ${semester}`,
            })),
            selectedValues: filters.semesters.map(String),
            onToggle: (value) => toggleSemester(Number(value)),
          },
        ]}
      />
    </>
  );
}
