"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/core";
import { MdSkeleton } from "@/components/core/md-skeleton";
import {
  DashboardMasonrySection,
  DashboardTile,
} from "@/components/features/dashboard/DashboardMasonryLayout";
import { APP_SURFACE_CARD } from "@/lib/ui-sync";

const dashboardSurfaceCard = APP_SURFACE_CARD;

function SkeletonMetricCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3">
      <MdSkeleton variant="text" width="54%" height={11} />
      <MdSkeleton
        variant="text"
        width={compact ? "44%" : "38%"}
        height={compact ? 22 : 24}
        className="mt-2"
      />
    </div>
  );
}

function SkeletonSectionHeader({ showAction = false }: { showAction?: boolean }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="space-y-2">
        <MdSkeleton variant="text" width={108} height={11} />
        <MdSkeleton variant="text" width="min(380px,58vw)" height={26} />
        <MdSkeleton variant="text" width="min(520px,74vw)" height={14} />
      </div>
      {showAction ? (
        <MdSkeleton variant="rounded" className="h-9 w-28 shrink-0 rounded-full" />
      ) : null}
    </div>
  );
}

function SkeletonStudentFeedCard() {
  return (
    <div className="rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <MdSkeleton variant="rounded" className="h-6 w-20 rounded-full" />
        <MdSkeleton variant="rounded" className="h-6 w-24 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <MdSkeleton variant="circular" width={22} height={22} />
        <MdSkeleton variant="text" width="84%" height={22} />
        <MdSkeleton variant="text" width="56%" height={13} />
        <MdSkeleton variant="text" width="94%" height={13} />
        <MdSkeleton variant="text" width="72%" height={13} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <MdSkeleton variant="rounded" className="h-9 w-28 rounded-full" />
        <MdSkeleton variant="circular" width={40} height={40} />
      </div>
    </div>
  );
}

