"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[color:var(--md-sys-color-surface-container-highest)]",
        className,
      )}
    />
  );
}

/**
 * Course Detail Page Header Skeleton
 */
export function CourseDetailHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-28" />
      </div>
      <Skeleton className="h-12 w-3/4 rounded-2xl" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
}

/**
 * Course Hero Section Skeleton
 */
export function CourseHeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)]">
      {/* Banner */}
      <div className="relative h-48 w-full bg-gradient-to-r from-[color:var(--md-sys-color-primary-container)] to-[color:var(--md-sys-color-secondary-container)] md:h-64">
        <div className="absolute inset-0 p-6 md:p-8">
          <Skeleton className="mb-4 h-10 w-3/4 rounded-xl bg-white/20" />
          <Skeleton className="h-6 w-1/2 rounded-lg bg-white/20" />
        </div>
      </div>

      {/* Course Info */}
      <div className="p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Course Lecturer Card Skeleton
 */
export function CourseLecturerSkeleton() {
  return (
    <div className="rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}

/**
 * Course Modules/Content Skeleton
 */
export function CourseModulesSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4"
          >
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Course Materials Grid Skeleton
 */
export function CourseMaterialsGridSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-40" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4"
          >
            <div className="mb-3 flex items-start justify-between">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="mb-2 h-5 w-full" />
            <Skeleton className="mb-4 h-4 w-2/3" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Course Stats Cards Skeleton
 */
export function CourseStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-5"
        >
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="mb-1 h-10 w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
}

/**
 * Course Announcements Skeleton
 */
export function CourseAnnouncementsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-5"
          >
            <div className="mb-3 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="mb-3 h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Course Progress Section Skeleton (Student View)
 */
export function CourseProgressSkeleton() {
  return (
    <div className="rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-3 w-full rounded-full" />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

/**
 * Complete Course Detail Page Skeleton
 * Combines all skeleton components for full page loading state
 */
export function CourseDetailPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Skeleton className="h-10 w-36" />

      {/* Header */}
      <CourseDetailHeaderSkeleton />

      {/* Hero Section */}
      <CourseHeroSkeleton />

      {/* Stats */}
      <CourseStatsSkeleton />

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content (2 columns) */}
        <div className="space-y-8 lg:col-span-2">
          <CourseModulesSkeleton />
          <CourseMaterialsGridSkeleton />
        </div>

        {/* Sidebar (1 column) */}
        <div className="space-y-6">
          <CourseLecturerSkeleton />
          <CourseProgressSkeleton />
          <CourseAnnouncementsSkeleton />
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Course Detail Skeleton (for inline loading)
 */
export function CompactCourseDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-36" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
