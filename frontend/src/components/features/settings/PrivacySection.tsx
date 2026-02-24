"use client";

import { AlertCircleIcon } from "@/lib/icons/material-icons";
import * as React from "react";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  M3Button,
  Label,
  useToast,
} from "@/components/core";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";
import { mockActionsService } from "@/services/mock-actions.service";

export function PrivacySection() {
  const { addToast } = useToast();
  const { profileVisibility, setProfileVisibility } = useSettingsStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDownloadData = async () => {
    setIsDownloading(true);
    try {
      const result = await mockActionsService.requestDataExport();
      addToast(
        `Data export prepared (${result.referenceId}).`,
        "success",
      );
    } catch {
      addToast("Data export request failed.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const result = await mockActionsService.requestAccountDeletion();
      addToast(
        `Deletion request submitted (${result.referenceId}).`,
        "info",
      );
      setShowDeleteConfirm(false);
    } catch {
      addToast("Unable to submit deletion request.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card className="border-muted/10">
        <CardHeader>
          <CardTitle className="text-[20px] font-bold">
            Privacy Settings
          </CardTitle>
          <CardDescription className="font-medium">
            Control who can see your profile and activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-[14px] font-bold">Profile Visibility</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setProfileVisibility("public");
                  addToast("Profile is now public", "info");
                }}
                className={cn(
                  "flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all",
                  profileVisibility === "public"
                    ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)]"
                    : "border-border hover:border-muted-foreground/30",
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                      profileVisibility === "public"
                        ? "border-[color:var(--md-sys-color-primary)]"
                        : "border-muted-foreground",
                    )}
                  >
                    {profileVisibility === "public" && (
                      <div className="h-2 w-2 rounded-full bg-[color:var(--md-sys-color-primary)]" />
                    )}
                  </div>
                  <span className="font-bold text-[14px]">Public</span>
                </div>
                <p className="text-[13px] text-muted-foreground font-medium text-left">
                  Your profile is visible to all users
                </p>
              </button>

              <button
                onClick={() => {
                  setProfileVisibility("private");
                  addToast("Profile is now private", "info");
                }}
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
                  <span className="font-bold text-[14px]">Private</span>
                </div>
                <p className="text-[13px] text-muted-foreground font-medium text-left">
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
          <CardTitle className="text-[20px] font-bold">
            Data Management
          </CardTitle>
          <CardDescription className="font-medium">
            Download or delete your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Download Data */}
          <div className="flex items-start justify-between p-4 rounded-xl bg-muted/5 border border-muted/10">
            <div className="space-y-1 flex-1">
              <Label className="text-[14px] font-bold">
                Download Your Data
              </Label>
              <p className="text-[13px] text-muted-foreground font-medium">
                Get a copy of all your personal information, materials, and
                activity
              </p>
            </div>
            <M3Button
              variant="outlined"
              onClick={handleDownloadData}
              isLoading={isDownloading}
              className="ml-4 font-bold"
            >
              Download
            </M3Button>
          </div>

          {/* Delete Account - Warning Section */}
          <div className="p-6 rounded-xl bg-destructive/5 border-2 border-destructive/20 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <MaterialSymbol
                  icon={AlertCircleIcon}
                  size={20}
                  className="text-destructive"
                />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-[14px] font-bold text-foreground">
                  Delete Account
                </h4>
                <p className="text-[13px] text-muted-foreground font-medium leading-relaxed">
                  Permanently delete your account and all associated data. This
                  action cannot be undone. All your materials, notes, and
                  activity will be permanently removed.
                </p>
              </div>
            </div>

            {!showDeleteConfirm ? (
              <M3Button
                variant="filled"
                className="font-bold bg-[color:var(--md-sys-color-error)] text-[color:var(--md-sys-color-on-error)] hover:opacity-90"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Request Account Deletion
              </M3Button>
            ) : (
              <div className="space-y-3">
                <p className="text-[14px] font-bold text-destructive">
                  Are you absolutely sure? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <M3Button
                    variant="filled"
                    className="bg-[color:var(--md-sys-color-error)] text-[color:var(--md-sys-color-on-error)] font-bold"
                    onClick={handleDeleteAccount}
                    isLoading={isDeleting}
                  >
                    Yes, Delete My Account
                  </M3Button>
                  <M3Button
                    variant="outlined"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="font-bold"
                  >
                    Cancel
                  </M3Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
