/**
 * =============================================================================
 * API RESPONSE TYPES
 * =============================================================================
 * 
 * FOR BACKEND ENGINEERS:
 * These are standardized response formats that the frontend expects.
 * All API endpoints should follow these patterns for consistency.
 * 
 * STANDARD RESPONSE STRUCTURE:
 * - Success: { success: true, data: T, timestamp, requestId }
 * - Error: { success: false, error: { code, message, details } }
 * - Paginated: { results: T[], count, next, previous, page, pageSize }
 */

import type {
  Material,
  Course,
  CourseDetails,
  UserProfile,
  LecturerStats,
  StudentStats,
  StudentGamificationProfile,
  DashboardData,
} from "@/services/api";

// =============================================================================
// GENERIC RESPONSE TYPES (All endpoints should follow this pattern)
// =============================================================================

/**
 * Success response wrapper
 * Backend: Use this structure for all successful API responses
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;      // ISO 8601 format
  requestId: string;      // For logging/debugging
}

/**
 * Error response wrapper
 * Backend: Use this structure for all error responses
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;         // Machine-readable error code
    message: string;      // Human-readable message
    details?: Record<string, string[]>;  // Field-specific errors
    field?: string;       // Single field error (alternative to details)
  };
  timestamp: string;
  requestId: string;
}

/**
 * Combined response type (success OR error)
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Paginated response for list endpoints
 * Backend: Use for endpoints that return multiple items
 */
export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;    // URL to next page (null if last page)
  previous: string | null; // URL to previous page (null if first page)
  page: number;
  pageSize: number;
  totalPages: number;
}

// =============================================================================
// COURSE API RESPONSES
/*
 * Endpoints: /api/courses/, /api/courses/:id/, etc.
 * =============================================================================
 */

/**
 * Response for GET /api/courses/
 */
export interface CourseListResponse {
  courses: Course[];
  total: number;
  semester?: number;      // If filtered by semester
  department?: string;    // If filtered by department
}

/**
 * Response for GET /api/courses/:id/
 * Includes enrollment status and user-specific data
 */
export interface CourseDetailsResponse extends CourseDetails {
  isEnrolled: boolean;    // Whether current user is enrolled
  isFavorite: boolean;    // Whether user favorited this course
  lastAccessedAt?: string; // Last time user accessed this course
  bookmarks: string[];    // IDs of bookmarked materials
}

/**
 * Request for POST /api/courses/:id/enroll/
 */
export interface CourseEnrollmentRequest {
  courseId: string;
  userId: string;
}

/**
 * Response for POST /api/courses/:id/enroll/
 */
export interface CourseEnrollmentResponse {
  success: boolean;
  enrollmentId: string;
  enrolledAt: string;
}

/**
 * Request for PUT /api/courses/:id/progress/
 */
export interface CourseProgressUpdate {
  courseId: string;
  progress: number;       // 0-100 percentage
  completedModules: string[];
  lastAccessedMaterialId?: string;
  updatedAt: string;
}

/**
 * Response for GET /api/courses/:id/materials/:materialId/
 */
export interface CourseMaterialResponse {
  material: Material;
  canDownload: boolean;
  canEdit: boolean;
  canDelete: boolean;
  downloadCount: number;
  viewCount: number;
}

/**
 * Request for POST /api/materials/bulk-action/
 */
export interface CourseBulkActionRequest {
  materialIds: string[];
  action: "delete" | "move" | "hide" | "publish";
  targetModuleId?: string;  // For "move" action
}

/**
 * Response for POST /api/materials/bulk-action/
 */
export interface CourseBulkActionResponse {
  success: boolean;
  affectedCount: number;
  failedIds: string[];    // IDs that failed to process
}

// =============================================================================
// MATERIAL/LIBRARY API RESPONSES
/*
 * Endpoints: /api/materials/, /api/materials/:id/, etc.
 * =============================================================================
 */

/**
 * Response for GET /api/materials/
 */
export interface MaterialListResponse {
  materials: Material[];
  total: number;
  filters?: {
    courseCode?: string;
    type?: Material["type"][];
    semester?: number[];
  };
}

/**
 * Request for POST /api/materials/
 */
export interface MaterialUploadRequest {
  title: string;
  courseId: string;
  type: Material["type"];
  semester: number;
  visibility: "public" | "private";
  moduleId?: string;
}

/**
 * Response for POST /api/materials/
 */
export interface MaterialUploadResponse {
  material: Material;
  uploadUrl?: string;     // For direct S3 upload
  fileId: string;
}

/**
 * Response for GET /api/materials/search/
 */
export interface MaterialSearchResponse {
  results: Material[];
  query: string;
  total: number;
  suggestions: string[];  // Related search terms
}

// =============================================================================
// DASHBOARD API RESPONSES
/*
 * Endpoints: /api/dashboard/student/, /api/dashboard/lecturer/
 * =============================================================================
 */

/**
 * Response for GET /api/dashboard/student/ or /api/dashboard/lecturer/
 */
