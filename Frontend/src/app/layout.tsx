import type { Metadata } from "next";
import "./globals.css";
import { PageAnimatePresence } from "@/components/layout/PageAnimatePresence";

export const metadata: Metadata = {
  title: "Calabash - Academic Material Discovery",
  description:
    "Explore and share academic resources curated for your department.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
    </html>
  );
}
