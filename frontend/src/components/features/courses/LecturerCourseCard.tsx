"use client";

import * as React from "react";
import Link from "next/link";
import { Course } from "@/services/api";
import { Card, CardContent, M3Button } from "@/components/core";

interface LecturerCourseCardProps {
  course: Course;
}

export function LecturerCourseCard({ course }: LecturerCourseCardProps) {
  return (
    <Card className="group border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)] transition-colors hover:border-[color:var(--md-sys-color-primary)] hover:bg-[color:var(--md-sys-color-surface-container-low)]">
      <CardContent className="flex flex-col gap-6 p-4 md:flex-row md:items-center">
        <div className="flex-1 space-y-1">
          <div className="mb-1 flex items-center gap-3">
            <span className="rounded-full bg-[color:var(--md-sys-color-primary-container)] px-2 py-0.5 text-[13px] font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-primary-container)]">
              Semester {course.semester}
            </span>
            <span className="font-mono text-[13px] font-semibold uppercase tracking-tighter text-[color:var(--md-sys-color-on-surface-variant)]">
              {course.code}
            </span>
          </div>
          <h3 className="text-[20px] font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)] transition-colors group-hover:text-[color:var(--md-sys-color-primary)]">
            {course.title}
          </h3>
        </div>

        <div className="flex items-center gap-8 px-6 md:border-x md:border-[color:var(--md-sys-color-outline-variant)]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-surface-variant)]">
              Students
            </span>
            <span className="text-[18px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              {(course.enrollment || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-surface-variant)]">
              Resources
            </span>
            <span className="text-[18px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              {course.materialCount || 0}
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <Link href={`/courses/${course.id}`}>
            <M3Button className="h-11 gap-2 px-6">Manage Course</M3Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
