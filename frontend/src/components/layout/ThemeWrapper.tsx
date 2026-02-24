"use client";

import React from "react";
import { useSettingsStore } from "@/store/useSettingsStore";

export function ThemeWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useSettingsStore();

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark"); // Clean up existing classes

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return <>{children}</>;
}