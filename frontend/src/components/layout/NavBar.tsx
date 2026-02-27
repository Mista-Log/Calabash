"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { lecturerNavGroups, studentNavGroups } from "./NavigationRail";

type MaterialNavBarElement = HTMLElement & { activeIndex?: number };

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavBar() {
  const pathname = usePathname();
  const activeIndexRef = React.useRef<number>(-1);
  const { user, hasHydrated } = useUserStore();
  const isLecturer = user?.role === "lecturer";
  const navGroups = isLecturer ? lecturerNavGroups : studentNavGroups;
  const navItems = navGroups.flatMap((group) => group.items);
  const activeIndex = React.useMemo(() => {
    const idx = navItems.findIndex((item) => isItemActive(pathname, item.href));
    return idx;
  }, [navItems, pathname]);

  React.useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const navBar = document.getElementById(
      "mobile-nav-bar"
    ) as MaterialNavBarElement | null;
    if (!navBar) {
      return;
    }

    if (activeIndexRef.current !== activeIndex) {
      navBar.activeIndex = activeIndex;
      activeIndexRef.current = activeIndex;
    }
  }, [activeIndex, hasHydrated]);

  if (!hasHydrated) {
    return null;
  }

  const navItemsEl = navItems.map((item) => {
    const activeIcon = item.filledIcon || item.icon;
    return React.createElement(
      "md-nav-item",
      {
        key: item.href,
        href: item.href,
        label: item.title,
        "badge-value": item.badge || undefined,
        "show-badge": !!item.badge ? true : undefined,
      },
      React.createElement(
        "md-icon",
        { slot: "active-icon", className: "material-icons-round" },
        activeIcon,
      ),
      React.createElement(
        "md-icon",
        { slot: "inactive-icon", className: "material-icons-outlined" },
        item.icon,
      ),
    );
  });

  return React.createElement(
    "md-nav-bar",
    {
      id: "mobile-nav-bar",
      "aria-label": "Mobile navigation",
      className: "fixed bottom-0 left-0 right-0 z-40 lg:hidden",
    },
    navItemsEl
  );
}
