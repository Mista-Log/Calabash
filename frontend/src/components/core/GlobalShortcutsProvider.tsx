"use client";

import * as React from "react";
import { KeyboardShortcutsModal } from "@/components/core/keyboard-shortcuts-modal";
import { useShowShortcutsShortcut } from "@/hooks/use-keyboard-shortcut";
import type { KeyboardShortcut } from "@/components/core/keyboard-shortcuts-modal";

interface GlobalShortcutsProviderProps {
  children: React.ReactNode;
}

// Universal shortcuts (same for all roles)
const UNIVERSAL_SHORTCUTS: KeyboardShortcut[] = [
  { keys: ["⌘", "K"], description: "Quick Search", category: "general" },
  { keys: ["Shift", "/"], description: "Show Shortcuts", category: "general" },
  { keys: ["Esc"], description: "Close Modal", category: "general" },
];

export function GlobalShortcutsProvider({ children }: GlobalShortcutsProviderProps) {
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = React.useState(false);

  // Global keyboard shortcuts - only Shift+/ for shortcuts modal
  useShowShortcutsShortcut(() => setIsShortcutsModalOpen(true));

  return (
    <>
      {children}

      {/* Keyboard Shortcuts Modal (Shift+/) - Available globally */}
      <KeyboardShortcutsModal
        open={isShortcutsModalOpen}
        onOpenChange={setIsShortcutsModalOpen}
        shortcuts={UNIVERSAL_SHORTCUTS}
      />
    </>
  );
}
