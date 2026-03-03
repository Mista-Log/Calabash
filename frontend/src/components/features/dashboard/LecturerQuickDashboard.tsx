"use client";

import * as React from "react";
import Link from "next/link";
import {
  Upload02Icon,
  CourseIcon,
  AnalyticsUpIcon,
  UserGroupIcon,
  PlusSignIcon,
  Download01Icon,
  ViewIcon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { Card, CardContent, M3Button, Badge } from "@/components/core";
import { useUserStore } from "@/store/useUserStore";
import { useCourseStore } from "@/store/useCourseStore";
import { cn } from "@/lib/utils";

interface LecturerDashboardProps {
  onQuickUpload?: () => void;
}

export function LecturerQuickDashboard({
  onQuickUpload,
}: LecturerDashboardProps) {
  const { user } = useUserStore();
  const { courses } = useCourseStore();

  const stats = React.useMemo(() => {
    const totalMaterials = courses.reduce(
      (sum, course: any) => sum + (course.materialCount || 0),
      0,
    );
    const totalStudents = courses.reduce(
      (sum, course: any) => sum + (course.enrollment || 0),
      0,
    );

    return {
      totalCourses: courses.length,
      totalMaterials,
      totalStudents,
      avgMaterialsPerCourse:
        courses.length > 0 ? Math.round(totalMaterials / courses.length) : 0,
    };
  }, [courses]);

  const recentCourses = courses.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
            Welcome back, {user?.name?.split(" ")[0] || "Lecturer"}!
          </h1>
          <p className="mt-1 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
            Here&apos;s what&apos;s happening with your courses today.
          </p>
        </div>
        <Link href="/upload">
          <M3Button className="gap-2 h-11 px-6">
            <MaterialSymbol icon={PlusSignIcon} size={18} />
            Quick Upload
          </M3Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CourseIcon}
          label="Active Courses"
          value={stats.totalCourses}
          trend="+2 this semester"
          color="primary"
        />
        <StatCard
          icon={ViewIcon}
          label="Total Materials"
          value={stats.totalMaterials}
          trend={`${stats.avgMaterialsPerCourse} avg per course`}
          color="secondary"
        />
        <StatCard
          icon={UserGroupIcon}
          label="Total Students"
          value={stats.totalStudents}
          trend="Across all courses"
          color="tertiary"
        />
        <StatCard
          icon={AnalyticsUpIcon}
          label="Avg Engagement"
          value="78%"
          trend="+12% from last week"
          color="success"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="border-b border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                Quick Actions
              </h2>
              <p className="text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                Common tasks for lecturers
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickActionButton
              icon={Upload02Icon}
              label="Upload Material"
              description="Add new course content"
              href="/upload"
              color="primary"
            />
            <QuickActionButton
              icon={CourseIcon}
              label="Manage Courses"
              description="View and edit courses"
              href="/courses"
              color="secondary"
            />
            <QuickActionButton
              icon={AnalyticsUpIcon}
              label="View Analytics"
              description="Check engagement metrics"
              href="/analytics"
              color="tertiary"
            />
            <QuickActionButton
              icon={UserGroupIcon}
              label="Student Roster"
              description="View enrolled students"
              href="/courses?tab=students"
              color="success"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Courses */}
      <Card>
        <CardHeader className="border-b border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                Your Courses
              </h2>
              <p className="text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                {recentCourses.length} active courses this semester
              </p>
            </div>
            <Link href="/courses">
              <M3Button variant="text" size="sm">
                View All
                <MaterialSymbol icon="arrow_forward" size={16} />
              </M3Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          {recentCourses.length > 0 ? (
            <div className="space-y-3">
              {recentCourses.map((course: any) => (
                <CourseRow key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[color:var(--md-sys-color-on-surface-variant)]">
              <MaterialSymbol
                icon={CourseIcon}
                size={48}
                className="mx-auto mb-3 opacity-50"
              />
              <p>No courses yet</p>
              <p className="text-[13px]">
                Create your first course to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  trend,
  color,
}: {
  icon: any;
  label: string;
  value: number | string;
  trend: string;
  color: "primary" | "secondary" | "tertiary" | "success";
}) {
  const colorClasses = {
    primary:
      "bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]",
    secondary:
      "bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]",
    tertiary:
      "bg-[color:var(--md-sys-color-tertiary-container)] text-[color:var(--md-sys-color-on-tertiary-container)]",
    success:
      "bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]",
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              colorClasses[color],
            )}
          >
            <MaterialSymbol icon={icon} size={24} />
          </div>
          <Badge variant="secondary" className="text-[11px]">
            <MaterialSymbol icon="trending_up" size={12} />
            +2.5%
          </Badge>
        </div>
        <div className="mt-4">
          <p className="text-[28px] font-bold text-[color:var(--md-sys-color-on-surface)]">
            {value}
          </p>
          <p className="mt-1 text-[13px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
            {label}
          </p>
          <p className="mt-1 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
            {trend}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Action Button
function QuickActionButton({
  icon,
  label,
  description,
  href,
  color,
}: {
  icon: any;
  label: string;
  description: string;
  href: string;
  color: "primary" | "secondary" | "tertiary" | "success";
}) {
  const colorClasses = {
    primary:
      "bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]",
    secondary:
      "bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]",
    tertiary:
      "bg-[color:var(--md-sys-color-tertiary-container)] text-[color:var(--md-sys-color-on-tertiary-container)]",
    success:
      "bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]",
  };

  return (
    <Link href={href}>
      <div className="group flex items-center gap-4 rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] p-4 transition-all hover:bg-[color:var(--md-sys-color-surface-container)] hover:shadow-md">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            colorClasses[color],
          )}
        >
          <MaterialSymbol icon={icon} size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-[color:var(--md-sys-color-on-surface)] group-hover:text-[color:var(--md-sys-color-primary)]">
            {label}
          </h3>
          <p className="mt-0.5 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
            {description}
          </p>
        </div>
        <MaterialSymbol
          icon="arrow_forward"
          size={18}
          className="text-[color:var(--md-sys-color-on-surface-variant)] opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>
    </Link>
  );
}

// Course Row Component
function CourseRow({ course }: { course: any }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] p-4 transition-colors hover:bg-[color:var(--md-sys-color-surface-container)]">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
          <MaterialSymbol icon={CourseIcon} size={24} />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
            {course.code}: {course.title}
          </h3>
          <p className="mt-0.5 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
            {course.enrollment || 0} students • {course.materialCount || 0}{" "}
            materials
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link href={`/courses/${course.id}`}>
          <M3Button variant="outlined" size="sm">
            View
          </M3Button>
        </Link>
        <Link href={`/courses/${course.id}?tab=analytics`}>
          <M3Button variant="text" size="sm">
            <MaterialSymbol icon={AnalyticsUpIcon} size={18} />
          </M3Button>
        </Link>
      </div>
    </div>
  );
}

// CardHeader helper
function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
