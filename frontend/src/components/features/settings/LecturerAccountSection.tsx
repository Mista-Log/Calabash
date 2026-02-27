"use client";

import * as React from "react";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  M3Button,
  Input,
  Label,
  useToast,
} from "@/components/core";
import { mockActionsService } from "@/services/mock-actions.service";

export function LecturerAccountSection() {
  const { addToast } = useToast();
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const passwordsMatch = newPassword && newPassword === confirmPassword;
  const canSave = currentPassword && newPassword && passwordsMatch && newPassword.length >= 8;

  const handleSave = async () => {
    if (!canSave) return;

    setIsSaving(true);
    try {
      await mockActionsService.updatePassword();
      addToast("Password updated successfully", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      addToast("Failed to update password", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-[color:var(--md-sys-color-outline-variant)] rounded-[28px]">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: "var(--md-sys-color-primary-container)" }}
          >
            <MaterialSymbol
              icon="lock"
              size={20}
              style={{ color: "var(--md-sys-color-primary)" }}
            />
          </div>
          <div>
            <CardTitle className="m3-title-large text-[color:var(--md-sys-color-on-surface)]">
              Security Settings
            </CardTitle>
            <p className="m3-body-medium text-[color:var(--md-sys-color-on-surface-variant)] mt-1">
              Update your password and secure your faculty account
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Password */}
        <div className="space-y-2">
          <Label className="m3-label-large text-[color:var(--md-sys-color-on-surface-variant)]">
            Current Password
          </Label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--md-sys-color-on-surface-variant)]">
              <MaterialSymbol icon="lock" size={20} />
            </div>
            <Input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-14 pl-12 pr-12 rounded-2xl bg-[color:var(--md-sys-color-surface-container-high)] border-2 border-transparent focus:border-[color:var(--md-sys-color-primary)] outline-none transition-all"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-on-surface)] transition-colors"
            >
              <MaterialSymbol icon={showCurrent ? "visibility_off" : "visibility"} size={20} />
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label className="m3-label-large text-[color:var(--md-sys-color-on-surface-variant)]">
            New Password
          </Label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--md-sys-color-on-surface-variant)]">
              <MaterialSymbol icon="lock" size={20} />
            </div>
            <Input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-14 pl-12 pr-12 rounded-2xl bg-[color:var(--md-sys-color-surface-container-high)] border-2 border-transparent focus:border-[color:var(--md-sys-color-primary)] outline-none transition-all"
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-on-surface)] transition-colors"
            >
              <MaterialSymbol icon={showNew ? "visibility_off" : "visibility"} size={20} />
            </button>
          </div>
          {newPassword.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 w-8 rounded-full ${
                      i <= (newPassword.length >= 12 ? 5 : newPassword.length / 2)
                        ? newPassword.length >= 12
                          ? "bg-[color:var(--md-sys-color-primary)]"
                          : newPassword.length >= 8
                          ? "bg-[color:var(--md-sys-color-secondary)]"
                          : "bg-[color:var(--md-sys-color-error)]"
                        : "bg-[color:var(--md-sys-color-surface-container-high)]"
                    }`}
                  />
                ))}
              </div>
              <span className="m3-label-small text-[color:var(--md-sys-color-on-surface-variant)]">
                {newPassword.length >= 12
                  ? "Strong"
                  : newPassword.length >= 8
                  ? "Good"
                  : "Weak"}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label className="m3-label-large text-[color:var(--md-sys-color-on-surface-variant)]">
            Confirm New Password
          </Label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--md-sys-color-on-surface-variant)]">
              <MaterialSymbol icon="lock" size={20} />
            </div>
            <Input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={cn(
                "h-14 pl-12 pr-12 rounded-2xl bg-[color:var(--md-sys-color-surface-container-high)] border-2 border-transparent focus:border-[color:var(--md-sys-color-primary)] outline-none transition-all",
                confirmPassword && !passwordsMatch && "border-[color:var(--md-sys-color-error)]"
              )}
              placeholder="Re-enter new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-on-surface)] transition-colors"
            >
              <MaterialSymbol icon={showConfirm ? "visibility_off" : "visibility"} size={20} />
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="m3-label-small text-[color:var(--md-sys-color-error)] flex items-center gap-2">
              <MaterialSymbol icon="error" size={16} />
              Passwords do not match
            </p>
          )}
          {confirmPassword && passwordsMatch && (
            <p className="m3-label-small text-[color:var(--md-sys-color-primary)] flex items-center gap-2">
              <MaterialSymbol icon="check_circle" size={16} />
              Passwords match
            </p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-[color:var(--md-sys-color-outline-variant)]">
          <M3Button
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!canSave}
            className="h-12 px-8 rounded-2xl"
          >
            Update Password
          </M3Button>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
