/**
 * Global Keyboard Shortcuts for Calabash
 * Comprehensive keyboard navigation and shortcuts
 */

export interface KeyboardShortcut {
  key: string;
  modifiers: ("ctrl" | "meta" | "alt" | "shift")[];
  action: () => void;
  description: string;
  category: "navigation" | "actions" | "global";
  enabled?: boolean;
}

// Keyboard shortcut registry
const shortcutRegistry = new Map<string, KeyboardShortcut>();

function getShortcutKey(shortcut: Omit<KeyboardShortcut, "action" | "description" | "category" | "enabled">): string {
  const parts = [...shortcut.modifiers, shortcut.key].map(k => k.toLowerCase());
  return parts.join("+");
}

/**
 * Register a keyboard shortcut
 */
export function registerShortcut(shortcut: KeyboardShortcut): void {
  const key = getShortcutKey(shortcut);
  shortcutRegistry.set(key, shortcut);
}

/**
 * Unregister a keyboard shortcut
 */
export function unregisterShortcut(key: string): void {
  shortcutRegistry.delete(key.toLowerCase());
}

/**
 * Get all registered shortcuts
 */
export function getAllShortcuts(): KeyboardShortcut[] {
  return Array.from(shortcutRegistry.values());
}

/**
 * Get shortcuts by category
 */
export function getShortcutsByCategory(category: KeyboardShortcut["category"]): KeyboardShortcut[] {
  return Array.from(shortcutRegistry.values()).filter(s => s.category === category);
}

/**
 * Check if a keyboard event matches a registered shortcut
 */
export function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  // Check modifiers
  const hasCtrl = event.ctrlKey || shortcut.modifiers.includes("ctrl");
  const hasMeta = event.metaKey || shortcut.modifiers.includes("meta");
  const hasAlt = event.altKey || shortcut.modifiers.includes("alt");
  const hasShift = event.shiftKey || shortcut.modifiers.includes("shift");

  const needsCtrl = shortcut.modifiers.includes("ctrl");
  const needsMeta = shortcut.modifiers.includes("meta");
  const needsAlt = shortcut.modifiers.includes("alt");
  const needsShift = shortcut.modifiers.includes("shift");

  // On Mac, Cmd can substitute for Ctrl
  const ctrlMatch = (needsCtrl && (hasCtrl || hasMeta)) || (!needsCtrl && !hasCtrl && !hasMeta);
  const metaMatch = (needsMeta && hasMeta) || (!needsMeta && !hasMeta);
  const altMatch = (needsAlt && hasAlt) || (!needsAlt && !hasAlt);
  const shiftMatch = (needsShift && hasShift) || (!needsShift && !hasShift);

  // Check key
  const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

  return ctrlMatch && metaMatch && altMatch && shiftMatch && keyMatch;
}

/**
 * Initialize global keyboard shortcuts
 */
