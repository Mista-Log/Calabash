import { create } from "zustand";
import { persist } from "zustand/middleware";
import { notesRepository } from "@/services/notes.repository";
import type {
  NoteDraftSeed,
  NoteEntity,
  NoteSaveState,
  NotesHydrationContext,
  NotesRole,
} from "@/types/notes";
import type { Material } from "@/services/api";

type NotesStatus = "idle" | "loading" | "success" | "error";

interface NotesStoreState {
  notes: NoteEntity[];
  status: NotesStatus;
  error: string | null;
  loadedContext: NotesHydrationContext | null;
  activeNoteId: string | null;
  searchQuery: string;
  saveStateByNoteId: Record<string, NoteSaveState>;
  lastUpdated: string | null;
  hydrateForContext: (context: NotesHydrationContext) => Promise<void>;
  createDraft: (context: NotesHydrationContext, seed?: NoteDraftSeed) => Promise<string | null>;
  updateDraft: (noteId: string, updates: Partial<NoteEntity>) => void;
  autosaveNote: (noteId: string, updates?: Partial<NoteEntity>) => Promise<boolean>;
  publishNote: (noteId: string, updates?: Partial<NoteEntity>) => Promise<boolean>;
  deleteNote: (noteId: string) => Promise<boolean>;
  togglePin: (noteId: string) => Promise<boolean>;
  attachMaterial: (noteId: string, material: Material) => Promise<boolean>;
  setActiveNote: (noteId: string | null) => void;
  setSearchQuery: (query: string) => void;
  resetForContext: () => void;
}

const initialState = {
  notes: [] as NoteEntity[],
  status: "idle" as NotesStatus,
  error: null as string | null,
  loadedContext: null as NotesHydrationContext | null,
  activeNoteId: null as string | null,
  searchQuery: "",
  saveStateByNoteId: {} as Record<string, NoteSaveState>,
  lastUpdated: null as string | null,
};

