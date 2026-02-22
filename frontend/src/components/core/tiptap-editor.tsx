"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { cn } from "@/lib/utils";
import { MaterialSymbol } from "./MaterialSymbol";
import {
  TextBoldIcon,
  TextItalicIcon,
  LeftToRightListNumberIcon,
  LeftToRightListBulletIcon,
  CodeIcon,
  QuotesIcon,
  UndoIcon,
  RedoIcon,
} from "@/lib/icons/material-icons";

interface TiptapEditorProps {
  content: string;
  onUpdate: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  showShortcuts?: boolean;
}

interface ToolbarAction {
  id: string;
  icon?: string;
  text?: string;
  label: string;
  shortcut?: string;
  onPress: () => void;
  active: boolean;
  disabled: boolean;
}

function normalizeHtml(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

const editorBodyClass =
  "max-w-none min-h-[220px] px-4 py-4 sm:min-h-[300px] sm:px-5 sm:py-5 text-[color:var(--md-sys-color-on-surface)] [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_p]:text-[15px] [&_ul]:list-disc [&_ol]:list-decimal [&_blockquote]:border-l-4 [&_blockquote]:border-[color:var(--md-sys-color-outline)] [&_blockquote]:pl-3";

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onUpdate,
  placeholder = "Write something...",
  editable = true,
  className,
  showShortcuts = true,
}) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [, forceToolbarRefresh] = React.useReducer((x) => x + 1, 0);
  const lastEmittedContentRef = React.useRef(content || "<p></p>");

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
    ],
    content,
    editable,
    onUpdate: ({ editor: activeEditor }) => {
      const html = activeEditor.getHTML();
      lastEmittedContentRef.current = html;
      onUpdate(html);
    },
    editorProps: {
      attributes: {
        class: cn(editorBodyClass, "focus:outline-none"),
      },
    },
  });

  React.useEffect(() => {
    if (!editor) return;
    const incomingContent = content || "<p></p>";
    const currentContent = editor.getHTML();

    if (
      normalizeHtml(incomingContent) ===
      normalizeHtml(lastEmittedContentRef.current)
    ) {
      return;
    }

    if (normalizeHtml(incomingContent) !== normalizeHtml(currentContent)) {
      editor.commands.setContent(incomingContent, { emitUpdate: false });
      lastEmittedContentRef.current = incomingContent;
    }
  }, [content, editor]);

  React.useEffect(() => {
    if (!editor) return;

    const refresh = () => forceToolbarRefresh();
    editor.on("selectionUpdate", refresh);
    editor.on("transaction", refresh);
    editor.on("focus", refresh);
    editor.on("blur", refresh);

    return () => {
      editor.off("selectionUpdate", refresh);
      editor.off("transaction", refresh);
      editor.off("focus", refresh);
      editor.off("blur", refresh);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const actions: ToolbarAction[] = [
    {
      id: "bold",
      icon: TextBoldIcon,
      label: "Bold",
      shortcut: "Ctrl+B",
      onPress: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      disabled: !editor.can().chain().focus().toggleBold().run(),
    },
    {
      id: "italic",
      icon: TextItalicIcon,
      label: "Italic",
      shortcut: "Ctrl+I",
      onPress: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      disabled: !editor.can().chain().focus().toggleItalic().run(),
    },
    {
      id: "heading-1",
      text: "H1",
      label: "Heading 1",
      onPress: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
      disabled: !editor.can().chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      id: "heading-2",
      text: "H2",
      label: "Heading 2",
      onPress: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      disabled: !editor.can().chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      id: "heading-3",
      text: "H3",
      label: "Heading 3",
      onPress: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
      disabled: !editor.can().chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      id: "bullet",
      icon: LeftToRightListBulletIcon,
      label: "Bullet List",
      onPress: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      disabled: !editor.can().chain().focus().toggleBulletList().run(),
    },
    {
      id: "ordered",
      icon: LeftToRightListNumberIcon,
      label: "Numbered List",
      onPress: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      disabled: !editor.can().chain().focus().toggleOrderedList().run(),
    },
    {
      id: "quote",
      icon: QuotesIcon,
      label: "Quote",
      onPress: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
      disabled: !editor.can().chain().focus().toggleBlockquote().run(),
    },
    {
      id: "code",
      icon: CodeIcon,
      label: "Code",
      onPress: () => editor.chain().focus().toggleCode().run(),
      active: editor.isActive("code"),
      disabled: !editor.can().chain().focus().toggleCode().run(),
    },
    {
      id: "undo",
      icon: UndoIcon,
      label: "Undo",
      shortcut: "Ctrl+Z",
      onPress: () => editor.chain().focus().undo().run(),
      active: editor.can().chain().focus().undo().run(),
      disabled: !editor.can().chain().focus().undo().run(),
    },
    {
      id: "redo",
      icon: RedoIcon,
      label: "Redo",
      shortcut: "Ctrl+Shift+Z",
      onPress: () => editor.chain().focus().redo().run(),
      active: editor.can().chain().focus().redo().run(),
      disabled: !editor.can().chain().focus().redo().run(),
    },
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]",
        "focus-within:border-[color:var(--md-sys-color-primary)] focus-within:ring-2 focus-within:ring-[color:var(--md-sys-color-primary-container)]",
        className,
      )}
    >
      {editable ? (
        <div className="border-b border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] px-2 py-2.5 sm:px-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                data-active={action.active ? "true" : "false"}
                aria-pressed={action.active}
                aria-label={action.label}
                title={
                  action.shortcut
                    ? `${action.label} (${action.shortcut})`
                    : action.label
                }
                disabled={action.disabled}
                onPointerDown={(event) => {
                  event.preventDefault();
                  if (!action.disabled) {
                    action.onPress();
                    forceToolbarRefresh();
                  }
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={(event) => {
                  event.preventDefault();
                }}
                className={cn(
                  "inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl border px-2.5 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-sys-color-primary-container)]",
                  action.active
                    ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]"
                    : "border-transparent bg-transparent text-[color:var(--md-sys-color-on-surface-variant)] hover:bg-[color:var(--md-sys-color-surface-container-high)]",
                  action.disabled && "opacity-45 cursor-not-allowed",
                )}
                style={
                  action.active
                    ? ({
                        backgroundColor: "var(--md-sys-color-primary-container)",
                        borderColor: "var(--md-sys-color-primary)",
                        color: "var(--md-sys-color-on-primary-container)",
                      } as React.CSSProperties)
                    : ({
                        backgroundColor: "transparent",
                        borderColor: "transparent",
                        color: "var(--md-sys-color-on-surface-variant)",
                      } as React.CSSProperties)
                }
              >
                {action.icon ? (
                  <MaterialSymbol icon={action.icon} size={16} />
                ) : (
                  <span className="text-[11px] font-semibold tracking-wide">
                    {action.text}
                  </span>
                )}
              </button>
            ))}
          </div>

          {showShortcuts && !isMobile ? (
            <p className="mt-2 px-1 text-[11px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
              Shortcuts: Ctrl+B bold, Ctrl+I italic, Ctrl+Z undo
            </p>
          ) : null}
        </div>
      ) : null}

      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