export interface DashboardResponse extends DashboardData {
  lastRefreshedAt: string;  // When data was last refreshed
  cacheExpiry: string;      // When cached data expires
}

/**
 * Response for GET /api/dashboard/stats/
 */
export interface QuickStatsResponse {
  studentStats?: StudentStats;
  lecturerStats?: LecturerStats;
  gamification?: StudentGamificationProfile;
}

// =============================================================================
// AUTHENTICATION API RESPONSES
/*
 * Endpoints: /api/auth/login/, /api/auth/signup/, etc.
 * =============================================================================
 */

/**
 * Request for POST /api/auth/login/
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Response for POST /api/auth/login/
 */
export interface LoginResponse {
  user: UserProfile;
  token: string;          // JWT access token
  refreshToken: string;   // JWT refresh token
  expiresAt: string;      // Token expiry (ISO 8601)
}

/**
 * Request for POST /api/auth/signup/
 */
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: "student" | "lecturer";
  department?: string;
  semester?: number;
}

/**
 * Response for POST /api/auth/signup/
 */
export interface SignupResponse {
  user: UserProfile;
  token: string;
  refreshToken: string;
  requiresVerification: boolean;
}

/**
 * Request for PUT /api/users/me/
 */
export interface UserProfileUpdateRequest {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  department?: string;
  semester?: number;
}

/**
 * Request for POST /api/auth/password-reset/
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Request for POST /api/auth/password-reset-confirm/
 */
export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

// =============================================================================
// NOTES API RESPONSES
/*
 * Endpoints: /api/notes/, /api/notes/:id/, etc.
 * =============================================================================
 */

/**
 * Note object structure
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  courseId?: string;
  materialId?: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response for GET /api/notes/
 */
export interface NoteListResponse {
  notes: Note[];
  total: number;
  tags: string[];         // All unique tags used by user
}

/**
 * Request for POST /api/notes/
 */
export interface NoteCreateRequest {
  title: string;
  content: string;
  courseId?: string;
  materialId?: string;
  tags?: string[];
}

/**
 * Request for PUT /api/notes/:id/
 */
export interface NoteUpdateRequest {
  title?: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}

// =============================================================================
// CALENDAR API RESPONSES
/*
 * Endpoints: /api/calendar/events/, etc.
 * =============================================================================
 */

/**
 * Calendar event object
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;          // ISO 8601 datetime
  end: string;            // ISO 8601 datetime
  allDay: boolean;
  type: "exam" | "assignment" | "lecture" | "personal" | "deadline";
  courseId?: string;
  color?: string;         // UI color for event
  reminders: number[];    // Minutes before event to remind
}

/**
 * Response for GET /api/calendar/events/?month=2025-03
 */
export interface CalendarEventListResponse {
  events: CalendarEvent[];
  month: string;          // YYYY-MM format
}

/**
 * Request for POST /api/calendar/events/
 */
export interface CalendarEventCreateRequest {
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay: boolean;
  type: CalendarEvent["type"];
  courseId?: string;
  color?: string;
  reminders?: number[];
}

// =============================================================================
// ANALYTICS API RESPONSES
/*
 * Endpoints: /api/analytics/courses/:id/, /api/analytics/students/:id/
 * =============================================================================
 */

/**
 * Response for GET /api/analytics/courses/:id/
 */
export interface CourseAnalyticsResponse {
  courseId: string;
  enrollmentTrend: { date: string; count: number }[];
  materialViews: { materialId: string; views: number }[];
  engagementScore: number;
  averageProgress: number;
  completionRate: number;
}

/**
 * Response for GET /api/analytics/students/:id/
 */
export interface StudentPerformanceResponse {
  userId: string;
  courses: {
    courseId: string;
    progress: number;
    timeSpent: number;    // Minutes
    materialsCompleted: number;
    lastActive: string;
  }[];
  weeklyActivity: { date: string; minutes: number }[];
  strengths: string[];
  areasForImprovement: string[];
}

// =============================================================================
// UPLOAD API RESPONSES
/*
 * Endpoints: /api/uploads/, /api/uploads/:id/status/
 * =============================================================================
 */

/**
 * Upload progress information
 */
export interface UploadProgress {
  fileId: string;
  uploadedBytes: number;
  totalBytes: number;
  percentage: number;
  speed: number;          // Bytes per second
  estimatedTimeRemaining: number; // Seconds
}

/**
 * Response for GET /api/uploads/:id/status/
 */
export interface UploadStatusResponse {
  fileId: string;
  status: "pending" | "uploading" | "processing" | "completed" | "failed";
  error?: string;
  materialId?: string;
}

// =============================================================================
// REAL-TIME/WEBSOCKET TYPES
/*
 * For future real-time features (notifications, live updates)
 * =============================================================================
 */

/**
 * WebSocket connection configuration
 */
export interface WebSocketConnectionConfig {
  userId: string;
  channels: string[];
  authToken: string;
}

/**
 * Real-time message structure
 */
export interface RealTimeMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
  channelId: string;
}

/**
 * User presence update
 */
export interface PresenceUpdate {
  userId: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
}
