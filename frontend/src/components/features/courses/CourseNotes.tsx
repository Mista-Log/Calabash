"use client";

import * as React from "react";
<<<<<<< HEAD
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
=======
import {
  Note01Icon,
  Download01Icon,
  Settings02Icon,
  PlusSignIcon,
  Delete02Icon,
  Search01Icon,
  Bookmark01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
  SearchInput,
} from "@/components/core";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  materialName: string;
}

const MOCK_NOTES: Note[] = [
  {
    id: "1",
    title: "Carrier Concentration Basics",
    content:
      "Remember that n_i^2 = n * p. This is crucial for mass action law calculations. Also, intrinsic carrier concentration is temperature dependent.",
    timestamp: "2 days ago",
    materialName: "Lecture 1: Intro to Semiconductors",
  },
  {
    id: "2",
    title: "Fermi Level Position",
    content:
      "For n-type, Fermi level is closer to the conduction band. For p-type, it's closer to the valence band.",
    timestamp: "1 week ago",
    materialName: "Lecture 2: Energy Bands",
  },
];

export function CourseNotes() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [notes, setNotes] = React.useState<Note[]>(MOCK_NOTES);
  const [isAdding, setIsAdding] = React.useState(false);
  const [newNote, setNewNote] = React.useState({ title: "", content: "" });

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSave = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    const n: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      timestamp: "Just now",
      materialName: "Current Material",
    };
    setNotes([n, ...notes]);
    setNewNote({ title: "", content: "" });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <SearchInput
            placeholder="Search your notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="h-11 rounded-xl gap-2 font-bold px-6"
          >
            <HugeiconsIcon icon={Download01Icon} size={18} />
            Export PDF
          </Button>
          <Button
            onClick={() => setIsAdding(true)}
            className="h-11 rounded-xl gap-2 font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex-1 md:flex-none"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={18} />
            Add Note
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Note Title"
                  className="w-full bg-background border border-muted/20 rounded-lg px-4 h-10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                />
                <textarea
                  placeholder="Write your note here..."
                  className="w-full min-h-[150px] bg-background border border-muted/20 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsAdding(false)}
                    className="font-bold font-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-primary text-primary-foreground font-bold rounded-lg shadow-lg shadow-primary/20"
                  >
                    Save Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map((note) => (
          <motion.div
            key={note.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="group h-full flex flex-col hover:shadow-lg transition-all border-muted/10 hover:border-primary/20">
              <CardContent className="p-6 flex-1 flex flex-col space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {note.timestamp}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-muted/20" />
                      <span className="text-xs font-bold text-primary opacity-60 uppercase tracking-widest truncate max-w-[150px]">
                        {note.materialName}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground/40 hover:text-red-500"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={16} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-4">
                  {note.content}
                </p>
                <div className="pt-4 border-t border-muted/5 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    className="h-8 text-xs font-bold uppercase tracking-widest text-muted-foreground gap-1.5 p-0 hover:bg-transparent hover:text-primary"
                  >
                    <HugeiconsIcon icon={Bookmark01Icon} size={12} />
                    View Details
                  </Button>
                  <HugeiconsIcon
                    icon={Note01Icon}
                    size={16}
                    className="text-muted-foreground/10 group-hover:text-primary/20 transition-colors"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
>>>>>>> origin/main
    </div>
  );
}
