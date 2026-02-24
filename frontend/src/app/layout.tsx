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

export const metadata: Metadata = {
  title: "Calabash - Academic Material Discovery",
  description:
    "Explore and share academic resources curated for your department.",
<<<<<<< HEAD
=======
  manifest: "/manifest.json", // Add manifest link
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
    </html>
  );
}
