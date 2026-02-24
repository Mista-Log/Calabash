"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { M3Button } from "@/components/core";

export interface CommandPaletteItem {
  id: string;
  label: string;
  description?: string;
  icon: string;
  href: string;
  category: "navigation" | "actions" | "courses" | "library";
  shortcut?: string[];
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items?: CommandPaletteItem[];
  role?: "student" | "lecturer";
}

// Role-specific items
const STUDENT_ITEMS: CommandPaletteItem[] = [
  { id: "dashboard", label: "Dashboard", description: "Go to your dashboard", icon: "dashboard", href: "/dashboard", category: "navigation" },
  { id: "courses", label: "My Courses", description: "View enrolled courses", icon: "school", href: "/courses", category: "navigation" },
  { id: "library", label: "Library", description: "Browse materials", icon: "library_books", href: "/library", category: "navigation" },
  { id: "calendar", label: "Calendar", description: "View academic calendar", icon: "calendar_month", href: "/calendar", category: "navigation" },
  { id: "notes", label: "My Notes", description: "Access your notes", icon: "note_add", href: "/notes", category: "actions" },
  { id: "achievements", label: "Achievements", description: "View achievements", icon: "emoji_events", href: "/dashboard", category: "actions" },
];

const LECTURER_ITEMS: CommandPaletteItem[] = [
  { id: "dashboard", label: "Dashboard", description: "Go to your dashboard", icon: "dashboard", href: "/dashboard", category: "navigation" },
  { id: "courses", label: "My Courses", description: "Manage your courses", icon: "school", href: "/courses", category: "navigation" },
  { id: "library", label: "Library", description: "Browse materials", icon: "library_books", href: "/library", category: "navigation" },
  { id: "analytics", label: "Analytics", description: "View insights", icon: "analytics", href: "/analytics", category: "navigation" },
  { id: "upload", label: "Upload Material", description: "Publish new material", icon: "upload_file", href: "/upload", category: "actions" },
  { id: "create-course", label: "Create Course", description: "Add new course", icon: "add_circle", href: "/courses/add", category: "actions" },
];

const COMMON_ITEMS: CommandPaletteItem[] = [
  { id: "settings", label: "Settings", description: "Manage preferences", icon: "settings", href: "/settings", category: "navigation" },
  { id: "support", label: "Support", description: "Get help", icon: "help", href: "/support", category: "navigation" },
];

const CATEGORY_ICONS: Record<CommandPaletteItem["category"], string> = {
  navigation: "route",
  actions: "bolt",
  courses: "school",
  library: "library_books",
};

