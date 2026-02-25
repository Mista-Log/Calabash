"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PersistentLayoutProps {
  children: React.ReactNode;
  isLoading: boolean;
}

/**
 * PersistentLayout - Maintains fixed header and sidebar during content loading
 * Prevents layout shift and white flash during page transitions
 */
export function PersistentLayout({ children, isLoading }: PersistentLayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [showSkeleton, setShowSkeleton] = React.useState(isLoading);

  // Handle mount state to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Show skeleton when loading state changes
  React.useEffect(() => {
    if (isLoading) {
      setShowSkeleton(true);
    } else {
      const timer = setTimeout(() => setShowSkeleton(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!mounted) {
    return (
      <div className={cn(
        "flex min-h-screen w-full flex-1 flex-col",
        "pt-16 lg:pl-[var(--app-nav-rail-collapsed-width)]",
      )}>
        <div className="flex-1 animate-pulse bg-[color:var(--md-sys-color-surface-container-highest)]" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-screen w-full flex-1 flex-col",
        "pt-16 lg:pl-[var(--app-nav-rail-collapsed-width)]",
        "layout-transition",
      )}
    >
      {isLoading || showSkeleton ? (
        <div className="flex-1 animate-pulse bg-[color:var(--md-sys-color-surface-container-highest)]" />
      ) : (
        <div className="animate-fade-in flex-1">
          {children}
        </div>
      )}
    </div>
  );
}
