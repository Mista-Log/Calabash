"use client";

import React from "react";
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
          >
            View All
          </Link>
        </div>
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
        </div>
      </div>
    </div>
  );
}
