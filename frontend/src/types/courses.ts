/**
 * =============================================================================
 * COURSES TYPES
 * =============================================================================
 * 
 * FOR BACKEND ENGINEERS:
 * These types define how course data is organized and displayed in the UI.
 * The backend just needs to return Course and CourseDetails objects.
 * Everything else is frontend view model logic.
 */

import type { Course, CourseDetails, Material } from "@/services/api";

// =============================================================================
// ERROR HANDLING
/*
 * Backend: Your API should return similar error structures
 * =============================================================================
 */

export type CourseRepoErrorCode =
  | "UNAVAILABLE"      // Service/database unavailable
  | "NOT_FOUND"        // Course doesn't exist
  | "INVALID_CONTEXT"; // Invalid user/role context

/**
 * Result type for course operations
 * Backend: Use similar structure for API responses
 * Example: { ok: true, data: course } or { ok: false, code: "NOT_FOUND", error: "..." }
 */
export type CourseRepoResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: CourseRepoErrorCode; error: string };

// =============================================================================
// SIDEBAR COMPONENT TYPES
/*
 * Backend: These are for UI display, computed from course/material data
 * =============================================================================
 */

/**
 * Deadline color coding for UI
 * Backend: Map your priority levels to these colors
 */
export type CourseSidebarDeadlineColor =
  | "primary"    // High priority (due today/tomorrow)
  | "secondary"  // Medium priority (due this week)
  | "tertiary"   // Low priority (due later)
  | "error";     // Overdue

/**
 * Deadline item for sidebar display
 * Backend: GET /api/courses/:id/deadlines/ or from Assignment model
 */
export interface CourseSidebarDeadline {
  id: string;
  title: string;          // Assignment/exam title
  courseCode: string;     // e.g., "CSC 201"
  due: string;            // Relative: "Tomorrow", "2 days", or ISO date
  color: CourseSidebarDeadlineColor;
}

/**
 * Activity type for sidebar feed
 */
export type CourseSidebarActivityKind =
  | "upload"       // New material uploaded
  | "progress"     // Student made progress
  | "visibility"   // Material visibility changed
  | "announcement"; // General announcement

/**
 * Activity item for sidebar feed
 * Backend: Generated from material uploads, views, etc.
 */
export interface CourseSidebarActivity {
  id: string;
  text: string;         // Display text: "Uploaded Binary Trees PDF"
  time: string;         // Relative: "2h ago", "Mar 3"
  kind: CourseSidebarActivityKind;
}

/**
 * Complete sidebar feed data
 * Backend: GET /api/courses/sidebar-feed/
 */
export interface CourseSidebarFeed {
  deadlines: CourseSidebarDeadline[];
  recentActivity: CourseSidebarActivity[];
}

// =============================================================================
// VIEW MODELS (Frontend UI Organization)
/*
 * Backend: These are frontend-specific. Just return Course/CourseDetails.
 * =============================================================================
 */

/**
 * Course list with sidebar data
 * Backend: This is computed from multiple API calls on the frontend
 */
export interface CourseListViewModel {
  courses: Course[];
  courseProgress: Record<string, number>;  // courseId -> progress %
  sidebar: CourseSidebarFeed;
}

/**
 * Single course detail view
 * Backend: GET /api/courses/:id/ returns CourseDetails
 */
export interface CourseDetailViewModel {
  course: CourseDetails;
  courseProgress: number;  // User's progress in this course (0-100)
}

/**
 * Course materials grouped by modules
 * Backend: Can return all materials, frontend groups them into modules
 * OR backend can have Module model with order field
 */
export interface CourseMaterialGroup {
  modules: CourseDetails["modules"];
  materials: Material[];
}
