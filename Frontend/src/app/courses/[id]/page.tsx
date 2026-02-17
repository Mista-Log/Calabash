"use client";

import {
  BookOpen01Icon,
  UserGroupIcon,
  ArrowLeft01Icon,
  Analytics01Icon,
  Settings02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
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
import { CalabashApiService, CourseDetails } from "@/services/api";
import { LecturerCourseView } from "@/components/features/courses/LecturerCourseView";
import { StudentCourseView } from "@/components/features/courses/StudentCourseView";

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = React.useState<CourseDetails | null>(null);
  const [userRole, setUserRole] = React.useState<"student" | "lecturer" | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [details, dashboard] = await Promise.all([
          CalabashApiService.getCourseDetails(id as string),
          CalabashApiService.getDashboardData(),
        ]);
        setCourse(details);
        setUserRole(dashboard.user.role);
      } catch (error) {
        console.error("Failed to load course details:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading || !course || !userRole) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-10">
          <div className="h-8 w-48 bg-muted/20 rounded-full" />
          <div className="h-32 w-full bg-muted/10 rounded-2xl" />
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted/5 rounded-xl" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  const isLecturer = userRole === "lecturer";

  return (
    <MainLayout>
      <div
        className={isLecturer ? "max-w-7xl mx-auto space-y-10" : "max-w-none"}
      >
        {/* Navigation - Only show for Lecturer (Student view has intrinsic navigation) */}
        {isLecturer && (
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="group gap-2 font-bold text-muted-foreground hover:text-primary transition-colors p-0 h-auto"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Courses
          </Button>
        )}

        {isLecturer ? (
          <LecturerCourseView course={course} />
        ) : (
          <StudentCourseView course={course} />
        )}
      </div>
    </MainLayout>
  );
}
