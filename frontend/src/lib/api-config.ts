/**
 * API Configuration for Calabash
 * Central place to manage API base URL and endpoints
 * 
 * TO UPDATE WHEN BACKEND IS READY:
 * 1. Update API_BASE_URL to production URL
 * 2. Set ENABLE_MOCK_DATA to false
 * 3. Implement real API calls in repository files
 */

export const API_CONFIG = {
  // Backend API URL - UPDATE THIS when backend is ready
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://calabash-n9hz.onrender.com',
  
  // Mock Data Toggle - Set to false when backend is ready
  ENABLE_MOCK_DATA: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true' || 
                    process.env.NODE_ENV === 'development',
  
  // API Timeouts
  REQUEST_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 2,
  
  // Feature flags for gradual backend rollout
  FEATURES: {
    DASHBOARD_API: false, // Set to true when dashboard API is ready
    COURSES_API: false,   // Set to true when courses API is ready
    MATERIALS_API: false, // Set to true when materials API is ready
    AUTH_API: false,      // Set to true when auth API is ready
    ANALYTICS_API: false, // Set to true when analytics API is ready
  },
} as const;

// API Endpoints - Organized by feature
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login/',
    SIGNUP: '/api/auth/signup/',
    LOGOUT: '/api/auth/logout/',
    ME: '/api/auth/me/',
    REFRESH: '/api/auth/token/refresh/',
    PASSWORD_RESET: '/api/auth/password/reset/',
  },
  
  // Dashboard
  DASHBOARD: {
    OVERVIEW: '/api/dashboard/',
    STATS: '/api/dashboard/stats/',
  },
  
  // Courses
  COURSES: {
    LIST: '/api/courses/',
    DETAIL: (id: string) => `/api/courses/${id}/`,
    MATERIALS: (id: string) => `/api/courses/${id}/materials/`,
    STUDENTS: (id: string) => `/api/courses/${id}/students/`,
    ANALYTICS: (id: string) => `/api/courses/${id}/analytics/`,
  },
  
  // Materials
  MATERIALS: {
    LIST: '/api/materials/',
    DETAIL: (id: string) => `/api/materials/${id}/`,
    UPLOAD: '/api/materials/upload/',
    UPDATE: (id: string) => `/api/materials/${id}/`,
    DELETE: (id: string) => `/api/materials/${id}/`,
    DOWNLOAD: (id: string) => `/api/materials/${id}/download/`,
  },
  
  // Library
  LIBRARY: {
    LIST: '/api/library/',
    SEARCH: '/api/library/search/', 
  },
  
  // Notes
  NOTES: {
    LIST: '/api/notes/',
    CREATE: '/api/notes/',
    UPDATE: (id: string) => `/api/notes/${id}/`,
    DELETE: (id: string) => `/api/notes/${id}/`,
  },
  
  // Calendar
  CALENDAR: {
    EVENTS: '/api/calendar/events/',
    CREATE: '/api/calendar/events/',
    UPDATE: (id: string) => `/api/calendar/events/${id}/`,
    DELETE: (id: string) => `/api/calendar/events/${id}/`,
  },
  
  // Analytics
  ANALYTICS: {
    OVERVIEW: '/api/analytics/',
    COURSE_ENGAGEMENT: (id: string) => `/api/analytics/courses/${id}/`,
    MATERIAL_VIEWS: (id: string) => `/api/analytics/materials/${id}/views/`,
    STUDENT_PROGRESS: (id: string) => `/api/analytics/students/${id}/progress/`,
  },
  
  // Users
  USERS: {
    PROFILE: '/api/users/profile/',
    UPDATE: '/api/users/profile/',
    LECTURERS: '/api/users/lecturers/',
    STUDENTS: '/api/users/students/',
  },
} as const;

/**
 * Helper to check if a feature should use real API or mock
 */
export function shouldUseRealAPI(feature: keyof typeof API_CONFIG.FEATURES): boolean {
  return API_CONFIG.FEATURES[feature] && !API_CONFIG.ENABLE_MOCK_DATA;
}

/**
 * Helper to get API URL with base
 */
export function getAPIUrl(endpoint: string): string {
  return `${API_CONFIG.API_BASE_URL}${endpoint}`;
}

/**
 * Environment info for debugging
 */
export const ENV_INFO = {
  NODE_ENV: process.env.NODE_ENV,
  API_BASE_URL: API_CONFIG.API_BASE_URL,
  ENABLE_MOCK_DATA: API_CONFIG.ENABLE_MOCK_DATA,
  FEATURES: API_CONFIG.FEATURES,
} as const;

// Log configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('[API Config]', ENV_INFO);
}
