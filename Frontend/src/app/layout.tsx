import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { PageAnimatePresence } from "@/components/layout/PageAnimatePresence";
import { ThemeWrapper } from "@/components/layout/ThemeWrapper"; // Import ThemeWrapper

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Calabash - Academic Material Discovery",
  description:
    "Explore and share academic resources curated for your department.",
  manifest: "/manifest.json", // Add manifest link
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeWrapper>
        <body
          className={`${outfit.variable} antialiased overflow-x-hidden font-sans`}
        >
          <PageAnimatePresence>{children}</PageAnimatePresence>
        </body>
      </ThemeWrapper>
    </html>
  );
}
