"use client";

import { UserIcon, Camera01Icon } from "@/lib/icons/material-icons";
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
  Avatar,
  AvatarFallback,
  AvatarImage,
  useToast,
} from "@/components/core";
import { useUserStore } from "@/store/useUserStore";

export function LecturerProfileSection() {
  const { user, updateUser } = useUserStore();
  const { addToast } = useToast();
  const [name, setName] = React.useState(user?.name || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [bio, setBio] = React.useState(user?.bio || "");
  const [department, setDepartment] = React.useState(user?.department || "");
  const [avatarUrl, setAvatarUrl] = React.useState(user?.avatarUrl || "");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (user) {
        updateUser({
          name: name,
          bio: bio,
          department: department,
          avatarUrl: avatarUrl,
        });

        addToast("Profile updated successfully", "success");
      }
    } catch {
      addToast("Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
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
              icon={UserIcon}
              size={20}
              style={{ color: "var(--md-sys-color-primary)" }}
            />
          </div>
          <div>
            <CardTitle className="m3-title-large text-[color:var(--md-sys-color-on-surface)]">
              Faculty Profile
            </CardTitle>
            <p className="m3-body-medium text-[color:var(--md-sys-color-on-surface-variant)] mt-1">
              Update your faculty information and profile picture
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-2 border-[color:var(--md-sys-color-outline)]">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback
              className="text-[24px] font-bold"
              style={{
                backgroundColor: "var(--md-sys-color-primary-container)",
                color: "var(--md-sys-color-on-primary-container)",
              }}
            >
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "FA"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-3">
            <label
              htmlFor="avatar-upload"
              className="inline-flex items-center justify-center h-10 px-5 rounded-xl text-[15px] font-bold text-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)] hover:opacity-90 transition-opacity cursor-pointer"
            >
              <MaterialSymbol icon={Camera01Icon} size={18} className="mr-2" />
              Change Photo
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <p className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]">
              JPG, GIF or PNG. Max size 2MB.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-5">
          <div className="space-y-2">
            <Label className="m3-label-large text-[color:var(--md-sys-color-on-surface-variant)]">
              Full Name
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--md-sys-color-on-surface-variant)]">
                <MaterialSymbol icon={UserIcon} size={20} />
              </div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 pl-12 rounded-2xl bg-[color:var(--md-sys-color-surface-container-high)] border-2 border-transparent focus:border-[color:var(--md-sys-color-primary)] outline-none transition-all"
                placeholder="Dr. John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="m3-label-large text-[color:var(--md-sys-color-on-surface-variant)]">
              Email Address
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--md-sys-color-on-surface-variant)]">
                <MaterialSymbol icon="mail" size={20} />
              </div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 pl-12 rounded-2xl bg-[color:var(--md-sys-color-surface-container-high)] border-2 border-transparent focus:border-[color:var(--md-sys-color-primary)] outline-none transition-all"
                placeholder="faculty@university.edu"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="m3-label-large text-[color:var(--md-sys-color-on-surface-variant)]">
              Department
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--md-sys-color-on-surface-variant)]">
                <MaterialSymbol icon="business" size={20} />
              </div>
              <Input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="h-14 pl-12 rounded-2xl bg-[color:var(--md-sys-color-surface-container-high)] border-2 border-transparent focus:border-[color:var(--md-sys-color-primary)] outline-none transition-all"
                placeholder="Computer Science"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="m3-label-large text-[color:var(--md-sys-color-on-surface-variant)]">
              Bio
            </Label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full rounded-2xl bg-[color:var(--md-sys-color-surface-container-high)] border-2 border-transparent focus:border-[color:var(--md-sys-color-primary)] outline-none transition-all p-4 m3-body-medium text-[color:var(--md-sys-color-on-surface)] resize-none"
              placeholder="Tell students about your background and expertise..."
            />
            <p className="m3-body-small text-[color:var(--md-sys-color-on-surface-variant)]">
              Brief description for your profile. Max 500 characters.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-[color:var(--md-sys-color-outline-variant)]">
          <M3Button
            onClick={handleSave}
            isLoading={isSaving}
            className="h-12 px-8 rounded-2xl"
          >
            Save Changes
          </M3Button>
        </div>
      </CardContent>
    </Card>
  );
}
