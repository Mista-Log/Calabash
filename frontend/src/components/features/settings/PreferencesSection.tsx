"use client";

import {
  Moon02Icon,
  Sun03Icon,
  EyeIcon,
  BookOpenIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"; // Added BookOpenIcon, UserIcon
import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Switch,
  Field,
  FieldLabel,
  Input,
} from "@/components/core";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";

export function PreferencesSection() {
  const {
    theme,
    reducedMotion,
    emailNotifications,
    pushNotifications,
    setTheme,
    toggleReducedMotion,
    setEmailNotifications,
    setPushNotifications,
  } = useSettingsStore();

  // Mock states for new preferences
  const [favoriteTopics, setFavoriteTopics] = React.useState(
    "AI, Machine Learning",
  );
  const [preferredAuthors, setPreferredAuthors] =
    React.useState("Dr. Alice Smith");

  return (
    <Card className="border-muted/10">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Preferences</CardTitle>
        <CardDescription className="font-medium">
          Customize your experience and notification settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Theme Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-bold">Theme</Label>
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
            {(["light", "dark", "system"] as const).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => setTheme(themeOption)}
                className={cn(
                  "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all font-bold text-sm capitalize",
                  theme === themeOption
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-muted-foreground/30 text-muted-foreground hover:text-foreground",
                )}
              >
                <HugeiconsIcon
                  icon={
                    themeOption === "light"
                      ? Sun03Icon
                      : themeOption === "dark"
                        ? Moon02Icon
                        : EyeIcon
                  }
                  size={24}
                />
                {themeOption}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Choose how Calabash looks to you. Select a single theme, or sync
            with your system.
          </p>
        </div>

        {/* User Preferences */}
        <div className="space-y-3 border-t border-border/50 pt-8">
          <h3 className="text-lg font-bold text-foreground">
            Content Preferences
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            Help us personalize your content feed.
          </p>
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <HugeiconsIcon icon={BookOpenIcon} size={18} /> Favorite Topics
            </FieldLabel>
            <Input
              placeholder="e.g., AI, Machine Learning, Quantum Physics"
              value={favoriteTopics}
              onChange={(e) => setFavoriteTopics(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <HugeiconsIcon icon={UserIcon} size={18} /> Preferred Authors
            </FieldLabel>
            <Input
              placeholder="e.g., Dr. Alice Smith, Prof. Bob Johnson"
              value={preferredAuthors}
              onChange={(e) => setPreferredAuthors(e.target.value)}
            />
          </Field>
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/5 border border-muted/10 gap-4">
          <div className="space-y-1 flex-1">
            <Label className="text-sm font-bold">Reduced Motion</Label>
            <p className="text-xs text-muted-foreground font-medium">
              Minimize animations and transitions for a calmer experience
            </p>
          </div>
          <Switch
            checked={reducedMotion}
            onCheckedChange={toggleReducedMotion}
          />
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/5 border border-muted/10 gap-4">
          <div className="space-y-1 flex-1">
            <Label className="text-sm font-bold">Email Notifications</Label>
            <p className="text-xs text-muted-foreground font-medium">
              Receive email updates about new materials, assignments, and
              announcements
            </p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        {/* Push Notifications */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/5 border border-muted/10 gap-4">
          <div className="space-y-1 flex-1">
            <Label className="text-sm font-bold">Push Notifications</Label>
            <p className="text-xs text-muted-foreground font-medium">
              Get instant browser notifications for important updates
            </p>
          </div>
          <Switch
            checked={pushNotifications}
            onCheckedChange={setPushNotifications}
          />
        </div>
      </CardContent>
    </Card>
  );
}
