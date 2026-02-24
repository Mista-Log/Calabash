import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Course } from '@/services/api';

interface CourseState {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  removeCourse: (id: string) => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
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
);
