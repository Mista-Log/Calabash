"use client";

import {
  Download01Icon,
  StarIcon,
  UserGroupIcon,
  Clock02Icon,
  File01Icon,
  Search01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  MessageQuestionIcon,
  Note01Icon,
  MegaphoneIcon,
} from "@hugeicons/core-free-icons";
import * as React from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Input,
} from "@/components/core";
import { CourseDetails, Material } from "@/services/api";
import { CourseContentSidebar } from "./CourseContentSidebar";
import { CourseQA } from "./CourseQA";
import { CourseNotes } from "./CourseNotes";
import { CourseAnnouncements } from "./CourseAnnouncements";

import Image from "next/image"; // Import Image component

interface StudentCourseViewProps {
  course: CourseDetails;
}

export function StudentCourseView({ course }: StudentCourseViewProps) {
  const [activeMaterialId, setActiveMaterialId] = React.useState(
    course.sections[0]?.materials[0]?.id,
  );
  const [completedMaterials, setCompletedMaterials] = React.useState<string[]>(
    [],
  );

  const toggleComplete = (id: string) => {
    setCompletedMaterials((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const isCompleted = activeMaterialId
    ? completedMaterials.includes(activeMaterialId)
    : false;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Video Player Section */}
        <div className="aspect-video w-full bg-black relative group">
          <iframe
            src={course.youtubeUrl}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {/* Mock Overlay Controls */}
          <div className="absolute top-6 left-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border-white/10 text-white"
            >
              <HugeiconsIcon icon={Download01Icon} size={20} />
            </Button>
            <Button
              onClick={() =>
                activeMaterialId && toggleComplete(activeMaterialId)
              }
              variant="secondary"
              size="icon"
              className={`h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border-white/10 transition-colors ${isCompleted ? "text-green-500" : "text-white"}`}
            >
              <HugeiconsIcon
                icon={isCompleted ? CheckmarkCircle02Icon : StarIcon}
                size={20}
              />
            </Button>
          </div>
        </div>

        {/* Course Info & Tabs */}
        <div className="px-10 py-10 space-y-10 max-w-5xl mx-auto">
          {/* Title & Lecturer info */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src={course.lecturer.avatar}
                    alt={course.lecturer.name}
                    width={48} // Explicit width
                    height={48} // Explicit height
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold text-foreground">
                    {course.lecturer.name}
                  </h4>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    {course.lecturer.role}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
                  {course.title}
                </h1>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                  <HugeiconsIcon
                    icon={Clock02Icon}
                    size={14}
                    className="text-muted-foreground/40"
                  />
                  <span>Last Updated: November 2029</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 bg-muted/5 border border-muted/10 p-6 rounded-2xl">
              <div className="text-center">
                <div className="flex items-center gap-1.5 justify-center mb-1">
                  <span className="text-lg font-bold">
                    {course.stats.rating}
                  </span>
                  <HugeiconsIcon
                    icon={StarIcon}
                    size={16}
                    className="text-amber-500"
                  />
                </div>
                <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest whitespace-nowrap">
                  {course.stats.totalRatings} Ratings
                </p>
              </div>
              <div className="h-8 w-px bg-muted/10" />
              <div className="text-center">
                <div className="text-lg font-bold mb-1">
                  {course.studentCount.toLocaleString()}
                </div>
                <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest whitespace-nowrap">
                  Students Enrolled
                </p>
              </div>
              <div className="h-8 w-px bg-muted/10" />
              <div className="text-center">
                <div className="text-lg font-bold mb-1">
                  {course.stats.duration}
                </div>
                <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest whitespace-nowrap">
                  Total Duration
                </p>
              </div>
              <div className="h-8 w-px bg-muted/10" />
              <div className="text-center">
                <div className="text-lg font-bold mb-1">
                  {course.materialCount}
                </div>
                <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest whitespace-nowrap">
                  Total Files
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <div className="flex items-center justify-between border-b border-muted/10 pb-1">
              <div className="relative group">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={16}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-colors group-focus-within:text-primary"
                />
                <input
                  placeholder="Search..."
                  className="pl-6 h-10 bg-transparent border-none text-sm font-medium focus:ring-0 w-32 focus:w-48 transition-all"
                />
              </div>
              <TabsList className="bg-transparent rounded-none h-12 p-0 gap-10">
                {[
                  {
                    id: "overview",
                    label: "Overview",
                    icon: InformationCircleIcon,
                  },
                  { id: "qa", label: "Q&A", icon: MessageQuestionIcon },
                  { id: "notes", label: "Notes", icon: Note01Icon },
                  {
                    id: "announcements",
                    label: "Updates",
                    icon: MegaphoneIcon,
                  },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-sm font-bold uppercase tracking-widest text-muted-foreground/50 data-[state=active]:text-foreground h-full transition-all px-0 flex items-center gap-2"
                  >
                    <HugeiconsIcon icon={tab.icon} size={14} />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent
              value="overview"
              className="mt-10 outline-none space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div className="space-y-6">
                <h3 className="text-xl font-bold tracking-tight">
                  About This Course
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed max-w-4xl text-lg">
                  {course.description}
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold tracking-tight">
                  Course Supplements
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {course.supplements.map((item) => (
                    <Card
                      key={item.id}
                      className="group hover:border-primary/20 hover:shadow-lg transition-all duration-300 border-muted/10 bg-card/50"
                    >
                      <CardContent className="p-6 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            <span>{item.size}</span>
                            <div className="h-1 w-1 rounded-full bg-muted/20" />
                            <span>{item.type}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-xl shrink-0 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                        >
                          <HugeiconsIcon icon={Download01Icon} size={18} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="qa" className="mt-10 outline-none">
              <CourseQA />
            </TabsContent>

            <TabsContent value="notes" className="mt-10 outline-none">
              <CourseNotes />
            </TabsContent>

            <TabsContent value="announcements" className="mt-10 outline-none">
              <CourseAnnouncements />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <CourseContentSidebar
        sections={course.sections}
        activeMaterialId={activeMaterialId}
        completedMaterials={completedMaterials}
      />
    </div>
  );
}
