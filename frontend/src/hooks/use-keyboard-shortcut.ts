"use client";

import * as React from "react";

export interface UseKeyboardShortcutOptions {
  preventDefault?: boolean;
  enabled?: boolean;
}

/**
 * Hook for registering global keyboard shortcuts
 */
export function useKeyboardShortcut(
  keys: string[],
  callback: () => void,
  options: UseKeyboardShortcutOptions = {}
) {
  const { preventDefault = true, enabled = true } = options;

  React.useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if all required keys are pressed
      const isMatch = keys.every((key) => {
        const lowerKey = key.toLowerCase();
        
        // Handle modifier keys
        if (lowerKey === "cmd" || lowerKey === "meta") {
          return event.metaKey;
        }
        if (lowerKey === "ctrl") {
          return event.ctrlKey;
        }
        if (lowerKey === "alt") {
          return event.altKey;
        }
        if (lowerKey === "shift") {
          return event.shiftKey;
        }

        // Handle regular keys
        return event.key.toLowerCase() === lowerKey;
      });

      // Check that no extra modifier keys are pressed (unless specified)
      const hasExtraModifiers =
        (keys.some((k) => k.toLowerCase() === "cmd" || k.toLowerCase() === "meta")
          ? false
          : event.metaKey) ||
        (keys.some((k) => k.toLowerCase() === "ctrl") ? false : event.ctrlKey) ||
        (keys.some((k) => k.toLowerCase() === "alt") ? false : event.altKey);

      if (isMatch && !hasExtraModifiers) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keys, callback, preventDefault, enabled]);
}

/**
 * Hook for Cmd+K command palette shortcut
 */
export function useCommandPaletteShortcut(onOpen: () => void) {
  useKeyboardShortcut(["meta", "k"], onOpen);
  useKeyboardShortcut(["ctrl", "k"], onOpen); // Windows/Linux support
}

/**
 * Hook for Escape key
 */
export function useEscapeKey(callback: () => void, enabled = true) {
  useKeyboardShortcut(["escape"], callback, { enabled });
}

/**
 * Hook for Shift+/ (?) to show shortcuts
 */
export function useShowShortcutsShortcut(onOpen: () => void) {
  useKeyboardShortcut(["shift", "/"], onOpen);
}
