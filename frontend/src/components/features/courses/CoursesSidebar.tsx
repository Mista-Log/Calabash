"use client";

import React from "react";
<<<<<<< HEAD
import Link from "next/link";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Calendar01Icon,
  CheckmarkCircle01Icon,
  Clock02Icon,
  File02Icon,
  InformationCircleIcon,
  ViewIcon,
} from "@/lib/icons/material-icons";
import { Badge } from "@/components/core/badge";
import type { CourseSidebarFeed } from "@/types/courses";

type AppRole = "student" | "lecturer";

interface CoursesSidebarProps {
  role: AppRole;
  feed: CourseSidebarFeed;
}

const deadlineColorClass: Record<string, string> = {
  primary: "text-[color:var(--md-sys-color-primary)]",
  secondary: "text-[color:var(--md-sys-color-secondary)]",
  tertiary: "text-[color:var(--md-sys-color-tertiary)]",
  error: "text-[color:var(--md-sys-color-error)]",
};

const activityIconMap = {
  upload: File02Icon,
  progress: CheckmarkCircle01Icon,
  visibility: ViewIcon,
  announcement: InformationCircleIcon,
};

export function CoursesSidebar({ role, feed }: CoursesSidebarProps) {
  const deadlines = feed.deadlines ?? [];
  const recentActivity = feed.recentActivity ?? [];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-[16px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
            <MaterialSymbol
              icon={Calendar01Icon}
              size={16}
              className="text-[color:var(--md-sys-color-primary)]"
            />
            {role === "student" ? "Deadlines" : "Content Queue"}
          </h3>
          <Link
            href="/calendar"
            className="text-[12px] font-semibold uppercase tracking-wider text-[color:var(--md-sys-color-primary)] hover:underline"
=======
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock02Icon,
  Knowledge01Icon,
  Calendar01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  File02Icon,
} from "@hugeicons/core-free-icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/core/card";
import { ProgressRing } from "@/components/core/progress-ring";
import { Button } from "@/components/core/button";
import { Badge } from "@/components/core/badge";
import Link from "next/link";

export function CoursesSidebar() {
  const upcomingDeadlines = [
    {
      id: 1,
      title: "Data Structures Quiz",
      course: "CSC401",
      due: "Tomorrow, 10:00 AM",
      type: "assessment",
    },
    {
      id: 2,
      title: "AI Project Proposal",
      course: "CSC405",
      due: "Oct 25, 11:59 PM",
      type: "assignment",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      text: "Dr. Robert uploaded new notes for CSC401",
      time: "2 hours ago",
      icon: File02Icon,
    },
    {
      id: 2,
      text: "You completed 'Algorithm Basics' module",
      time: "Yesterday",
      icon: CheckmarkCircle01Icon,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Learning Goals - Removed as per user request (No Grading/GPA) */}

      {/* Upcoming Deadlines */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <HugeiconsIcon
              icon={Calendar01Icon}
              size={16}
              className="text-primary"
            />
            Deadlines
          </h3>
          <Link
            href="/calendar"
            className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
>>>>>>> origin/main
          >
            View All
          </Link>
        </div>
<<<<<<< HEAD

        <div className="space-y-3">
          {deadlines.length > 0 ? (
            deadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-3"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="h-5 border-none bg-[color:var(--md-sys-color-primary-container)] px-2 text-[11px] font-semibold text-[color:var(--md-sys-color-on-primary-container)]"
                  >
                    {deadline.courseCode}
                  </Badge>
                  <span
                    className={`text-[12px] font-semibold ${deadlineColorClass[deadline.color] ?? "text-[color:var(--md-sys-color-on-surface-variant)]"}`}
                  >
                    {deadline.due}
                  </span>
                </div>
                <p className="truncate text-[15px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                  {deadline.title}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
              No pending items. You are up to date.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-[16px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
          <MaterialSymbol
            icon={Clock02Icon}
            size={16}
            className="text-[color:var(--md-sys-color-primary)]"
          />
          Recent Activity
        </h3>

        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => {
              const icon = activityIconMap[activity.kind] ?? File02Icon;
              return (
                <div key={activity.id} className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface-variant)]">
                    <MaterialSymbol icon={icon} size={14} />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold leading-tight text-[color:var(--md-sys-color-on-surface)]">
                      {activity.text}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
              No recent activity yet.
            </div>
          )}
=======
        <div className="space-y-3">
          {upcomingDeadlines.map((deadline) => (
            <div
              key={deadline.id}
              className="p-3 rounded-xl border border-muted/20 bg-card hover:border-primary/30 transition-all group pointer-events-auto cursor-pointer"
            >
              <div className="flex items-start justify-between mb-1">
                <Badge
                  variant="outline"
                  className="text-[8px] font-black h-4 px-1.5 border-primary/20 bg-primary/5 text-primary"
                >
                  {deadline.course}
                </Badge>
                <span className="text-[9px] font-bold text-orange-500">
                  {deadline.due}
                </span>
              </div>
              <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                {deadline.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <HugeiconsIcon
            icon={Clock02Icon}
            size={16}
            className="text-primary"
          />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
                <HugeiconsIcon icon={activity.icon} size={12} />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground leading-tight">
                  {activity.text}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
>>>>>>> origin/main
        </div>
      </div>
    </div>
  );
}
