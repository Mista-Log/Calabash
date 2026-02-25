/**
 * Custom Hooks for TanStack Query
 * Type-safe data fetching with caching and background updates
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { dashboardRepository } from '@/services/dashboard.repository';
import { courseRepository } from '@/services/course.repository';
import type { DashboardData, Material, UserProfile } from '@/services/api';
import type { CourseDetailViewModel, CourseListViewModel, CourseRepoResult } from '@/types/courses';
import type { NotesRole, NoteEntity } from '@/types/notes';

// ============================================================================
// Dashboard Hooks
// ============================================================================

export function useDashboard(
  role: 'student' | 'lecturer',
  userId: string,
  options?: Omit<
    UseQueryOptions<DashboardData, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: queryKeys.dashboard.byUser(userId, role),
    queryFn: async () => {
      const result = await dashboardRepository.getDashboard(role, userId);
      return result.raw;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes for dashboard
    ...options,
  });
}

// ============================================================================
// Courses Hooks
// ============================================================================

export function useCourses(
  role: 'student' | 'lecturer',
  userId: string,
  options?: Omit<
    UseQueryOptions<CourseListViewModel, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: queryKeys.courses.list({ role }),
    queryFn: async () => {
      const result = await courseRepository.getCoursesForUser(role, userId);
      if (!result.ok) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId,
    ...options,
  });
}

export function useCourseDetail(
  courseId: string,
  role: 'student' | 'lecturer',
  userId: string,
  options?: Omit<
    UseQueryOptions<CourseDetailViewModel, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: queryKeys.courses.detail(courseId),
    queryFn: async () => {
      const result = await courseRepository.getCourseDetails(courseId, role, userId);
      if (!result.ok) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!courseId && !!userId,
    ...options,
  });
}

export function useUpdateCourseProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      courseId, 
      progress 
    }: { 
      userId: string; 
      courseId: string; 
      progress: number;
    }) => {
      // Optimistic update
      queryClient.setQueryData(
        queryKeys.courses.progress(userId),
        (old: Record<string, number> = {}) => ({
          ...old,
          [courseId]: progress,
        })
      );
      
      // In real implementation, this would call API
      return { userId, courseId, progress };
    },
    onSuccess: () => {
      // Invalidate to refetch if needed
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.courses.list() 
      });
    },
  });
}

// ============================================================================
// Library/Materials Hooks
// ============================================================================

export function useLibraryMaterials(
  filters?: { courseCode?: string; type?: string },
  options?: Omit<
    UseQueryOptions<Material[], Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: queryKeys.library.list(filters),
    queryFn: async () => {
      // In real implementation, this would call API
      // For now, return empty array
      return [];
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useMaterialDetail(
  materialId: string,
  options?: Omit<
    UseQueryOptions<Material, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: queryKeys.library.detail(materialId),
    queryFn: async () => {
      // In real implementation, this would call API
      throw new Error('Not implemented');
    },
    enabled: !!materialId,
    ...options,
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (material: Partial<Material>) => {
      // In real implementation, this would call API
      const newMaterial: Material = {
        id: `mat-${Math.random().toString(36).slice(2, 9)}`,
        title: material.title || 'Untitled',
        courseCode: material.courseCode || 'UNKNOWN',
        type: material.type || 'pdf',
        semester: material.semester || 1,
        uploadDate: new Date().toISOString(),
        url: material.url || '#',
        uploader: material.uploader || 'User',
        visibility: material.visibility || 'public',
      };
      return newMaterial;
    },
    onMutate: async (newMaterial) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.library.list() 
      });
      
      // Snapshot previous value
      const previousMaterials = queryClient.getQueryData<Material[]>(
        queryKeys.library.list()
      );
      
      // Optimistically update
      if (previousMaterials) {
        queryClient.setQueryData(
          queryKeys.library.list(),
          [newMaterial as Material, ...previousMaterials]
        );
      }
      
      return { previousMaterials };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousMaterials) {
        queryClient.setQueryData(
          queryKeys.library.list(),
          context.previousMaterials
        );
      }
    },
    onSuccess: () => {
      // Invalidate to refetch
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.library.list() 
      });
    },
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<Material>;
    }) => {
      // In real implementation, this would call API
      return { id, updates };
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.library.list() 
      });
      
      const previousMaterials = queryClient.getQueryData<Material[]>(
        queryKeys.library.list()
      );
      
      if (previousMaterials) {
        queryClient.setQueryData(
          queryKeys.library.list(),
          previousMaterials.map(m => 
            m.id === id ? { ...m, ...updates, lastEditedAt: new Date().toISOString() } : m
          )
        );
      }
      
      return { previousMaterials };
    },
    onError: (err, variables, context) => {
      if (context?.previousMaterials) {
        queryClient.setQueryData(
          queryKeys.library.list(),
          context.previousMaterials
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.library.list()
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.library.detail(undefined as any)
      });
    },
  });
}

// ============================================================================
// Notes Hooks
// ============================================================================

export function useNotes(
  userId: string,
  role: NotesRole,
  options?: Omit<
    UseQueryOptions<NoteEntity[], Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: queryKeys.notes.list(userId, role),
    queryFn: async () => {
      // In real implementation, this would call API
      // For now, return empty array
      return [] as NoteEntity[];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
    ...options,
  });
}

// ============================================================================
// Calendar Hooks
// ============================================================================

export function useCalendarEvents(
  userId: string,
  month?: string,
  options?: Omit<
    UseQueryOptions<any[], Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: queryKeys.calendar.events(userId, month),
    queryFn: async () => {
      // In real implementation, this would call API
      return [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for calendar
    enabled: !!userId,
    ...options,
  });
}
