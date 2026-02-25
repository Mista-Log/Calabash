/**
 * Enhanced API Response Types for Calabash
 * Comprehensive type definitions for all API endpoints
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

// ============================================================================
// Generic API Response Types
// ============================================================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
  requestId: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    field?: string;
  };
  timestamp: string;
  requestId: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// Course API Response Types
// ============================================================================

export interface CourseListResponse {
  courses: Course[];
  total: number;
  semester?: number;
  department?: string;
}

export interface CourseDetailsResponse extends CourseDetails {
  isEnrolled: boolean;
  isFavorite: boolean;
  lastAccessedAt?: string;
  bookmarks: string[]; // material IDs
}

export interface CourseEnrollmentRequest {
  courseId: string;
  userId: string;
}

export interface CourseEnrollmentResponse {
  success: boolean;
  enrollmentId: string;
  enrolledAt: string;
}

export interface CourseProgressUpdate {
  courseId: string;
  progress: number;
  completedModules: string[];
  lastAccessedMaterialId?: string;
  updatedAt: string;
}

export interface CourseMaterialResponse {
  material: Material;
  canDownload: boolean;
  canEdit: boolean;
  canDelete: boolean;
  downloadCount: number;
  viewCount: number;
}

export interface CourseBulkActionRequest {
  materialIds: string[];
  action: "delete" | "move" | "hide" | "publish";
  targetModuleId?: string;
}

export interface CourseBulkActionResponse {
  success: boolean;
  affectedCount: number;
  failedIds: string[];
}

// ============================================================================
// Library/Material API Response Types
// ============================================================================

export interface MaterialListResponse {
  materials: Material[];
  total: number;
  filters?: {
    courseCode?: string;
    type?: Material["type"][];
    semester?: number[];
  };
}

export interface MaterialUploadRequest {
  title: string;
  courseId: string;
  type: Material["type"];
  semester: number;
  visibility: "public" | "private";
  moduleId?: string;
}

export interface MaterialUploadResponse {
  material: Material;
  uploadUrl?: string; // For direct upload to S3
  fileId: string;
}

export interface MaterialSearchResponse {
  results: Material[];
  query: string;
  total: number;
  suggestions: string[];
}

// ============================================================================
// Dashboard API Response Types
// ============================================================================

export interface DashboardResponse extends DashboardData {
  lastRefreshedAt: string;
  cacheExpiry: string;
}

export interface QuickStatsResponse {
  studentStats?: StudentStats;
  lecturerStats?: LecturerStats;
  gamification?: StudentGamificationProfile;
}

// ============================================================================
// User/Authentication API Response Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: UserProfile;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: "student" | "lecturer";
  department?: string;
  semester?: number;
}

export interface SignupResponse {
  user: UserProfile;
  token: string;
  refreshToken: string;
  requiresVerification: boolean;
}

export interface UserProfileUpdateRequest {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  department?: string;
  semester?: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

// ============================================================================
// Notes API Response Types
// ============================================================================

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

export interface NoteListResponse {
  notes: Note[];
  total: number;
  tags: string[];
}

export interface NoteCreateRequest {
  title: string;
  content: string;
  courseId?: string;
  materialId?: string;
  tags?: string[];
}

export interface NoteUpdateRequest {
  title?: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}

// ============================================================================
// Calendar API Response Types
// ============================================================================

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay: boolean;
  type: "exam" | "assignment" | "lecture" | "personal" | "deadline";
  courseId?: string;
  color?: string;
  reminders: number[]; // minutes before event
}

export interface CalendarEventListResponse {
  events: CalendarEvent[];
  month: string; // YYYY-MM format
}

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

// ============================================================================
// Analytics API Response Types
// ============================================================================

export interface CourseAnalyticsResponse {
  courseId: string;
  enrollmentTrend: { date: string; count: number }[];
  materialViews: { materialId: string; views: number }[];
  engagementScore: number;
  averageProgress: number;
  completionRate: number;
}

export interface StudentPerformanceResponse {
  userId: string;
  courses: {
    courseId: string;
    progress: number;
    timeSpent: number; // minutes
    materialsCompleted: number;
    lastActive: string;
  }[];
  weeklyActivity: { date: string; minutes: number }[];
  strengths: string[];
  areasForImprovement: string[];
}

// ============================================================================
// Upload API Response Types
// ============================================================================

export interface UploadProgress {
  fileId: string;
  uploadedBytes: number;
  totalBytes: number;
  percentage: number;
  speed: number; // bytes per second
  estimatedTimeRemaining: number; // seconds
}

export interface UploadStatusResponse {
  fileId: string;
  status: "pending" | "uploading" | "processing" | "completed" | "failed";
  error?: string;
  materialId?: string;
}

// ============================================================================
// Real-time/WebSocket Types
// ============================================================================

export interface WebSocketConnectionConfig {
  userId: string;
  channels: string[];
  authToken: string;
}

export interface RealTimeMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
  channelId: string;
}

export interface PresenceUpdate {
  userId: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
}
