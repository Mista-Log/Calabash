"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { MaterialDetailPage } from "@/components/features/library/MaterialDetailPage";
import { useCourseStore } from "@/store/useCourseStore";
import { useUserStore } from "@/store/useUserStore";
import type { Material, CourseDetails } from "@/services/api";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";

export default function CourseMaterialPage() {
  const params = useParams();
  const { user } = useUserStore();
  const { courses, loadedContext } = useCourseStore();

  const courseId = params.id as string;
  const materialId = params.materialId as string;

  // Find course - cast to CourseDetails to access modules
  const course = React.useMemo(() => {
    return courses.find(c => c.id === courseId) as CourseDetails | undefined;
  }, [courses, courseId]);

  const material = React.useMemo((): Material | undefined => {
    if (!course) return undefined;
    
    // Search in course modules
    const allMaterials = course.modules?.flatMap(m => m.materials) || [];
    return allMaterials.find(m => m.id === materialId);
  }, [course, materialId]);

  const courseMaterials = React.useMemo((): Material[] => {
    if (!course) return [];
    return course.modules?.flatMap(m => m.materials) || [];
  }, [course]);

  // Loading state
  if (!course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--md-sys-color-primary)] border-t-transparent mx-auto mb-4" />
          <p className="text-[color:var(--md-sys-color-on-surface-variant)]">
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!material) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-full bg-[color:var(--md-sys-color-error-container)] flex items-center justify-center mx-auto mb-4">
            <MaterialSymbol icon="error" size={32} className="text-[color:var(--md-sys-color-on-error-container)]" />
          </div>
          <h1 className="text-[24px] font-semibold text-[color:var(--md-sys-color-on-surface)] mb-2">
            Material Not Found
          </h1>
          <p className="text-[14px] text-[color:var(--md-sys-color-on-surface-variant)] mb-6">
            This material may have been removed or is not available.
          </p>
          <a href={`/courses/${courseId}`} className="inline-block">
            <p className="text-[color:var(--md-sys-color-primary)] hover:underline">
              ← Back to Course
            </p>
          </a>
        </div>
      </div>
    );
  }

  return (
    <MaterialDetailPage
      material={material}
      courseMaterials={courseMaterials}
      courseTitle={course.title}
    />
  );
}
