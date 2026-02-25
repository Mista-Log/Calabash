"use client";

import * as React from "react";
import { useMaterialUI } from "@/contexts/MaterialUIContext";
import { MdIcon } from "@/components/core/md-icon";
import { MdIconButton } from "@/components/core/md-button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useRouter } from "next/navigation";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";

export interface ToolbarProps {
  title?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  showNavigation?: boolean;
  actions?: React.ReactNode;
  onOpenCommandPalette?: () => void;
}

export function Toolbar({
  title = "Calabash",
  showSearch = true,
  searchPlaceholder = "Search...",
  onSearch: _onSearch,
  showNavigation = true,
  actions,
  onOpenCommandPalette,
}: ToolbarProps) {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const { theme, setTheme } = useSettingsStore();
  const {
    experiencePoints,
    streakCount,
    isDrawerCollapsed,
    isUIHydrated,
    openDrawer,
  } = useMaterialUI();
  const showGamification = user?.role === "student";
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    "light",
  );
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push("/auth");
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showUserMenu &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const resolveTheme = (): "light" | "dark" =>
      theme === "system" ? (media.matches ? "dark" : "light") : theme;
    const applyResolvedTheme = () => setResolvedTheme(resolveTheme());

    applyResolvedTheme();

    if (theme !== "system") {
      return;
    }

    media.addEventListener("change", applyResolvedTheme);
    return () => media.removeEventListener("change", applyResolvedTheme);
  }, [theme]);

  return (
    <header
      className={cn(
        // Fixed positioning for consistent header
        "fixed top-0 z-30",
        "h-16",
        "flex items-center justify-between gap-4",
        "px-4",
        "bg-[color:var(--md-sys-color-surface-container-lowest)]",
        "border-b border-[color:var(--md-sys-color-outline-variant)]",
        "m3-motion-short",
        // Mobile: full width, starts from left edge
        "left-0 w-full",
        // Desktop: offset by navigation rail width
        showNavigation &&
          "lg:left-[var(--app-nav-rail-collapsed-width)] lg:w-[calc(100%-var(--app-nav-rail-collapsed-width))]",
        showNavigation &&
          isUIHydrated &&
          !isDrawerCollapsed &&
          "lg:left-[var(--app-nav-rail-expanded-width)] lg:w-[calc(100%-var(--app-nav-rail-expanded-width))]",
      )}
    >
      {/* Left Section - Menu & Logo */}
      <div className="flex items-center gap-2">
        {/* Mobile menu button - visible only on mobile/tablet */}
        <MdIconButton
          icon="menu"
          className={cn("lg:hidden", !showNavigation && "hidden")}
          aria-label="Toggle navigation"
          onClick={openDrawer}
        />

        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Calabash Home"
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-2xl"
            style={{ backgroundColor: "var(--md-sys-color-primary)" }}
          >
            <MdIcon
              className="text-[24px]"
              style={{ color: "var(--md-sys-color-on-primary)" }}
            >
              school
            </MdIcon>
          </div>
          {/* Logo text - hidden on small mobile */}
          <span
            className="hidden sm:block m3-title-large"
            style={{ color: "var(--md-sys-color-on-surface)" }}
          >
            {title}
          </span>
        </Link>
      </div>

      {/* Center Section - Command Palette Search */}
      <div className="flex-1 min-w-0 max-w-xl mx-auto">
        {showSearch && (
          <button
            onClick={onOpenCommandPalette}
            className={cn(
              "flex items-center gap-3",
              "w-full h-12 px-4",
              "rounded-[var(--md-sys-shape-corner-large)]",
              "bg-[color:var(--md-sys-color-surface-container-high)]",
              "hover:bg-[color:var(--md-sys-color-surface-container-highest)]",
              "transition-colors m3-motion-short"
            )}
          >
            <MaterialSymbol
              icon="search"
              size={24}
              className="text-[color:var(--md-sys-color-on-surface-variant)]"
            />
            <span
              className="m3-body-medium"
              style={{ color: "var(--md-sys-color-on-surface-variant)" }}
            >
              {searchPlaceholder}
            </span>
            <kbd
              className={cn(
                "hidden xl:inline-flex items-center gap-1 ml-auto",
                "px-2 py-1 text-xs font-medium rounded-lg",
                "bg-[color:var(--md-sys-color-surface-container)]",
                "text-[color:var(--md-sys-color-on-surface-variant)]"
              )}
            >
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-1">
        {showGamification && (
          <>
            {/* XP - Hidden on mobile */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "var(--md-sys-color-primary-container)" }}
              title="Experience Points"
              role="status"
              aria-label={`${experiencePoints.toLocaleString()} experience points`}
            >
              <MdIcon
                className="text-[20px]"
                style={{ color: "var(--md-sys-color-primary)" }}
              >
                stars
              </MdIcon>
              <span
                className="m3-label-large"
                style={{ color: "var(--md-sys-color-primary)" }}
              >
                {experiencePoints.toLocaleString()}
              </span>
            </div>

            {/* Streak - Hidden on mobile */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "var(--md-sys-color-tertiary-container)" }}
              title="Learning Streak"
              role="status"
              aria-label={`${streakCount} day learning streak`}
            >
              <MdIcon
                className="text-[20px]"
                style={{ color: "var(--md-sys-color-on-tertiary-container)" }}
              >
                local_fire_department
              </MdIcon>
              <span
                className="m3-label-large"
                style={{ color: "var(--md-sys-color-on-tertiary-container)" }}
              >
                {streakCount}
              </span>
            </div>
          </>
        )}

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <MdIconButton
            icon="person"
            style={{ backgroundColor: "var(--md-sys-color-primary)" }}
            aria-label="Account"
            title="My Account"
            onClick={() => setShowUserMenu(!showUserMenu)}
          />
        </div>

        {actions}
      </div>
    </header>
  );
}
