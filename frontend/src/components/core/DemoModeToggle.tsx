"use client";

import * as React from "react";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { M3Button } from "@/components/core";
import { useUserStore } from "@/store/useUserStore";
import {
  seedStudentDemoData,
  seedLecturerDemoData,
  clearDemoData,
  isDemoDataSeeded,
  DEMO_STUDENT_USER,
  DEMO_LECTURER_USER,
} from "@/lib/demo-seeder";
import { cn } from "@/lib/utils";

interface DemoModeToggleProps {
  onSeedComplete?: () => void;
}

export function DemoModeToggle({ onSeedComplete }: DemoModeToggleProps) {
  const { user, login, logout } = useUserStore();
  const [isSeeded, setIsSeeded] = React.useState(false);
  const [isSeeding, setIsSeeding] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsSeeded(isDemoDataSeeded());
  }, []);

  React.useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleSeedStudent = async () => {
    setIsSeeding(true);
    await seedStudentDemoData();
    setIsSeeded(true);
    setIsSeeding(false);
    setShowMenu(false);
    onSeedComplete?.();
  };

  const handleSeedLecturer = async () => {
    setIsSeeding(true);
    await seedLecturerDemoData();
    setIsSeeded(true);
    setIsSeeding(false);
    setShowMenu(false);
    onSeedComplete?.();
  };

  const handleClear = () => {
    clearDemoData();
    setIsSeeded(false);
    setShowMenu(false);
    onSeedComplete?.();
  };

  const handleSwitchToStudent = () => {
    login(DEMO_STUDENT_USER, "demo-token", null);
    setShowMenu(false);
  };

  const handleSwitchToLecturer = () => {
    login(DEMO_LECTURER_USER, "demo-token", null);
    setShowMenu(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <M3Button
        variant={isSeeded ? "filled" : "outlined"}
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        className={cn(
          "h-9 gap-1.5 rounded-full",
          isSeeded && "bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)]",
        )}
        disabled={isSeeding}
      >
        <MaterialSymbol icon={isSeeded ? "check_circle" : "experiment"} size={16} />
        {isSeeded ? "Demo Mode" : "Try Demo"}
      </M3Button>

      {showMenu && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-64",
            "bg-[color:var(--md-sys-color-surface-container)]",
            "rounded-2xl",
            "border border-[color:var(--md-sys-color-outline-variant)]",
            "shadow-2xl",
            "overflow-hidden",
            "z-50",
          )}
        >
          {/* Header */}
          <div className="border-b border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-primary-container)]/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <MaterialSymbol
                icon="experiment"
                size={20}
                className="text-[color:var(--md-sys-color-primary)]"
              />
              <h3 className="m3-title-small text-[color:var(--md-sys-color-on-surface)]">
                Demo Mode
              </h3>
            </div>
            <p className="mt-1 m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]">
              Populate with sample data for testing
            </p>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {!isSeeded ? (
              <>
                <button
                  type="button"
                  onClick={handleSeedStudent}
                  disabled={isSeeding}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
                    "hover:bg-[color:var(--md-sys-color-surface-container-high)]",
                    "transition-colors",
                  )}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "var(--md-sys-color-primary-container)" }}
                  >
                    <MaterialSymbol
                      icon="school"
                      size={18}
                      className="text-[color:var(--md-sys-color-on-primary-container)]"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="m3-body-small font-semibold text-[color:var(--md-sys-color-on-surface)]">
                      Student Demo
                    </p>
                    <p className="m3-label-small text-[color:var(--md-sys-color-on-surface-variant)]">
                      Courses, notes, calendar events
                    </p>
                  </div>
                  {isSeeding && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[color:var(--md-sys-color-primary)] border-t-transparent" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSeedLecturer}
                  disabled={isSeeding}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
                    "hover:bg-[color:var(--md-sys-color-surface-container-high)]",
                    "transition-colors",
                  )}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "var(--md-sys-color-secondary-container)" }}
                  >
                    <MaterialSymbol
                      icon="person"
                      size={18}
                      className="text-[color:var(--md-sys-color-on-secondary-container)]"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="m3-body-small font-semibold text-[color:var(--md-sys-color-on-surface)]">
                      Lecturer Demo
                    </p>
                    <p className="m3-label-small text-[color:var(--md-sys-color-on-surface-variant)]">
                      Courses, uploads, analytics
                    </p>
                  </div>
                  {isSeeding && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[color:var(--md-sys-color-primary)] border-t-transparent" />
                  )}
                </button>
              </>
            ) : (
              <>
                <div className="mb-2 rounded-xl bg-[color:var(--md-sys-color-primary-container)]/10 px-3 py-2">
                  <p className="m3-label-large text-[color:var(--md-sys-color-on-surface)]">
                    Demo data loaded
                  </p>
                  <p className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]">
                    Logged in as: {user?.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSwitchToStudent}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
                    "hover:bg-[color:var(--md-sys-color-surface-container-high)]",
                    "transition-colors",
                  )}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "var(--md-sys-color-primary-container)" }}
                  >
                    <MaterialSymbol
                      icon="school"
                      size={18}
                      className="text-[color:var(--md-sys-color-on-primary-container)]"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="m3-body-small font-semibold text-[color:var(--md-sys-color-on-surface)]">
                      Switch to Student
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleSwitchToLecturer}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
                    "hover:bg-[color:var(--md-sys-color-surface-container-high)]",
                    "transition-colors",
                  )}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "var(--md-sys-color-secondary-container)" }}
                  >
                    <MaterialSymbol
                      icon="person"
                      size={18}
                      className="text-[color:var(--md-sys-color-on-secondary-container)]"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="m3-body-small font-semibold text-[color:var(--md-sys-color-on-surface)]">
                      Switch to Lecturer
                    </p>
                  </div>
                </button>

                <div className="my-2 h-px bg-[color:var(--md-sys-color-outline-variant)]" />

                <button
                  type="button"
                  onClick={handleClear}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
                    "hover:bg-[color:var(--md-sys-color-error-container)]/20",
                    "transition-colors",
                  )}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "var(--md-sys-color-error-container)" }}
                  >
                    <MaterialSymbol
                      icon="delete"
                      size={18}
                      className="text-[color:var(--md-sys-color-on-error-container)]"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="m3-body-small font-semibold text-[color:var(--md-sys-color-error)]">
                      Clear Demo Data
                    </p>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
