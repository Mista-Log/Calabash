"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { M3Button } from "@/components/core";

export interface KeyboardShortcut {
  keys: string[];
  description: string;
  category: "navigation" | "actions" | "general";
}

export interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortcuts?: KeyboardShortcut[];
}

const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  { keys: ["⌘", "K"], description: "Quick search", category: "navigation" },
  { keys: ["G", "D"], description: "Go to Dashboard", category: "navigation" },
  { keys: ["G", "C"], description: "Go to Courses", category: "navigation" },
  { keys: ["G", "L"], description: "Go to Library", category: "navigation" },
  { keys: ["G", "S"], description: "Go to Settings", category: "navigation" },
  { keys: ["?"], description: "Show shortcuts", category: "general" },
  { keys: ["Esc"], description: "Close modal/dialog", category: "general" },
  { keys: ["U"], description: "Upload material", category: "actions" },
  { keys: ["N"], description: "New note", category: "actions" },
  { keys: ["C"], description: "Create course", category: "actions" },
];

const CATEGORY_LABELS: Record<KeyboardShortcut["category"], string> = {
  navigation: "Navigation",
  actions: "Actions",
  general: "General",
};

export function KeyboardShortcutsModal({
  open,
  onOpenChange,
  shortcuts = DEFAULT_SHORTCUTS,
}: KeyboardShortcutsModalProps) {
  const groupedShortcuts = React.useMemo(() => {
    const groups: Record<string, KeyboardShortcut[]> = {
      navigation: [],
      actions: [],
      general: [],
    };
    shortcuts.forEach((shortcut) => {
      groups[shortcut.category].push(shortcut);
    });
    return groups;
  }, [shortcuts]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="app-overlay-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
      onClick={() => onOpenChange(false)}
    >
      <div aria-hidden="true" className="app-overlay-scrim" />
      <div className="app-overlay-center">
      <div
        className="app-overlay-panel w-full max-w-3xl overflow-hidden rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[color:var(--md-sys-color-outline-variant)] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary-container)]">
              <MaterialSymbol
                icon="keyboard"
                size={20}
                className="text-[color:var(--md-sys-color-primary)]"
              />
            </div>
            <h2
              id="shortcuts-modal-title"
              className="text-xl font-semibold text-[color:var(--md-sys-color-on-surface)]"
            >
              Keyboard Shortcuts
            </h2>
          </div>
          <M3Button
            variant="text"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0"
            aria-label="Close shortcuts"
          >
            <MaterialSymbol icon="close" size={18} />
          </M3Button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              categoryShortcuts.length > 0 && (
                <div key={category} className="space-y-3">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
                    {CATEGORY_LABELS[category as KeyboardShortcut["category"]]}
                  </h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4 rounded-xl bg-[color:var(--md-sys-color-surface-container-low)] px-3 py-2.5"
                      >
                        <span className="text-[14px] font-medium text-[color:var(--md-sys-color-on-surface)]">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {shortcut.keys.map((key, keyIndex) => (
                            <React.Fragment key={keyIndex}>
                              <kbd
                                className={cn(
                                  "flex min-w-[28px] items-center justify-center rounded-lg px-2 py-1.5 text-[13px] font-semibold",
                                  "border border-[color:var(--md-sys-color-outline-variant)]",
                                  "bg-[color:var(--md-sys-color-surface-container-highest)]",
                                  "text-[color:var(--md-sys-color-on-surface)]"
                                )}
                              >
                                {key}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="text-[color:var(--md-sys-color-on-surface-variant)]">
                                  +
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[color:var(--md-sys-color-outline-variant)] px-6 py-4">
          <p className="text-center text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
            Press{" "}
            <kbd className="mx-1 rounded bg-[color:var(--md-sys-color-surface-container-highest)] px-2 py-0.5 text-[12px] font-semibold">
              ?
            </kbd>{" "}
            anytime to view this help
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
