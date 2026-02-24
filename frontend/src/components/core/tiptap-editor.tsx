"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/core/button";
import {
  TextBoldIcon as BoldIcon,
  TextItalicIcon as ItalicIcon,
  LeftToRightListNumberIcon as ListOrderedIcon,
  LeftToRightListBulletIcon as ListUnorderedIcon,
  CodeIcon,
  QuotesIcon as QuoteIcon,
  TextItalicSlashIcon as SlashIcon,
  UndoIcon,
  RedoIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface TiptapEditorProps {
  content: string;
  onUpdate: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onUpdate,
  placeholder = "Write something...",
  editable = true,
  className,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : architectural change
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : architectural change
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editable,
    editorProps: {
      attributes: {
        class: cn(
          "prose dark:prose-invert max-w-none focus:outline-none p-4 rounded-md min-h-[100px] border border-border/50",
          !editable && "opacity-70",
          className,
        ),
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col border border-border/50 rounded-lg shadow-sm">
      {editable && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border/50 bg-muted/20 rounded-t-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active bg-muted/40" : ""}
          >
            <HugeiconsIcon icon={BoldIcon} size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active bg-muted/40" : ""}
          >
            <HugeiconsIcon icon={ItalicIcon} size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={editor.isActive("code") ? "is-active bg-muted/40" : ""}
          >
            <HugeiconsIcon icon={CodeIcon} size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.can().chain().focus().toggleBulletList().run()}
            className={
              editor.isActive("bulletList") ? "is-active bg-muted/40" : ""
            }
          >
            <HugeiconsIcon icon={ListUnorderedIcon} size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            className={
              editor.isActive("orderedList") ? "is-active bg-muted/40" : ""
            }
          >
            <HugeiconsIcon icon={ListOrderedIcon} size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={!editor.can().chain().focus().toggleBlockquote().run()}
            className={
              editor.isActive("blockquote") ? "is-active bg-muted/40" : ""
            }
          >
            <HugeiconsIcon icon={QuoteIcon} size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <HugeiconsIcon icon={UndoIcon} size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <HugeiconsIcon icon={RedoIcon} size={18} />
          </Button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
