"use client";

import React from "react";
import Link from "next/link";
<<<<<<< HEAD
import { motion } from "@/lib/motion-foundations";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useToast } from "@/components/core/toast";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  ArrowRight01Icon,
  AnalyticsUpIcon,
  BookOpen01Icon,
  Pdf01Icon,
  VideoReplayIcon,
  FileZipIcon,
  PlusSignIcon,
  Upload02Icon,
  UserGroupIcon,
} from "@/lib/icons/material-icons";
import { M3Button } from "@/components/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/core";
import { UploadModal } from "@/components/features/library/UploadModal";
import { EditMaterialModal } from "@/components/features/library/EditMaterialModal";
import { Chart } from "@/components/core/chart";
import { EmptyState } from "@/components/core/empty-state";
import { SectionHeader } from "@/components/core/section-header";
import { MetricStat } from "@/components/core/metric-stat";
import {
  DashboardMasonrySection,
  DashboardTile,
} from "@/components/features/dashboard/DashboardMasonryLayout";
import { APP_SURFACE_CARD } from "@/lib/ui-sync";
import type { LecturerDashboardView } from "@/types/dashboard";
import type { Material } from "@/services/api";

interface LecturerDashboardProps {
  view: LecturerDashboardView;
  onRefresh?: () => Promise<void> | void;
}

function dateToTime(value?: string | null): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

const materialIcons = {
  pdf: Pdf01Icon,
  video: VideoReplayIcon,
  "past-question": BookOpen01Icon,
  zip: FileZipIcon,
  image: Pdf01Icon,
};

const dashboardSurfaceCard = APP_SURFACE_CARD;

const COPY = {
  heroKicker: "Instructional Overview",
  heroTitle: "Faculty Academic Overview",
  heroDescription:
    "Review instructional output, learner engagement, and course performance from one academic workspace.",
  actionsTitle: "Academic Actions",
  uploadMaterial: "Publish New Material",
  createCourse: "Create Course Record",
  openAnalytics: "Review Analytics",
  uploadTrend: "Monthly Publication Trend",
  needsReview: (count: number) =>
    `${count} course${count === 1 ? "" : "s"} currently require academic content review.`,
  contentHealthTitle: "Course Content Health",
  contentHealthDescription:
    "Operational signal for stale, incomplete, or missing instructional resources.",
  statusReviewRequired: "Review Required",
  statusOnTrack: "On Track",
  noUploadsYet: "No uploads on record",
  openCourse: "Open Course Record",
  managedCoursesTitle: "Managed Course Portfolio",
  managedCoursesDescription:
    "Review managed courses by enrollment and instructional resource output.",
  managePortfolio: "Manage Portfolio",
  noCoursesTitle: "No managed courses yet",
  noCoursesDescription:
    "Create your first course record to begin publishing instructional materials.",
  insightsKicker: "Academic Insights",
  insightsTitle: "Content Performance",
  insightsDescription:
    "Review high-impact resources and recent academic publications.",
  trendingTitle: "Trending Material",
  mostViewed: "Most Accessed",
  noTrendTitle: "No trend data available",
  noTrendDescription:
    "Publish and distribute instructional materials to generate trend records.",
  recentUploadsTitle: "Recent Publications",
  openResource: "Open Resource",
  editResource: "Edit Record",
  saving: "Saving...",
  setPrivate: "Set Private",
  setPublic: "Set Public",
  clearSelection: "Clear Selection",
  selectAll: "Select All",
  setSelectedPublic: "Set Selected Public",
  setSelectedPrivate: "Set Selected Private",
  selectedCount: (selected: number, visible: number) =>
    `${selected} selected of ${visible} visible`,
  visibleScopeHint: "Bulk actions apply to visible items on this panel.",
  visibilityPublic: "Public",
  visibilityPrivate: "Private",
  select: "Select",
  selected: "Selected",
  noRecentUploadsTitle: "No recent publications",
  noRecentUploadsDescription:
    "Newly published instructional materials will appear here.",
  attentionQueueTitle: "Instructional Review Queue",
  attentionQueueDescription: "Courses requiring immediate instructional updates.",
  noUrgentUpdatesTitle: "No urgent instructional updates",
  noUrgentUpdatesDescription:
    "All tracked courses are currently on schedule.",
  queueResourcesLastPublication: "resources • Last publication",
};

