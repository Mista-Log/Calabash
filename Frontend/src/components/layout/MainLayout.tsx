"use client";

import { Menu01Icon, Mortarboard01Icon } from "@hugeicons/core-free-icons";
import * as React from "react";
import { usePathname } from "next/navigation";

import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Button } from "@/components/core";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/core";
import { Sidebar } from "./Sidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { reducedMotion } = useSettingsStore();

  const isFullPage = pathname === "/courses/add";

  const motionProps = reducedMotion ? { initial: false, animate: false } : {};

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Sidebar */}
      {!isFullPage && (
        <div className="hidden md:block">
          <Sidebar
            isCollapsed={isCollapsed}
            onToggle={() => setIsCollapsed(!isCollapsed)}
          />
        </div>
      )}

      {/* Mobile Sidebar Trigger (Floating) */}
      {!isFullPage && (
        <div className="md:hidden">
          <AnimatePresence>
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 z-[100]" 
                role="dialog" 
                aria-modal="true"
                aria-label="Mobile navigation sidebar"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-md"
                  aria-hidden="true"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="relative h-full w-full max-w-[280px] shadow-2xl"
                >
                  <Sidebar
                    isCollapsed={false}
                    onToggle={() => setIsSidebarOpen(false)}
                  />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Main Content */}
      <main
        id="main-content"
        className={cn(
          "flex-1 min-h-screen flex flex-col transition-all duration-300",
          !isFullPage && (isCollapsed ? "md:pl-[80px]" : "md:pl-[260px]"),
        )}
      >
        {!isFullPage && (
          <header className="flex h-16 items-center justify-between border-b px-4 md:px-8 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden z-50 relative focus-visible:ring-2 focus-visible:ring-primary"
                aria-expanded={isSidebarOpen}
                aria-controls="mobile-sidebar"
                aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
              >
                <HugeiconsIcon icon={Menu01Icon} size={20} />
              </Button>
              <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  {pathname === "/dashboard" ? (
                    <BreadcrumbItem>
                      <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : pathname.startsWith("/courses") ? (
                    <>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/courses">
                          My Courses
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {pathname.split("/").length > 2 && (
                        <>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                            <BreadcrumbPage>Course Detail</BreadcrumbPage>
                          </BreadcrumbItem>
                        </>
                      )}
                    </>
                  ) : pathname === "/library" ? (
                    <BreadcrumbItem>
                      <BreadcrumbPage>Library</BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : (
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {pathname.slice(1).charAt(0).toUpperCase() +
                          pathname.slice(2)}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-4">
              {/* Vibrant Earth Accent Badge */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent-foreground text-xs font-semibold">
                <HugeiconsIcon
                  icon={Mortarboard01Icon}
                  size={14}
                  className="text-accent"
                />
                <span>Semester 2</span>
              </div>
            </div>
          </header>
        )}
        <div className={cn("p-4 md:p-8 flex-1", isFullPage && "p-0")}>
          {children}
        </div>
      </main>
    </div>
  );
}
