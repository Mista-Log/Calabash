"use client";

import { ViewIcon, ViewOffIcon } from "@/lib/icons/material-icons";
import * as React from "react";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  M3Button,
  Input,
  Label,
  useToast,
} from "@/components/core";
import { cn } from "@/lib/utils";
import { mockActionsService } from "@/services/mock-actions.service";

export function AccountSection() {
  const { addToast } = useToast();
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Password strength calculation (reused from signup)
  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return { score, percentage: (score / 5) * 100 };
  };

  const strength = calculatePasswordStrength(newPassword);
  const passwordsMatch =
    newPassword === confirmPassword && newPassword.length > 0;

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !passwordsMatch) return;
    setIsSaving(true);
    try {
      await mockActionsService.updatePassword();
      addToast("Password updated successfully", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      addToast("Unable to update password", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-muted/10">
      <CardHeader>
        <CardTitle className="text-[20px] font-bold">
          Account Security
        </CardTitle>
        <CardDescription className="font-medium">
          Update your password and manage security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="current-password" className="text-[14px] font-bold">
            Current Password
          </Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="h-11 rounded-xl pr-12"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MaterialSymbol
                icon={showCurrent ? ViewOffIcon : ViewIcon}
                size={18}
              />
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-[14px] font-bold">
            New Password
          </Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="h-11 rounded-xl pr-12"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MaterialSymbol
                icon={showNew ? ViewOffIcon : ViewIcon}
                size={18}
              />
            </button>
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="space-y-2">
              <div className="flex gap-1 h-1.5">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={cn(
                      "h-full flex-1 rounded-full transition-all duration-300",
                      step <= strength.score
                        ? strength.score <= 2
                          ? "bg-destructive"
                          : strength.score <= 3
                            ? "bg-amber-500"
                            : strength.score <= 4
                              ? "bg-emerald-500"
                              : "bg-primary"
                        : "bg-border/30",
                    )}
                  />
                ))}
              </div>
              <p className="text-[13px] font-bold text-muted-foreground">
                Password strength:{" "}
                {strength.score <= 2
                  ? "Weak"
                  : strength.score <= 3
                    ? "Fair"
                    : strength.score <= 4
                      ? "Good"
                      : "Strong"}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-[14px] font-bold">
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="h-11 rounded-xl pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MaterialSymbol
                icon={showConfirm ? ViewOffIcon : ViewIcon}
                size={18}
              />
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="text-[13px] font-bold text-destructive">
              Passwords do not match
            </p>
          )}
          {passwordsMatch && (
            <p className="text-[13px] font-bold text-emerald-500">
              Passwords match ✓
            </p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-muted/10">
          <M3Button
            onClick={handleSave}
            disabled={!currentPassword || !newPassword || !passwordsMatch}
            isLoading={isSaving}
            className="px-8 font-bold"
          >
            Update Password
          </M3Button>
        </div>
      </CardContent>
    </Card>
  );
}
