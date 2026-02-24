"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AddCourseWizard } from "@/components/features/courses/AddCourseWizard";
import { MainLayout } from "@/components/layout/MainLayout";
import { useCourseStore } from "@/store/useCourseStore";
import { Course } from "@/services/api";

export default function AddCoursePage() {
  const router = useRouter();
  const { addCourse } = useCourseStore();

  const handleAddCourseSuccess = (courseData: any) => {
    // Map wizard data to Course interface
    const newCourse: Course = {
      id: "c-" + Math.random().toString(36).substr(2, 6),
      title: courseData.title,
      code: courseData.code,
      semester: courseData.semester === "Semester 1" ? 1 : 2,
    };

    addCourse(newCourse);
    router.push("/courses");
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <AddCourseWizard
          isOpen={true}
          onClose={() => router.push("/courses")}
          onSuccess={handleAddCourseSuccess}
          isFullPage={true}
        />
      </div>
    </MainLayout>
  );
}
