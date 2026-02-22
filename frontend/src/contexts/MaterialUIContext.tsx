"use client";

import * as React from "react";

/**
 * Material 3 Expressive UI State Management
 * Manages navigation drawer, toolbar, and other UI states
 * Following Google Skills/Qwiklabs patterns
 */

export interface MaterialUIState {
  isUIHydrated: boolean;

  // Navigation Drawer
  isDrawerOpen: boolean;
  isDrawerCollapsed: boolean;
  toggleDrawer: () => void;
  toggleDrawerCollapsed: () => void;
  collapseDrawer: () => void;
  expandDrawer: () => void;
  
  // Search
  isSearchOpen: boolean;
  searchQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  
  // User Menu
  isUserMenuOpen: boolean;
  openUserMenu: () => void;
  closeUserMenu: () => void;
  
  // Notifications
  unreadNotifications: number;
  markNotificationsRead: () => void;

  // Gamification (Google Skills style)
  experiencePoints: number;
  streakCount: number;
  
  // Breadcrumbs
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

const MaterialUIContext = React.createContext<MaterialUIState | undefined>(undefined);
const DRAWER_COLLAPSED_STORAGE_KEY = "calabash-nav-rail-collapsed";

export function MaterialUIProvider({ children }: { children: React.ReactNode }) {
  const [isUIHydrated, setIsUIHydrated] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = React.useState(true);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [unreadNotifications, setUnreadNotifications] = React.useState(0);
  const [experiencePoints, setExperiencePoints] = React.useState(0);
  const [streakCount, setStreakCount] = React.useState(0);
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItem[]>([]);

  // Load state from localStorage
  React.useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem(DRAWER_COLLAPSED_STORAGE_KEY);
      if (savedCollapsed !== null) {
        setIsDrawerCollapsed(savedCollapsed === "true");
      }

      const savedXp = localStorage.getItem("experience-points");
      if (savedXp) {
        setExperiencePoints(parseInt(savedXp, 10));
      }

      const savedStreak = localStorage.getItem("streak-count");
      if (savedStreak) {
        setStreakCount(parseInt(savedStreak, 10));
      }
    } catch {
      // Ignore storage access failures (private mode, browser policies).
    } finally {
      setIsUIHydrated(true);
    }
  }, []);

  React.useEffect(() => {
    if (!isUIHydrated) {
      return;
    }

    try {
      localStorage.setItem(
        DRAWER_COLLAPSED_STORAGE_KEY,
        String(isDrawerCollapsed)
      );
    } catch {
      // Ignore storage access failures (private mode, browser policies).
    }
  }, [isDrawerCollapsed, isUIHydrated]);

  const toggleDrawer = React.useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const collapseDrawer = React.useCallback(() => {
    setIsDrawerCollapsed(true);
  }, []);

  const expandDrawer = React.useCallback(() => {
    setIsDrawerCollapsed(false);
  }, []);

  const toggleDrawerCollapsed = React.useCallback(() => {
    setIsDrawerCollapsed((prev) => !prev);
  }, []);

  const openSearch = React.useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = React.useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
  }, []);

  const openUserMenu = React.useCallback(() => {
    setIsUserMenuOpen(true);
  }, []);

  const closeUserMenu = React.useCallback(() => {
    setIsUserMenuOpen(false);
  }, []);

  const markNotificationsRead = React.useCallback(() => {
    setUnreadNotifications(0);
  }, []);

  const value = React.useMemo(
    () => ({
      isUIHydrated,
      isDrawerOpen,
      isDrawerCollapsed,
      toggleDrawer,
      toggleDrawerCollapsed,
      collapseDrawer,
      expandDrawer,
      isSearchOpen,
      searchQuery,
      openSearch,
      closeSearch,
      setSearchQuery,
      isUserMenuOpen,
      openUserMenu,
      closeUserMenu,
      unreadNotifications,
      markNotificationsRead,
      experiencePoints,
      streakCount,
      breadcrumbs,
      setBreadcrumbs,
    }),
    [
      isDrawerOpen,
      isDrawerCollapsed,
      isUIHydrated,
      isSearchOpen,
      searchQuery,
      isUserMenuOpen,
      unreadNotifications,
      experiencePoints,
      streakCount,
      breadcrumbs,
      toggleDrawer,
      toggleDrawerCollapsed,
      collapseDrawer,
      expandDrawer,
      openSearch,
      closeSearch,
      openUserMenu,
      closeUserMenu,
      markNotificationsRead,
    ]
  );

  return (
    <MaterialUIContext.Provider value={value}>
      {children}
    </MaterialUIContext.Provider>
  );
}

export function useMaterialUI() {
  const context = React.useContext(MaterialUIContext);
  if (context === undefined) {
    throw new Error("useMaterialUI must be used within a MaterialUIProvider");
  }
  return context;
}

// Helper functions for gamification
export function addExperiencePoints(points: number) {
  const current = parseInt(localStorage.getItem("experience-points") || "0", 10);
  const newValue = current + points;
  localStorage.setItem("experience-points", newValue.toString());
  // Trigger a storage event to update components
  window.dispatchEvent(new StorageEvent("storage", { key: "experience-points", newValue: newValue.toString() }));
}

export function updateStreak(days: number) {
  const current = parseInt(localStorage.getItem("streak-count") || "0", 10);
  const newValue = Math.max(current, days);
  localStorage.setItem("streak-count", newValue.toString());
  // Trigger a storage event to update components
  window.dispatchEvent(new StorageEvent("storage", { key: "streak-count", newValue: newValue.toString() }));
}
