"use client";

import * as React from "react";
import {
  Search01Icon,
  FilterIcon,
  ArrowUpRight01Icon,
  Clock02Icon,
  PlusSignIcon,
  Mortarboard01Icon,
  BookOpen01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { CalabashApiService, DashboardData } from "@/services/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { MaterialShelf } from "@/components/scenes/MaterialShelf";
import { MaterialCard } from "@/components/library/MaterialCard";
import { UploadModal } from "@/components/modals/UploadModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Separator,
  Input,
} from "@/components/core";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";
import { fadeIn } from "@/lib/motion-variants";

export default function DashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const { reducedMotion } = useSettingsStore();

  const motionProps = reducedMotion ? { initial: false, animate: false } : {};

  React.useEffect(() => {
    CalabashApiService.getDashboardData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
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

  return (
    <MainLayout>
      <motion.div
        className="space-y-12"
        initial="initial"
        animate="animate"
        variants={fadeIn}
        {...motionProps}
      >
        {/* Welcome Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {data.user.name}
            </h1>
            <p className="text-muted-foreground">
              Continue your academic journey in {data.user.department}.
            </p>
          </div>
          <Button
            className="w-fit gap-2 shadow-lg shadow-primary/20"
            onClick={() => setIsUploadOpen(true)}
            icon={PlusSignIcon}
          >
            Upload Material
          </Button>
        </div>

        {/* 3D Material Shelf Integration */}
        <MaterialShelf materials={data.recentMaterials} />

        {/* Stats / Quick Actions Area */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Course Cards */}
          {data.courses.map((course) => (
            <div key={course.id}>
              <Card className="group relative overflow-hidden h-full">
                <div className="p-6 transition-transform group-hover:-translate-y-1">
                  <CardHeader className="p-0 pb-2">
                    <CardDescription className="text-primary/70 font-semibold">
                      {course.code}
                    </CardDescription>
                    <CardTitle className="text-lg leading-tight lg:text-xl">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <HugeiconsIcon icon={Clock02Icon} size={12} /> Updated 2
                      days ago
                    </div>
                  </CardContent>
                </div>
                <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={16}
                    className="text-primary"
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Main Interface Split */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Materials (Large) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Recent Materials
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    size={16}
                    className="absolute left-3 top-2.5 text-muted-foreground"
                  />
                  <Input
                    placeholder="Search materials..."
                    className="w-[200px] pl-10 h-10 bg-card md:w-[300px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <HugeiconsIcon icon={FilterIcon} size={18} />
                </Button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {data.recentMaterials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onView={(m) => console.warn("Viewing:", m.title)}
                />
              ))}
            </div>
          </div>

          {/* Activity / Sidebar Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              Department News
            </h2>
            <Card className="border-accent/30 bg-accent/5 backdrop-blur-sm shadow-none hover:shadow-none translate-y-0">
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-accent/20 flex items-center justify-center text-accent-foreground">
                    <HugeiconsIcon icon={Mortarboard01Icon} size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      Semester Registration
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Deadline for course registration is next Friday.
                    </p>
                    <span className="text-[10px] text-accent font-bold mt-2 block uppercase tracking-wider">
                      Important
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <HugeiconsIcon icon={BookOpen01Icon} size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      New Library Addition
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      "Advanced Database Systems" slides added by Dr. Okoro.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full text-xs text-muted-foreground underline"
                >
                  View all notifications
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </motion.div>
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </MainLayout>
  );
}
