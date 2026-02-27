"use client";

import {
  Moon02Icon,
  Sun03Icon,
  EyeIcon,
  BookOpen01Icon,
  UserIcon,
} from "@/lib/icons/material-icons";
import * as React from "react";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
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
  useToast,
} from "@/components/core";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";

export function PreferencesSection() {
  const { addToast } = useToast();
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
        <CardTitle className="text-[20px] font-bold">Preferences</CardTitle>
        <CardDescription className="font-medium">
          Customize your experience and notification settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Theme Selection */}
        <div className="space-y-3">
          <Label className="text-[14px] font-bold">Theme</Label>
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
            {(["light", "dark", "system"] as const).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => {
                  setTheme(themeOption);
                  addToast(`Theme set to ${themeOption}`, "info");
                }}
                className={cn(
                  "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all font-bold text-[14px] capitalize",
                  theme === themeOption
                    ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]"
                    : "border-border hover:border-muted-foreground/30 text-muted-foreground hover:text-foreground",
                )}
              >
                <MaterialSymbol
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
          <p className="text-[13px] text-muted-foreground font-medium">
            Choose how Calabash looks to you. Select a single theme, or sync
            with your system.
          </p>
        </div>

        {/* User Preferences */}
        <div className="space-y-3 border-t border-border/50 pt-8">
          <h3 className="text-[18px] font-bold text-foreground">
            Content Preferences
          </h3>
          <p className="text-[14px] text-muted-foreground font-medium">
            Help us personalize your content feed.
          </p>
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <MaterialSymbol icon={BookOpen01Icon} size={18} /> Favorite Topics
            </FieldLabel>
            <Input
              placeholder="e.g., AI, Machine Learning, Quantum Physics"
              value={favoriteTopics}
              onChange={(e) => setFavoriteTopics(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <MaterialSymbol icon={UserIcon} size={18} /> Preferred Authors
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
            <Label className="text-[14px] font-bold">Reduced Motion</Label>
            <p className="text-[13px] text-muted-foreground font-medium">
              Minimize animations and transitions for a calmer experience
            </p>
          </div>
          <Switch
            checked={reducedMotion}
            onCheckedChange={(checked) => {
              toggleReducedMotion();
              addToast(
                `Reduced motion ${checked ? "enabled" : "disabled"}`,
                "info",
              );
            }}
          />
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/5 border border-muted/10 gap-4">
          <div className="space-y-1 flex-1">
            <Label className="text-[14px] font-bold">Email Notifications</Label>
            <p className="text-[13px] text-muted-foreground font-medium">
              Receive email updates about new materials, assignments, and
              announcements
            </p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={(checked) => {
              setEmailNotifications(checked);
              addToast(
                `Email notifications ${checked ? "enabled" : "disabled"}`,
                "info",
              );
            }}
          />
        </div>

        {/* Push Notifications */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/5 border border-muted/10 gap-4">
          <div className="space-y-1 flex-1">
            <Label className="text-[14px] font-bold">Push Notifications</Label>
            <p className="text-[13px] text-muted-foreground font-medium">
              Get instant browser notifications for important updates
            </p>
          </div>
          <Switch
            checked={pushNotifications}
            onCheckedChange={(checked) => {
              setPushNotifications(checked);
              addToast(
                `Push notifications ${checked ? "enabled" : "disabled"}`,
                "info",
              );
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}


