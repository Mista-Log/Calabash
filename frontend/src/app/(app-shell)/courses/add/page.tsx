"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AddCourseWizard,
  type AddCourseWizardData,
} from "@/components/features/courses/AddCourseWizard";
import { useCourseStore } from "@/store/useCourseStore";
import { Course } from "@/services/api";

export default function AddCoursePage() {
  const router = useRouter();
  const { addCourse } = useCourseStore();

  const handleAddCourseSuccess = (courseData: AddCourseWizardData) => {
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
    
      <div className="bg-background">
        <AddCourseWizard
          isOpen={true}
          onClose={() => router.push("/courses")}
          onSuccess={handleAddCourseSuccess}
          isFullPage={true}
        />
      </div>
    
  );
}

