"use client";

import * as React from "react";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { M3Button } from "@/components/core";
import { KEYBOARD_SHORTCUTS_HELP, getAllShortcuts } from "@/lib/keyboard-shortcuts";
import { cn } from "@/lib/utils";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Close on Escape
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
        className={cn(
          "relative w-full max-w-2xl max-h-[80vh] overflow-y-auto",
          "bg-[color:var(--md-sys-color-surface-container)]",
          "rounded-3xl",
          "border border-[color:var(--md-sys-color-outline-variant)]",
          "shadow-2xl",
          "animate-fade-in",
        )}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] px-6 py-4 z-10">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "var(--md-sys-color-primary-container)" }}
            >
              <MaterialSymbol
                icon="keyboard"
                size={22}
                className="text-[color:var(--md-sys-color-on-primary-container)]"
              />
            </div>
            <h2
              id="shortcuts-modal-title"
              className="m3-title-large text-[color:var(--md-sys-color-on-surface)]"
            >
              Keyboard Shortcuts
            </h2>
          </div>
          <M3Button
            variant="text"
            size="sm"
            onClick={onClose}
            className="h-9 w-9 p-0"
            aria-label="Close keyboard shortcuts"
          >
            <MaterialSymbol icon="close" size={20} />
          </M3Button>
        </div>

        {/* Content */}
        <div className="space-y-6 px-6 py-4">
          {/* Navigation Shortcuts */}
          <section>
            <h3 className="m3-title-small mb-3 text-[color:var(--md-sys-color-on-surface)]">
              Navigation
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {KEYBOARD_SHORTCUTS_HELP.navigation.map((shortcut) => (
                <ShortcutRow key={shortcut.description} shortcut={shortcut} />
              ))}
            </div>
          </section>

          {/* Actions Shortcuts */}
          <section>
            <h3 className="m3-title-small mb-3 text-[color:var(--md-sys-color-on-surface)]">
              Actions
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {KEYBOARD_SHORTCUTS_HELP.actions.map((shortcut) => (
                <ShortcutRow key={shortcut.description} shortcut={shortcut} />
              ))}
            </div>
          </section>

          {/* Global Shortcuts */}
          <section>
            <h3 className="m3-title-small mb-3 text-[color:var(--md-sys-color-on-surface)]">
              Global
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {KEYBOARD_SHORTCUTS_HELP.global.map((shortcut) => (
                <ShortcutRow key={shortcut.description} shortcut={shortcut} />
              ))}
            </div>
          </section>

          {/* Tips */}
          <div
            className="mt-6 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-primary-container)]/10 p-4"
          >
            <div className="flex items-start gap-3">
              <MaterialSymbol
                icon="lightbulb"
                size={20}
                className="mt-0.5 text-[color:var(--md-sys-color-primary)]"
              />
              <div>
                <p className="m3-body-small font-semibold text-[color:var(--md-sys-color-on-surface)]">
                  Pro Tip
                </p>
                <p className="mt-1 m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]">
                  Press <kbd className="mx-1 rounded bg-[color:var(--md-sys-color-surface-container-high)] px-1.5 py-0.5 text-xs font-semibold">⌘</kbd> + <kbd className="mx-1 rounded bg-[color:var(--md-sys-color-surface-container-high)] px-1.5 py-0.5 text-xs font-semibold">K</kbd> to quickly open the command palette and search anything.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] px-6 py-4">
          <M3Button
            variant="outlined"
            layout="mobile-full"
            onClick={onClose}
            className="w-full"
          >
            Got it
          </M3Button>
        </div>
      </div>
    </div>
  );
}

interface ShortcutRowProps {
  shortcut: {
    keys: string[];
    description: string;
  };
}

function ShortcutRow({ shortcut }: ShortcutRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-3 py-2.5">
      <span className="m3-body-small text-[color:var(--md-sys-color-on-surface)]">
        {shortcut.description}
      </span>
      <div className="flex shrink-0 items-center gap-1">
        {shortcut.keys.map((key, index) => (
          <React.Fragment key={index}>
            <kbd
              className={cn(
                "inline-flex min-w-[24px] items-center justify-center rounded-lg px-2 py-1",
                "bg-[color:var(--md-sys-color-surface-container-high)]",
                "text-[11px] font-semibold text-[color:var(--md-sys-color-on-surface)]",
                "border border-[color:var(--md-sys-color-outline-variant)]",
              )}
            >
              {key}
            </kbd>
            {index < shortcut.keys.length - 1 && (
              <span className="text-[color:var(--md-sys-color-on-surface-variant)]">+</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