function SkeletonXpCard() {
  return (
    <Card className={dashboardSurfaceCard}>
      <CardContent className="space-y-5 p-6">
        <div className="flex items-center justify-between">
          <MdSkeleton variant="text" width="42%" height={20} />
          <MdSkeleton variant="circular" width={74} height={74} />
        </div>
        <MdSkeleton variant="rounded" className="h-24 w-full rounded-2xl" />
        <div className="space-y-2">
          <MdSkeleton variant="text" width="52%" height={12} />
          <MdSkeleton variant="rounded" className="h-2.5 w-full rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MdSkeleton variant="rounded" className="h-16 w-full rounded-2xl" />
          <MdSkeleton variant="rounded" className="h-16 w-full rounded-2xl" />
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonHealthCard() {
  return (
    <Card className={cn(dashboardSurfaceCard, "h-full min-h-[248px]")}>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <MdSkeleton variant="text" width={76} height={11} />
            <MdSkeleton variant="text" width="min(220px,62vw)" height={19} />
          </div>
          <MdSkeleton variant="rounded" className="h-6 w-28 rounded-full" />
        </div>
        <MdSkeleton variant="text" width="66%" height={13} />
        <MdSkeleton variant="text" width="74%" height={13} />
        <MdSkeleton variant="rounded" className="h-10 w-full rounded-full" />
      </CardContent>
    </Card>
  );
}

function SkeletonManagedCourseCard() {
  return (
    <Card className={cn(dashboardSurfaceCard, "h-full min-h-[252px]")}>
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="space-y-2">
            <MdSkeleton variant="text" width={78} height={11} />
            <MdSkeleton variant="text" width="min(230px,60vw)" height={22} />
          </div>
          <MdSkeleton variant="rounded" className="h-6 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SkeletonMetricCard compact />
          <SkeletonMetricCard compact />
        </div>
        <MdSkeleton variant="rounded" className="mt-5 h-10 w-full rounded-full" />
      </CardContent>
    </Card>
  );
}

function SkeletonChartCard() {
  return (
    <div className="rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4">
      <MdSkeleton variant="text" width={134} height={12} />
      <MdSkeleton variant="rounded" className="mt-3 h-40 w-full rounded-2xl" />
    </div>
  );
}

function SkeletonUploadRow({ selected = false }: { selected?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-[color:var(--md-sys-color-surface-container-low)] p-3.5",
        selected
          ? "border-[color:var(--md-sys-color-primary)]"
          : "border-[color:var(--md-sys-color-outline-variant)]",
      )}
    >
      <div className="flex items-start gap-3">
        <MdSkeleton variant="rounded" className="h-10 w-10 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <MdSkeleton variant="text" width="72%" height={14} />
          <MdSkeleton variant="text" width="34%" height={12} />
          <MdSkeleton variant="text" width="56%" height={12} />
        </div>
        <MdSkeleton variant="rounded" className="h-8 w-28 rounded-full" />
        <MdSkeleton variant="rounded" className="h-8 w-20 rounded-full" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <MdSkeleton variant="rounded" className="h-8 w-28 rounded-full" />
        <MdSkeleton variant="rounded" className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

function SkeletonAttentionRow() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <MdSkeleton variant="text" width="min(260px,72vw)" height={14} />
        <MdSkeleton variant="text" width="min(320px,84vw)" height={12} />
      </div>
      <MdSkeleton variant="rounded" className="h-8 w-36 rounded-full" />
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
              <MdSkeleton variant="text" width="68%" height={34} />
              <MdSkeleton variant="text" width="78%" height={15} />
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonMetricCard key={`student-hero-stat-${index}`} />
              ))}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <MdSkeleton variant="text" width={170} height={12} />
                <MdSkeleton variant="text" width={38} height={12} />
              </div>
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
              <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <md-tabs
                  active-tab-index={0}
                  className="course-tabs pointer-events-none opacity-70"
                  aria-hidden="true"
                >
                  <md-tab>Learning Activity</md-tab>
                  <md-tab>Course Pathways</md-tab>
                </md-tabs>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonStudentFeedCard key={`student-feed-card-${index}`} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(dashboardSurfaceCard, "p-5 sm:p-6")}>
          <CardContent className="space-y-4 p-0">
            <div className="flex items-center gap-2">
              <MdSkeleton variant="circular" width={16} height={16} />
              <MdSkeleton variant="text" width={240} height={18} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`student-deadline-${index}`}
                  className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3"
                >
                  <MdSkeleton variant="text" width="82%" height={14} />
                  <MdSkeleton variant="text" width="54%" height={12} className="mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <aside className="col-span-12 min-w-0 space-y-6 xl:col-span-4">
        <SkeletonXpCard />

        <Card className={dashboardSurfaceCard}>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <MdSkeleton variant="text" width="56%" height={22} />
              <MdSkeleton variant="circular" width={40} height={40} />
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
            <MdSkeleton variant="text" width="72%" height={12} />
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
                <MdSkeleton variant="text" width="68%" height={36} />
                <MdSkeleton variant="text" width="82%" height={15} />
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonMetricCard key={`lecturer-hero-stat-${index}`} />
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SkeletonChartCard />
                <SkeletonChartCard />
              </div>
            </CardContent>
          </Card>
        </DashboardTile>

        <DashboardTile span="rail" className="min-w-0">
          <Card className={cn(dashboardSurfaceCard, "h-full")}>
            <CardContent className="space-y-4 p-6">
              <MdSkeleton variant="text" width="48%" height={22} />
              <MdSkeleton variant="rounded" className="h-10 w-full rounded-full" />
              <MdSkeleton variant="rounded" className="h-10 w-full rounded-full" />
              <MdSkeleton variant="rounded" className="h-10 w-full rounded-full" />
              <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4">
                <MdSkeleton variant="text" width={148} height={12} />
                <MdSkeleton variant="text" width="88%" height={14} className="mt-3" />
                <MdSkeleton variant="text" width="72%" height={12} className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </DashboardTile>
      </DashboardMasonrySection>

      <section>
        <SkeletonSectionHeader />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonHealthCard key={`lecturer-health-${index}`} />
          ))}
        </div>
      </section>

      <section>
        <SkeletonSectionHeader showAction />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonManagedCourseCard key={`lecturer-courses-${index}`} />
          ))}
        </div>
      </section>

      <section>
        <SkeletonSectionHeader />
        <DashboardMasonrySection>
          <DashboardTile span="narrow">
            <Card className={cn(dashboardSurfaceCard, "h-full min-h-[280px]")}>
              <CardContent className="space-y-4 p-6">
                <MdSkeleton variant="text" width={152} height={22} />
                <div className="rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-5">
                  <div className="flex items-start gap-3">
                    <MdSkeleton variant="rounded" className="h-11 w-11 rounded-xl" />
                    <div className="space-y-2">
                      <MdSkeleton variant="text" width={100} height={11} />
                      <MdSkeleton variant="text" width="min(190px,52vw)" height={16} />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={`trend-readout-${index}`} className="space-y-1.5">
                        <MdSkeleton variant="text" width="68%" height={18} />
                        <MdSkeleton variant="text" width="76%" height={11} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </DashboardTile>
          <DashboardTile span="wide">
            <Card className={cn(dashboardSurfaceCard, "h-full min-h-[520px]")}>
              <CardContent className="space-y-3 p-6">
                <MdSkeleton variant="text" width={164} height={22} />
                <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <MdSkeleton variant="rounded" className="h-8 w-24 rounded-full" />
                    <MdSkeleton variant="rounded" className="h-8 w-32 rounded-full" />
                    <MdSkeleton variant="rounded" className="h-8 w-32 rounded-full" />
                    <MdSkeleton variant="text" width={88} height={12} className="ml-auto" />
                  </div>
                </div>
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonUploadRow
                    key={`upload-row-${index}`}
                    selected={index === 0}
                  />
                ))}
              </CardContent>
            </Card>
          </DashboardTile>
        </DashboardMasonrySection>
      </section>

      <section>
        <SkeletonSectionHeader />
        <Card className={dashboardSurfaceCard}>
          <CardContent className="space-y-3 p-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonAttentionRow key={`attention-row-${index}`} />
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
