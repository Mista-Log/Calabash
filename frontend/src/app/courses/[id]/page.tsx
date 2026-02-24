"use client";

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
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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
        </div>
      </MainLayout>
    );
  }

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
      </div>
    </MainLayout>
  );
}
