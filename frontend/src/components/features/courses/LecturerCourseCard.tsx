"use client";

<<<<<<< HEAD
import * as React from "react";
import Link from "next/link";
import { Course } from "@/services/api";
import { Card, CardContent, M3Button } from "@/components/core";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { APP_SURFACE_CARD } from "@/lib/ui-sync";
import { cn } from "@/lib/utils";
import { UploadModal } from "@/components/features/library/UploadModal";
=======
import {
  UserGroupIcon,
  BookOpen01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import * as React from "react";
import Link from "next/link";

import { HugeiconsIcon } from "@hugeicons/react";
import { Course } from "@/services/api";
import { Card, CardContent, Button } from "@/components/core";
>>>>>>> origin/main

interface LecturerCourseCardProps {
  course: Course;
}

export function LecturerCourseCard({ course }: LecturerCourseCardProps) {
<<<<<<< HEAD
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

  return (
    <>
      <Card
        className={cn(
          APP_SURFACE_CARD,
          "group transition-colors hover:border-[color:var(--md-sys-color-primary)] hover:bg-[color:var(--md-sys-color-surface-container-low)]",
        )}
      >
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

          <div className="flex shrink-0 items-center gap-2">
            <M3Button
              variant="outlined"
              onClick={() => setIsUploadOpen(true)}
              className="h-11 gap-2 px-4 font-medium"
            >
              <MaterialSymbol icon="upload_file" size={18} />
              Upload
            </M3Button>
            <Link href={`/courses/${course.id}`}>
              <M3Button className="h-11 gap-2 px-6 font-medium">Manage Course</M3Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        preselectedCourseCode={course.code}
      />
    </>
=======
  // Mock additional data for lecturer view
  const enrollment = 420; // This would normally come from the API
  const resources = 15;

  return (
    <Card className="group border-muted/20 bg-card hover:border-primary/50 transition-all duration-300">
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-6">
        {/* Left Side: Course Info */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-sm font-bold uppercase tracking-widest text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded-full">
              Semester {course.semester}
            </span>
            <span className="font-mono text-sm font-semibold text-muted-foreground/40 uppercase tracking-tighter">
              {course.code}
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
            {course.title}
          </h3>
        </div>

        {/* Middle Section: Stats */}
        <div className="flex items-center gap-8 px-6 md:border-x border-muted/10">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground/40">
              Students
            </span>
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={UserGroupIcon}
                size={14}
                className="text-primary/60"
              />
              <span className="text-lg font-bold">
                {enrollment.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground/40">
              Resources
            </span>
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={BookOpen01Icon}
                size={14}
                className="text-primary/60"
              />
              <span className="text-lg font-bold">{resources}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Action */}
        <div className="shrink-0">
          <Link href={`/courses/${course.id}`}>
            <Button className="px-6 h-11 font-bold gap-2 group/btn shadow-sm">
              Manage Course
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                className="transition-transform group-hover/btn:translate-x-1"
              />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
>>>>>>> origin/main
  );
}