export function LecturerDashboard({ view, onRefresh }: LecturerDashboardProps) {
  const { reducedMotion } = useSettingsStore();
  const { addToast } = useToast();
  const { updateMaterial, setVisibility, batchSetVisibility } = useLibraryStore();

  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [editingMaterial, setEditingMaterial] = React.useState<Material | null>(null);
  const [pendingMaterialId, setPendingMaterialId] = React.useState<string | null>(
    null,
  );
  const [selectedUploadIds, setSelectedUploadIds] = React.useState<string[]>([]);
  const [isBatchUpdating, setIsBatchUpdating] = React.useState(false);

  const { data, contentHealth, recentUploads } = view;
=======
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mortarboard01Icon,
  UserGroupIcon,
  BookOpen01Icon,
  TradeUpIcon,
  MoreHorizontalIcon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Calendar03Icon,
  Clock01Icon,
  File01Icon,
  Download01Icon,
  StarIcon,
  RefreshIcon,
  FilterHorizontalIcon,
  Search01Icon,
  Comment01Icon,
  ViewIcon,
  PdfIcon,
  VideoReplayIcon,
  FileZipIcon,
  AnalyticsUpIcon,
  Upload02Icon,
  PlusSignIcon,
  Sorting05Icon,
  NoteEditIcon,
  TradeUpIcon as TrendingUp01Icon,
  RefreshIcon as RefreshCw01Icon,
  Comment01Icon as MessageChatSquareIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/core/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/core/card";
import { Timeline } from "@/components/core/timeline";
import { DashboardData } from "@/services/api";
import { UploadModal } from "@/components/features/library/UploadModal";
import { EditMaterialModal } from "@/components/features/library/EditMaterialModal";
import { Material } from "@/services/api";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Chart } from "@/components/core/chart"; // Import the Chart component

interface LecturerDashboardProps {
  data: DashboardData;
}

const materialIcons: Record<string, any> = {
  pdf: PdfIcon,
  video: VideoReplayIcon,
  "past-question": BookOpen01Icon,
  zip: FileZipIcon,
};

// Mock data for charts
const monthlyUploadsData = [
  { name: "Jan", uploads: 40, value: 40 },
  { name: "Feb", uploads: 30, value: 30 },
  { name: "Mar", uploads: 20, value: 20 },
  { name: "Apr", uploads: 27, value: 27 },
  { name: "May", uploads: 18, value: 18 },
  { name: "Jun", uploads: 23, value: 23 },
  { name: "Jul", uploads: 34, value: 34 },
];

const courseEngagementData = [
  { name: "MATH201", engagement: 400, value: 400 },
  { name: "CS305", engagement: 300, value: 300 },
  { name: "PHYS101", engagement: 200, value: 200 },
  { name: "ART100", engagement: 278, value: 278 },
  { name: "BIO200", engagement: 189, value: 189 },
];

export function LecturerDashboard({ data }: LecturerDashboardProps) {
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [editingMaterial, setEditingMaterial] = React.useState<Material | null>(
    null,
  );

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
  };

  const { reducedMotion } = useSettingsStore();

