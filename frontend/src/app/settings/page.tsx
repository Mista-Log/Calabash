"use client";

import {
  Settings02Icon,
  UserIcon,
  Locker01Icon,
  Notification03Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/core";
import { ProfileSection } from "@/components/features/settings/ProfileSection";
import { AccountSection } from "@/components/features/settings/AccountSection";
import { PreferencesSection } from "@/components/features/settings/PreferencesSection";
import { PrivacySection } from "@/components/features/settings/PrivacySection";
import { cn } from "@/lib/utils";

type SettingsTab = "profile" | "account" | "preferences" | "privacy";

const settingsNav = [
  { id: "profile" as const, label: "Profile", icon: UserIcon },
  { id: "account" as const, label: "Account", icon: Locker01Icon },
  {
    id: "preferences" as const,
    label: "Preferences",
    icon: Notification03Icon,
  },
  { id: "privacy" as const, label: "Privacy", icon: Shield01Icon },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("profile");

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <HugeiconsIcon
                icon={Settings02Icon}
                size={20}
                className="text-primary"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-muted-foreground font-medium">
            Manage your account preferences and privacy settings
          </p>
        </div>

        {/* Settings Layout: Sidebar + Content */}
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar Navigation */}
          <nav className="space-y-2">
            {settingsNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <HugeiconsIcon icon={item.icon} size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Content Area */}
          <div>
            {activeTab === "profile" && <ProfileSection />}
            {activeTab === "account" && <AccountSection />}
            {activeTab === "preferences" && <PreferencesSection />}
            {activeTab === "privacy" && <PrivacySection />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
