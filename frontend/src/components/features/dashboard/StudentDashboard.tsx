"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mortarboard01Icon,
  Clock02Icon,
  ArrowUpRight01Icon,
  BookOpen01Icon,
  VideoReplayIcon,
  FileZipIcon,
  PdfIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/core/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/core/card";
import { Timeline } from "@/components/core/timeline";
import { ProgressRing } from "@/components/core/progress-ring";
import { DashboardData } from "@/services/api";
import { useSettingsStore } from "@/store/useSettingsStore";

interface StudentDashboardProps {
  data: DashboardData;
}

const materialIcons: Record<string, any> = {
  pdf: PdfIcon,
  video: VideoReplayIcon,
  "past-question": BookOpen01Icon,
  zip: FileZipIcon,
};

export function StudentDashboard({ data }: StudentDashboardProps) {
  const { reducedMotion } = useSettingsStore();
  const [searchQuery] = useState("");

  const filteredMaterials = data.recentMaterials.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.courseCode.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Mock progress data - in real implementation, this would come from API
  const courseProgress = {
    [data.courses[0]?.id]: 45,
    [data.courses[1]?.id]: 78,
    [data.courses[2]?.id]: 23,
  };

  return (
    <div className="space-y-12">
      {/* Hero Section: Continue Learning + Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Continue Learning (60% -> 7 cols) */}
        {data.courses.length > 0 && (
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <Card className="h-full border border-primary/10 shadow-xl shadow-primary/5 bg-linear-to-br from-primary/3 via-background to-accent/3 relative overflow-hidden group">
              <div
                className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-[12rem] font-black hidden lg:block origin-top-right transform-gpu rotate-12"
                aria-hidden="true"
              >
                🎓
              </div>

              <CardHeader className="relative z-10">
                <CardTitle className="text-xs font-black text-primary/60 uppercase tracking-[0.2em] flex items-center justify-between">
                  <span>Resume Progress</span>
                  <span className="text-primary bg-primary/10 px-3 py-1 rounded-full text-xs ring-1 ring-primary/20">
                    {data.courses[0].code}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-8 relative z-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight text-balance">
                    {data.courses[0].title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm font-bold">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted/50">
                      <HugeiconsIcon
                        icon={Mortarboard01Icon}
                        size={14}
                        className="text-primary"
                      />
                      Semester {data.courses[0].semester}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted/50">
                      <HugeiconsIcon
                        icon={Clock02Icon}
                        size={14}
                        className="text-primary"
                      />
                      2h remaining
                    </span>
                  </div>
                </div>

                {/* Course Info Card */}
                <div className="p-6 rounded-2xl bg-background/40 backdrop-blur-md border border-white/20 shadow-sm space-y-4 ring-1 ring-black/5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center text-primary-foreground text-xl font-black">
                        <HugeiconsIcon icon={BookOpen01Icon} size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-primary/40 uppercase tracking-widest">
                          Next Up
                        </p>
                        <p className="text-base font-bold text-foreground leading-none mt-1">
                          Trees & Graphs
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                        Module 4
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        Advanced Structures
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/courses/${data.courses[0].id}`}
                  className="block"
                  aria-label={`Resume learning ${data.courses[0].title}`}
                >
                  <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                    Start Learning
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
        )}

        {/* Upcoming & Overdue (40% -> 5 cols) */}
        {data.studentStats?.upcomingDeadlines && (
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <Card className="h-full border border-border/60 shadow-lg bg-muted/5 flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  Critical Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-3">
                  {data.studentStats.upcomingDeadlines.map((item, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left p-4 rounded-xl border border-border/40 hover:border-primary/40 bg-background hover:bg-primary/2 transition-all group shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Deadline for ${item.title} due ${item.due}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-10 w-1 min-w-[4px] rounded-full",
                            item.color === "orange"
                              ? "bg-orange-500"
                              : item.color === "sage"
                                ? "bg-accent"
                                : "bg-primary",
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5 font-bold uppercase tracking-wider">
                            Due {item.due}
                          </p>
                        </div>
                        <HugeiconsIcon
                          icon={ArrowUpRight01Icon}
                          size={14}
                          className="text-muted-foreground group-hover:text-primary transition-colors"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Link href="/calendar" className="block">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl font-black border-primary/10 hover:bg-primary/5 text-xs uppercase tracking-widest h-11"
                  >
                    View Schedule
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* My Courses Section */}
      <motion.section
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        aria-labelledby="my-courses-title"
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2
              id="my-courses-title"
              className="text-2xl font-black text-foreground mb-2"
            >
              Academic Focus
            </h2>
            <p className="text-base text-muted-foreground font-bold">
              Enrolled courses for Semester {data.user.semester}
            </p>
          </div>
          <Link href="/courses">
            <Button
              variant="ghost"
              size="sm"
              className="font-black text-primary hover:bg-primary/5"
            >
              Browse All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.courses.map((course, idx) => {
            const progress =
              courseProgress[course.id as keyof typeof courseProgress] || 0;
            return (
              <motion.div
                key={course.id}
                initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
              >
                <Link
                  href={`/courses/${course.id}`}
                  aria-label={`View ${course.title}`}
                >
                  <Card className="h-full hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer group border border-border/60 hover:border-primary/40 bg-background/40 hover:-translate-y-1">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex-1">
                          <div className="text-xs font-black text-primary mb-2 uppercase tracking-[0.2em]">
                            {course.code}
                          </div>
                          <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors leading-tight text-pretty">
                            {course.title}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-auto pt-6 border-t border-border/40">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-black text-xs text-primary/60 uppercase tracking-widest">
                            {Math.floor(Math.random() * 20) + 5} Resources
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-primary">
                              {progress}%
                            </span>
                          </div>
                        </div>
                        {/* Linear Progress Bar */}
                        <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden mb-6">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>

                        <Button
                          variant="subtle"
                          className="w-full rounded-xl h-11 font-black group-hover:bg-primary group-hover:text-primary-foreground transition-all text-xs uppercase tracking-widest"
                        >
                          Launch Module
                          <HugeiconsIcon
                            icon={ArrowUpRight01Icon}
                            size={14}
                            className="ml-2"
                          />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Recent Materials Timeline */}
      <motion.section
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        aria-labelledby="recent-materials-title"
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2
              id="recent-materials-title"
              className="text-2xl font-black text-foreground mb-2"
            >
              Learning Log
            </h2>
            <p className="text-base text-muted-foreground font-bold">
              Your most recent material interactions
            </p>
          </div>
          <Link href="/library">
            <Button
              variant="ghost"
              size="sm"
              className="font-black text-primary hover:bg-primary/5"
            >
              All Library Items
            </Button>
          </Link>
        </div>

        <Card className="border-border/40">
          <CardContent className="p-6">
            <Timeline
              items={filteredMaterials.slice(0, 5).map((material) => {
                const Icon = materialIcons[material.type] || PdfIcon;
                return {
                  id: material.id,
                  title: material.title,
                  description: material.courseCode,
                  date: new Date(material.uploadDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    },
                  ),
                  icon: (
                    <HugeiconsIcon
                      icon={Icon}
                      size={18}
                      className="text-primary"
                    />
                  ),
                  metadata: `Uploaded by ${material.uploader}`,
                  action: (
                    <Link href={`/library/${material.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-bold text-sm h-9 px-4"
                      >
                        Open
                      </Button>
                    </Link>
                  ),
                };
              })}
            />

            {filteredMaterials.length === 0 && (
              <div className="text-center py-12">
                <HugeiconsIcon
                  icon={BookOpen01Icon}
                  size={36}
                  className="mx-auto text-muted-foreground/40 mb-4"
                />
                <p className="text-lg font-bold text-muted-foreground">
                  No materials found
                </p>
                <p className="text-sm text-muted-foreground/60 mt-2">
                  Check back later for new uploads
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
