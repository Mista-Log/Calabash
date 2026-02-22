"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/core";
import { MdSkeleton } from "@/components/core/md-skeleton";
import {
  DashboardMasonrySection,
  DashboardTile,
} from "@/components/features/dashboard/DashboardMasonryLayout";

const dashboardSurfaceCard =
  "m3-surface m3-surface--elevated rounded-[28px] border-[color:var(--md-sys-color-outline-variant)]";

function SkeletonMetricCard() {
  return (
    <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3">
      <MdSkeleton variant="text" width="50%" height={12} />
      <MdSkeleton variant="text" width="38%" height={24} className="mt-2" />
    </div>
  );
}

function SkeletonSectionHeader() {
  return (
    <div className="mb-5 space-y-2">
      <MdSkeleton variant="text" width={120} height={12} />
      <MdSkeleton variant="text" width="38%" height={26} />
      <MdSkeleton variant="text" width="62%" height={14} />
    </div>
  );
}

export function DashboardHeaderSkeleton() {
  return (
    <div className="space-y-3">
      <MdSkeleton variant="text" width="42%" height={42} />
      <MdSkeleton variant="text" width="66%" height={16} />
    </div>
  );
}

export function StudentDashboardSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-5 sm:gap-7">
      <section className="col-span-12 min-w-0 space-y-6 xl:col-span-8">
        <Card className={cn(dashboardSurfaceCard, "overflow-hidden")}>
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="space-y-2.5">
              <MdSkeleton variant="text" width={160} height={12} />
              <MdSkeleton variant="text" width="62%" height={36} />
              <MdSkeleton variant="text" width="74%" height={16} />
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonMetricCard key={`student-hero-stat-${index}`} />
              ))}
            </div>

            <div className="space-y-2.5">
              <MdSkeleton variant="text" width="26%" height={12} />
              <MdSkeleton variant="rounded" className="h-2.5 w-full" />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <MdSkeleton variant="rounded" className="h-10 w-full sm:w-44" />
              <MdSkeleton variant="rounded" className="h-10 w-full sm:w-52" />
            </div>
          </CardContent>
        </Card>

        <Card className={cn(dashboardSurfaceCard, "p-5 sm:p-6")}>
          <CardContent className="p-0">
            <div className="space-y-5">
              <div className="flex gap-2 border-b border-[color:var(--md-sys-color-outline-variant)] pb-2.5">
                <MdSkeleton variant="rounded" className="h-10 w-40 rounded-full" />
                <MdSkeleton variant="rounded" className="h-10 w-44 rounded-full" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`student-feed-card-${index}`}
                    className="rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-5"
                  >
                    <MdSkeleton variant="rounded" className="h-32 w-full rounded-2xl" />
                    <MdSkeleton variant="text" width="76%" height={20} className="mt-4" />
                    <MdSkeleton variant="text" width="48%" height={14} className="mt-2" />
                    <MdSkeleton variant="rounded" className="mt-4 h-9 w-28 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(dashboardSurfaceCard, "p-5 sm:p-6")}>
          <CardContent className="space-y-4 p-0">
            <MdSkeleton variant="text" width={240} height={18} />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <MdSkeleton
                  key={`student-deadline-${index}`}
                  variant="rounded"
                  className="h-20 w-full rounded-2xl"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <aside className="col-span-12 min-w-0 space-y-6 xl:col-span-4">
        <Card className={dashboardSurfaceCard}>
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <MdSkeleton variant="text" width="38%" height={18} />
              <MdSkeleton variant="circular" width={74} height={74} />
            </div>
            <MdSkeleton variant="rounded" className="h-24 w-full rounded-2xl" />
            <MdSkeleton variant="rounded" className="h-20 w-full rounded-2xl" />
          </CardContent>
        </Card>

        <Card className={dashboardSurfaceCard}>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <MdSkeleton variant="text" width="56%" height={22} />
              <MdSkeleton variant="circular" width={36} height={36} />
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <MdSkeleton
                  key={`student-milestone-chip-${index}`}
                  variant="rounded"
                  className="h-8 w-24 rounded-full"
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <MdSkeleton
                  key={`student-milestone-badge-${index}`}
                  variant="rounded"
                  className="h-24 w-full rounded-2xl"
                />
              ))}
            </div>
            <MdSkeleton variant="rounded" className="h-10 w-full rounded-full" />
          </CardContent>
        </Card>

        <Card className={dashboardSurfaceCard}>
          <CardContent className="space-y-5 p-6">
            <MdSkeleton variant="text" width="58%" height={22} />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <MdSkeleton
                  key={`student-progress-${index}`}
                  variant="rounded"
                  className="h-20 w-full rounded-2xl"
                />
              ))}
            </div>
            <MdSkeleton variant="rounded" className="h-10 w-full rounded-full" />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

export function LecturerDashboardSkeleton() {
  return (
    <div className="space-y-7 sm:space-y-10">
      <DashboardMasonrySection>
        <DashboardTile span="hero" className="min-w-0">
          <Card className={cn(dashboardSurfaceCard, "h-full overflow-hidden")}>
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="space-y-3">
                <MdSkeleton variant="text" width={180} height={12} />
                <MdSkeleton variant="text" width="64%" height={36} />
                <MdSkeleton variant="text" width="78%" height={16} />
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonMetricCard key={`lecturer-hero-stat-${index}`} />
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <MdSkeleton variant="rounded" className="h-48 w-full rounded-3xl" />
                <MdSkeleton variant="rounded" className="h-48 w-full rounded-3xl" />
              </div>
            </CardContent>
          </Card>
        </DashboardTile>

        <DashboardTile span="rail" className="min-w-0">
          <Card className={cn(dashboardSurfaceCard, "h-full")}>
            <CardContent className="space-y-4 p-6">
              <MdSkeleton variant="text" width="56%" height={22} />
              <MdSkeleton variant="rounded" className="h-10 w-full rounded-full" />
              <MdSkeleton variant="rounded" className="h-10 w-full rounded-full" />
              <MdSkeleton variant="rounded" className="h-10 w-full rounded-full" />
              <MdSkeleton variant="rounded" className="h-24 w-full rounded-2xl" />
            </CardContent>
          </Card>
        </DashboardTile>
      </DashboardMasonrySection>

      <section>
        <SkeletonSectionHeader />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <MdSkeleton
              key={`lecturer-health-${index}`}
              variant="rounded"
              className="h-[248px] w-full rounded-[28px]"
            />
          ))}
        </div>
      </section>

      <section>
        <SkeletonSectionHeader />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <MdSkeleton
              key={`lecturer-courses-${index}`}
              variant="rounded"
              className="h-[252px] w-full rounded-[28px]"
            />
          ))}
        </div>
      </section>

      <section>
        <SkeletonSectionHeader />
        <DashboardMasonrySection>
          <DashboardTile span="narrow">
            <MdSkeleton variant="rounded" className="h-[280px] w-full rounded-[28px]" />
          </DashboardTile>
          <DashboardTile span="wide">
            <MdSkeleton variant="rounded" className="h-[520px] w-full rounded-[28px]" />
          </DashboardTile>
        </DashboardMasonrySection>
      </section>

      <section>
        <SkeletonSectionHeader />
        <MdSkeleton variant="rounded" className="h-[230px] w-full rounded-[28px]" />
      </section>
    </div>
  );
}

