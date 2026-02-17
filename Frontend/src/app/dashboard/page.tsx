"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, BookOpen01Icon } from "@hugeicons/core-free-icons";

import { CalabashApiService, DashboardData } from "@/services/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { UploadModal } from "@/components/features/library/UploadModal";
import { Button } from "@/components/core";
import { StatPill } from "@/components/core/stat-pill";
import { useSettingsStore } from "@/store/useSettingsStore";
import { fadeIn } from "@/lib/motion-variants";
import { useUserStore } from "@/store/useUserStore";
import { useCourseStore } from "@/store/useCourseStore";
import { useLibraryStore } from "@/store/useLibraryStore";

const StudentDashboard = dynamic(
  () =>
    import("@/components/features/dashboard/StudentDashboard").then(
      (mod) => mod.StudentDashboard,
    ),
  {
    loading: () => <DashboardSkeleton />,
  },
);

const LecturerDashboard = dynamic(
  () =>
    import("@/components/features/dashboard/LecturerDashboard").then(
      (mod) => mod.LecturerDashboard,
    ),
  {
    loading: () => <DashboardSkeleton />,
  },
);

function DashboardSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-muted/20 rounded-lg" />
            <div className="h-6 w-96 bg-muted/20 rounded-lg" />
          </div>
          <div className="h-14 w-48 bg-muted/20 rounded-2xl" />
        </div>
        <div className="flex flex-wrap items-center gap-4 p-2 rounded-3xl bg-muted/10 w-fit">
          <div className="h-20 w-32 bg-muted/20 rounded-2xl" />
          <div className="h-20 w-32 bg-muted/20 rounded-2xl" />
          <div className="h-20 w-32 bg-muted/20 rounded-2xl" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 h-[300px] bg-muted/20 rounded-2xl" />
        <div className="lg:col-span-5 h-[300px] bg-muted/20 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-60 bg-muted/20 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, login, updateUser } = useUserStore();
  const { courses, setCourses } = useCourseStore();
  const { materials, setMaterials } = useLibraryStore();

  const [showWelcome, setShowWelcome] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const { reducedMotion } = useSettingsStore();

  const motionProps = reducedMotion ? { initial: false, animate: false } : {};

  React.useEffect(() => {
    if (user?.isNewUser) {
      setShowWelcome(true);
      updateUser({ isNewUser: false });
    }
  }, [user, updateUser]);

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
        if (!user) {
          // In a real app, we'd redirect to /auth if no user is found
          // For now, we'll just not call login with a mock token
        }
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
        className="space-y-12"
        initial="initial"
        animate="animate"
        variants={fadeIn}
        {...motionProps}
      >
        {/* Header Section */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground text-balance">
                {isLecturer
                  ? `Faculty Dashboard`
                  : `${showWelcome ? "Welcome" : "Academic Overview"}, ${(() => {
                      const nameParts =
                        dashboardData.user.name?.split(" ") || [];
                      return nameParts.length > 1
                        ? nameParts[1]
                        : nameParts[0] || "User";
                    })()}`}
              </h1>
              <p className="text-muted-foreground font-bold text-lg max-w-2xl leading-relaxed">
                {isLecturer
                  ? `Oversee your courses and academic materials for ${dashboardData.user.department}.`
                  : `Resume your educational journey and track your progress in ${dashboardData.user.department}.`}
              </p>
            </div>
            {isLecturer && (
              <Button
                className="w-full md:w-fit h-14 px-8 gap-3 shadow-2xl shadow-primary/30 rounded-2xl text-base font-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setIsUploadOpen(true)}
                icon={PlusSignIcon}
              >
                Upload New Material
              </Button>
            )}
          </div>

          {/* Stat Pills Header */}
          <div className="flex flex-wrap items-center gap-4 bg-muted/5 p-2 rounded-3xl border border-border/40 w-fit">
            {isLecturer ? (
              <>
                <StatPill
                  label="Enrolled Students"
                  value={dashboardData.lecturerStats?.totalStudents || 0}
                  variant="primary"
                />
                <StatPill
                  label="Digital Assets"
                  value={dashboardData.lecturerStats?.totalUploads || 0}
                  variant="accent"
                />
                <StatPill
                  label="Global Reach"
                  value={dashboardData.lecturerStats?.totalViews || 0}
                  variant="default"
                />
              </>
            ) : (
              <>
                <StatPill
                  label="Active Courses"
                  value={dashboardData.courses.length}
                  variant="primary"
                />
                <StatPill label="Resources Used" value="12" variant="accent" />
                <StatPill label="Bookmarks" value="5" variant="default" />
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
      {isLecturer && (
        <UploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
        />
      )}
    </MainLayout>
  );
}
