"use client";

import * as React from "react";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import {
  initializeGlobalShortcuts,
  handleGlobalKeyboardEvent,
} from "@/lib/keyboard-shortcuts";

interface GlobalShortcutsProviderProps {
  children: React.ReactNode;
}

export function GlobalShortcutsProvider({ children }: GlobalShortcutsProviderProps) {
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = React.useState(false);

  // Initialize global shortcuts on mount
  React.useEffect(() => {
    initializeGlobalShortcuts();

    // Listen for shortcuts help event
    const handleOpenShortcuts = () => setIsShortcutsModalOpen(true);
    window.addEventListener("open-shortcuts-help", handleOpenShortcuts);

    // Listen for close modals event
    const handleCloseModals = () => {
      setIsShortcutsModalOpen(false);
    };
    window.addEventListener("close-modals", handleCloseModals);

    // Global keyboard event handler
    const handleKeyDown = (event: KeyboardEvent) => {
      handleGlobalKeyboardEvent(event);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-shortcuts-help", handleOpenShortcuts);
      window.removeEventListener("close-modals", handleCloseModals);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {children}

      {/* Keyboard Shortcuts Modal (Shift+/) - Available globally */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </>
  );
}
