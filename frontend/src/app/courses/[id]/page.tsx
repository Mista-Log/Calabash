"use client";

<<<<<<< HEAD
import * as React from "react";
import { useParams } from "next/navigation";
import {
  BookOpen01Icon,
  UserGroupIcon,
  Calendar01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { MaterialCard } from "@/components/library/MaterialCard";
=======
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
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
import {
  Button,
  Card,
  CardContent,
<<<<<<< HEAD
  CardDescription,
  CardHeader,
  CardTitle,
=======
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
<<<<<<< HEAD
} from "@/components/core";
import { CalabashApiService, Material, Course } from "@/services/api";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = React.useState<Course | null>(null);
  const [materials, setMaterials] = React.useState<Material[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    CalabashApiService.getDashboardData().then((data) => {
      const foundCourse =
        data.courses.find((c) => c.id === id) || data.courses[0];
      setCourse(foundCourse);
      setMaterials(
        data.recentMaterials.filter((m) => m.courseCode === foundCourse.code),
      );
      setLoading(false);
    });
  }, [id]);

  if (loading || !course) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-48 bg-accent/20 rounded" />
          <div className="h-32 w-full bg-accent/10 rounded-xl" />
=======
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
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
        </div>
      </MainLayout>
    );
  }

<<<<<<< HEAD
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-primary">
                {course.code}
              </span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span className="text-sm text-muted-foreground">
                Semester {course.semester}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Course Info Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-primary/5 border-primary/20 shadow-none hover:shadow-none translate-y-0">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary">
                <HugeiconsIcon icon={UserGroupIcon} size={16} />
                <CardDescription className="text-primary/70 font-semibold">
                  Instructor
                </CardDescription>
              </div>
              <CardTitle className="text-lg">Dr. Samuel Okoro</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-accent/5 border-accent/20 shadow-none hover:shadow-none translate-y-0">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-accent-foreground">
                <HugeiconsIcon icon={BookOpen01Icon} size={16} />
                <CardDescription className="font-semibold text-accent-foreground/70">
                  Materials
                </CardDescription>
              </div>
              <CardTitle className="text-lg">
                {materials.length} Resources
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-muted/5 border-muted-foreground/20 shadow-none hover:shadow-none translate-y-0">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <HugeiconsIcon icon={Calendar01Icon} size={16} />
                <CardDescription className="font-semibold">
                  Next Lecture
                </CardDescription>
              </div>
              <CardTitle className="text-lg">Tomorrow, 10:00 AM</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {materials.map((m) => (
                <MaterialCard
                  key={m.id}
                  material={m}
                  onView={(mat) => console.warn("Viewing:", mat.title)}
                />
              ))}
              {materials.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl">
                  <p className="text-muted-foreground">
                    No materials uploaded for this course yet.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="syllabus" className="mt-6">
            <Card className="shadow-none hover:shadow-none translate-y-0">
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Detailed syllabus tracking coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
=======
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
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
      </div>
    </MainLayout>
  );
}
