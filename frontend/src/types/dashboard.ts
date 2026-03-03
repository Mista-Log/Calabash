/**
 * =============================================================================
 * DASHBOARD TYPES
 * =============================================================================
 * 
 * FOR BACKEND ENGINEERS:
 * These types define the dashboard data structure. The backend needs to provide
 * the raw data (DashboardData), and the frontend transforms it into view models.
 * 
 * BACKEND ENDPOINTS NEEDED:
 * - GET /api/dashboard/student/   - Returns DashboardData for students
 * - GET /api/dashboard/lecturer/  - Returns DashboardData for lecturers
 * 
 * The backend should return the data in the DashboardData format.
 * Everything else (StudentDashboardView, LecturerDashboardView, etc.) is
 * frontend transformation logic.
 */

import type {
  Course,
  DashboardData,
  Material,
  StudentGamificationProfile,
  StudentStats,
} from "@/services/api";
import type { NotesDashboardSnapshot } from "@/types/notes";

// =============================================================================
// DASHBOARD STATE & ERROR HANDLING
 * Backend: Use similar error patterns in your API responses
 * =============================================================================

/**
 * Dashboard loading state
 */
export type DashboardStatus = "idle" | "loading" | "success" | "error";

/**
 * Error codes for dashboard operations
 */
export const DASHBOARD_ERROR_CODES = {
  SCHEMA_INVALID: "DASHBOARD_SCHEMA_INVALID",  // API response doesn't match expected format
  ROLE_MISMATCH: "DASHBOARD_ROLE_MISMATCH",    // User role doesn't match endpoint
  NETWORK_ERROR: "DASHBOARD_NETWORK_ERROR",    // API request failed
} as const;

export type DashboardErrorCode =
  (typeof DASHBOARD_ERROR_CODES)[keyof typeof DASHBOARD_ERROR_CODES];

// =============================================================================
// LECTURER DASHBOARD TYPES
 * Backend: These are computed from Course and Material data
 * =============================================================================

/**
 * Course content health indicator
 * Backend: GET /api/dashboard/lecturer/content-health/
 * Purpose: Help lecturers identify courses that need attention
 */
export interface CourseContentHealth {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  materialCount: number;
  lastUploadDate: string | null;  // ISO date or null if no materials
  needsAttention: boolean;        // True if no materials or stale (>21 days)
}

/**
 * Complete lecturer dashboard view
 * Backend: GET /api/dashboard/lecturer/ returns DashboardData
 * Frontend transforms it into this structure
 */
export interface LecturerDashboardView {
  role: "lecturer";
  data: DashboardData;            // Raw API response
  recentUploads: Material[];      // Last 12 materials across all courses
  contentHealth: CourseContentHealth[];  // Health status per course
}

// =============================================================================
// STUDENT DASHBOARD TYPES
 * Backend: These are computed from Course, Material, and progress data
 * =============================================================================

/**
 * Student dashboard view
 * Backend: GET /api/dashboard/student/ returns DashboardData
 * Frontend transforms it into this structure
 */
export interface StudentDashboardView {
  role: "student";
  data: DashboardData;            // Raw API response
  courseProgress: Record<string, number>;  // courseId -> progress %
  focusCourse: Course | null;     // Course with highest incomplete progress
  continueCourseId: string | null; // ID of course to continue
  focusCourseProgress: number;    // Progress in focus course
  averageProgress: number;        // Average progress across all courses
  deadlines: StudentStats["upcomingDeadlines"];
  recentMaterials: Material[];    // Last 8 materials from user's courses
  gamification: StudentGamificationProfile | null;
  notesSnapshot: NotesDashboardSnapshot;  // Recent notes summary
}

/**
 * Activity card for student dashboard
 * Backend: This is frontend UI logic, no API endpoint needed
 */
export interface StudentActivityCardVM {
  id: string;
  title: string;        // Card title
  subtitle: string;     // Course code or category
  description: string;  // Brief description
  typeLabel: string;    // e.g., "Continue Learning"
  href: string;         // Link to course/material
  ctaLabel: string;     // Call-to-action button text
}

/**
 * Learning path card for student dashboard
 * Backend: This is frontend UI logic, no API endpoint needed
 */
export interface StudentPathCardVM {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  progress: number;     // 0-100
  href: string;
  ctaLabel: string;
}

/**
 * Progress summary for student dashboard
 * Backend: Can be computed from course progress data
 */
export interface StudentProgressSummaryVM {
  coursesInProgress: number;
  coursesCompleted: number;
  materialsReviewed: number;
  activeStreak: number;
  longestStreak: number;
}

// =============================================================================
// COMBINED VIEW MODEL
 * Backend: Just return DashboardData, frontend handles the rest
 * =============================================================================

/**
 * Complete dashboard view model (combines both student and lecturer views)
 * Backend: Only DashboardData is needed from the API
 */
export interface DashboardViewModel {
  raw: DashboardData;           // Raw API response
  studentView: StudentDashboardView | null;   // Transformed for student UI
  lecturerView: LecturerDashboardView | null; // Transformed for lecturer UI
}
