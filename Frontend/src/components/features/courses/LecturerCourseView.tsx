"use client";

import {
  BookOpen01Icon,
  UserGroupIcon,
  Analytics01Icon,
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
} from "@/components/core";
import { CourseDetails } from "@/services/api";
import { DigitalLibrary } from "@/components/features/courses/DigitalLibrary";
import { CourseAnalytics } from "@/components/features/courses/CourseAnalytics";
import { StudentRoster } from "./StudentRoster";

interface LecturerCourseViewProps {
  course: CourseDetails;
}

export function LecturerCourseView({ course }: LecturerCourseViewProps) {
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
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-muted/10 bg-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <HugeiconsIcon icon={UserGroupIcon} size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                Enrolled Students
              </p>
              <p className="text-2xl font-bold">
                {course.studentCount.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-muted/10 bg-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b]">
              <HugeiconsIcon icon={BookOpen01Icon} size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                Total Materials
              </p>
              <p className="text-2xl font-bold">{course.materialCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-muted/10 bg-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
              <HugeiconsIcon icon={Analytics01Icon} size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                Avg. Rating
              </p>
              <p className="text-2xl font-bold">
                {course.stats.rating}{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  / 5.0
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
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
    </div>
  );
}