function sortNotes(notes: NoteEntity[]): NoteEntity[] {
  return [...notes].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

function applyNoteUpdate(
  notes: NoteEntity[],
  noteId: string,
  updates: Partial<NoteEntity>,
): NoteEntity[] {
  const next = notes.map((note) =>
    note.id === noteId ? { ...note, ...updates } : note,
  );
  return sortNotes(next);
}

function ensureContextMatch(
  state: NotesStoreState,
  context: NotesHydrationContext,
): boolean {
  return (
    state.loadedContext?.userId === context.userId &&
    state.loadedContext?.role === context.role
  );
}

export const useNotesStore = create<NotesStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      hydrateForContext: async (context) => {
        set((state) => ({
          ...state,
          status: "loading",
          error: null,
        }));

        const result = await notesRepository.getNotesForUser(
          context.userId,
          context.role,
        );

        if (!result.ok) {
          set((state) => ({
            ...state,
            status: "error",
            error: result.error,
          }));
          return;
        }

        const sorted = sortNotes(result.data);
        set((state) => ({
          ...state,
          notes: sorted,
          loadedContext: context,
          activeNoteId: sorted[0]?.id ?? null,
          status: "success",
          error: null,
          lastUpdated: new Date().toISOString(),
          saveStateByNoteId: sorted.reduce<Record<string, NoteSaveState>>(
            (acc, note) => {
              acc[note.id] = "idle";
              return acc;
            },
            {},
          ),
        }));
      },

      createDraft: async (context, seed) => {
        if (!context.userId) return null;

        const state = get();
        if (!ensureContextMatch(state, context)) {
          await get().hydrateForContext(context);
        }

        const draftResult = await notesRepository.createNoteDraft(
          context.userId,
          context.role,
          seed,
        );
        if (!draftResult.ok) {
          set((prev) => ({
            ...prev,
            status: "error",
            error: draftResult.error,
          }));
          return null;
        }

        set((prev) => {
          const nextNotes = sortNotes([draftResult.data, ...prev.notes]);
          return {
            ...prev,
            notes: nextNotes,
            activeNoteId: draftResult.data.id,
            status: "success",
            error: null,
            lastUpdated: new Date().toISOString(),
            saveStateByNoteId: {
              ...prev.saveStateByNoteId,
              [draftResult.data.id]: "idle",
            },
          };
        });
        return draftResult.data.id;
      },

      updateDraft: (noteId, updates) => {
        if (!noteId) return;
        set((state) => ({
          ...state,
          notes: applyNoteUpdate(state.notes, noteId, {
            ...updates,
            updatedAt: new Date().toISOString(),
          }),
          saveStateByNoteId: {
            ...state.saveStateByNoteId,
            [noteId]: "idle",
          },
        }));
      },

      autosaveNote: async (noteId, updates) => {
        const current = get().notes.find((note) => note.id === noteId);
        if (!current) return false;

        const payload: Partial<NoteEntity> = {
          ...updates,
          title: updates?.title ?? current.title,
          content: updates?.content ?? current.content,
          status: updates?.status ?? "saved",
        };

        set((state) => ({
          ...state,
          saveStateByNoteId: {
            ...state.saveStateByNoteId,
            [noteId]: "saving",
          },
        }));

        const result = await notesRepository.saveNote(noteId, payload);
        if (!result.ok) {
          set((state) => ({
            ...state,
            status: "error",
            error: result.error,
            saveStateByNoteId: {
              ...state.saveStateByNoteId,
              [noteId]: "error",
            },
          }));
          return false;
        }

        set((state) => ({
          ...state,
          notes: applyNoteUpdate(state.notes, noteId, result.data),
          status: "success",
          error: null,
          lastUpdated: new Date().toISOString(),
          saveStateByNoteId: {
            ...state.saveStateByNoteId,
            [noteId]: "saved",
          },
        }));
        return true;
      },

      publishNote: async (noteId, updates) => {
        return get().autosaveNote(noteId, { ...updates, status: "published" });
      },

      deleteNote: async (noteId) => {
        const result = await notesRepository.deleteNote(noteId);
        if (!result.ok) {
          set((state) => ({
            ...state,
            status: "error",
            error: result.error,
          }));
          return false;
        }

        set((state) => {
          const nextNotes = state.notes.filter((note) => note.id !== noteId);
          const nextActive =
            state.activeNoteId === noteId
              ? (nextNotes[0]?.id ?? null)
              : state.activeNoteId;

          const nextSaveState = { ...state.saveStateByNoteId };
          delete nextSaveState[noteId];

          return {
            ...state,
            notes: nextNotes,
            activeNoteId: nextActive,
            status: "success",
            error: null,
            saveStateByNoteId: nextSaveState,
            lastUpdated: new Date().toISOString(),
          };
        });
        return true;
      },

      togglePin: async (noteId) => {
        const note = get().notes.find((entry) => entry.id === noteId);
        if (!note) return false;

        const result = await notesRepository.togglePin(noteId, !note.pinned);
        if (!result.ok) {
          set((state) => ({
            ...state,
            status: "error",
            error: result.error,
          }));
          return false;
        }

        set((state) => ({
          ...state,
          notes: applyNoteUpdate(state.notes, noteId, {
            pinned: result.data.pinned,
            updatedAt: result.data.updatedAt,
          }),
          status: "success",
          error: null,
          lastUpdated: new Date().toISOString(),
        }));
        return true;
      },

      attachMaterial: async (noteId, material) => {
        const note = get().notes.find((entry) => entry.id === noteId);
        if (!note) return false;

        const result = await notesRepository.attachMaterialToNote(noteId, material);
        if (!result.ok) {
          set((state) => ({
            ...state,
            status: "error",
            error: result.error,
          }));
          return false;
        }

        const alreadyAttached = note.attachments.some(
          (attachment) => attachment.materialId === material.id,
        );
        const nextAttachments = alreadyAttached
          ? note.attachments
          : [...note.attachments, result.data.attachment];

        set((state) => ({
          ...state,
          notes: applyNoteUpdate(state.notes, noteId, {
            attachments: nextAttachments,
            materialId: result.data.materialId,
            scope: result.data.scope,
            courseCode: result.data.courseCode ?? note.courseCode,
            updatedAt: result.data.updatedAt,
          }),
          status: "success",
          error: null,
          lastUpdated: new Date().toISOString(),
        }));
        return true;
      },

      setActiveNote: (noteId) =>
        set((state) => {
          if (state.activeNoteId === noteId) {
            return state;
          }

          return {
            ...state,
            activeNoteId: noteId,
            notes: noteId
              ? applyNoteUpdate(state.notes, noteId, {
                  lastOpenedAt: new Date().toISOString(),
                })
              : state.notes,
          };
        }),

      setSearchQuery: (query) =>
        set((state) => ({
          ...state,
          searchQuery: query,
        })),

      resetForContext: () =>
        set((state) => ({
          ...state,
          ...initialState,
        })),
    }),
    {
      name: "calabash-notes-storage",
      partialize: (state) => ({
        notes: state.notes,
        loadedContext: state.loadedContext,
        activeNoteId: state.activeNoteId,
        searchQuery: state.searchQuery,
        saveStateByNoteId: state.saveStateByNoteId,
        lastUpdated: state.lastUpdated,
      }),
    },
  ),
);

export function filterNotesByQuery(notes: NoteEntity[], query: string): NoteEntity[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return notes;

  return notes.filter((note) => {
    const haystack = `${note.title} ${note.excerpt} ${note.courseCode ?? ""}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

export function getNotesForRole(
  notes: NoteEntity[],
  userId: string,
  role: NotesRole,
): NoteEntity[] {
  return notes.filter((note) => note.userId === userId && note.role === role);
}
