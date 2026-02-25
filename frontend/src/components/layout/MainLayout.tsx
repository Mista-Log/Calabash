"use client";

import * as React from "react";
import Link from "next/link";
import { NavigationDrawer } from "./NavigationRail";
import { Toolbar } from "./Toolbar";
import { MaterialUIProvider } from "@/contexts/MaterialUIContext";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { useMaterialUI } from "@/contexts/MaterialUIContext";
import { cn } from "@/lib/utils";
import { useCommandPaletteShortcut } from "@/hooks/use-keyboard-shortcut";
import { CommandPalette } from "@/components/core/command-palette";
import { useUserStore } from "@/store/useUserStore";

export interface MainLayoutProps {
  children: React.ReactNode;
  showToolbar?: boolean;
  showNavigation?: boolean;
  showFooter?: boolean;
  toolbarTitle?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

/**
 * Material 3 Expressive Main Layout
 * Mobile-first responsive layout:
 * - Mobile: Full-width content, hamburger menu drawer
 * - Tablet/Desktop: Fixed navigation rail, fixed toolbar
 * - Content scrolls independently while header/sidebar stay fixed
 */
export function MainLayout({
  children,
  showToolbar = true,
  showNavigation = true,
  showFooter = true,
  toolbarTitle = "Calabash",
  showSearch = true,
  searchPlaceholder = "Search...",
  onSearch,
}: MainLayoutProps) {
  return (
    <MaterialUIProvider>
      <MainLayoutFrame
        showToolbar={showToolbar}
        showNavigation={showNavigation}
        showFooter={showFooter}
        toolbarTitle={toolbarTitle}
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder}
        onSearch={onSearch}
      >
        {children}
      </MainLayoutFrame>
    </MaterialUIProvider>
  );
}

function MainLayoutFrame({
  children,
  showToolbar,
  showNavigation,
  showFooter,
  toolbarTitle,
  showSearch,
  searchPlaceholder,
  onSearch,
}: MainLayoutProps) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const { user } = useUserStore();

  // Cmd+K opens command palette from anywhere in the layout
  useCommandPaletteShortcut(() => setIsCommandPaletteOpen(true));

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[color:var(--background)]">
      {/* Navigation Rail - Fixed on desktop, drawer on mobile */}
      {showNavigation && (
        <div className="fixed inset-y-0 left-0 z-40 h-screen">
          <NavigationDrawer />
        </div>
      )}

      {/* Main content wrapper */}
      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        {/* Toolbar - Fixed position at top */}
        {showToolbar && (
          <div className="fixed top-0 left-0 right-0 z-30 h-16 border-b border-[color:var(--md-sys-color-outline-variant)]">
            <Toolbar
              title={toolbarTitle}
              showSearch={showSearch}
              searchPlaceholder={searchPlaceholder}
              onSearch={onSearch}
              showNavigation={showNavigation}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            />
          </div>
        )}

        {/* Scrollable content area */}
        <MainContent
          showNavigation={!!showNavigation}
          showToolbar={!!showToolbar}
        >
          {children}
        </MainContent>

        {showFooter && (
          <div className="flex-shrink-0">
            <Footer />
          </div>
        )}
      </div>

      {/* Command Palette for search - Role-aware */}
      <CommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
        role={user?.role}
      />
    </div>
  );
}

function MainContent({
  showNavigation,
  showToolbar,
  children,
}: {
  showNavigation: boolean;
  showToolbar: boolean;
  children: React.ReactNode;
}) {
  const { isDrawerCollapsed } = useMaterialUI();

  return (
    <main
      className={cn(
        "flex flex-1 flex-col overflow-hidden",
        "transition-all duration-200",
        // Toolbar padding for fixed header
        showToolbar && "pt-16",
        // Desktop: left padding for navigation rail
        showNavigation && "lg:pl-[var(--app-nav-rail-collapsed-width)]",
        showNavigation &&
          !isDrawerCollapsed &&
          "lg:pl-[var(--app-nav-rail-expanded-width)]",
      )}
    >
      <div className="w-full h-full overflow-y-auto">{children}</div>
    </main>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)]">
      <div className="mx-auto w-full max-w-[1360px] px-3 py-5 sm:px-5 sm:py-7 lg:px-7 lg:py-9">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-full sm:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--md-sys-color-primary)]">
                <MaterialSymbol
                  icon="school"
                  size={18}
                  className="text-(--md-sys-color-on-primary)"
                />
              </div>
              <span className="m3-title-medium text-(--md-sys-color-on-surface)">
                Calabash
              </span>
            </div>
            <p className="m3-body-small text-(--md-sys-color-on-surface-variant)">
              Digital Library & Learning Management System
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 m3-label-large text-(--md-sys-color-on-surface)">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="m3-body-small text-(--md-sys-color-on-surface-variant) hover:text-(--md-sys-color-primary) transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="m3-body-small text-(--md-sys-color-on-surface-variant) hover:text-(--md-sys-color-primary) transition-colors"
                >
                  Library
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="m3-body-small text-(--md-sys-color-on-surface-variant) hover:text-(--md-sys-color-primary) transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/exams"
                  className="m3-body-small text-(--md-sys-color-on-surface-variant) hover:text-(--md-sys-color-primary) transition-colors"
                >
                  Assessment
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-3 m3-label-large text-(--md-sys-color-on-surface)">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/calendar"
                  className="m3-body-small text-(--md-sys-color-on-surface-variant) hover:text-(--md-sys-color-primary) transition-colors"
                >
                  Calendar
                </Link>
              </li>
              <li>
                <Link
                  href="/notes"
                  className="m3-body-small text-(--md-sys-color-on-surface-variant) hover:text-(--md-sys-color-primary) transition-colors"
                >
                  Notes
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="m3-body-small text-(--md-sys-color-on-surface-variant) hover:text-(--md-sys-color-primary) transition-colors"
                >
                  Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="m3-body-small text-(--md-sys-color-on-surface-variant) hover:text-(--md-sys-color-primary) transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 m3-label-large text-(--md-sys-color-on-surface)">
              Account
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/settings"
                  className="m3-body-small text-(--md-sys-color-on-surface-variant) hover:text-(--md-sys-color-primary) transition-colors"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="m3-body-small text-(--md-sys-color-on-surface-variant) hover:text-(--md-sys-color-primary) transition-colors"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/auth"
                  className="m3-body-small text-(--md-sys-color-on-surface-variant) hover:text-(--md-sys-color-primary) transition-colors"
                >
                  Account Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-[color:var(--md-sys-color-outline-variant)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="m3-body-small text-(--md-sys-color-on-surface-variant)">
            © {new Date().getFullYear()} Calabash. Built with Material 3
            Expressive.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center gap-2 rounded-full bg-[color:var(--md-sys-color-surface-container-high)] px-4 py-2 transition-colors hover:bg-[color:var(--md-sys-color-surface-container-highest)]">
              <MaterialSymbol
                icon="light_mode"
                size={18}
                className="text-(--md-sys-color-on-surface-variant)"
              />
              <span className="m3-label-large text-(--md-sys-color-on-surface-variant)">
                Light
              </span>
            </button>
            <button className="flex items-center gap-2 rounded-full bg-[color:var(--md-sys-color-surface-container-high)] px-4 py-2 transition-colors hover:bg-[color:var(--md-sys-color-surface-container-highest)]">
              <MaterialSymbol
                icon="dark_mode"
                size={18}
                className="text-(--md-sys-color-on-surface-variant)"
              />
              <span className="m3-label-large text-(--md-sys-color-on-surface-variant)">
                Dark
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
