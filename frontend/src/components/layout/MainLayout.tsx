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
 *
 * Implements Google Skills/Qwiklabs patterns:
 * - Navigation Rail (Desktop) - Collapsed/expanded widths from app tokens
 * - Mobile Drawer - Slide-in drawer for mobile/tablet
 * - Top App Bar (Toolbar) - Search, gamification, user menu
 * - Content Area - Main content with proper padding
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
    <div className="min-h-screen bg-[color:var(--background)]">
      {showNavigation && (
        <>
          <NavigationDrawer />
        </>
      )}

      {showToolbar && (
        <Toolbar
          title={toolbarTitle}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
          showNavigation={showNavigation}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />
      )}

      <MainContent
        showNavigation={!!showNavigation}
        showToolbar={!!showToolbar}
      >
        {children}
      </MainContent>

      {showFooter && <Footer />}

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
        "min-h-[calc(100vh-4rem)] pb-4 transition-all duration-200",
        showToolbar ? "pt-2 sm:pt-3" : "pt-0",
        showNavigation && "lg:ml-[var(--app-nav-rail-collapsed-width)]",
        showNavigation &&
          !isDrawerCollapsed &&
          "lg:ml-[var(--app-nav-rail-expanded-width)]",
      )}
    >
      <div className="w-full">{children}</div>
    </main>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[color:var(--md-sys-color-primary)]">
                <MaterialSymbol
                  icon="school"
                  size={18}
                  className="text-[color:var(--md-sys-color-on-primary)]"
                />
              </div>
              <span className="m3-title-medium text-[color:var(--md-sys-color-on-surface)]">
                Calabash
              </span>
            </div>
            <p className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]">
              Digital Library & Learning Management System
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="m3-label-large text-[color:var(--md-sys-color-on-surface)] mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-primary)] transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-primary)] transition-colors"
                >
                  Library
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-primary)] transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/exams"
                  className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-primary)] transition-colors"
                >
                  Assessment
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="m3-label-large text-[color:var(--md-sys-color-on-surface)] mb-3">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/calendar"
                  className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-primary)] transition-colors"
                >
                  Calendar
                </Link>
              </li>
              <li>
                <Link
                  href="/notes"
                  className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-primary)] transition-colors"
                >
                  Notes
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-primary)] transition-colors"
                >
                  Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-primary)] transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="m3-label-large text-[color:var(--md-sys-color-on-surface)] mb-3">
              Account
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/settings"
                  className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-primary)] transition-colors"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-primary)] transition-colors"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/auth"
                  className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-primary)] transition-colors"
                >
                  Account Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-[color:var(--md-sys-color-outline-variant)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]">
            © {new Date().getFullYear()} Calabash. Built with Material 3
            Expressive.
          </p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--md-sys-color-surface-container-high)] hover:bg-[color:var(--md-sys-color-surface-container-highest)] transition-colors">
              <MaterialSymbol
                icon="light_mode"
                size={18}
                className="text-[color:var(--md-sys-color-on-surface-variant)]"
              />
              <span className="m3-label-large text-[color:var(--md-sys-color-on-surface-variant)]">
                Light
              </span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--md-sys-color-surface-container-high)] hover:bg-[color:var(--md-sys-color-surface-container-highest)] transition-colors">
              <MaterialSymbol
                icon="dark_mode"
                size={18}
                className="text-[color:var(--md-sys-color-on-surface-variant)]"
              />
              <span className="m3-label-large text-[color:var(--md-sys-color-on-surface-variant)]">
                Dark
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