export function CommandPalette({
  open,
  onOpenChange,
  items,
  role,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Use role-based items if no items provided
  const defaultItems = React.useMemo(() => {
    if (role === "student") {
      return [...STUDENT_ITEMS, ...COMMON_ITEMS];
    }
    if (role === "lecturer") {
      return [...LECTURER_ITEMS, ...COMMON_ITEMS];
    }
    return COMMON_ITEMS;
  }, [role]);

  const resolvedItems = items ?? defaultItems;

  const filteredItems = React.useMemo(() => {
    if (!query) return resolvedItems;
    const lowerQuery = query.toLowerCase();
    return resolvedItems.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    );
  }, [query, resolvedItems]);

  const groupedItems = React.useMemo(() => {
    const groups: Record<string, CommandPaletteItem[]> = {
      navigation: [],
      actions: [],
      courses: [],
      library: [],
    };
    filteredItems.forEach((item) => {
      groups[item.category].push(item);
    });
    return Object.entries(groups).filter(([_, groupItems]) => groupItems.length > 0);
  }, [filteredItems]);

  const flatItems = React.useMemo(() => {
    return groupedItems.flatMap(([_, groupItems]) => groupItems);
  }, [groupedItems]);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selectedItem = flatItems[selectedIndex];
        if (selectedItem) {
          onOpenChange(false);
          router.push(selectedItem.href);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, flatItems, selectedIndex, onOpenChange, router]);

  if (!open) return null;

  return (
    <div
      className="app-overlay-root"
      role="dialog"
      aria-modal="true"
      onClick={() => onOpenChange(false)}
    >
      <div aria-hidden="true" className="app-overlay-scrim" />
      <div className="app-overlay-center">
      <div
        className="app-overlay-panel w-full max-w-[44rem] overflow-hidden rounded-[24px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-[color:var(--md-sys-color-outline-variant)] px-5 py-4">
          <MaterialSymbol
            icon="search"
            size={20}
            className="text-[color:var(--md-sys-color-on-surface-variant)]"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-[15px] font-medium text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] focus:outline-none"
          />
          <div className="flex items-center gap-1">
            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded bg-[color:var(--md-sys-color-surface-container-highest)] px-1.5 text-[11px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">
              ⌘K
            </kbd>
            <M3Button
              variant="text"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
              aria-label="Close search"
            >
              <MaterialSymbol icon="close" size={18} />
            </M3Button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[420px] overflow-y-auto px-3 py-2">
          {flatItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MaterialSymbol
                icon="search_off"
                size={32}
                className="mb-3 text-[color:var(--md-sys-color-on-surface-variant)]"
              />
              <p className="text-[14px] font-medium text-[color:var(--md-sys-color-on-surface)]">
                No results found
              </p>
              <p className="mt-1 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                Try searching for something else
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {groupedItems.map(([category, categoryItems]) => (
                <div key={category} className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1.5">
                    <MaterialSymbol
                      icon={CATEGORY_ICONS[category as CommandPaletteItem["category"]]}
                      size={14}
                      className="text-[color:var(--md-sys-color-on-surface-variant)]"
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--md-sys-color-on-surface-variant)]">
                      {category}
                    </span>
                  </div>
                  {categoryItems.map((item) => {
                    const index = flatItems.indexOf(item);
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onOpenChange(false);
                          router.push(item.href);
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                          isSelected
                            ? "bg-[color:var(--md-sys-color-primary-container)]"
                            : "hover:bg-[color:var(--md-sys-color-surface-container-high)]"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full",
                            isSelected
                              ? "bg-[color:var(--md-sys-color-primary)]"
                              : "bg-[color:var(--md-sys-color-surface-container-highest)]"
                          )}
                        >
                          <MaterialSymbol
                            icon={item.icon}
                            size={18}
                            className={cn(
                              isSelected
                                ? "text-[color:var(--md-sys-color-on-primary)]"
                                : "text-[color:var(--md-sys-color-on-surface-variant)]"
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "truncate text-[14px] font-semibold",
                              isSelected
                                ? "text-[color:var(--md-sys-color-on-primary-container)]"
                                : "text-[color:var(--md-sys-color-on-surface)]"
                            )}
                          >
                            {item.label}
                          </p>
                          {item.description && (
                            <p
                              className={cn(
                                "truncate text-[12px]",
                                isSelected
                                  ? "text-[color:var(--md-sys-color-on-primary-container)]"
                                  : "text-[color:var(--md-sys-color-on-surface-variant)]"
                              )}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>
                        {item.shortcut && (
                          <div className="flex items-center gap-1">
                            {item.shortcut.map((key, i) => (
                              <React.Fragment key={i}>
                                <kbd
                                  className={cn(
                                    "flex h-6 min-w-[24px] items-center justify-center rounded-lg px-1.5 text-[11px] font-semibold",
                                    "border border-[color:var(--md-sys-color-outline)]",
                                    isSelected
                                      ? "bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)]"
                                      : "bg-[color:var(--md-sys-color-surface-container-highest)] text-[color:var(--md-sys-color-on-surface-variant)]"
                                  )}
                                >
                                  {key}
                                </kbd>
                                {i < (item.shortcut?.length ?? 0) - 1 && (
                                  <span className={cn(
                                    "text-[11px]",
                                    isSelected
                                      ? "text-[color:var(--md-sys-color-on-primary-container)]"
                                      : "text-[color:var(--md-sys-color-on-surface-variant)]"
                                  )}>
                                    +
                                  </span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[color:var(--md-sys-color-outline-variant)] px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <kbd className="flex h-5 items-center justify-center rounded bg-[color:var(--md-sys-color-surface-container-highest)] px-1.5 text-[10px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">
                ↑↓
              </kbd>
              <span className="text-[11px] text-[color:var(--md-sys-color-on-surface-variant)]">
                to navigate
              </span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="flex h-5 items-center justify-center rounded bg-[color:var(--md-sys-color-surface-container-highest)] px-1.5 text-[10px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">
                ↵
              </kbd>
              <span className="text-[11px] text-[color:var(--md-sys-color-on-surface-variant)]">
                to select
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="flex h-5 items-center justify-center rounded bg-[color:var(--md-sys-color-surface-container-highest)] px-1.5 text-[10px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">
              Esc
            </kbd>
            <span className="text-[11px] text-[color:var(--md-sys-color-on-surface-variant)]">
              to close
            </span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
