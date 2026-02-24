"use client";

<<<<<<< HEAD
import * as React from "react";
import TiptapEditor from "@/components/core/tiptap-editor";
import type { NoteSaveState } from "@/types/notes";
=======
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import {
  TextBoldIcon,
  TextItalicIcon,
  Menu01Icon, // Using as placeholder for Unordered List
  Sorting01Icon, // Using as placeholder for Ordered List
  TextIcon,
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/core/button";
import { cn } from "@/lib/utils";
>>>>>>> origin/main

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
<<<<<<< HEAD
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
=======
>>>>>>> origin/main
}

export function NoteEditor({
  content,
  onChange,
  placeholder = "Start typing your note...",
  editable = true,
<<<<<<< HEAD
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
=======
}: NoteEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration mismatch
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Typography,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[300px] p-4",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border/40 rounded-xl overflow-hidden bg-card/50 focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">
      {/* Toolbar */}
      {editable && (
        <div className="bg-muted/50 border-b border-border/40 p-2 flex items-center gap-1 overflow-x-auto">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={TextBoldIcon}
            label="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={TextItalicIcon}
            label="Italic"
          />
          <div className="w-px h-6 bg-border mx-2" />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            icon={Heading01Icon}
            label="H1"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            icon={Heading02Icon}
            label="H2"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            icon={Heading03Icon}
            label="H3"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive("paragraph")}
            icon={TextIcon}
            label="Paragraph"
          />
          <div className="w-px h-6 bg-border mx-2" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={Menu01Icon}
            label="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={Sorting01Icon}
            label="Ordered List"
          />
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} />
>>>>>>> origin/main
    </div>
  );
}

<<<<<<< HEAD
=======
function ToolbarButton({
  onClick,
  isActive,
  icon,
  label,
}: {
  onClick: () => void;
  isActive: boolean;
  icon: any;
  label: string;
}) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="icon"
      onClick={onClick}
      className={cn(
        "h-8 w-8 rounded-lg",
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground",
      )}
      title={label}
    >
      <HugeiconsIcon icon={icon} size={16} />
    </Button>
  );
}
>>>>>>> origin/main
