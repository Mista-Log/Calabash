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

          {showUserMenu && (
            <div
              className={cn(
                "absolute right-0 mt-2 w-80",
                "bg-[color:var(--md-sys-color-surface-container)]",
                "rounded-3xl",
                "border border-[color:var(--md-sys-color-outline-variant)]",
                "shadow-2xl",
                "overflow-hidden",
                "z-50",
                "m3-motion-short",
              )}
              style={{
                animation: "slideDown 0.15s ease-out",
              }}
            >
              {/* Header with gradient background */}
              <div className="relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    background: "linear-gradient(135deg, var(--md-sys-color-primary-container) 0%, var(--md-sys-color-surface-container) 100%)",
                  }}
                />
                <div className="relative flex items-center gap-4 p-5">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-md"
                    style={{ backgroundColor: "var(--md-sys-color-primary)" }}
                  >
                    <MdIcon
                      className="text-[28px]"
                      style={{ color: "var(--md-sys-color-on-primary)" }}
                    >
                      person
                    </MdIcon>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="m3-title-medium truncate font-semibold text-[color:var(--md-sys-color-on-surface)]"
                    >
                      {user?.name || "User"}
                    </p>
                    <p
                      className="m3-body-small truncate text-[color:var(--md-sys-color-on-surface-variant)]"
                    >
                      {user?.email || "user@calabash.edu"}
                    </p>
                    {user?.role && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[color:var(--md-sys-color-secondary-container)] px-2 py-0.5">
                        <span className="m3-label-small font-semibold capitalize text-[color:var(--md-sys-color-on-secondary-container)]">
                          {user.role}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items - Hidden Scrollbar */}
              <div
                className="max-h-[60vh] overflow-y-auto py-2"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {/* Hide scrollbar for Chrome, Safari and Opera */}
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                  }
                `}</style>
                
                <div className="px-2">
                  <Link
                    href="/settings"
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3",
                      "m3-body-medium text-[color:var(--md-sys-color-on-surface-variant)]",
                      "hover:bg-[color:var(--md-sys-color-surface-container-high)]",
                      "transition-colors m3-motion-short",
                    )}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{ backgroundColor: "var(--md-sys-color-secondary-container)" }}
                    >
                      <MdIcon className="text-[20px] text-[color:var(--md-sys-color-on-secondary-container)]">
                        settings
                      </MdIcon>
                    </div>
                    <span className="font-medium">Settings</span>
                  </Link>

                  <Link
                    href="/support"
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3",
                      "m3-body-medium text-[color:var(--md-sys-color-on-surface-variant)]",
                      "hover:bg-[color:var(--md-sys-color-surface-container-high)]",
                      "transition-colors m3-motion-short",
                    )}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{ backgroundColor: "var(--md-sys-color-tertiary-container)" }}
                    >
                      <MdIcon className="text-[20px] text-[color:var(--md-sys-color-on-tertiary-container)]">
                        help
                      </MdIcon>
                    </div>
                    <span className="font-medium">Help & Support</span>
                  </Link>
                </div>

                {/* Divider */}
                <div className="my-2 px-2">
                  <div
                    className="h-px"
                    style={{ backgroundColor: "var(--md-sys-color-outline-variant)" }}
                  />
                </div>

                {/* Logout */}
                <div className="px-2">
                  <button
                    onClick={handleLogout}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-3",
                      "m3-body-medium",
                      "hover:bg-[color:var(--md-sys-color-error-container)]/20",
                      "transition-colors m3-motion-short",
                    )}
                    style={{ color: "var(--md-sys-color-error)" }}
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{ backgroundColor: "var(--md-sys-color-error-container)" }}
                    >
                      <MdIcon className="text-[20px] text-[color:var(--md-sys-color-on-error-container)]">
                        logout
                      </MdIcon>
                    </div>
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {actions}
      </div>
    </header>
  );
}
