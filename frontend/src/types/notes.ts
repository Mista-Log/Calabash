/**
 * =============================================================================
 * NOTES TYPES
 * =============================================================================
 * 
 * FOR BACKEND ENGINEERS:
 * These types define the notes feature data structure.
 * 
 * BACKEND ENDPOINTS NEEDED:
 * - GET    /api/notes/              - List user's notes
 * - GET    /api/notes/:id/          - Get single note
 * - POST   /api/notes/              - Create new note
 * - PUT    /api/notes/:id/          - Update note
 * - DELETE /api/notes/:id/          - Delete note
 * - PATCH  /api/notes/:id/pin/      - Toggle pin status
 * - POST   /api/notes/:id/attachments/ - Attach material to note
 * 
 * DJANGO MODEL: courses.models.Note
 */

import type { Material } from "@/services/api";

// =============================================================================
// CORE TYPES
/*
 * Backend: These map directly to Django model fields
 * =============================================================================
 */

/**
 * User role for notes (notes are role-specific)
 */
export type NotesRole = "student" | "lecturer";

/**
 * Note scope (what the note is about)
 * - general: Free-form note, not linked to anything
 * - course: Note linked to a specific course
 * - material: Note linked to a specific material
 */
export type NoteScope = "general" | "course" | "material";

/**
 * Note status (workflow state)
 * - draft: Unsaved/in-progress note
 * - saved: Completed and saved note
 * - published: Shared/public note (future feature)
 */
export type NoteStatus = "draft" | "saved" | "published";

/**
 * Note save state (for UI feedback during save operations)
 */
export type NoteSaveState = "idle" | "saving" | "saved" | "error";

// =============================================================================
// NOTE ENTITY (Main data structure)
/*
 * Backend: This is what GET /api/notes/:id/ should return
 * Django Model: courses.models.Note
 * =============================================================================
 */

export interface NoteEntity {
  // Unique identifier
  id: string;

  // Owner of the note
  userId: string;
  role: NotesRole;

  // Note content
  title: string;
  content: string;        // HTML content from rich text editor
  excerpt: string;        // Auto-generated plain text summary

  // Note categorization
  scope: NoteScope;
  status: NoteStatus;

  // Note metadata
  pinned: boolean;        // Whether note is pinned to top
  courseId?: string;      // If scope is "course" or "material"
  courseCode?: string;    // For display purposes
  materialId?: string;    // If scope is "material"
  tags: string[];         // User-defined tags for organization

  // Attachments (materials linked to this note)
  attachments: NoteAttachment[];

  // Timestamps
  createdAt: string;      // ISO 8601 format
  updatedAt: string;      // ISO 8601 format
  lastOpenedAt?: string;  // ISO 8601 format (for "continue reading" feature)
}

// =============================================================================
// NOTE ATTACHMENT
/*
 * Backend: Links a note to a material
 * Django: Many-to-Many relationship between Note and CourseMaterial
 * =============================================================================
 */

export interface NoteAttachment {
  materialId: string;
  title: string;
  courseCode: string;
  type: Material["type"];  // 'pdf' | 'past-question' | 'video' | 'zip' | 'image'
  url?: string;            // Optional: direct link to material
}

// =============================================================================
// NOTE FILTERS & SEARCH
/*
 * Backend: Query parameters for GET /api/notes/
 * =============================================================================
 */

/**
 * Filter options for listing notes
 * Backend: GET /api/notes/?query=...&courseId=...&status=...
 */
export interface NoteFilter {
  query?: string;         // Search in title and content
  courseId?: string;      // Filter by course
  status?: NoteStatus | "all";  // Filter by status
}

// =============================================================================
// DASHBOARD SNAPSHOT
/*
 * Backend: GET /api/notes/dashboard-snapshot/
 * Purpose: Quick summary of notes for dashboard widget
 * =============================================================================
 */

export interface NotesDashboardSnapshot {
  recentNotes: NoteEntity[];  // Last 3 updated notes
  pinnedCount: number;        // Number of pinned notes
  draftCount: number;         // Number of draft notes
  continueNoteId: string | null;  // ID of most recent draft or note to continue
}

// =============================================================================
// REPOSITORY RESULT TYPE
/*
 * Backend: Use similar structure for API responses
 * Example: { ok: true, data: note } or { ok: false, code: "NOT_FOUND", error: "..." }
 * =============================================================================
 */

export type NotesRepoErrorCode =
  | "NOT_FOUND"        // Note doesn't exist
  | "INVALID_CONTEXT"  // Invalid user ID or role
  | "UNAVAILABLE";     // Service/database unavailable

export type NotesRepoResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: NotesRepoErrorCode; error: string };

// =============================================================================
// NOTE CREATION
/*
 * Backend: POST /api/notes/ request body
 * =============================================================================
 */

/**
 * Seed data for creating a new note draft
 * Backend: POST /api/notes/ with this structure
 */
export interface NoteDraftSeed {
  title?: string;
  content?: string;
  courseId?: string;
  courseCode?: string;
  materialId?: string;
  scope?: NoteScope;
}
