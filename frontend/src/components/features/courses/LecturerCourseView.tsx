"use client";

import {
  BookOpen01Icon,
  UserGroupIcon,
  Analytics01Icon,
  CloudDownloadIcon,
} from "@/lib/icons/material-icons";
import * as React from "react";

import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Card,
  CardContent,
  Badge,
  M3Button,
} from "@/components/core";
import { CourseDetails } from "@/services/api";
import { DigitalLibrary } from "@/components/features/courses/DigitalLibrary";
import { CourseAnalytics } from "@/components/features/courses/CourseAnalytics";
import { StudentRoster } from "./StudentRoster";
import { ModuleEditor } from "./ModuleEditor";
import { downloadCsv } from "@/lib/csv";

interface LecturerCourseViewProps {
  course: CourseDetails;
}

export function LecturerCourseView({ course }: LecturerCourseViewProps) {
  const lecturerTabs = React.useMemo(
    () => [
      { id: "modules", label: "Course Modules" },
      { id: "library", label: "Digital Library" },
      { id: "analytics", label: "Analytics Insights" },
      { id: "participants", label: "Student Roster" },
    ],
    [],
  );
  const [activeTabIndex, setActiveTabIndex] = React.useState(1);
  const activeTabId =
    lecturerTabs[activeTabIndex]?.id ?? lecturerTabs[1]?.id ?? "library";

  const handleTabChange = React.useCallback(
    (event: React.FormEvent<HTMLElement>) => {
      const target = event.currentTarget as HTMLElement & {
        activeTabIndex?: number;
      };
      const nextIndex = target.activeTabIndex ?? 0;
      const boundedIndex = Math.max(0, Math.min(nextIndex, lecturerTabs.length - 1));
      setActiveTabIndex(boundedIndex);
    },
    [lecturerTabs.length],
  );

  const handleExportPerformance = React.useCallback(() => {
    const materialRows = course.modules.flatMap((module) =>
      module.materials.map((material) => ({
        module: module.title,
        title: material.title,
        type: material.type,
        uploads: material.uploadDate,
        visibility: material.visibility ?? "public",
      })),
    );

    const summaryRow = {
      module: "Course Summary",
      title: course.title,
      type: "summary",
      uploads: `${course.studentCount} enrolled`,
      visibility: `${course.materialCount} materials`,
    };

    const rows = materialRows.length > 0 ? materialRows : [summaryRow];
    downloadCsv(`${course.code.toLowerCase()}-performance.csv`, rows, [
      "module",
      "title",
      "type",
      "uploads",
      "visibility",
    ]);
  }, [course.code, course.materialCount, course.modules, course.studentCount, course.title]);

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="border-none bg-[color:var(--md-sys-color-tertiary-container)] text-[color:var(--md-sys-color-on-tertiary-container)] font-bold tracking-widest text-[13px]"
              >
                {course.code}
              </Badge>
              <Badge
                variant="outline"
                className="text-muted-foreground border-muted/20 font-bold text-[13px]"
              >
                SEMESTER {course.semester}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight sm:text-4xl">
              {course.title}
            </h1>
            <p className="max-w-3xl text-muted-foreground font-medium">
              {course.description}
            </p>
          </div>

          <M3Button
            onClick={handleExportPerformance}
            className="h-12 gap-2 px-6 font-bold transition-all"
          >
            <MaterialSymbol icon={CloudDownloadIcon} size={18} />
            Export Performance
          </M3Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)]">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <MaterialSymbol icon={UserGroupIcon} size={24} />
            </div>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground/50">
                Enrolled Students
              </p>
              <p className="text-2xl font-bold">
                {course.studentCount.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)]">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-tertiary-container)] text-[color:var(--md-sys-color-on-tertiary-container)]">
              <MaterialSymbol icon={BookOpen01Icon} size={24} />
            </div>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground/50">
                Total Materials
              </p>
              <p className="text-2xl font-bold">{course.materialCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)]">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
              <MaterialSymbol icon={Analytics01Icon} size={24} />
            </div>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground/50">
                Avg. Rating
              </p>
              <p className="text-2xl font-bold">
                {course.stats.rating}{" "}
                <span className="text-[14px] font-medium text-muted-foreground">
                  / 5.0
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <div className="w-full space-y-8">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <md-tabs
            active-tab-index={activeTabIndex}
            onChange={handleTabChange}
            className="course-tabs"
            aria-label="Lecturer course management sections"
          >
            {lecturerTabs.map((tab) => (
              <md-tab key={tab.id}>{tab.label}</md-tab>
            ))}
          </md-tabs>
        </div>

        {activeTabId === "modules" ? (
          <Card className="border-muted/10">
            <CardContent className="p-8">
              <ModuleEditor
                courseCode={course.code}
                initialModules={course.modules}
                onChange={() => {}}
              />
            </CardContent>
          </Card>
        ) : null}

        {activeTabId === "library" ? (
          <DigitalLibrary courseDetails={course} />
        ) : null}

        {activeTabId === "analytics" ? (
          <CourseAnalytics courseDetails={course} />
        ) : null}

        {activeTabId === "participants" ? (
          <StudentRoster />
        ) : null}
      </div>
    </div>
  );
}
