import type { Material } from "@/services/api";

export type NotesRole = "student" | "lecturer";

export type NoteScope = "general" | "course" | "material";

export type NoteStatus = "draft" | "saved" | "published";

export type NoteSaveState = "idle" | "saving" | "saved" | "error";

export interface NotesHydrationContext {
  userId: string;
  role: NotesRole;
}

export interface NoteAttachment {
  materialId: string;
  title: string;
  courseCode: string;
  type: Material["type"];
  url?: string;
}

export interface NoteEntity {
  id: string;
  userId: string;
  role: NotesRole;
  title: string;
  content: string;
  excerpt: string;
  scope: NoteScope;
  status: NoteStatus;
  pinned: boolean;
  courseId?: string;
  courseCode?: string;
  materialId?: string;
  tags: string[];
  attachments: NoteAttachment[];
  createdAt: string;
  updatedAt: string;
  lastOpenedAt?: string;
}

export interface NoteFilter {
  query?: string;
  courseId?: string;
  status?: NoteStatus | "all";
}

export interface NotesDashboardSnapshot {
  recentNotes: NoteEntity[];
  pinnedCount: number;
  draftCount: number;
  continueNoteId: string | null;
}

export type NotesRepoErrorCode = "NOT_FOUND" | "INVALID_CONTEXT" | "UNAVAILABLE";

export type NotesRepoResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: NotesRepoErrorCode; error: string };

export interface NoteDraftSeed {
  title?: string;
  content?: string;
  courseId?: string;
  courseCode?: string;
  materialId?: string;
  scope?: NoteScope;
}

