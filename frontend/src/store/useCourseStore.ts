<<<<<<< HEAD
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Course } from "@/services/api";

type CourseStatus = "idle" | "loading" | "success" | "error";
type AppRole = "student" | "lecturer";

interface LoadedCourseContext {
  userId: string;
  role: AppRole;
}

type MaterialCompletionMap = Record<string, Record<string, string[]>>;

interface CourseState {
  courses: Course[];
  status: CourseStatus;
  error: string | null;
  loadedContext: LoadedCourseContext | null;
  courseProgress: Record<string, number>;
  materialCompletion: MaterialCompletionMap;
  setCourses: (courses: Course[]) => void;
  hydrateForContext: (
    context: LoadedCourseContext,
    courses: Course[],
    courseProgress: Record<string, number>,
  ) => void;
  resetForContext: () => void;
  setCourseProgress: (courseProgress: Record<string, number>) => void;
  setLoading: () => void;
  setError: (error: string) => void;
  clearError: () => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  removeCourse: (id: string) => void;
  toggleMaterialCompletion: (
    userId: string,
    courseId: string,
    materialId: string,
  ) => void;
  getCompletedMaterials: (userId: string, courseId: string) => string[];
}

const initialState = {
  courses: [] as Course[],
  status: "idle" as CourseStatus,
  error: null as string | null,
  loadedContext: null as LoadedCourseContext | null,
  courseProgress: {} as Record<string, number>,
  materialCompletion: {} as MaterialCompletionMap,
};

function dedupeCourses(courses: Course[]): Course[] {
  const courseMap = new Map<string, Course>();
  for (const course of courses) {
    courseMap.set(
      course.id,
      courseMap.has(course.id)
        ? { ...courseMap.get(course.id), ...course }
        : course,
    );
  }
  return Array.from(courseMap.values());
=======
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Course } from '@/services/api';

interface CourseState {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  removeCourse: (id: string) => void;
>>>>>>> origin/main
}

export const useCourseStore = create<CourseState>()(
  persist(
<<<<<<< HEAD
    (set, get) => ({
      ...initialState,

      setCourses: (courses) =>
        set((state) => ({
          ...state,
          courses: dedupeCourses(courses),
          status: "success",
          error: null,
        })),

      hydrateForContext: (context, courses, courseProgress) =>
        set((state) => ({
          ...state,
          courses: dedupeCourses(courses),
          courseProgress: { ...courseProgress },
          loadedContext: context,
          status: "success",
          error: null,
        })),

      resetForContext: () =>
        set((state) => ({
          ...state,
          courses: [],
          loadedContext: null,
          courseProgress: {},
          status: "idle",
          error: null,
        })),

      setCourseProgress: (courseProgress) =>
        set((state) => ({
          ...state,
          courseProgress: { ...courseProgress },
          status: state.status === "idle" ? "success" : state.status,
        })),

      setLoading: () =>
        set((state) => ({
          ...state,
          status: "loading",
          error: null,
        })),

      setError: (error) =>
        set((state) => ({
          ...state,
          status: "error",
          error,
        })),

      clearError: () =>
        set((state) => ({
          ...state,
          error: null,
          status: state.status === "error" ? "idle" : state.status,
        })),

      addCourse: (course) =>
        set((state) => ({
          ...state,
          courses: dedupeCourses([course, ...state.courses]),
          status: "success",
          error: null,
        })),

      updateCourse: (id, updates) =>
        set((state) => ({
          ...state,
          courses: state.courses.map((course) =>
            course.id === id ? { ...course, ...updates } : course,
          ),
          status: "success",
          error: null,
        })),

      removeCourse: (id) =>
        set((state) => ({
          ...state,
          courses: state.courses.filter((course) => course.id !== id),
          status: "success",
          error: null,
        })),

      toggleMaterialCompletion: (userId, courseId, materialId) =>
        set((state) => {
          const userMap = state.materialCompletion[userId] ?? {};
          const completed = userMap[courseId] ?? [];
          const nextCompleted = completed.includes(materialId)
            ? completed.filter((id) => id !== materialId)
            : [...completed, materialId];

          return {
            ...state,
            materialCompletion: {
              ...state.materialCompletion,
              [userId]: {
                ...userMap,
                [courseId]: nextCompleted,
              },
            },
          };
        }),

      getCompletedMaterials: (userId, courseId) =>
        get().materialCompletion[userId]?.[courseId] ?? [],
    }),
    {
      name: "calabash-course-storage",
      partialize: (state) => ({
        courses: state.courses,
        loadedContext: state.loadedContext,
        courseProgress: state.courseProgress,
        materialCompletion: state.materialCompletion,
      }),
    },
  ),
=======
    (set) => ({
      courses: [],
      setCourses: (courses) => set({ courses }),
      addCourse: (course) => set((state) => ({ courses: [course, ...state.courses] })),
      updateCourse: (id, updates) =>
        set((state) => ({
          courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      removeCourse: (id) =>
        set((state) => ({ courses: state.courses.filter((c) => c.id !== id) })),
    }),
    {
      name: 'calabash-course-storage',
    }
  )
>>>>>>> origin/main
);
