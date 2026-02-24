"use client";

<<<<<<< HEAD
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LibraryIcon,
  BookOpen01Icon,
  // Upload01Icon,
  Settings02Icon,
  Logout02Icon,
  Menu01Icon,
  UserIcon,
  Mortarboard01Icon,
  DashboardSquare01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion}  from "framer-motion";

import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/useSettingsStore";
import { staggerContainer, listEntry } from "@/lib/motion-variants";
import { Button, ScrollArea } from "@/components/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/core";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/core";
=======
import { Menu01Icon, Mortarboard01Icon } from "@hugeicons/core-free-icons";
import * as React from "react";
import { usePathname } from "next/navigation";

import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Button } from "@/components/core";
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/core";
<<<<<<< HEAD
// import { LucideIcon } from "lucide-react";
// import { HugeiconsIcon } from "hugeicons-react";


type HugeIconType = React.ComponentProps<typeof HugeiconsIcon>["icon"];
interface NavItem {
  title: string;
  href: string;
  icon: HugeIconType;
}

const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: DashboardSquare01Icon },
  { title: "Courses", href: "/courses", icon: BookOpen01Icon },
  { title: "Library", href: "/library", icon: LibraryIcon },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { reducedMotion } = useSettingsStore();

  const motionProps = reducedMotion ? { initial: false, animate: false } : {};

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card/70 backdrop-blur-xl transition-all duration-300",
          !isSidebarOpen && "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-primary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HugeiconsIcon icon={LibraryIcon} size={20} />
            </div>
            <span className="text-xl tracking-tight">Calabash</span>
          </Link>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <motion.nav
            className="space-y-1"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            {...motionProps}
          >
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              const NavIcon = item.icon;

              return (
                <motion.div
                  key={item.href}
                  variants={listEntry}
                  {...motionProps}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-md bg-primary/10 border-l-2 border-primary"
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : { type: "spring", duration: 0.5 }
                        }
                      />
                    )}
                    <HugeiconsIcon
                      icon={NavIcon}
                      size={18}
                      className={cn(
                        "relative z-10",
                        isActive && "text-primary",
                      )}
                    />
                    <span className="relative z-10 font-semibold">
                      {item.title}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>
        </ScrollArea>

        <div className="mt-auto border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start truncate">
                  <span className="text-sm font-medium">John Doe</span>
                  <span className="text-xs text-muted-foreground">Student</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HugeiconsIcon icon={UserIcon} size={16} className="mr-2" />{" "}
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={Settings02Icon}
                  size={16}
                  className="mr-2"
                />{" "}
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <HugeiconsIcon icon={Logout02Icon} size={16} className="mr-2" />{" "}
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen",
          isSidebarOpen ? "pl-64" : "pl-0",
        )}
      >
        <header className="flex h-16 items-center justify-between border-b px-8 bg-background/60 backdrop-blur-xl supports-backdrop-filter:bg-background/40 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              <HugeiconsIcon icon={Menu01Icon} size={20} />
            </Button>
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
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
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
=======
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
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
