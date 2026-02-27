"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  ArrowLeft01Icon,
  PlusSignIcon,
  Bookmark01Icon,
  Delete02Icon,
  Tick01Icon,
  Note01Icon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  M3Button,
  SearchInput,
  Card,
  CardContent,
  Input,
  EmptyState,
} from "@/components/core";
import { NoteEditor } from "@/components/features/notes/NoteEditor";
import { useNotesStore, filterNotesByQuery, getNotesForRole } from "@/store/useNotesStore";
import { useUserStore } from "@/store/useUserStore";
import { useToast } from "@/components/core/toast";
import type { NotesRole } from "@/types/notes";

const AUTOSAVE_DELAY = 900;

function NotesPageSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-11 w-64 animate-pulse rounded-full bg-[color:var(--md-sys-color-surface-container-high)]" />
      <div className="h-[420px] animate-pulse rounded-3xl bg-[color:var(--md-sys-color-surface-container-low)]" />
    </div>
  );
}

function NotesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, hasHydrated } = useUserStore();
  const { addToast } = useToast();
  const {
    notes,
    status,
    error,
    loadedContext,
    activeNoteId,
    searchQuery,
    saveStateByNoteId,
    hydrateForContext,
    createDraft,
    updateDraft,
    autosaveNote,
    publishNote,
    deleteNote,
    togglePin,
    setActiveNote,
    setSearchQuery,
    resetForContext,
  } = useNotesStore();

  const [titleDraft, setTitleDraft] = React.useState("");
  const [contentDraft, setContentDraft] = React.useState("<p></p>");
  const [dirty, setDirty] = React.useState(false);
  const [mobileEditorOpen, setMobileEditorOpen] = React.useState(false);
  const [isCreatingNote, setIsCreatingNote] = React.useState(false);
  const lastSyncedNoteIdRef = React.useRef<string | null>(null);

  const role: NotesRole = user?.role === "lecturer" ? "lecturer" : "student";
  const context = React.useMemo(
    () =>
      user
        ? {
            userId: user.id,
            role,
          }
        : null,
    [role, user],
  );

  const roleNotes = React.useMemo(() => {
    if (!user) return [];
    return getNotesForRole(notes, user.id, role);
  }, [notes, role, user]);

  const filteredNotes = React.useMemo(
    () => filterNotesByQuery(roleNotes, searchQuery),
    [roleNotes, searchQuery],
  );

  const activeNote = React.useMemo(
    () => roleNotes.find((note) => note.id === activeNoteId) ?? null,
    [activeNoteId, roleNotes],
  );
  const requestedNoteId = searchParams.get("note");

  React.useEffect(() => {
    if (!hasHydrated) return;

    if (!context) {
      if (loadedContext) {
        resetForContext();
      }
      return;
    }

    const mismatch =
      loadedContext &&
      (loadedContext.userId !== context.userId || loadedContext.role !== context.role);

    if (mismatch) {
      resetForContext();
      return;
    }

    if (!loadedContext || status === "idle") {
      void hydrateForContext(context);
    }
  }, [
    context,
    hasHydrated,
    hydrateForContext,
    loadedContext,
    resetForContext,
    status,
  ]);

  React.useEffect(() => {
    if (roleNotes.length === 0) {
      return;
    }

    const hasActiveNote =
      !!activeNoteId && roleNotes.some((note) => note.id === activeNoteId);
    const requestedExists =
      !!requestedNoteId &&
      roleNotes.some((note) => note.id === requestedNoteId);

    if (!hasActiveNote) {
      const fallbackNoteId = requestedExists ? requestedNoteId : roleNotes[0].id;
      if (fallbackNoteId && fallbackNoteId !== activeNoteId) {
        setActiveNote(fallbackNoteId);
        if (requestedExists) {
          setMobileEditorOpen(true);
        }
      }
      return;
    }

    if (requestedExists && requestedNoteId !== activeNoteId) {
      setActiveNote(requestedNoteId);
      setMobileEditorOpen(true);
    }
  }, [activeNoteId, requestedNoteId, roleNotes, setActiveNote]);

  React.useEffect(() => {
    if (!activeNoteId) {
      lastSyncedNoteIdRef.current = null;
      return;
    }
    if (lastSyncedNoteIdRef.current === activeNoteId) {
      return;
    }

    const resolved = roleNotes.find((note) => note.id === activeNoteId);
    if (!resolved) return;
    setTitleDraft(resolved.title);
    setContentDraft(resolved.content || "<p></p>");
    setDirty(false);
    lastSyncedNoteIdRef.current = activeNoteId;
  }, [activeNoteId, roleNotes]);

  React.useEffect(() => {
    if (!activeNoteId || !dirty) return;

    const timeoutId = window.setTimeout(async () => {
      await autosaveNote(activeNoteId, {
        title: titleDraft,
        content: contentDraft,
      });
      setDirty(false);
    }, AUTOSAVE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeNoteId, autosaveNote, contentDraft, dirty, titleDraft]);

  const activeSaveState = activeNoteId
    ? (saveStateByNoteId[activeNoteId] ?? "idle")
    : "idle";

  const handleCreateNote = async () => {
    if (isCreatingNote) return;

    const resolvedContext =
      context ?? (user?.id ? { userId: user.id, role } : null);
    if (!resolvedContext) {
      addToast("Unable to create note: missing user context.", "error");
      return;
    }

    setIsCreatingNote(true);
    try {
      const createdId = await createDraft(resolvedContext, {
        title: "Untitled Note",
        scope: searchParams.get("course") ? "course" : "general",
        courseId: searchParams.get("course") || undefined,
      });

      if (!createdId) {
        addToast("Unable to create note.", "error");
        return;
      }

      setSearchQuery("");
      setActiveNote(createdId);
      setMobileEditorOpen(true);
      const courseParam = searchParams.get("course");
      const nextUrl = courseParam
        ? `/notes?note=${createdId}&course=${courseParam}`
        : `/notes?note=${createdId}`;
      router.replace(nextUrl);
      addToast("New note created.", "success");
    } finally {
      setIsCreatingNote(false);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTitle = event.target.value;
    setTitleDraft(nextTitle);
    if (activeNoteId) {
      updateDraft(activeNoteId, { title: nextTitle, status: "draft" });
    }
    setDirty(true);
  };

  const handleContentChange = (content: string) => {
    setContentDraft(content);
    if (activeNoteId) {
      updateDraft(activeNoteId, { content, status: "draft" });
    }
    setDirty(true);
  };

  const handlePublish = async () => {
    if (!activeNoteId) return;
    const ok = await publishNote(activeNoteId, {
      title: titleDraft,
      content: contentDraft,
    });
    if (ok) {
      addToast("Note published.", "success");
    } else {
      addToast("Unable to publish note.", "error");
    }
  };

  const handleSave = async () => {
    if (!activeNoteId) return;
    const ok = await autosaveNote(activeNoteId, {
      title: titleDraft,
      content: contentDraft,
    });
    if (ok) {
      addToast("Note saved.", "success");
    } else {
      addToast("Unable to save note.", "error");
    }
    setDirty(false);
  };

  const handleDelete = async () => {
    if (!activeNoteId) return;
    const ok = await deleteNote(activeNoteId);
    if (ok) {
      addToast("Note deleted.", "success");
      setMobileEditorOpen(false);
    } else {
      addToast("Delete failed.", "error");
    }
  };

  if (!hasHydrated) {
    return <NotesPageSkeleton />;
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[960px] items-center justify-center px-4">
        <Card className="w-full border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
          <CardContent className="p-8 text-center">
            <h1 className="text-[24px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              Sign in to open notes
            </h1>
            <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
              Your notes are linked to your profile context.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-3 py-5 sm:px-5 sm:py-7 lg:px-7 lg:py-9">
      <div className="mx-auto w-full max-w-[1360px] space-y-6 pb-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[32px] font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)]">
            Academic Notes
          </h1>
          <p className="mt-1 text-[15px] text-[color:var(--md-sys-color-on-surface-variant)]">
            Capture course insights with autosave drafts and material references.
          </p>
        </div>
        <M3Button
          onClick={() => void handleCreateNote()}
          className="h-11 gap-2 rounded-xl"
          disabled={isCreatingNote}
        >
          <MaterialSymbol icon={PlusSignIcon} size={18} />
          {isCreatingNote ? "Creating..." : "New Note"}
        </M3Button>
      </div>

      <SearchInput
        placeholder="Search notes by title, excerpt, or course code..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="h-12 rounded-2xl bg-[color:var(--md-sys-color-surface-container-low)]"
      />

      {status === "error" ? (
        <Card className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--md-sys-color-error-container)] text-[color:var(--md-sys-color-on-error-container)]">
                <MaterialSymbol icon={Note01Icon} size={16} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                  Unable to load notes
                </p>
                <p className="mt-1 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                  {error ?? "Please retry after reloading your notes context."}
                </p>
              </div>
            </div>
            <div className="m3-action-row mt-4">
              <M3Button
                variant="outlined"
                size="sm"
                layout="mobile-full"
                onClick={() => {
                  if (context) {
                    void hydrateForContext(context);
                  }
                }}
              >
                Retry
              </M3Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[330px_minmax(0,1fr)]">
        <Card
          className={
            mobileEditorOpen
              ? "hidden lg:block border-[color:var(--md-sys-color-outline-variant)]"
              : "border-[color:var(--md-sys-color-outline-variant)]"
          }
        >
          <CardContent className="space-y-2 p-3 sm:p-4 lg:max-h-[calc(100vh-260px)] lg:overflow-y-auto">
            {status === "loading" ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`note-skeleton-${index}`}
                    className="h-20 animate-pulse rounded-2xl bg-[color:var(--md-sys-color-surface-container-high)]"
                  />
                ))}
              </div>
            ) : filteredNotes.length > 0 ? (
              filteredNotes.map((note) => {
                const selected = note.id === activeNoteId;
                return (
                  <button
                    type="button"
                    key={note.id}
                    onClick={() => {
                      setActiveNote(note.id);
                      setMobileEditorOpen(true);
                    }}
                    className={`w-full rounded-2xl border p-3 text-left transition-colors ${
                      selected
                        ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]"
                        : "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)] hover:bg-[color:var(--md-sys-color-surface-container)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="line-clamp-1 text-[14px] font-semibold">{note.title}</p>
                      {note.pinned ? (
                        <MaterialSymbol icon={Bookmark01Icon} size={14} />
                      ) : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                      {note.excerpt || "No summary yet."}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-medium">
                      <span>{note.courseCode ?? "General"}</span>
                      <span className="uppercase">{note.status}</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <EmptyState
                icon={Note01Icon}
                title="No notes found"
                description="Create a new note to start your workspace."
                className="py-12"
              />
            )}
          </CardContent>
        </Card>

        <Card
          className={
            !mobileEditorOpen && activeNote
              ? "hidden lg:block border-[color:var(--md-sys-color-outline-variant)]"
              : "border-[color:var(--md-sys-color-outline-variant)]"
          }
        >
          <CardContent className="space-y-4 p-3 sm:p-5">
            {activeNote ? (
              <>
                <div className="flex items-center justify-between gap-2 lg:hidden">
                  <M3Button
                    variant="text"
                    size="sm"
                    onClick={() => setMobileEditorOpen(false)}
                    className="gap-1"
                  >
                    <MaterialSymbol icon={ArrowLeft01Icon} size={16} />
                    Back
                  </M3Button>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Input
                      value={titleDraft}
                      onChange={handleTitleChange}
                      placeholder="Untitled note"
                      className="h-11 min-w-[220px] flex-1 rounded-xl border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] text-[16px] font-semibold"
                    />
                    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
                      <M3Button
                        variant={activeNote.pinned ? "filled" : "outlined"}
                        size="sm"
                        onClick={() => void togglePin(activeNote.id)}
                        className="h-10 gap-1.5 rounded-xl"
                      >
                        <MaterialSymbol icon={Bookmark01Icon} size={14} />
                        {activeNote.pinned ? "Pinned" : "Pin"}
                      </M3Button>
                      <M3Button
                        variant="outlined"
                        size="sm"
                        onClick={() => void handleDelete()}
                        className="h-10 gap-1.5 rounded-xl"
                      >
                        <MaterialSymbol icon={Delete02Icon} size={14} />
                        Delete
                      </M3Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                    <span className="rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-2 py-1">
                      {activeNote.courseCode ?? "General"}
                    </span>
                    <span className="rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-2 py-1">
                      {activeNote.status.toUpperCase()}
                    </span>
                    <span>
                      Updated{" "}
                      {new Date(activeNote.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <NoteEditor
                  content={contentDraft}
                  onChange={handleContentChange}
                  saveState={activeSaveState}
                  statusMessage={dirty ? "Saving..." : undefined}
                  placeholder="Capture key points, formulas, and reminders..."
                />

                <div className="m3-action-row m3-action-row--end sticky bottom-2 z-10 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-2 lg:static lg:border-0 lg:bg-transparent lg:p-0">
                  <M3Button
                    variant="outlined"
                    size="sm"
                    layout="mobile-full"
                    className="gap-1.5"
                    onClick={() => void handleSave()}
                  >
                    <MaterialSymbol icon={Tick01Icon} size={14} />
                    Save Draft
                  </M3Button>
                  <M3Button
                    size="sm"
                    layout="mobile-full"
                    onClick={() => void handlePublish()}
                  >
                    Publish Note
                  </M3Button>
                </div>
              </>
            ) : (
              <EmptyState
                icon={Note01Icon}
                title="Select a note"
                description="Choose a note from the left panel or create a new draft."
                className="py-16"
              />
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}

export default function NotesPage() {
  return (
    <React.Suspense fallback={<NotesPageSkeleton />}>
      <NotesPageContent />
    </React.Suspense>
  );
}
