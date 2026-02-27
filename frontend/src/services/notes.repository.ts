import type { Material } from "@/services/api";
import { useMockDataStore } from "@/store/useMockDataStore";
import { MOCK_NOTES } from "@/data/mock-data";
import type {
  NoteAttachment,
  NoteDraftSeed,
  NoteEntity,
  NotesDashboardSnapshot,
  NotesRepoResult,
  NotesRole,
} from "@/types/notes";

function toTimestamp(value?: string): number {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function createExcerpt(content: string): string {
  const plain = stripHtml(content);
  if (plain.length <= 120) return plain;
  return `${plain.slice(0, 117)}...`;
}

function sortRecent(notes: NoteEntity[]): NoteEntity[] {
  return [...notes].sort(
    (left, right) => toTimestamp(right.updatedAt) - toTimestamp(left.updatedAt),
  );
}

function getRoleForUser(userId: string): NotesRole {
  const matched = useMockDataStore
    .getState()
    .users.find((candidate) => candidate.id === userId);
  return matched?.role === "lecturer" ? "lecturer" : "student";
}

function normalizeNote(note: NoteEntity): NoteEntity {
  const now = new Date().toISOString();
  const content = note.content ?? "";
  const updatedAt = note.updatedAt || now;
  const createdAt = note.createdAt || updatedAt;

  return {
    ...note,
    title: note.title?.trim() || "Untitled Note",
    content,
    excerpt: note.excerpt?.trim() || createExcerpt(content),
    tags: Array.isArray(note.tags) ? note.tags : [],
    attachments: Array.isArray(note.attachments) ? note.attachments : [],
    status: note.status ?? "draft",
    scope: note.scope ?? "general",
    createdAt,
    updatedAt,
  };
}

function getFallbackNotes(userId: string, role: NotesRole): NoteEntity[] {
  const matching = MOCK_NOTES.filter(
    (note) => note.userId === userId && note.role === role,
  );
  if (matching.length > 0) {
    return matching.map(normalizeNote);
  }

  if (role === "student" && userId) {
    return [];
  }

  return MOCK_NOTES.filter((note) => note.role === role).map(normalizeNote);
}

function resolveMaterialAttachment(material: Material): NoteAttachment {
  return {
    materialId: material.id,
    title: material.title,
    courseCode: material.courseCode,
    type: material.type,
    url: material.url,
  };
}

export const notesRepository = {
  async getNotesForUser(
    userId: string,
    role: NotesRole,
  ): Promise<NotesRepoResult<NoteEntity[]>> {
    if (!userId) {
      return {
        ok: false,
        code: "INVALID_CONTEXT",
        error: "A valid user id is required to load notes.",
      };
    }

    const notes = getFallbackNotes(userId, role);
    return { ok: true, data: sortRecent(notes) };
  },

  async getDashboardNotesSnapshot(
    userId: string,
  ): Promise<NotesRepoResult<NotesDashboardSnapshot>> {
    if (!userId) {
      return {
        ok: false,
        code: "INVALID_CONTEXT",
        error: "A valid user id is required to load dashboard notes.",
      };
    }

    const role = getRoleForUser(userId);
    const result = await this.getNotesForUser(userId, role);
    if (!result.ok) return result;

    const recentNotes = sortRecent(result.data).slice(0, 3);
    const pinnedCount = result.data.filter((note) => note.pinned).length;
    const draftCount = result.data.filter((note) => note.status === "draft").length;
    const continueNoteId =
      sortRecent(
        result.data.filter((note) => note.status === "draft"),
      )[0]?.id ?? recentNotes[0]?.id ?? null;

    return {
      ok: true,
      data: {
        recentNotes,
        pinnedCount,
        draftCount,
        continueNoteId,
      },
    };
  },

  async createNoteDraft(
    userId: string,
    role: NotesRole,
    seed?: NoteDraftSeed,
  ): Promise<NotesRepoResult<NoteEntity>> {
    if (!userId) {
      return {
        ok: false,
        code: "INVALID_CONTEXT",
        error: "A valid user id is required to create a draft.",
      };
    }

    const now = new Date().toISOString();
    const content = seed?.content ?? "<p></p>";
    const note = normalizeNote({
      id: `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      userId,
      role,
      title: seed?.title?.trim() || "Untitled Note",
      content,
      excerpt: createExcerpt(content),
      scope: seed?.scope ?? (seed?.courseId ? "course" : "general"),
      status: "draft",
      pinned: false,
      courseId: seed?.courseId,
      courseCode: seed?.courseCode,
      materialId: seed?.materialId,
      tags: [],
      attachments: [],
      createdAt: now,
      updatedAt: now,
      lastOpenedAt: now,
    });

    return { ok: true, data: note };
  },

  async saveNote(
    noteId: string,
    payload: Partial<NoteEntity>,
  ): Promise<NotesRepoResult<Partial<NoteEntity>>> {
    if (!noteId) {
      return {
        ok: false,
        code: "INVALID_CONTEXT",
        error: "A valid note id is required to save note changes.",
      };
    }

    const content = payload.content ?? "";
    const update: Partial<NoteEntity> = {
      ...payload,
      title: payload.title?.trim() || "Untitled Note",
      excerpt: payload.excerpt ?? createExcerpt(content),
      updatedAt: new Date().toISOString(),
      status: payload.status ?? "saved",
    };

    return { ok: true, data: update };
  },

  async deleteNote(noteId: string): Promise<NotesRepoResult<{ id: string }>> {
    if (!noteId) {
      return {
        ok: false,
        code: "INVALID_CONTEXT",
        error: "A valid note id is required to delete a note.",
      };
    }
    return { ok: true, data: { id: noteId } };
  },

  async togglePin(
    noteId: string,
    pinned: boolean,
  ): Promise<NotesRepoResult<Pick<NoteEntity, "id" | "pinned" | "updatedAt">>> {
    if (!noteId) {
      return {
        ok: false,
        code: "INVALID_CONTEXT",
        error: "A valid note id is required to pin/unpin a note.",
      };
    }
    return {
      ok: true,
      data: { id: noteId, pinned, updatedAt: new Date().toISOString() },
    };
  },

  async attachMaterialToNote(
    noteId: string,
    material: Material,
  ): Promise<
    NotesRepoResult<{
      noteId: string;
      attachment: NoteAttachment;
      scope: NoteEntity["scope"];
      materialId: string;
      courseCode?: string;
      updatedAt: string;
    }>
  > {
    if (!noteId || !material?.id) {
      return {
        ok: false,
        code: "INVALID_CONTEXT",
        error: "Note and material context are required to attach material.",
      };
    }

    return {
      ok: true,
      data: {
        noteId,
        attachment: resolveMaterialAttachment(material),
        scope: "material",
        materialId: material.id,
        courseCode: material.courseCode,
        updatedAt: new Date().toISOString(),
      },
    };
  },

  async getCourseNotes(
    userId: string,
    role: NotesRole,
    courseId: string,
  ): Promise<NotesRepoResult<NoteEntity[]>> {
    if (!courseId) {
      return {
        ok: false,
        code: "INVALID_CONTEXT",
        error: "A valid course id is required to load course notes.",
      };
    }
    const notesResult = await this.getNotesForUser(userId, role);
    if (!notesResult.ok) return notesResult;
    return {
      ok: true,
      data: notesResult.data.filter((note) => note.courseId === courseId),
    };
  },
};

