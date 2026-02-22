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
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (nextTheme: "light" | "dark") => {
      // Use Google's M3 system theme naming: sys-light / sys-dark
      // Also keep legacy `light`/`dark` classes for Tailwind compatibility.
      root.classList.remove("sys-light", "sys-dark", "light", "dark");
      const themeClass = nextTheme === "dark" ? "sys-dark" : "sys-light";
      const legacy = nextTheme === "dark" ? "dark" : "light";
      root.classList.add(themeClass, legacy);
      root.style.colorScheme = nextTheme;
      root.setAttribute("data-theme", themeClass);
      root.setAttribute("data-md-theme", nextTheme);
    };

    const resolveTheme = () => (media.matches ? "dark" : "light");

    if (theme === "system") {
      applyTheme(resolveTheme());
      const onChange = () => applyTheme(resolveTheme());
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    applyTheme(theme);
  }, [theme]);

  return <>{children}</>;
}
