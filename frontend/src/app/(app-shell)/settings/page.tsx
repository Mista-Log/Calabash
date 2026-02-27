"use client";

import {
  Settings02Icon,
  UserIcon,
  Locker01Icon,
  Notification03Icon,
  Shield01Icon,
} from "@/lib/icons/material-icons";
import * as React from "react";
import Link from "next/link";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { ProfileSection } from "@/components/features/settings/ProfileSection";
import { AccountSection } from "@/components/features/settings/AccountSection";
import { PreferencesSection } from "@/components/features/settings/PreferencesSection";
import { PrivacySection } from "@/components/features/settings/PrivacySection";
import { LecturerProfileSection } from "@/components/features/settings/LecturerProfileSection";
import { LecturerAccountSection } from "@/components/features/settings/LecturerAccountSection";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
} from "@/components/core";

type SettingsTab = "profile" | "account" | "preferences" | "privacy";

const studentNav = [
  {
    id: "profile" as const,
    label: "Profile",
    icon: UserIcon,
    description: "Personal info, avatar, and bio",
  },
  {
    id: "account" as const,
    label: "Account",
    icon: Locker01Icon,
    description: "Password and sign-in security",
  },
  {
    id: "preferences" as const,
    label: "Learning Preferences",
    icon: Notification03Icon,
    description: "Theme, notifications, and study signals",
  },
  {
    id: "privacy" as const,
    label: "Privacy",
    icon: Shield01Icon,
    description: "Data visibility and account control",
  },
];

const lecturerNav = [
  {
    id: "profile" as const,
    label: "Faculty Profile",
    icon: UserIcon,
    description: "Identity, department, and faculty bio",
  },
  {
    id: "account" as const,
    label: "Account Security",
    icon: Locker01Icon,
    description: "Password hardening and access control",
  },
  {
    id: "preferences" as const,
    label: "Teaching Preferences",
    icon: Notification03Icon,
    description: "Alerts, interface, and workflow defaults",
  },
  {
    id: "privacy" as const,
    label: "Privacy",
    icon: Shield01Icon,
    description: "Data visibility and account control",
  },
];

const studentScope = [
  {
    label: "Role",
    value: "Student",
    tone:
      "bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]",
  },
  {
    label: "Primary Focus",
    value: "Learning & submissions",
    tone:
      "bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]",
  },
  {
    label: "Core Surfaces",
    value: "Courses, Notes, Assessment",
    tone:
      "bg-[color:var(--md-sys-color-tertiary-container)] text-[color:var(--md-sys-color-on-tertiary-container)]",
  },
];

const lecturerScope = [
  {
    label: "Role",
    value: "Lecturer",
    tone:
      "bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]",
  },
  {
    label: "Primary Focus",
    value: "Teaching & publishing",
    tone:
      "bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]",
  },
  {
    label: "Core Surfaces",
    value: "Courses, Upload, Analytics",
    tone:
      "bg-[color:var(--md-sys-color-tertiary-container)] text-[color:var(--md-sys-color-on-tertiary-container)]",
  },
];

export default function SettingsPage() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("profile");
  const isLecturer = user?.role === "lecturer";
  const navItems = isLecturer ? lecturerNav : studentNav;
  const scopeItems = isLecturer ? lecturerScope : studentScope;

  return (
    <div className="w-full px-3 py-5 sm:px-5 sm:py-7 lg:px-7 lg:py-9">
      <div className="mx-auto max-w-[1360px] space-y-6">
        <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-primary-container)]">
                <MaterialSymbol
                  icon={Settings02Icon}
                  size={28}
                  className="text-[color:var(--md-sys-color-on-primary-container)]"
                />
              </div>
              <div>
                <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-[color:var(--md-sys-color-on-surface)]">
                  {isLecturer ? "Faculty Settings" : "Student Settings"}
                </h1>
                <p className="mt-1 text-[14px] font-medium text-[color:var(--md-sys-color-on-surface-variant)] sm:text-[15px]">
                  {isLecturer
                    ? "Configure teaching identity, account security, and delivery preferences."
                    : "Configure profile, account security, and learning preferences."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {scopeItems.map((item) => (
                <div
                  key={item.label}
                  className={cn("rounded-xl px-3 py-2", item.tone)}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-widest opacity-90">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-[13px] font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <Card className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
              <CardContent className="space-y-2 p-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
                      activeTab === item.id
                        ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]"
                        : "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface)] hover:bg-[color:var(--md-sys-color-surface-container)]",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        activeTab === item.id
                          ? "bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)]"
                          : "bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface-variant)]",
                      )}
                    >
                      <MaterialSymbol icon={item.icon} size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold">{item.label}</p>
                      <p className="text-[12px] font-medium opacity-80">{item.description}</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
              <CardContent className="space-y-3 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-surface-variant)]">
                  Quick Access
                </p>
                <div className="space-y-2">
                  <Link
                    href={isLecturer ? "/courses" : "/library"}
                    className="block rounded-lg border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-3 py-2 text-[13px] font-semibold text-[color:var(--md-sys-color-on-surface)] transition-colors hover:bg-[color:var(--md-sys-color-surface-container)]"
                  >
                    {isLecturer ? "Manage Courses" : "Open Library"}
                  </Link>
                  <Link
                    href={isLecturer ? "/upload" : "/courses"}
                    className="block rounded-lg border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-3 py-2 text-[13px] font-semibold text-[color:var(--md-sys-color-on-surface)] transition-colors hover:bg-[color:var(--md-sys-color-surface-container)]"
                  >
                    {isLecturer ? "Upload Material" : "Continue Courses"}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="min-w-0">
            {activeTab === "profile" &&
              (isLecturer ? <LecturerProfileSection /> : <ProfileSection />)}
            {activeTab === "account" &&
              (isLecturer ? <LecturerAccountSection /> : <AccountSection />)}
            {activeTab === "preferences" && <PreferencesSection />}
            {activeTab === "privacy" && <PrivacySection />}
          </div>
        </div>
      </div>
    </div>
  );
}