>>>>>>> origin/main
  const lecturerStats = data.lecturerStats || {
    totalStudents: 0,
    totalUploads: 0,
    totalViews: 0,
<<<<<<< HEAD
    activeCourses: data.courses.length,
    trendingMaterial: null,
    monthlyUploads: [],
    courseEngagement: [],
  };

  const monthlyUploadsData = lecturerStats.monthlyUploads || [];
  const courseEngagementData = lecturerStats.courseEngagement || [];
  const courseCount = data.courses.length;
  const estimatedStudentsPerCourse =
    courseCount > 0 ? Math.round(lecturerStats.totalStudents / courseCount) : 0;
  const currentMonthUploads =
    monthlyUploadsData.length > 0
      ? monthlyUploadsData[monthlyUploadsData.length - 1]?.uploads ?? 0
      : 0;
  const previousMonthUploads =
    monthlyUploadsData.length > 1
      ? monthlyUploadsData[monthlyUploadsData.length - 2]?.uploads ?? 0
      : 0;
  const monthDelta = currentMonthUploads - previousMonthUploads;
  const monthDeltaPct =
    previousMonthUploads > 0
      ? Math.round((monthDelta / previousMonthUploads) * 100)
      : monthDelta > 0
        ? 100
        : 0;
  const attentionQueue = [...contentHealth]
    .filter((health) => health.needsAttention)
    .sort(
      (left, right) =>
        left.materialCount - right.materialCount ||
        dateToTime(left.lastUploadDate) - dateToTime(right.lastUploadDate),
    )
    .slice(0, 3);
  const selectableUploads = React.useMemo(
    () => recentUploads.slice(0, 6),
    [recentUploads],
  );

  React.useEffect(() => {
    const visibleIds = new Set(selectableUploads.map((material) => material.id));
    setSelectedUploadIds((previous) =>
      previous.filter((materialId) => visibleIds.has(materialId)),
    );
  }, [selectableUploads]);

  const isUploadSelected = (id: string) => selectedUploadIds.includes(id);

  const toggleUploadSelection = (id: string) => {
    setSelectedUploadIds((previous) =>
      previous.includes(id)
        ? previous.filter((selectedId) => selectedId !== id)
        : [...previous, id],
    );
  };

  const toggleSelectAllUploads = () => {
    const allIds = selectableUploads.map((material) => material.id);
    setSelectedUploadIds((previous) =>
      previous.length === allIds.length ? [] : allIds,
    );
  };

  const applyBatchVisibility = async (visibility: "public" | "private") => {
    if (selectedUploadIds.length === 0) return;
    setIsBatchUpdating(true);
    try {
      await batchSetVisibility(selectedUploadIds, visibility);
      addToast(
        visibility === "public"
          ? "Selected instructional materials are now public."
          : "Selected instructional materials are now private.",
        "success",
      );
      setSelectedUploadIds([]);
      await onRefresh?.();
    } catch {
      addToast("Batch visibility update failed. Try again.", "error");
    } finally {
      setIsBatchUpdating(false);
    }
  };

  const handleSaveMaterial = async (updates: Partial<Material>) => {
    if (!editingMaterial) return;
    const targetId = editingMaterial.id;
    setPendingMaterialId(targetId);
    try {
      await updateMaterial(targetId, updates);
      addToast("Instructional material updated successfully.", "success");
      await onRefresh?.();
    } catch {
      addToast("Failed to update instructional material.", "error");
    } finally {
      setPendingMaterialId(null);
      setEditingMaterial(null);
    }
  };

  const handleToggleVisibility = async (material: Material) => {
    const nextVisibility = material.visibility === "private" ? "public" : "private";
    setPendingMaterialId(material.id);
    try {
      await setVisibility(material.id, nextVisibility);
      addToast(
        nextVisibility === "public"
          ? "Instructional material is now public."
          : "Instructional material is now private.",
        "success",
      );
      await onRefresh?.();
    } catch {
      addToast("Visibility update failed. Changes were not saved.", "error");
    } finally {
      setPendingMaterialId(null);
    }
  };

  return (
    <div className="space-y-7 sm:space-y-10">
      <DashboardMasonrySection>
        <DashboardTile span="hero" className="min-w-0">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.04 }}
          className="h-full"
        >
          <Card className={cn(dashboardSurfaceCard, "relative h-full overflow-hidden")}>
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--md-sys-color-primary)]">
                  {COPY.heroKicker}
                </p>
                <h2 className="text-[30px] font-semibold leading-tight tracking-tight sm:text-[36px]">
                  {COPY.heroTitle}
                </h2>
                <p className="max-w-2xl text-[15px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                  {COPY.heroDescription}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <MetricStat
                  label="Students"
                  value={lecturerStats.totalStudents}
                  icon="school"
                  trend={{ value: 15, isPositive: true }}
                />
                <MetricStat
                  label="Uploads"
                  value={lecturerStats.totalUploads}
                  icon="upload_file"
                  trend={{ value: monthDeltaPct, isPositive: monthDelta >= 0 }}
                />
                <MetricStat
                  label="Total Views"
                  value={lecturerStats.totalViews}
                  icon="visibility"
                  trend={{ value: 23, isPositive: true }}
                />
                <MetricStat
                  label="Active Courses"
                  value={lecturerStats.activeCourses}
                  icon="menu_book"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ChartCard title="Monthly Uploads">
                  <Chart
                    type="line"
                    data={monthlyUploadsData}
                    dataKey="uploads"
                    name="Uploads"
                    stroke="var(--md-sys-color-primary)"
                  />
                </ChartCard>
                <ChartCard title="Course Engagement">
                  <Chart
                    type="bar"
                    data={courseEngagementData}
                    dataKey="engagement"
                    name="Engagement"
                    fill="var(--md-sys-color-tertiary)"
                  />
                </ChartCard>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </DashboardTile>

        <DashboardTile span="rail" className="min-w-0">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.09 }}
          className="h-full"
        >
          <Card className={cn(dashboardSurfaceCard, "h-full")}>
            <CardHeader>
              <CardTitle className="text-[20px] font-semibold">{COPY.actionsTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <M3Button
                className="w-full justify-start gap-2"
                onClick={() => setIsUploadOpen(true)}
              >
                <MaterialSymbol icon={Upload02Icon} size={16} />
                {COPY.uploadMaterial}
              </M3Button>
              <Link href="/courses/add" className="block">
                <M3Button variant="secondary" className="w-full justify-start gap-2">
                  <MaterialSymbol icon={PlusSignIcon} size={16} />
                  {COPY.createCourse}
                </M3Button>
              </Link>
              <Link href="/analytics" className="block">
                <M3Button variant="outlined" className="w-full justify-start gap-2">
                  <MaterialSymbol icon={AnalyticsUpIcon} size={16} />
                  {COPY.openAnalytics}
                </M3Button>
              </Link>
              <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
                  {COPY.uploadTrend}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--md-sys-color-on-surface)]">
                  {monthDelta >= 0 ? "+" : ""}
                  {monthDelta} uploads vs previous month ({monthDeltaPct >= 0 ? "+" : ""}
                  {monthDeltaPct}%).
                </p>
                <p className="mt-1 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                  {COPY.needsReview(attentionQueue.length)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </DashboardTile>
      </DashboardMasonrySection>

      <motion.section
        initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.14 }}
        aria-labelledby="course-health-title"
      >
        <SectionHeader
          id="course-health-title"
          kicker="Operations"
          title={COPY.contentHealthTitle}
          description={COPY.contentHealthDescription}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 [grid-auto-flow:dense]">
          {contentHealth.map((health) => (
            <Card
              key={health.courseId}
              className={cn(
                dashboardSurfaceCard,
                "h-full min-h-[248px]",
                health.needsAttention &&
                  "border-[color:var(--md-sys-color-error)]",
              )}
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--md-sys-color-primary)]">
                      {health.courseCode}
                    </p>
                    <h3 className="mt-1 text-[18px] font-semibold leading-tight">
                      {health.courseTitle}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                      health.needsAttention
                        ? "border-[color:var(--md-sys-color-error)] text-[color:var(--md-sys-color-error)]"
                        : "border-[color:var(--md-sys-color-outline-variant)] text-[color:var(--md-sys-color-on-surface-variant)]",
                    )}
                  >
                    {health.needsAttention ? COPY.statusReviewRequired : COPY.statusOnTrack}
                  </span>
                </div>
                <p className="text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                  Materials:{" "}
                  <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">
                    {health.materialCount}
                  </span>
                </p>
                <p className="text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                  Last upload:{" "}
                  <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">
                    {health.lastUploadDate
                      ? new Date(health.lastUploadDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : COPY.noUploadsYet}
                  </span>
                </p>
                <Link href={`/courses/${health.courseId}`} className="block">
                  <M3Button variant="outlined" className="w-full gap-2">
                    {COPY.openCourse}
                    <MaterialSymbol icon={ArrowRight01Icon} size={15} />
                  </M3Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        aria-labelledby="managed-courses-title"
      >
        <SectionHeader
          id="managed-courses-title"
          kicker="Portfolio"
          title={COPY.managedCoursesTitle}
          description={COPY.managedCoursesDescription}
          action={
            <Link href="/courses">
                <M3Button variant="text" size="sm">
                {COPY.managePortfolio}
                </M3Button>
            </Link>
          }
        />

        {data.courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 [grid-auto-flow:dense]">
            {data.courses.map((course, idx) => {
              const students = course.enrollment ?? estimatedStudentsPerCourse;
              const health = contentHealth.find((item) => item.courseId === course.id);
              const materials = health?.materialCount ?? course.materialCount ?? 0;

              return (
                <motion.div
                  key={course.id}
                  initial={reducedMotion ? {} : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.02 + idx * 0.02 }}
                >
                  <Card className={cn(dashboardSurfaceCard, "h-full min-h-[252px]")}>
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--md-sys-color-primary)]">
                            {course.code}
                          </p>
                          <h3 className="mt-1 text-[20px] font-semibold leading-tight">
                            {course.title}
                          </h3>
                        </div>
                        <span className="rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-3 py-1 text-[11px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                          Sem {course.semester}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <MetricStat label="Students" value={students} compact />
                        <MetricStat label="Materials" value={materials} compact />
                      </div>

                      <Link href={`/courses/${course.id}`} className="mt-5 block">
                        <M3Button variant="outlined" className="w-full gap-2">
                          {COPY.openCourse}
                          <MaterialSymbol icon={ArrowRight01Icon} size={16} />
                        </M3Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
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
      </motion.section>

      <motion.section
        initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.24 }}
        aria-labelledby="insights-title"
      >
        <SectionHeader
          id="insights-title"
          kicker={COPY.insightsKicker}
          title={COPY.insightsTitle}
          description={COPY.insightsDescription}
          className="mb-5"
        />

        <DashboardMasonrySection>
          <DashboardTile span="narrow">
          <Card className={cn(dashboardSurfaceCard, "h-full")}>
            <CardHeader>
              <CardTitle className="text-[20px] font-semibold">
                {COPY.trendingTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lecturerStats.trendingMaterial ? (
                <div className="space-y-4 rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
                      <MaterialSymbol icon={BookOpen01Icon} size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--md-sys-color-primary)]">
                        {COPY.mostViewed}
                      </p>
                      <p className="mt-1 text-[16px] font-semibold leading-tight">
=======
    trendingMaterial: null,
  };

  return (
    <div className="space-y-12">
      {/* Hero Section: Analytics + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Engagement Analytics (60% -> 7 cols) */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <Card className="h-full border border-primary/10 shadow-xl shadow-primary/5 bg-linear-to-br from-primary/3 via-background to-accent/3 relative overflow-hidden group">
            <div
              className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 transform group-hover:scale-110 pointer-events-none text-[12rem] font-black hidden lg:block origin-top-right transform-gpu rotate-12"
              aria-hidden="true"
            >
              📊
            </div>

            <CardHeader>
              <CardTitle className="text-xs font-black text-primary/60 uppercase tracking-[0.2em]">
                Insight Center
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
                  Resource Impact
                </h2>
                <p className="text-base text-muted-foreground font-bold max-w-md">
                  Track how your educational materials are performing across
                  your student body.
                </p>
              </div>

              {/* Trending Material */}
              {lecturerStats.trendingMaterial && (
                <div className="p-6 rounded-2xl bg-background/40 backdrop-blur-md border border-white/20 shadow-sm ring-1 ring-black/5">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 text-2xl font-black">
                      <HugeiconsIcon icon={AnalyticsUpIcon} size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-primary/60 uppercase tracking-[0.2em]">
                        Peak Performance
                      </p>
                      <p className="text-lg font-extrabold text-foreground leading-tight mt-1">
>>>>>>> origin/main
                        {lecturerStats.trendingMaterial.title}
                      </p>
                    </div>
                  </div>
<<<<<<< HEAD
                  <div className="grid grid-cols-3 gap-3">
                    <MetricReadout label="Views" value={lecturerStats.trendingMaterial.views} />
                    <MetricReadout
                      label="Downloads"
                      value={lecturerStats.trendingMaterial.downloads}
                    />
                    <MetricReadout
                      label="Trend"
                      value={`+${lecturerStats.trendingMaterial.trend}%`}
                      className="text-[color:var(--md-sys-color-primary)]"
                    />
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={AnalyticsUpIcon}
                  title={COPY.noTrendTitle}
                  description={COPY.noTrendDescription}
                  className="py-6"
                />
              )}
            </CardContent>
          </Card>
          </DashboardTile>

          <DashboardTile span="wide">
          <Card className={cn(dashboardSurfaceCard, "h-full")}>
            <CardHeader>
              <CardTitle className="text-[20px] font-semibold">
                {COPY.recentUploadsTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentUploads.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3">
                  <M3Button
                    variant="outlined"
                    size="sm"
                    onClick={toggleSelectAllUploads}
                    disabled={isBatchUpdating || selectableUploads.length === 0}
                  >
                    {selectedUploadIds.length === selectableUploads.length
                      ? COPY.clearSelection
                      : COPY.selectAll}
                  </M3Button>
                  <M3Button
                    variant="text"
                    size="sm"
                    onClick={() => void applyBatchVisibility("public")}
                    disabled={
                      isBatchUpdating ||
                      selectableUploads.length === 0 ||
                      selectedUploadIds.length === 0
                    }
                  >
                    {COPY.setSelectedPublic}
                  </M3Button>
                  <M3Button
                    variant="text"
                    size="sm"
                    onClick={() => void applyBatchVisibility("private")}
                    disabled={
                      isBatchUpdating ||
                      selectableUploads.length === 0 ||
                      selectedUploadIds.length === 0
                    }
                  >
                    {COPY.setSelectedPrivate}
                  </M3Button>
                  <span className="ml-auto text-[12px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                    {COPY.selectedCount(selectedUploadIds.length, selectableUploads.length)}
                  </span>
                  <p className="w-full text-[11px] text-[color:var(--md-sys-color-on-surface-variant)]">
                    {COPY.visibleScopeHint}
                  </p>
                </div>
              )}
              {recentUploads.length > 0 ? (
                selectableUploads.map((material) => {
                  const Icon = materialIcons[material.type] || Pdf01Icon;
                  const isPending = isBatchUpdating || pendingMaterialId === material.id;
                  const isPublic = material.visibility !== "private";
                  const isSelected = isUploadSelected(material.id);

                  return (
                    <div
                      key={material.id}
                      className={cn(
                        "rounded-2xl border bg-[color:var(--md-sys-color-surface-container-low)] p-3.5",
                        isSelected
                          ? "border-[color:var(--md-sys-color-primary)]"
                          : "border-[color:var(--md-sys-color-outline-variant)]",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
                          <MaterialSymbol icon={Icon} size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-semibold">
                            {material.title}
                          </p>
                          <p className="text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                            {material.courseCode}
                          </p>
                          <div className="mt-1 flex items-center gap-1 text-[color:var(--md-sys-color-on-surface-variant)]">
                            <MaterialSymbol icon={UserGroupIcon} size={14} />
                            <span className="text-[12px] font-medium">
                              {material.uploader}
                            </span>
                            <span className="mx-1 text-[10px]">•</span>
                            <span className="text-[11px] font-semibold">
                              {isPublic ? COPY.visibilityPublic : COPY.visibilityPrivate}
                            </span>
                          </div>
                        </div>
                        <Link href={`/library/${material.id}`}>
                          <M3Button variant="text" size="sm">
                            {COPY.openResource}
                          </M3Button>
                        </Link>
                        <M3Button
                          variant={isSelected ? "filled" : "outlined"}
                          size="sm"
                          disabled={isPending}
                          onClick={() => toggleUploadSelection(material.id)}
                        >
                          {isSelected ? COPY.selected : COPY.select}
                        </M3Button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <M3Button
                          variant="outlined"
                          size="sm"
                          disabled={isPending}
                          onClick={() => setEditingMaterial(material)}
                        >
                          {COPY.editResource}
                        </M3Button>
                        <M3Button
                          variant="text"
                          size="sm"
                          disabled={isPending}
                          onClick={() => void handleToggleVisibility(material)}
                        >
                          {isPending
                            ? COPY.saving
                            : isPublic
                              ? COPY.setPrivate
                              : COPY.setPublic}
                        </M3Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  icon={Upload02Icon}
                  title={COPY.noRecentUploadsTitle}
                  description={COPY.noRecentUploadsDescription}
                  className="py-6"
                />
              )}
            </CardContent>
          </Card>
          </DashboardTile>
        </DashboardMasonrySection>
      </motion.section>

      <motion.section
        initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.28 }}
        aria-labelledby="attention-queue-title"
      >
        <SectionHeader
          id="attention-queue-title"
          kicker="Operations"
          title={COPY.attentionQueueTitle}
          description={COPY.attentionQueueDescription}
        />
        <Card className={dashboardSurfaceCard}>
          <CardContent className="space-y-3 p-5">
            {attentionQueue.length > 0 ? (
              attentionQueue.map((item) => (
                <div
                  key={item.courseId}
                  className="flex flex-col gap-3 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                      {item.courseCode} • {item.courseTitle}
                    </p>
                    <p className="text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                      {item.materialCount} {COPY.queueResourcesLastPublication}{" "}
                      {item.lastUploadDate
                        ? new Date(item.lastUploadDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "never"}
                    </p>
                  </div>
                  <Link href={`/courses/${item.courseId}`}>
                    <M3Button variant="outlined" size="sm">
                      {COPY.openCourse}
                    </M3Button>
                  </Link>
                </div>
              ))
            ) : (
              <EmptyState
                icon={BookOpen01Icon}
                title={COPY.noUrgentUpdatesTitle}
                description={COPY.noUrgentUpdatesDescription}
                className="py-6"
              />
            )}
          </CardContent>
        </Card>
      </motion.section>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploaded={async () => {
          addToast("Publication completed and added to recent records.", "success");
          await onRefresh?.();
        }}
      />

      <EditMaterialModal
        isOpen={Boolean(editingMaterial)}
        onClose={() => setEditingMaterial(null)}
        material={editingMaterial}
        onSave={handleSaveMaterial}
      />
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4">
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
        {title}
      </p>
      <div className="h-40">{children}</div>
    </div>
  );
}

function MetricReadout({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div>
      <p className={cn("text-[18px] font-semibold", className)}>{value}</p>
      <p className="text-[11px] text-[color:var(--md-sys-color-on-surface-variant)]">
        {label}
      </p>
=======

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-primary tracking-tighter">
                        {lecturerStats.trendingMaterial.views}
                      </p>
                      <p className="text-xs font-black text-primary/40 uppercase tracking-widest mt-1">
                        Total Reach
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-accent-foreground tracking-tighter">
                        {lecturerStats.trendingMaterial.downloads}
                      </p>
                      <p className="text-xs font-black text-accent-foreground/40 uppercase tracking-widest mt-1">
                        Retention
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-green-600 tracking-tighter">
                        +{lecturerStats.trendingMaterial.trend}%
                      </p>
                      <p className="text-xs font-black text-green-600/40 uppercase tracking-widest mt-1">
                        Velocity
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 bg-background/40 backdrop-blur-md border border-white/20 shadow-sm ring-1 ring-black/5">
                  <CardTitle className="text-base font-bold mb-4">
                    Monthly Uploads
                  </CardTitle>
                  <div className="h-40">
                    <Chart
                      type="line"
                      data={monthlyUploadsData}
                      dataKey="uploads"
                      name="Uploads"
                      stroke="var(--primary)"
                    />
                  </div>
                </Card>
                <Card className="p-4 bg-background/40 backdrop-blur-md border border-white/20 shadow-sm ring-1 ring-black/5">
                  <CardTitle className="text-base font-bold mb-4">
                    Course Engagement
                  </CardTitle>
                  <div className="h-40">
                    <Chart
                      type="bar"
                      data={courseEngagementData}
                      dataKey="engagement"
                      name="Engagement"
                      fill="var(--accent)"
                    />
                  </div>
                </Card>
              </div>

              {/* Action */}
              <Link
                href="/analytics"
                aria-label="View detailed analytics report"
              >
                <Button className="w-full h-14 rounded-2xl text-base font-black shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-transform">
                  Full Analytics Report
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

        {/* Quick Actions (40% -> 5 cols) */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5"
        >
          <Card className="h-full border border-border/60 shadow-lg bg-muted/5 flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-black">
                Management Hub
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <Button
                className="w-full h-14 rounded-2xl text-base font-black justify-start px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5"
                onClick={() => setIsUploadOpen(true)}
                aria-label="Upload new educational material"
              >
                <HugeiconsIcon icon={Upload02Icon} size={24} className="mr-4" />
                Upload New Material
              </Button>

              <div className="grid grid-cols-1 gap-3">
                <Link href="/courses/add">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl text-sm font-black justify-start px-6 border-primary/10 hover:bg-primary/5 transition-all"
                  >
                    <HugeiconsIcon
                      icon={RefreshIcon}
                      size={18}
                      className="mr-3 text-primary"
                    />
                    Curate New Course
                  </Button>
                </Link>

                <Link href="/analytics">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl text-sm font-black justify-start px-6 border-primary/10 hover:bg-primary/5 transition-all"
                  >
                    <HugeiconsIcon
                      icon={Comment01Icon}
                      size={18}
                      className="mr-3 text-primary"
                    />
                    Student Directory
                  </Button>
                </Link>
              </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent-foreground font-black text-xs">
                  💡
                </div>
                <p className="text-xs font-bold text-accent-foreground leading-tight">
                  Tip: Uploading materials in PDF format increases student
                  engagement by 40%.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Course Portfolio Section */}
      <motion.section
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        aria-labelledby="managed-courses-title"
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2
              id="managed-courses-title"
              className="text-2xl font-black text-foreground mb-2"
            >
              Course Portfolio
            </h2>
            <p className="text-base text-muted-foreground font-bold">
              Active courses under your instruction
            </p>
          </div>
          <Link href="/courses">
            <Button
              variant="ghost"
              size="sm"
              className="font-black text-primary hover:bg-primary/5"
            >
              Portfolio Management
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
            >
              <Link
                href={`/courses/${course.id}`}
                aria-label={`Manage course ${course.title}`}
              >
                <Card className="h-full hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer group border border-border/60 hover:border-primary/40 bg-background/40 hover:-translate-y-1">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex-1">
                      <div className="text-xs font-black text-primary mb-3 uppercase tracking-[0.2em]">
                        {course.code}
                      </div>
                      <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors leading-tight mb-8">
                        {course.title}
                      </h3>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col p-4 rounded-xl bg-muted/30 border border-border/20 group-hover:bg-primary/2 transition-colors">
                          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">
                            Students
                          </span>
                          <span className="text-lg font-black text-primary">
                            {Math.floor(Math.random() * 100) + 20}
                          </span>
                        </div>

                        <div className="flex flex-col p-4 rounded-xl bg-muted/30 border border-border/20 group-hover:bg-primary/2 transition-colors">
                          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">
                            Materials
                          </span>
                          <span className="text-lg font-black text-primary">
                            {Math.floor(Math.random() * 30) + 5}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button
                        variant="outline"
                        className="w-full rounded-xl h-11 font-black group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all text-xs uppercase tracking-widest"
                      >
                        Launch Dashboard
                        <HugeiconsIcon
                          icon={TradeUpIcon}
                          size={14}
                          className="ml-2"
                        />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Student Progress & Course Activity Section */}
      <motion.section
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        aria-labelledby="student-activity-title"
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2
              id="student-activity-title"
              className="text-2xl font-black text-foreground mb-2"
            >
              Student Dynamics
            </h2>
            <p className="text-base text-muted-foreground font-bold">
              Recent student progress and interactions across your courses.
            </p>
          </div>
          <Link href="/analytics">
            <Button
              variant="ghost"
              size="sm"
              className="font-black text-primary hover:bg-primary/5"
            >
              Full Activity Log
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1 border-border/40">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <HugeiconsIcon
                  icon={TradeUpIcon}
                  size={20}
                  className="text-primary"
                />
                Latest Engagements
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {[
                {
                  student: "Alice Smith",
                  action: "Completed 'Linear Algebra Module 3'",
                  time: "2 hours ago",
                  course: "MATH201",
                },
                {
                  student: "Bob Johnson",
                  action: "Submitted 'Physics Lab Report 1'",
                  time: "Yesterday",
                  course: "PHYS101",
                },
                {
                  student: "Charlie Brown",
                  action: "Viewed 'History of Art: Renaissance'",
                  time: "2 days ago",
                  course: "ART100",
                },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-4 p-3 rounded-xl bg-muted/20 border border-border/20"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {activity.student
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {activity.student}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-muted-foreground">
                      {activity.time}
                    </p>
                    <p className="text-xs font-bold text-primary">
                      {activity.course}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="col-span-1 border-border/40">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <HugeiconsIcon
                  icon={RefreshIcon}
                  size={20}
                  className="text-accent"
                />
                Course Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {[
                {
                  course: "MATH201 - Linear Algebra",
                  update: "New assignment 'Eigenvalues' posted.",
                  time: "1 day ago",
                },
                {
                  course: "CS305 - Data Structures",
                  update: "Lecture notes for 'Trees' updated.",
                  time: "3 days ago",
                },
                {
                  course: "PHYS101 - Intro to Physics",
                  update: "Lab session reschedule notice.",
                  time: "Last week",
                },
              ].map((update, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-4 p-3 rounded-xl bg-muted/20 border border-border/20"
                >
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">
                    <HugeiconsIcon icon={BookOpen01Icon} size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {update.course}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {update.update}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {update.time}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.section>
>>>>>>> origin/main
    </div>
  );
}
