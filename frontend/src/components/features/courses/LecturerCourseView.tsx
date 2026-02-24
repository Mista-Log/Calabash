"use client";

import {
  BookOpen01Icon,
  UserGroupIcon,
  Analytics01Icon,
<<<<<<< HEAD
  CloudDownloadIcon,
} from "@/lib/icons/material-icons";
import * as React from "react";

import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Card,
  CardContent,
  Badge,
  M3Button,
=======
  Settings02Icon,
  InformationCircleIcon,
  CloudDownloadIcon,
} from "@hugeicons/core-free-icons";
import * as React from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
>>>>>>> origin/main
} from "@/components/core";
import { CourseDetails } from "@/services/api";
import { DigitalLibrary } from "@/components/features/courses/DigitalLibrary";
import { CourseAnalytics } from "@/components/features/courses/CourseAnalytics";
import { StudentRoster } from "./StudentRoster";
<<<<<<< HEAD
import { ModuleEditor } from "./ModuleEditor";
import { downloadCsv } from "@/lib/csv";
import { APP_SURFACE_CARD } from "@/lib/ui-sync";
import { cn } from "@/lib/utils";
=======
>>>>>>> origin/main

interface LecturerCourseViewProps {
  course: CourseDetails;
}

export function LecturerCourseView({ course }: LecturerCourseViewProps) {
<<<<<<< HEAD
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
      <div className={cn(APP_SURFACE_CARD, "p-5 sm:p-7")}>
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
=======
  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="bg-[#f59e0b]/10 text-[#f59e0b] border-none font-bold tracking-widest text-xs"
            >
              {course.code}
            </Badge>
            <Badge
              variant="outline"
              className="text-muted-foreground border-muted/20 font-bold text-xs"
            >
              SEMESTER {course.semester}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight uppercase">
            {course.title}
          </h1>
          <p className="text-muted-foreground font-medium max-w-2xl">
            {course.description}
          </p>
        </div>

        <Button
          onClick={() => {
            // Simulate export
            alert("Performance report downloading...");
          }}
          className="h-12 px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all gap-2"
        >
          <HugeiconsIcon icon={CloudDownloadIcon} size={18} />
          Export Performance
        </Button>
>>>>>>> origin/main
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
<<<<<<< HEAD
        <Card className={APP_SURFACE_CARD}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <MaterialSymbol icon={UserGroupIcon} size={24} />
            </div>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground/50">
=======
        <Card className="border-muted/10 bg-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <HugeiconsIcon icon={UserGroupIcon} size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
>>>>>>> origin/main
                Enrolled Students
              </p>
              <p className="text-2xl font-bold">
                {course.studentCount.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
<<<<<<< HEAD
        <Card className={APP_SURFACE_CARD}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-tertiary-container)] text-[color:var(--md-sys-color-on-tertiary-container)]">
              <MaterialSymbol icon={BookOpen01Icon} size={24} />
            </div>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground/50">
=======
        <Card className="border-muted/10 bg-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b]">
              <HugeiconsIcon icon={BookOpen01Icon} size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
>>>>>>> origin/main
                Total Materials
              </p>
              <p className="text-2xl font-bold">{course.materialCount}</p>
            </div>
          </CardContent>
        </Card>
<<<<<<< HEAD
        <Card className={APP_SURFACE_CARD}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
              <MaterialSymbol icon={Analytics01Icon} size={24} />
            </div>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground/50">
=======
        <Card className="border-muted/10 bg-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
              <HugeiconsIcon icon={Analytics01Icon} size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
>>>>>>> origin/main
                Avg. Rating
              </p>
              <p className="text-2xl font-bold">
                {course.stats.rating}{" "}
<<<<<<< HEAD
                <span className="text-[14px] font-medium text-muted-foreground">
=======
                <span className="text-sm font-medium text-muted-foreground">
>>>>>>> origin/main
                  / 5.0
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
<<<<<<< HEAD
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
=======
      <Tabs defaultValue="library" className="w-full">
        <TabsList className="bg-transparent border-b border-muted/10 rounded-none h-14 p-0 gap-8 mb-8">
          {[
            { id: "library", label: "Digital Library", icon: BookOpen01Icon },
            {
              id: "analytics",
              label: "Analytics Insights",
              icon: Analytics01Icon,
            },
            {
              id: "participants",
              label: "Student Roster",
              icon: UserGroupIcon,
            },
          ].map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm font-bold uppercase tracking-widest text-muted-foreground/50 data-[state=active]:text-foreground h-full transition-all flex items-center gap-2"
            >
              <HugeiconsIcon icon={tab.icon} size={16} />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="library" className="mt-0 outline-none">
          <DigitalLibrary courseDetails={course} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-0 outline-none">
          <CourseAnalytics courseDetails={course} />
        </TabsContent>

        <TabsContent value="participants" className="mt-0 outline-none">
          <StudentRoster />
        </TabsContent>
      </Tabs>
>>>>>>> origin/main
    </div>
  );
}
