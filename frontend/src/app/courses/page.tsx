"use client";

import {
  Search01Icon,
  FilterIcon,
  BookOpen01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { CalabashApiService, Course } from "@/services/api";
import { LecturerCourseCard } from "@/components/features/courses/LecturerCourseCard";
import { StudentCourseCard } from "@/components/features/courses/StudentCourseCard";
import { EmptyCoursesState } from "@/components/features/courses/EmptyCoursesState";
import { CoursesSidebar } from "@/components/features/courses/CoursesSidebar";

import { SearchInput, Button, Badge } from "@/components/core";
import { MainLayout } from "@/components/layout/MainLayout";
import { useCourseStore } from "@/store/useCourseStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useUserStore } from "@/store/useUserStore";
import { AdvancedFilterPanel } from "@/components/features/library/AdvancedFilterPanel";
import { cn } from "@/lib/utils";

export default function CoursesPage() {
  const { courses, setCourses } = useCourseStore();
  const { query, setQuery, filters, clearFilters } = useSearchStore();
  const { user } = useUserStore();
  const [loading, setLoading] = React.useState(true);
  const [showFilters, setShowFilters] = React.useState(false);

  const role = user?.role || "student";

  React.useEffect(() => {
    async function loadData() {
      if (courses.length > 0) {
        setLoading(false);
        return;
      }

      try {
        const dashboardData = await CalabashApiService.getDashboardData();
        setCourses(dashboardData.courses);
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courses.length, setCourses]);

  // Apply filters and search
  const filteredCourses = React.useMemo(() => {
    let filtered = courses;

    // Text search
    if (query) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.code.toLowerCase().includes(query.toLowerCase()),
      );
    }

    // Semester filter
    if (filters.semesters.length > 0) {
      filtered = filtered.filter((course) =>
        filters.semesters.includes(course.semester),
      );
    }

    return filtered;
  }, [courses, query, filters]);

  const availableCourses = React.useMemo(
    () => Array.from(new Set(courses.map((c) => c.code))).sort(),
    [courses],
  );

  const activeFilterCount =
    filters.courses.length +
    filters.semesters.length +
    filters.materialTypes.length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground font-medium">
              Loading courses...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content (left 8/12) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Section */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                  <HugeiconsIcon icon={BookOpen01Icon} size={12} />
                  Academic Management
                </div>
                <h1 className="text-4xl font-black tracking-tight text-foreground">
                  {role === "lecturer"
                    ? "My Taught Courses"
                    : "My Enrolled Courses"}
                </h1>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-2xl">
                  {role === "lecturer"
                    ? "Manage modules, upload materials, and track student performance through your dedicated dashboard."
                    : "Access your lecture materials, track completion progress, and stay on top of your semester modules."}
                </p>
              </div>

              {role === "lecturer" && (
                <Link href="/courses/add">
                  <Button className="h-12 px-8 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                    <HugeiconsIcon icon={PlusSignIcon} size={20} />
                    Add Course
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-muted/10">
              <SearchInput
                placeholder="Search courses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 w-full sm:w-auto h-12 rounded-xl"
              />
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "h-12 px-6 rounded-xl gap-2 font-bold transition-all",
                    showFilters && "shadow-lg shadow-primary/20",
                  )}
                >
                  <HugeiconsIcon icon={FilterIcon} size={18} />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-primary-foreground text-primary border-none h-5 min-w-5 p-0 flex items-center justify-center text-xs font-black"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <AdvancedFilterPanel
                  availableCourses={availableCourses}
                  onClose={() => setShowFilters(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filter Badges */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-1">
                Active:
              </span>
              {filters.semesters.map((sem) => (
                <Badge
                  key={`sem-${sem}`}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 font-bold gap-2 pl-3 pr-2 py-1 rounded-lg"
                >
                  Semester {sem}
                  <button
                    onClick={() =>
                      useSearchStore.getState().toggleSemester(sem)
                    }
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs font-black uppercase tracking-widest h-7"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Courses List */}
          <div className="pt-4">
            {filteredCourses.length > 0 ? (
              <div
                className={cn(
                  "flex flex-col gap-4",
                  role === "student" && "grid grid-cols-1 md:grid-cols-2 gap-6",
                )}
              >
                {filteredCourses.map((course) =>
                  role === "lecturer" ? (
                    <LecturerCourseCard key={course.id} course={course} />
                  ) : (
                    <StudentCourseCard
                      key={course.id}
                      course={course}
                      progress={Math.floor(Math.random() * 80) + 10}
                    />
                  ),
                )}
              </div>
            ) : (
              <EmptyCoursesState role={role} />
            )}
          </div>
        </div>

        {/* Sidebar (right 4/12) */}
        <aside className="lg:col-span-4 space-y-8">
          <CoursesSidebar />
        </aside>
      </div>
    </MainLayout>
  );
}
