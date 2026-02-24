"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ensureMaterialWebRegistered } from "@/lib/material-web";
import { useUserStore } from "@/store/useUserStore";
import { useMaterialUI } from "@/contexts/MaterialUIContext";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  filledIcon?: string;
  badge?: number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const studentNavGroups: NavGroup[] = [
  {
    label: "Learn",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: "dashboard",
        filledIcon: "dashboard",
      },
      {
        title: "Library",
        href: "/library",
        icon: "local_library",
        filledIcon: "local_library",
      },
      { title: "My Courses", href: "/courses", icon: "book", filledIcon: "book" },
      { title: "My Notes", href: "/notes", icon: "note", filledIcon: "note" },
      {
        title: "Calendar",
        href: "/calendar",
        icon: "calendar_month",
        filledIcon: "calendar_month",
      },
      {
        title: "Assessment",
        href: "/exams",
        icon: "assignment",
        filledIcon: "assignment",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: "settings",
        filledIcon: "settings",
      },
      { title: "Support", href: "/support", icon: "help", filledIcon: "help" },
    ],
  },
];

export const lecturerNavGroups: NavGroup[] = [
  {
    label: "Teach",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: "dashboard",
        filledIcon: "dashboard",
      },
      { title: "My Courses", href: "/courses", icon: "book", filledIcon: "book" },
      { title: "Upload", href: "/upload", icon: "upload", filledIcon: "upload" },
      {
        title: "Calendar",
        href: "/calendar",
        icon: "calendar_month",
        filledIcon: "calendar_month",
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        title: "Library",
        href: "/library",
        icon: "local_library",
        filledIcon: "local_library",
      },
      {
        title: "Analytics",
        href: "/analytics",
        icon: "analytics",
        filledIcon: "analytics",
      }
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: "settings",
        filledIcon: "settings",
      },
      { title: "Support", href: "/support", icon: "help", filledIcon: "help" },
    ],
  },
];

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface NavRailItemProps {
  item: NavItem;
  expanded: boolean;
  isActive: boolean;
  onActivate?: () => void;
}

function NavRailItem({
  item,
  expanded,
  isActive,
  onActivate,
}: NavRailItemProps) {
  const inactiveIcon = item.icon;
  const activeIcon = item.filledIcon || item.icon;
  const expandedIconName = inactiveIcon;
  const activeSlotIconName = expanded ? expandedIconName : activeIcon;
  const activeSlotIconClass =
    expanded && !isActive ? "material-icons-outlined" : "material-icons-filled";

  return React.createElement(
    "md-nav-item",
    {
      href: item.href,
      label: item.title,
      "badge-value": item.badge || undefined,
      "show-badge": !!item.badge ? true : undefined,
      expanded: !!expanded,
      active: !!isActive,
      onClick: onActivate,
    },
    React.createElement("span", {
      slot: "active-icon",
      className: activeSlotIconClass,
      suppressHydrationWarning: true,
    }, activeSlotIconName),
    React.createElement("span", {
      slot: "inactive-icon",
      className: "material-icons-outlined",
      suppressHydrationWarning: true,
    }, inactiveIcon),
  );
}

