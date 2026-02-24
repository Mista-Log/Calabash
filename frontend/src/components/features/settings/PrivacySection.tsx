"use client";

import { Download01Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Label,
  Badge,
} from "@/components/core";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";

export function PrivacySection() {
  const { profileVisibility, setProfileVisibility } = useSettingsStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownloadData = async () => {
    setIsDownloading(true);
    // Simulate data preparation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsDownloading(false);
    // In real implementation, trigger download of user data
  };

  const handleDeleteAccount = () => {
    // In real implementation, show modal and handle account deletion
    console.log("Delete account requested");
  };

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card className="border-muted/10">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Privacy Settings</CardTitle>
          <CardDescription className="font-medium">
            Control who can see your profile and activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-bold">Profile Visibility</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setProfileVisibility("public")}
                className={cn(
                  "flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all",
                  profileVisibility === "public"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30",
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                      profileVisibility === "public"
                        ? "border-primary"
                        : "border-muted-foreground",
                    )}
                  >
                    {profileVisibility === "public" && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="font-bold text-sm">Public</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium text-left">
                  Your profile is visible to all users
                </p>
              </button>

              <button
                onClick={() => setProfileVisibility("private")}
                className={cn(
                  "flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all",
                  profileVisibility === "private"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30",
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                      profileVisibility === "private"
                        ? "border-primary"
                        : "border-muted-foreground",
                    )}
                  >
                    {profileVisibility === "private" && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="font-bold text-sm">Private</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium text-left">
                  Only you can see your profile
                </p>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-muted/10">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Data Management</CardTitle>
          <CardDescription className="font-medium">
            Download or delete your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Download Data */}
          <div className="flex items-start justify-between p-4 rounded-xl bg-muted/5 border border-muted/10">
            <div className="space-y-1 flex-1">
              <Label className="text-sm font-bold">Download Your Data</Label>
              <p className="text-xs text-muted-foreground font-medium">
                Get a copy of all your personal information, materials, and
                activity
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleDownloadData}
              isLoading={isDownloading}
              loadingText="Preparing..."
              className="ml-4 font-bold"
            >
              Download
            </Button>
          </div>

          {/* Delete Account - Warning Section */}
          <div className="p-6 rounded-xl bg-destructive/5 border-2 border-destructive/20 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  size={20}
                  className="text-destructive"
                />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-bold text-foreground">
                  Delete Account
                </h4>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Permanently delete your account and all associated data. This
                  action cannot be undone. All your materials, notes, and
                  activity will be permanently removed.
                </p>
              </div>
            </div>

            {!showDeleteConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="font-bold"
              >
                Request Account Deletion
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-bold text-destructive">
                  Are you absolutely sure? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="font-bold"
                  >
                    Yes, Delete My Account
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="font-bold"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
