import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {
  title: "Calabash - Academic Material Discovery",
  description:
    "Explore and share academic resources curated for your department.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  colorScheme: "light dark",
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
    </html>
  );
}
