"use client";

import { useState } from "react";
import {
  Note01Icon,
  Search01Icon,
  PlusSignIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button, SearchInput, Card, CardContent } from "@/components/core";
import { NoteEditor } from "@/components/features/notes/NoteEditor";

export default function NotesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {isCreating && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCreating(false)}
                className="rounded-full"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={24} />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isCreating ? "New Note" : "Academic Notes"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isCreating
                  ? "Capture your thoughts and observations."
                  : "Manage and organize your course-specific insights."}
              </p>
            </div>
          </div>
          {!isCreating && (
            <Button
              className="gap-2 h-11 rounded-xl shadow-lg shadow-primary/20"
              onClick={() => setIsCreating(true)}
            >
              <HugeiconsIcon icon={PlusSignIcon} size={18} />
              Create New Note
            </Button>
          )}
        </div>

        {isCreating ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <NoteEditor
              content={noteContent}
              onChange={setNoteContent}
              placeholder="Topic: Advanced Algorithms..."
            />
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreating(false)}>Save Note</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 p-4 rounded-xl border bg-card/50 backdrop-blur-sm lg:flex-row lg:items-center">
              <SearchInput
                placeholder="Search through your notes..."
                className="border-none bg-transparent shadow-none"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: 1,
                  title: "Data Structures Review",
                  date: "2 days ago",
                  course: "CSC 102",
                  content:
                    "<p>Key takeaways from the lecture on balanced trees and graph traversal algorithms...</p><ul><li>AVL Trees</li><li>Red-Black Trees</li><li>BFS vs DFS</li></ul>",
                },
                {
                  id: 2,
                  title: "Operating Systems Notes",
                  date: "5 days ago",
                  course: "CSC 201",
                  content:
                    "<p>Process scheduling algorithms: <strong>Round Robin</strong> seems most fair but context switching overhead is real.</p>",
                },
              ].map((note) => (
                <Card
                  key={note.id}
                  className="group hover:shadow-lg transition-all border border-border/40 hover:border-primary/30"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <HugeiconsIcon icon={Note01Icon} size={20} />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {note.date}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {note.title}
                      </h3>
                      <div
                        className="text-sm text-muted-foreground line-clamp-2 mt-2 prose prose-sm dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                      />
                    </div>
                    <div className="pt-4 border-t border-border/10 flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-accent/10 text-accent uppercase">
                        {note.course}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs font-bold rounded-full"
                        onClick={() => {
                          setNoteContent(note.content);
                          setIsCreating(true);
                        }}
                      >
                        Edit Note
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
