<<<<<<< HEAD
﻿import type { Metadata, Viewport } from "next";
import { Google_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PageAnimatePresence } from "@/components/layout/PageAnimatePresence";
import { ThemeWrapper } from "@/components/layout/ThemeWrapper";
import { MaterialWebInit } from "@/components/layout/MaterialWebInit";
import { GlobalErrorBoundary } from "@/components/core/GlobalErrorBoundary";
import { ToastProvider } from "@/components/core/toast";
import { GlobalShortcutsProvider } from "@/components/core/GlobalShortcutsProvider";

const googleSans = Google_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "700"],
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Consolas",
    "monospace",
  ],
});
=======
import type { Metadata } from "next";
<<<<<<< HEAD
import "./globals.css";
import { PageAnimatePresence } from "@/components/layout/PageAnimatePresence";
=======
import { Outfit } from "next/font/google";
import "./globals.css";
import { PageAnimatePresence } from "@/components/layout/PageAnimatePresence";
import { ThemeWrapper } from "@/components/layout/ThemeWrapper"; // Import ThemeWrapper

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
>>>>>>> origin/main

export const metadata: Metadata = {
  title: "Calabash - Academic Material Discovery",
  description:
    "Explore and share academic resources curated for your department.",
<<<<<<< HEAD
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: "#ffffff",
=======
<<<<<<< HEAD
=======
  manifest: "/manifest.json", // Add manifest link
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
>>>>>>> origin/main
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html
      lang="en"
      className={`light sys-light ${googleSans.variable} ${jetbrainsMono.variable}`}
      data-theme="sys-light"
      data-md-theme="light"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="antialiased overflow-x-hidden font-sans"
        suppressHydrationWarning
      >
        <ThemeWrapper>
          <MaterialWebInit />
          <ToastProvider>
            <GlobalShortcutsProvider>
              <GlobalErrorBoundary>
                <PageAnimatePresence>{children}</PageAnimatePresence>
              </GlobalErrorBoundary>
            </GlobalShortcutsProvider>
          </ToastProvider>
        </ThemeWrapper>
      </body>
=======
    <html lang="en">
<<<<<<< HEAD
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        <PageAnimatePresence>{children}</PageAnimatePresence>
      </body>
=======
      <ThemeWrapper>
        <body
          className={`${outfit.variable} antialiased overflow-x-hidden font-sans`}
        >
          <PageAnimatePresence>{children}</PageAnimatePresence>
        </body>
      </ThemeWrapper>
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
>>>>>>> origin/main
    </html>
  );
}
