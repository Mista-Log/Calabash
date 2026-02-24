"use client";

import React from "react";
import Link from "next/link";
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

  const lecturerStats = data.lecturerStats || {
    totalStudents: 0,
    totalUploads: 0,
    totalViews: 0,
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
                        {lecturerStats.trendingMaterial.title}
                      </p>
                    </div>
                  </div>

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
    </div>
  );
}
