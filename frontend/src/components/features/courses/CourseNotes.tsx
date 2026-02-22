"use client";

import * as React from "react";
import Link from "next/link";
import {
  Note01Icon,
  PlusSignIcon,
  Bookmark01Icon,
  ArrowRight01Icon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { Card, CardContent, M3Button, SearchInput, EmptyState } from "@/components/core";
import { useNotesStore, filterNotesByQuery, getNotesForRole } from "@/store/useNotesStore";
import { useUserStore } from "@/store/useUserStore";

interface CourseNotesProps {
  courseId: string;
  courseCode: string;
}

export function CourseNotes({ courseId, courseCode }: CourseNotesProps) {
  const { user } = useUserStore();
  const {
    notes,
    status,
    loadedContext,
    hydrateForContext,
    createDraft,
  } = useNotesStore();

  const [localQuery, setLocalQuery] = React.useState("");

  React.useEffect(() => {
    if (!user) return;
    const mismatch =
      !loadedContext ||
      loadedContext.userId !== user.id ||
      loadedContext.role !== user.role;
    if (mismatch) {
      void hydrateForContext({ userId: user.id, role: user.role });
    }
  }, [hydrateForContext, loadedContext, user]);

  const roleNotes = React.useMemo(() => {
    if (!user) return [];
    return getNotesForRole(notes, user.id, user.role);
  }, [notes, user]);

  const courseNotes = React.useMemo(
    () => roleNotes.filter((note) => note.courseId === courseId),
    [courseId, roleNotes],
  );

  const filtered = React.useMemo(
    () => filterNotesByQuery(courseNotes, localQuery),
    [courseNotes, localQuery],
  );

  const handleCreateCourseDraft = async () => {
    if (!user) return;
    await createDraft(
      { userId: user.id, role: user.role },
      {
        title: `${courseCode} - New Note`,
        courseId,
        courseCode,
        scope: "course",
      },
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SearchInput
          placeholder={`Search ${courseCode} notes...`}
          value={localQuery}
          onChange={(event) => {
            const value = event.target.value;
            setLocalQuery(value);
          }}
          className="h-11 max-w-md rounded-full"
        />
        <div className="flex flex-wrap items-center gap-2">
          <M3Button
            className="h-11 gap-2 rounded-xl"
            onClick={() => void handleCreateCourseDraft()}
          >
            <MaterialSymbol icon={PlusSignIcon} size={16} />
            Add Course Note
          </M3Button>
          <Link href={`/notes?course=${courseId}`}>
            <M3Button variant="outlined" className="h-11 gap-2 rounded-xl">
              Open Notes Workspace
              <MaterialSymbol icon={ArrowRight01Icon} size={15} />
            </M3Button>
          </Link>
        </div>
      </div>

      {status === "loading" ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`course-note-skeleton-${index}`}
              className="h-28 animate-pulse rounded-2xl bg-[color:var(--md-sys-color-surface-container-low)]"
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((note) => (
            <Card
              key={note.id}
              className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]"
            >
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="line-clamp-1 text-[14px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                    {note.title}
                  </p>
                  {note.pinned ? (
                    <MaterialSymbol
                      icon={Bookmark01Icon}
                      size={14}
                      className="text-[color:var(--md-sys-color-primary)]"
                    />
                  ) : null}
                </div>
                <p className="line-clamp-2 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                  {note.excerpt}
                </p>
                <div className="flex items-center justify-between text-[11px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                  <span className="uppercase">{note.status}</span>
                  <Link href={`/notes?note=${note.id}&course=${courseId}`}>
                    <M3Button variant="text" size="sm" className="h-8 px-2">
                      Open
                    </M3Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
          <CardContent className="p-8">
            <EmptyState
              icon={Note01Icon}
              title="No notes for this course"
              description="Create your first course note or open the notes workspace."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
