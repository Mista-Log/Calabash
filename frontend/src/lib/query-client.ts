/**
 * TanStack Query Client Configuration for Calabash
 * Provides caching, background refetch, and request deduplication
 */

import { QueryClient, keepPreviousData } from '@tanstack/react-query';

// Query keys factory for type-safe query keys
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },
  
  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    byUser: (userId: string, role: string) => 
      [...queryKeys.dashboard.all, userId, role] as const,
  },
  
  // Courses
  courses: {
    all: ['courses'] as const,
    list: (filters?: { role?: string; semester?: number }) => 
      [...queryKeys.courses.all, 'list', filters] as const,
    detail: (courseId: string) => 
      [...queryKeys.courses.all, 'detail', courseId] as const,
    progress: (userId: string) => 
      [...queryKeys.courses.all, 'progress', userId] as const,
  },
  
  // Library/Materials
  library: {
    all: ['library'] as const,
    list: (filters?: { courseCode?: string; type?: string }) => 
      [...queryKeys.library.all, 'list', filters] as const,
    detail: (materialId: string) => 
      [...queryKeys.library.all, 'detail', materialId] as const,
  },
  
  // Notes
  notes: {
    all: ['notes'] as const,
    list: (userId: string, role: string) => 
      [...queryKeys.notes.all, userId, role] as const,
    detail: (noteId: string) => 
      [...queryKeys.notes.all, 'detail', noteId] as const,
  },
  
  // Calendar
  calendar: {
    all: ['calendar'] as const,
    events: (userId: string, month?: string) => 
      [...queryKeys.calendar.all, 'events', userId, month] as const,
  },
  
  // Analytics
  analytics: {
    all: ['analytics'] as const,
    lecturer: (userId: string) => 
      [...queryKeys.analytics.all, 'lecturer', userId] as const,
  },
};

// Query client configuration
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Timing
        staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 min
        gcTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 min (formerly cacheTime)
        retry: 2, // Retry failed requests twice
        
        // Behavior
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnReconnect: true, // Refetch on reconnect
        refetchOnMount: false, // Don't refetch on mount (use stale data)
        
        // Performance
        placeholderData: keepPreviousData, // Show previous data while loading
        notifyOnChangeProps: 'all', // Optimize re-renders
      },
      mutations: {
        retry: 1, // Retry mutations once
      },
    },
  });
};

// Singleton query client for SSR
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new query client
    return createQueryClient();
  } else {
    // Browser: use singleton pattern to avoid creating multiple clients
    if (!browserQueryClient) {
      browserQueryClient = createQueryClient();
    }
    return browserQueryClient;
  }
}
