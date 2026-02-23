"use client";

import * as React from "react";
import Link from "next/link";
import {
  AnalyticsUpIcon,
  ArrowDown01Icon,
  ArrowUpRight01Icon,
  CourseIcon,
  Download01Icon,
  UserGroupIcon,
  ViewIcon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  M3Button,
} from "@/components/core";
import { downloadCsv } from "@/lib/csv";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useUserStore } from "@/store/useUserStore";
import { APP_PAGE_CONTAINER, APP_PAGE_SHELL, APP_SURFACE_CARD } from "@/lib/ui-sync";
import { cn } from "@/lib/utils";

const primaryColor = "var(--md-sys-color-primary)";
const tertiaryColor = "var(--md-sys-color-tertiary)";

function formatNumber(value: number): string {
  return value.toLocaleString();
}

export default function AnalyticsPage() {
  const { user, hasHydrated } = useUserStore();
  const { status, error, lecturerView, fetchDashboard, refresh } = useDashboardStore();

  React.useEffect(() => {
    if (!hasHydrated || !user || user.role !== "lecturer") {
      return;
    }

    if (!lecturerView && status !== "loading") {
      void fetchDashboard("lecturer", user.id);
    }
  }, [fetchDashboard, hasHydrated, lecturerView, status, user]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-[46vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--md-sys-color-primary)] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[920px] items-center justify-center px-4">
        <Card className={cn(APP_SURFACE_CARD, "w-full")}>
          <CardContent className="p-8 text-center">
            <h1 className="text-[24px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              Sign in to view analytics
            </h1>
            <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
              Analytics is available in authenticated lecturer mode.
            </p>
            <div className="m3-action-row mt-5 justify-center">
              <Link href="/auth/login">
                <M3Button layout="mobile-full">Go to Login</M3Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== "lecturer") {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[920px] items-center justify-center px-4">
        <Card className={cn(APP_SURFACE_CARD, "w-full")}>
          <CardContent className="p-8">
            <EmptyState
              icon={AnalyticsUpIcon}
              title="Analytics is lecturer-only"
              description="Student analytics is not enabled in this workspace yet."
              action={
                <Link href="/dashboard">
                  <M3Button layout="mobile-full">Back to Dashboard</M3Button>
                </Link>
              }
              className="py-8"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "loading" || (status === "idle" && !lecturerView)) {
    return (
      <div className="flex min-h-[46vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--md-sys-color-primary)] border-t-transparent" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[920px] items-center justify-center px-4">
        <Card className={cn(APP_SURFACE_CARD, "w-full")}>
          <CardContent className="p-8">
            <p className="text-[22px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              Unable to load analytics
            </p>
            <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
              {error ?? "Please retry to load lecturer metrics."}
            </p>
            <div className="m3-action-row mt-5">
              <M3Button
                variant="outlined"
                layout="mobile-full"
                onClick={() => void refresh("lecturer", user.id)}
              >
                Retry
              </M3Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lecturerView) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[920px] items-center justify-center px-4">
        <Card className={cn(APP_SURFACE_CARD, "w-full")}>
          <CardContent className="p-8">
            <EmptyState
              icon={AnalyticsUpIcon}
              title="No analytics available"
              description="Upload materials to start generating course insights."
              action={
                <Link href="/upload">
                  <M3Button layout="mobile-full">Open Upload Workbench</M3Button>
                </Link>
              }
              className="py-8"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = lecturerView.data.lecturerStats;
  const monthlyData = stats?.monthlyUploads ?? [];
  const courseData = stats?.courseEngagement ?? [];
  const exportRows = courseData.map((course) => ({
    course: course.name,
    engagement: course.engagement,
    metricValue: course.value,
  }));
  const handleExportCsv = () => {
    if (exportRows.length === 0) return;
    downloadCsv("lecturer-course-engagement.csv", exportRows, [
      "course",
      "engagement",
      "metricValue",
    ]);
  };

  const statCards = [
    {
      label: "Total Views",
      value: formatNumber(stats?.totalViews ?? 0),
      trend: "+12%",
      icon: ViewIcon,
    },
    {
      label: "Uploads",
      value: String(stats?.totalUploads ?? 0),
      trend: "+8%",
      icon: Download01Icon,
    },
    {
      label: "Active Students",
      value: formatNumber(stats?.totalStudents ?? 0),
      trend: "+5%",
      icon: UserGroupIcon,
    },
    {
      label: "Active Courses",
      value: String(stats?.activeCourses ?? 0),
      trend: "+2%",
      icon: CourseIcon,
    },
  ];

  return (
    <div className={APP_PAGE_SHELL}>
      <div className={cn(APP_PAGE_CONTAINER, "space-y-8")}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)]">
            Performance Analytics
          </h1>
          <p className="mt-1 text-[15px] text-[color:var(--md-sys-color-on-surface-variant)]">
            Track engagement trends for courses and materials.
          </p>
        </div>
        <M3Button
          variant="outlined"
          className="gap-2"
          onClick={handleExportCsv}
          disabled={exportRows.length === 0}
        >
          <MaterialSymbol icon={Download01Icon} size={16} />
          Export CSV
        </M3Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-[color:var(--md-sys-color-outline-variant)]">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
                  <MaterialSymbol icon={stat.icon} size={18} />
                </div>
                <Badge
                  variant="outline"
                  className="border-none bg-[color:var(--md-sys-color-secondary-container)] text-[11px] font-semibold text-[color:var(--md-sys-color-on-secondary-container)]"
                >
                  <MaterialSymbol icon={ArrowUpRight01Icon} size={12} className="mr-1" />
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--md-sys-color-on-surface-variant)]">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--md-sys-color-on-surface)]">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Card className="overflow-hidden border-[color:var(--md-sys-color-outline-variant)] xl:col-span-8">
          <CardHeader className="border-b border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
            <CardTitle className="text-[20px] font-semibold">Monthly Upload Trends</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {monthlyData.length > 0 ? (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="uploadArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={primaryColor} stopOpacity={0.28} />
                        <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--md-sys-color-outline-variant)"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--md-sys-color-on-surface-variant)", fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--md-sys-color-on-surface-variant)", fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid var(--md-sys-color-outline-variant)",
                        backgroundColor: "var(--md-sys-color-surface-container)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="uploads"
                      stroke={primaryColor}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#uploadArea)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={AnalyticsUpIcon}
                title="No upload trend data"
                description="Publish materials to generate monthly trend charts."
                className="py-10"
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-[color:var(--md-sys-color-outline-variant)] xl:col-span-4">
          <CardHeader>
            <CardTitle className="text-[20px] font-semibold">Top Resource</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.trendingMaterial ? (
              <div className="space-y-4 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-primary-container)] p-4">
                <h3 className="text-[17px] font-semibold text-[color:var(--md-sys-color-on-primary-container)]">
                  {stats.trendingMaterial.title}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <MetricBox label="Views" value={stats.trendingMaterial.views} />
                  <MetricBox label="Downloads" value={stats.trendingMaterial.downloads} />
                  <MetricBox label="Trend" value={`+${stats.trendingMaterial.trend}%`} />
                </div>
                <div className="rounded-xl bg-[color:var(--md-sys-color-surface-container)] px-3 py-2 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                  Peak activity generally occurs between 8PM and 11PM.
                </div>
              </div>
            ) : (
              <EmptyState
                icon={ArrowDown01Icon}
                title="No trending material yet"
                description="Usage ranking appears after learners engage with content."
                className="py-10"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-[color:var(--md-sys-color-outline-variant)]">
        <CardHeader className="border-b border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
          <CardTitle className="text-[20px] font-semibold">Course Engagement</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          {courseData.length > 0 ? (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--md-sys-color-outline-variant)"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--md-sys-color-on-surface-variant)", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--md-sys-color-on-surface-variant)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--md-sys-color-outline-variant)",
                      backgroundColor: "var(--md-sys-color-surface-container)",
                    }}
                  />
                  <Bar dataKey="engagement" radius={[8, 8, 0, 0]} fill={tertiaryColor} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={CourseIcon}
              title="No engagement metrics"
              description="Engagement bars appear once courses record learning activity."
              className="py-10"
            />
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-2.5 py-2">
      <p className="text-[16px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-[0.12em] text-[color:var(--md-sys-color-on-surface-variant)]">
        {label}
      </p>
    </div>
  );
}