export function initializeGlobalShortcuts(): void {
  // Navigation shortcuts
  registerShortcut({
    key: "g",
    modifiers: [],
    action: () => {}, // Handled by useKeyboardShortcut hook
    description: "Go to...",
    category: "navigation",
  });

  registerShortcut({
    key: "d",
    modifiers: [],
    action: () => {
      if (window.location.pathname !== "/dashboard") {
        window.location.href = "/dashboard";
      }
    },
    description: "Go to Dashboard",
    category: "navigation",
  });

  registerShortcut({
    key: "c",
    modifiers: [],
    action: () => {
      if (window.location.pathname !== "/courses") {
        window.location.href = "/courses";
      }
    },
    description: "Go to Courses",
    category: "navigation",
  });

  registerShortcut({
    key: "l",
    modifiers: [],
    action: () => {
      if (window.location.pathname !== "/library") {
        window.location.href = "/library";
      }
    },
    description: "Go to Library",
    category: "navigation",
  });

  registerShortcut({
    key: "n",
    modifiers: [],
    action: () => {
      if (window.location.pathname !== "/notes") {
        window.location.href = "/notes";
      }
    },
    description: "Go to Notes",
    category: "navigation",
  });

  registerShortcut({
    key: "k",
    modifiers: ["meta", "ctrl"],
    action: () => {
      // Command palette - handled by CommandPalette component
      const event = new CustomEvent("open-command-palette");
      window.dispatchEvent(event);
    },
    description: "Open Command Palette",
    category: "global",
  });

  registerShortcut({
    key: "k",
    modifiers: ["meta", "ctrl", "shift"],
    action: () => {
      // Toggle theme
      const event = new CustomEvent("toggle-theme");
      window.dispatchEvent(event);
    },
    description: "Toggle Light/Dark Theme",
    category: "actions",
  });

  registerShortcut({
    key: "?",
    modifiers: ["shift"],
    action: () => {
      // Open keyboard shortcuts help
      const event = new CustomEvent("open-shortcuts-help");
      window.dispatchEvent(event);
    },
    description: "Show Keyboard Shortcuts",
    category: "global",
  });

  registerShortcut({
    key: "Escape",
    modifiers: [],
    action: () => {
      // Close modals/drawers
      const event = new CustomEvent("close-modals");
      window.dispatchEvent(event);
    },
    description: "Close Modals/Drawers",
    category: "global",
  });

  registerShortcut({
    key: "r",
    modifiers: ["meta", "ctrl"],
    action: () => {
      // Refresh current page
      window.location.reload();
    },
    description: "Refresh Page",
    category: "actions",
  });

  registerShortcut({
    key: "/",
    modifiers: [],
    action: () => {
      // Focus search
      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    description: "Focus Search",
    category: "actions",
  });

  registerShortcut({
    key: "n",
    modifiers: ["meta", "ctrl"],
    action: () => {
      // New note
      if (window.location.pathname.startsWith("/notes")) {
        const newNoteButton = document.querySelector('[data-action="new-note"]') as HTMLElement;
        if (newNoteButton) {
          newNoteButton.click();
        }
      }
    },
    description: "Create New Note",
    category: "actions",
  });

  registerShortcut({
    key: "u",
    modifiers: ["meta", "ctrl"],
    action: () => {
      // Upload material (lecturers)
      if (window.location.pathname.startsWith("/upload")) {
        window.location.href = "/upload";
      }
    },
    description: "Open Upload",
    category: "actions",
  });

  // Arrow key navigation for lists
  registerShortcut({
    key: "ArrowDown",
    modifiers: [],
    action: () => {
      // Navigate down in lists
      const event = new CustomEvent("navigate-list", { detail: { direction: "down" } });
      window.dispatchEvent(event);
    },
    description: "Navigate Down",
    category: "navigation",
    enabled: false, // Context-specific
  });

  registerShortcut({
    key: "ArrowUp",
    modifiers: [],
    action: () => {
      // Navigate up in lists
      const event = new CustomEvent("navigate-list", { detail: { direction: "up" } });
      window.dispatchEvent(event);
    },
    description: "Navigate Up",
    category: "navigation",
    enabled: false, // Context-specific
  });

  registerShortcut({
    key: "Enter",
    modifiers: [],
    action: () => {
      // Select/activate focused item
      const event = new CustomEvent("activate-item");
      window.dispatchEvent(event);
    },
    description: "Select Item",
    category: "actions",
    enabled: false, // Context-specific
  });
}

/**
 * Handle keyboard event globally
 */
export function handleGlobalKeyboardEvent(event: KeyboardEvent): void {
  // Ignore if typing in input/textarea
  const target = event.target as HTMLElement;
  if (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  ) {
    // Allow escape to work even in inputs
    if (event.key !== "Escape") {
      return;
    }
  }

  // Check against registered shortcuts
  for (const shortcut of shortcutRegistry.values()) {
    if (shortcut.enabled === false) continue;
    
    if (matchesShortcut(event, shortcut)) {
      event.preventDefault();
      shortcut.action();
      return;
    }
  }
}

/**
 * Keyboard shortcuts help data
 */
export const KEYBOARD_SHORTCUTS_HELP = {
  navigation: [
    { keys: ["d"], description: "Go to Dashboard" },
    { keys: ["c"], description: "Go to Courses" },
    { keys: ["l"], description: "Go to Library" },
    { keys: ["n"], description: "Go to Notes" },
    { keys: ["↓", "↑"], description: "Navigate lists" },
    { keys: ["Enter"], description: "Select item" },
  ],
  actions: [
    { keys: ["⌘/Ctrl", "k"], description: "Open command palette" },
    { keys: ["⌘/Ctrl", "/"], description: "Focus search" },
    { keys: ["⌘/Ctrl", "n"], description: "New note" },
    { keys: ["⌘/Ctrl", "u"], description: "Upload material" },
    { keys: ["⌘/Ctrl", "r"], description: "Refresh page" },
    { keys: ["⌘/Ctrl", "⇧", "k"], description: "Toggle theme" },
  ],
  global: [
    { keys: ["⇧", "?"], description: "Show shortcuts help" },
    { keys: ["Esc"], description: "Close modals/drawers" },
  ],
};