interface NavigationRailProps {
  isCollapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function NavigationRail({
  isCollapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: NavigationRailProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hasHydrated } = useUserStore();
  const [isNavReady, setIsNavReady] = React.useState(false);
  const [canDismissMobileDrawer, setCanDismissMobileDrawer] = React.useState(false);
  const mobileOpenRef = React.useRef(mobileOpen);
  const isLecturer = user?.role === "lecturer";
  const navGroups = isLecturer ? lecturerNavGroups : studentNavGroups;
  const flatNavItems = React.useMemo(
    () => navGroups.flatMap((group) => group.items),
    [navGroups],
  );
  const activeIndex = React.useMemo(
    () => flatNavItems.findIndex((item) => isItemActive(pathname, item.href)),
    [flatNavItems, pathname],
  );
  const quickAction = isLecturer
    ? { href: "/courses/add", label: "Create Course" }
    : { href: "/library", label: "Open Library" };

  React.useEffect(() => {
    let cancelled = false;
    const register = async () => {
      for (let attempt = 0; attempt < 2 && !cancelled; attempt += 1) {
        try {
          await ensureMaterialWebRegistered();
          await Promise.all([
            customElements.whenDefined("md-nav-rail"),
            customElements.whenDefined("md-nav-item"),
            customElements.whenDefined("md-fab"),
          ]);
          if (!cancelled) {
            setIsNavReady(true);
          }
          return;
        } catch {
          // Registration failed, will retry on next attempt or fail silently
        }
      }
    };

    void register();

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  React.useEffect(() => {
    if (mobileOpenRef.current) {
      onMobileClose();
    }
  }, [pathname, onMobileClose]);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  React.useEffect(() => {
    if (!mobileOpen) {
      setCanDismissMobileDrawer(false);
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setCanDismissMobileDrawer(true);
    }, 140);
    return () => window.clearTimeout(timeoutId);
  }, [mobileOpen]);

  if (!isNavReady || !hasHydrated) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-y-0 left-0 z-40 hidden border-r border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] lg:block w-[var(--app-nav-rail-collapsed-width)]"
      />
    );
  }

  const buildNavItems = (mode: "desktop" | "mobile") =>
    navGroups.flatMap((group, groupIndex) => {
      const showAccountAnchor = group.label === "Account" && groupIndex > 0;
      const anchor = showAccountAnchor
        ? [
            React.createElement("div", {
              key: `${mode}-account-anchor`,
              className: "navigation-rail__account-anchor",
              "aria-hidden": "true",
            }),
          ]
        : [];

      const items = group.items.map((item) =>
        React.createElement(NavRailItem, {
          key: `${mode}-${item.href}`,
          item,
          expanded: mode === "desktop" ? !isCollapsed : true,
          isActive: isItemActive(pathname, item.href),
          onActivate: mode === "mobile" ? onMobileClose : undefined,
        }),
      );

      return [...anchor, ...items];
    });

  const navItemsDesktopEl = buildNavItems("desktop");
  const navItemsMobileEl = buildNavItems("mobile");

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "md-nav-rail",
      {
        id: "navigation-rail",
        className: `fixed inset-y-0 left-0 z-40 hidden lg:block navigation-rail ${isCollapsed ? "navigation-rail--collapsed" : ""}`,
        "aria-label": "Main navigation",
        expanded: !isCollapsed,
        "active-index": activeIndex,
      },
      React.createElement(
        "md-icon-button",
        {
          slot: "menu",
          onClick: onToggle,
          "aria-label": isCollapsed
            ? "Expand navigation rail"
            : "Collapse navigation rail",
          title: isCollapsed
            ? "Expand navigation rail"
            : "Collapse navigation rail",
          className: "navigation-rail__menu-toggle",
        },
        React.createElement("span", {
          className: "material-icons-outlined",
          suppressHydrationWarning: true,
        }, isCollapsed ? "menu" : "menu_open"),
      ),
      React.createElement(
        "md-fab",
        {
          id: "nav-fab",
          slot: "fab",
          variant: "primary",
          lowered: true,
          expanded: !isCollapsed,
          label: quickAction.label,
          "aria-label": quickAction.label,
          onClick: () => router.push(quickAction.href),
        },
        React.createElement("span", {
          slot: "icon",
          className: "material-icons-filled",
          suppressHydrationWarning: true,
        }, "add"),
      ),
      navItemsDesktopEl,
    ),
    mobileOpen
      ? React.createElement(
          React.Fragment,
          null,
          React.createElement("button", {
            type: "button",
            className: "fixed inset-0 z-50 app-overlay-scrim lg:hidden",
            onClick: () => {
              if (!canDismissMobileDrawer) return;
              onMobileClose();
            },
            "aria-label": "Close navigation",
          }),
          React.createElement(
            "aside",
            {
              className:
                "fixed inset-y-0 left-0 z-[51] w-[min(88vw,360px)] border-r border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] shadow-none lg:hidden",
              role: "dialog",
              "aria-modal": "true",
              "aria-label": "Mobile navigation drawer",
            },
            React.createElement(
              "md-nav-rail",
              {
                id: "mobile-navigation-rail",
                className:
                  "navigation-rail navigation-rail--mobile block h-full bg-[color:var(--md-sys-color-surface)]",
                "aria-label": "Mobile navigation",
                expanded: true,
                "active-index": activeIndex,
              },
              React.createElement(
                "md-icon-button",
                {
                  slot: "menu",
                  onClick: onMobileClose,
                  "aria-label": "Close navigation drawer",
                  title: "Close navigation drawer",
                  className: "navigation-rail__menu-toggle",
                },
                React.createElement("span", {
                  className: "material-icons-outlined",
                  suppressHydrationWarning: true,
                }, "menu_open"),
              ),
              React.createElement(
                "md-fab",
                {
                  id: "mobile-nav-fab",
                  slot: "fab",
                  variant: "primary",
                  lowered: true,
                  expanded: true,
                  label: quickAction.label,
                  "aria-label": quickAction.label,
                  onClick: () => {
                    router.push(quickAction.href);
                    onMobileClose();
                  },
                },
                React.createElement("span", {
                  slot: "icon",
                  className: "material-icons-filled",
                  suppressHydrationWarning: true,
                }, "add"),
              ),
              navItemsMobileEl,
            ),
          ),
        )
      : null,
  );
}

export function NavigationDrawer() {
  const {
    isDrawerCollapsed,
    toggleDrawerCollapsed,
    isDrawerOpen,
    closeDrawer,
  } = useMaterialUI();

  return React.createElement(NavigationRail, {
    isCollapsed: isDrawerCollapsed,
    onToggle: toggleDrawerCollapsed,
    mobileOpen: isDrawerOpen,
    onMobileClose: closeDrawer,
  });
}
