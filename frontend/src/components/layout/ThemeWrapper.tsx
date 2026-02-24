<<<<<<< HEAD
﻿"use client";
=======
"use client";
>>>>>>> origin/main

import React from "react";
import { useSettingsStore } from "@/store/useSettingsStore";

<<<<<<< HEAD
type ResolvedTheme = "light" | "dark";

=======
>>>>>>> origin/main
export function ThemeWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useSettingsStore();

  React.useEffect(() => {
    const root = document.documentElement;
<<<<<<< HEAD
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const syncThemeColorMeta = (nextTheme: ResolvedTheme) => {
      const computed = getComputedStyle(root);
      const themeColor =
        computed
          .getPropertyValue("--md-sys-color-surface-container-lowest")
          .trim() ||
        computed.getPropertyValue("--md-sys-color-surface").trim() ||
        computed.getPropertyValue("--background").trim() ||
        computed.backgroundColor ||
        (nextTheme === "dark" ? "#14110f" : "#ffffff");

      let themeMeta = document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]:not([media])'
      );

      if (!themeMeta) {
        themeMeta = document.querySelector<HTMLMetaElement>(
          'meta[name="theme-color"]'
        );
      }

      if (!themeMeta) {
        themeMeta = document.createElement("meta");
        themeMeta.name = "theme-color";
        document.head.appendChild(themeMeta);
      }

      themeMeta.content = themeColor;
    };

    const applyTheme = (nextTheme: ResolvedTheme) => {
      // Use Google's M3 system theme naming: sys-light / sys-dark
      // Also keep legacy `light`/`dark` classes for Tailwind compatibility.
      root.classList.remove("sys-light", "sys-dark", "light", "dark");
      const themeClass = nextTheme === "dark" ? "sys-dark" : "sys-light";
      const legacy = nextTheme === "dark" ? "dark" : "light";
      root.classList.add(themeClass, legacy);
      root.style.colorScheme = nextTheme;
      root.setAttribute("data-theme", themeClass);
      root.setAttribute("data-md-theme", nextTheme);

      syncThemeColorMeta(nextTheme);
      requestAnimationFrame(() => syncThemeColorMeta(nextTheme));
    };

    const resolveTheme = (): ResolvedTheme =>
      media.matches ? "dark" : "light";

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
=======
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
>>>>>>> origin/main
