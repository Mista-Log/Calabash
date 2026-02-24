"use client";

import {
  DashboardSquareIcon,
  BookOpen01Icon,
  Knowledge01Icon,
  Note01Icon,
  Settings02Icon,
  CustomerService01Icon,
  Search01Icon,
  Logout02Icon,
  LibraryIcon,
  Menu01Icon,
  Sun01Icon,
  Moon01Icon,
  LaptopIcon,
} from "@hugeicons/core-free-icons";
import { useUserStore } from "@/store/useUserStore";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import {
  ScrollArea,
  SearchInput,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/core";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/core";
import { useSettingsStore } from "@/store/useSettingsStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/core/tooltip"; // Import Tooltip components

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: number;
}

const studentNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: DashboardSquareIcon },
  { title: "My Courses", href: "/courses", icon: BookOpen01Icon, badge: 4 },
  { title: "Library", href: "/library", icon: LibraryIcon },
  { title: "Notes", href: "/notes", icon: Note01Icon, badge: 12 },
  { title: "Exams & Quiz", href: "/exams", icon: Knowledge01Icon },
];

const lecturerNav: NavItem[] = [
  { title: "Management", href: "/dashboard", icon: DashboardSquareIcon },
  { title: "My Taught Courses", href: "/courses", icon: BookOpen01Icon },
  { title: "Resource Library", href: "/library", icon: LibraryIcon },
  { title: "Analytics", href: "/analytics", icon: Knowledge01Icon },
  { title: "Settings", href: "/settings", icon: Settings02Icon },
];

const secondaryNav: NavItem[] = [
  { title: "Settings", href: "/settings", icon: Settings02Icon },
  { title: "Help & Support", href: "/support", icon: CustomerService01Icon },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUserStore();
  const { theme, setTheme } = useSettingsStore(); // Get theme and setTheme from store
  const isLecturer = user?.role === "lecturer";
  const mainNav = isLecturer ? lecturerNav : studentNav;

  const handleLogout = () => {
    const role = user?.role;
    logout();
    if (typeof window !== "undefined") {
    }

    // Redirect to role-specific login pages
    if (role === "lecturer") {
      router.push("/auth/login/lecturer");
    } else {
      router.push("/auth/login/student");
    }
  };

  return (
    <TooltipProvider>
      {" "}
      {/* Wrap with TooltipProvider */}
      <motion.aside
        id="mobile-sidebar"
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }} // Smoother animation
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-sidebar text-sidebar-foreground", // Removed direct transition-all
          "shadow-lg ring-1 ring-black/5",
        )}
        aria-label="Main Navigation"
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center px-6">
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-1"
            aria-label="Calabash Home"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
              <HugeiconsIcon
                icon={LibraryIcon}
                size={18}
                className="text-primary-foreground"
              />
            </div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }} // Quicker fade in/out for text
                  className="text-xl font-extrabold tracking-tight text-foreground"
                >
                  Calabash
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Search Section */}
        <div className="px-4 py-2">
          {isCollapsed ? (
            <Tooltip delayDuration={0}>
              {" "}
              {/* Add Tooltip */}
              <TooltipTrigger asChild>
                <button
                  onClick={() => onToggle()}
                  className="flex items-center justify-center rounded-xl border border-border bg-muted/30 h-10 w-10 mx-auto transition-all cursor-pointer hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Expand sidebar to search"
                >
                  <HugeiconsIcon
                    icon={Search01Icon}
                    size={18}
                    className="text-muted-foreground"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Search</TooltipContent>
            </Tooltip>
          ) : (
            <SearchInput
              placeholder="Search materials..."
              className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/50 h-10 rounded-xl focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Search site content"
            />
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1.5" aria-label="Primary navigation">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              const NavIcon = item.icon;

              return (
                <Tooltip key={item.href} delayDuration={0}>
                  {" "}
                  {/* Add Tooltip */}
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
                        isActive
                          ? "text-primary bg-primary/15 shadow-md shadow-primary/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                        isCollapsed && "justify-center",
                      )}
                    >
                      <HugeiconsIcon
                        icon={NavIcon}
                        size={20}
                        className={cn(
                          "transition-transform group-hover:scale-110",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                        aria-hidden="true"
                      />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 leading-none">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-black text-primary-foreground shadow-sm">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {isCollapsed && item.badge && (
                        <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-sidebar animate-pulse" />
                      )}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>

          <div className="mt-8 space-y-1.5" aria-label="Secondary navigation">
            {secondaryNav.map((item) => (
              <Tooltip key={item.href} delayDuration={0}>
                {" "}
                {/* Add Tooltip */}
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isCollapsed && "justify-center",
                    )}
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                      aria-hidden="true"
                    />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">{item.title}</TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </ScrollArea>

        {/* User Section */}
        <div className="mt-auto border-t border-border p-4 bg-muted/5">
          <div
            className={cn(
              "flex items-center gap-3",
              isCollapsed ? "justify-center" : "px-2",
            )}
          >
            <Avatar className="h-10 w-10 border-2 border-primary/10 bg-muted/50 shadow-sm">
              <AvatarImage src={""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-black">
                {user?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase() || "CU"}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <>
                <div className="flex flex-1 flex-col truncate">
                  <span className="text-sm font-bold text-foreground truncate leading-tight">
                    {user?.name || "Calabash User"}
                  </span>
                  <span className="text-xs text-primary font-black uppercase tracking-widest mt-0.5">
                    {user?.role === "lecturer" ? "Faculty" : "Scholar"}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label="Toggle theme"
                    >
                      <HugeiconsIcon
                        icon={theme === "dark" ? Moon01Icon : Sun01Icon}
                        size={18}
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="end"
                    className="w-32"
                  >
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <HugeiconsIcon
                        icon={Sun01Icon}
                        size={18}
                        className="mr-2"
                      />{" "}
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <HugeiconsIcon
                        icon={Moon01Icon}
                        size={18}
                        className="mr-2"
                      />{" "}
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <HugeiconsIcon
                        icon={LaptopIcon}
                        size={18}
                        className="mr-2"
                      />{" "}
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                  aria-label="Logout"
                >
                  <HugeiconsIcon icon={Logout02Icon} size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Collapse Toggle (Desktop) */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-border bg-sidebar text-muted-foreground hover:text-primary shadow-md transition-all z-50 focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <HugeiconsIcon
            icon={Menu01Icon}
            size={12}
            className={cn(
              "transition-transform duration-500",
              !isCollapsed && "rotate-180",
            )}
          />
        </button>
      </motion.aside>
    </TooltipProvider>
  );
}
