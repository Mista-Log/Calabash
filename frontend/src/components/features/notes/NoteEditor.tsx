"use client";

import * as React from "react";
import TiptapEditor from "@/components/core/tiptap-editor";
import type { NoteSaveState } from "@/types/notes";

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  saveState?: NoteSaveState;
  statusMessage?: string | null;
}

function saveStateLabel(state: NoteSaveState): string {
  switch (state) {
    case "saving":
      return "Saving...";
    case "saved":
      return "Saved";
    case "error":
      return "Save failed";
    default:
      return "Ready";
  }
}

export function NoteEditor({
  content,
  onChange,
  placeholder = "Start typing your note...",
  editable = true,
  saveState = "idle",
  statusMessage,
}: NoteEditorProps) {
  return (
    <div className="space-y-2">
      <TiptapEditor
        content={content}
        onUpdate={onChange}
        placeholder={placeholder}
        editable={editable}
      />
      <p className="px-1 text-[12px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
        {statusMessage ?? saveStateLabel(saveState)}
      </p>
    </div>
  );
}

