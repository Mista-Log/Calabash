"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, BookOpen01Icon } from "@hugeicons/core-free-icons";

import { CalabashApiService, DashboardData } from "@/services/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { UploadModal } from "@/components/modals/UploadModal";
import { Button } from "@/components/core";
import { StatPill } from "@/components/core/stat-pill";
import { useSettingsStore } from "@/store/useSettingsStore";
import { fadeIn } from "@/lib/motion-variants";
import { useUserStore } from "@/store/useUserStore";
import { useCourseStore } from "@/store/useCourseStore";
import { useLibraryStore } from "@/store/useLibraryStore";

const StudentDashboard = dynamic(
  () =>
    import("@/components/dashboard/StudentDashboard").then(
      (mod) => mod.StudentDashboard,
    ),
  {
    loading: () => <DashboardSkeleton />,
  },
);

const LecturerDashboard = dynamic(
  () =>
    import("@/components/dashboard/LecturerDashboard").then(
      (mod) => mod.LecturerDashboard,
    ),
  {
    loading: () => <DashboardSkeleton />,
  },
);

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted/10 rounded-lg" />
          <div className="h-4 w-64 bg-muted/10 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-muted/10 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/10 rounded-3xl" />
        ))}
      </div>
      <div className="h-[400px] bg-muted/10 rounded-3xl" />
    </div>
  );
}

export default function DashboardPage() {
  const { user, login } = useUserStore();
  const { courses, setCourses } = useCourseStore();
  const { materials, setMaterials } = useLibraryStore();

  const [loading, setLoading] = React.useState(true);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const { reducedMotion } = useSettingsStore();

  const motionProps = reducedMotion ? { initial: false, animate: false } : {};

  React.useEffect(() => {
    async function loadData() {
      // If we have user, courses, and materials, we might not need to fetch.
      if (user && courses.length > 0 && materials.length > 0) {
        setLoading(false);
        return;
      }

      try {
        const res = await CalabashApiService.getDashboardData();

        // Only set if not already set to preserve local changes
        if (!user) login(res.user, "mock-session-token");
        if (courses.length === 0) setCourses(res.courses);
        if (materials.length === 0) setMaterials(res.recentMaterials);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, courses.length, materials.length, login, setCourses, setMaterials]);

  // Construct the data object expected by children components
  const dashboardData: DashboardData | null = user
    ? {
        user: user,
        courses: courses,
        recentMaterials: materials,
        // Mock stats based on role
        lecturerStats:
          user.role === "lecturer"
            ? {
                totalStudents: 1240,
                totalUploads: materials.length,
                totalViews: 8200,
                activeCourses: courses.length,
                trendingMaterial: {
                  title: materials[0]?.title || "N/A",
                  views: 125,
                  downloads: 45,
                  trend: 12,
                },
              }
            : undefined,
        studentStats:
          user.role === "student"
            ? {
                gpa: "3.92",
                attendance: "94%",
                upcomingDeadlines: [
                  {
                    title: "Database Systems Project",
                    due: "Tomorrow",
                    color: "orange",
                  },
                  {
                    title: "Algorithm Analysis Quiz",
                    due: "2 days",
                    color: "sage",
                  },
                ],
              }
            : undefined,
      }
    : null;

  if (loading || !dashboardData) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground font-medium">
              Brewing your library...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isLecturer = dashboardData.user.role === "lecturer";

  return (
    <MainLayout>
      <motion.div
        className="space-y-10"
        initial="initial"
        animate="animate"
        variants={fadeIn}
        {...motionProps}
      >
        {/* Header Section */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {isLecturer
                  ? `Management Center`
                  : `Welcome back, ${dashboardData.user.name.split(" ")[0]}`}
              </h1>
              <p className="text-muted-foreground font-medium">
                {isLecturer
                  ? `Oversee your courses and materials in ${dashboardData.user.department}.`
                  : `Continue your academic journey in ${dashboardData.user.department}.`}
              </p>
            </div>
            <Button
              className="w-fit gap-2 shadow-lg shadow-primary/20 rounded-xl"
              onClick={() => setIsUploadOpen(true)}
              icon={PlusSignIcon}
            >
              Upload Material
            </Button>
          </div>

          {/* Stat Pills Header */}
          <div className="flex flex-wrap items-center gap-4">
            {isLecturer ? (
              <>
                <StatPill
                  label="Students"
                  value={dashboardData.lecturerStats?.totalStudents || 0}
                  variant="primary"
                />
                <StatPill
                  label="Uploads"
                  value={dashboardData.lecturerStats?.totalUploads || 0}
                  variant="accent"
                />
                <StatPill
                  label="Views"
                  value={dashboardData.lecturerStats?.totalViews || 0}
                  variant="default"
                />
              </>
            ) : (
              <>
                <StatPill
                  label="GPA"
                  value={dashboardData.studentStats?.gpa || "0.00"}
                  variant="primary"
                />
                <StatPill
                  label="Attendance"
                  value={dashboardData.studentStats?.attendance || "0%"}
                  variant="accent"
                />
                <StatPill
                  label="Courses"
                  value={dashboardData.courses.length}
                  variant="default"
                />
              </>
            )}
          </div>
        </div>

        {/* Role-Based Dashboard Content */}
        {isLecturer ? (
          <LecturerDashboard data={dashboardData} />
        ) : (
          <StudentDashboard data={dashboardData} />
        )}
      </motion.div>
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </MainLayout>
  );
}
