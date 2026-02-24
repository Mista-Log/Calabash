"use client";

import React from "react";
<<<<<<< HEAD
import { motion } from "@/lib/motion-foundations";
import { Card, CardContent, M3Button } from "@/components/core";
=======
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  UserIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { Card, CardContent } from "@/components/core/card";
import { Button } from "@/components/core/button";
>>>>>>> origin/main
import { ProgressRing } from "@/components/core/progress-ring";
import Link from "next/link";
import { Course } from "@/services/api";

interface StudentCourseCardProps {
  course: Course;
  progress?: number;
}

export function StudentCourseCard({
  course,
  progress = 0,
}: StudentCourseCardProps) {
<<<<<<< HEAD
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Link href={`/courses/${course.id}`}>
        <Card className="group overflow-hidden border-[color:var(--md-sys-color-outline-variant)] transition-colors hover:border-[color:var(--md-sys-color-primary)] hover:bg-[color:var(--md-sys-color-surface-container-low)]">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded-full bg-[color:var(--md-sys-color-primary-container)] px-2 py-0.5 text-[13px] font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-primary-container)]">
                      Semester {course.semester}
                    </span>
                    <span className="font-mono text-[13px] font-semibold uppercase text-[color:var(--md-sys-color-on-surface-variant)]">
                      {course.code}
                    </span>
                  </div>
                  <h3 className="text-[20px] font-semibold leading-tight tracking-tight text-[color:var(--md-sys-color-on-surface)] transition-colors group-hover:text-[color:var(--md-sys-color-primary)]">
=======
  // Mock data for student view
  const materialCount = 12;
  const lecturer = "Dr. Robert Smith";

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link href={`/courses/${course.id}`}>
        <Card className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-muted/20 hover:border-primary/30 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Semester {course.semester}
                    </span>
                    <span className="font-mono text-sm font-semibold text-muted-foreground/40 uppercase">
                      {course.code}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
>>>>>>> origin/main
                    {course.title}
                  </h3>
                </div>
                <ProgressRing progress={progress} size="md" />
              </div>

<<<<<<< HEAD
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--md-sys-color-surface-container-high)] text-[13px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">
                    L
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--md-sys-color-on-surface-variant)]">
                      Lecturer
                    </p>
                    <p className="truncate text-[14px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                      {course.lecturerName || "TBD"}
=======
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground">
                    <HugeiconsIcon icon={UserIcon} size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground/40">
                      Lecturer
                    </p>
                    <p className="text-sm font-bold text-foreground truncate">
                      {lecturer}
>>>>>>> origin/main
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
<<<<<<< HEAD
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--md-sys-color-surface-container-high)] text-[13px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">
                    R
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--md-sys-color-on-surface-variant)]">
                      Resources
                    </p>
                    <p className="text-[14px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                      {course.materialCount || 0} Files
=======
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground">
                    <HugeiconsIcon icon={BookOpen01Icon} size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground/40">
                      Resources
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {materialCount} Files
>>>>>>> origin/main
                    </p>
                  </div>
                </div>
              </div>

<<<<<<< HEAD
              <div className="flex items-center justify-between border-t border-[color:var(--md-sys-color-outline-variant)] pt-4">
                <div className="text-[13px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                  Active 2h ago
                </div>
                <M3Button variant="text" size="sm" className="h-8 px-3 text-[13px]">
                  Open Module
                </M3Button>
              </div>
            </div>

            <div className="h-1.5 w-full bg-[color:var(--md-sys-color-surface-container-high)]">
              <motion.div
                className="h-full bg-[color:var(--md-sys-color-primary)]"
=======
              <div className="flex items-center justify-between pt-4 border-t border-muted/10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <HugeiconsIcon icon={Clock01Icon} size={14} />
                  <span className="text-sm font-semibold">Active 2h ago</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 rounded-lg font-bold text-sm gap-1.5 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  Open Module
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Button>
              </div>
            </div>

            <div className="h-1.5 w-full bg-muted/20">
              <motion.div
                className="h-full bg-primary"
>>>>>>> origin/main
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
