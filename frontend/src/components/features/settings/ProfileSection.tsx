"use client";

import { Camera01Icon } from "@/lib/icons/material-icons";
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
  Avatar,
  AvatarFallback,
  AvatarImage,
  useToast,
} from "@/components/core";
import { useUserStore } from "@/store/useUserStore";

export function ProfileSection() {
  const { user, updateUser } = useUserStore();
  const { addToast } = useToast();
  const [name, setName] = React.useState(user?.name || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [bio, setBio] = React.useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = React.useState(user?.avatarUrl || "");
  const [isSaving, setIsSaving] = React.useState(false);

  // Sync state with user store when user data changes
  React.useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (user) {
        updateUser({
          name: name,
          bio: bio,
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
    <Card className="border-muted/10">
      <CardHeader>
        <CardTitle className="text-[20px] font-bold">
          Profile Information
        </CardTitle>
        <CardDescription className="font-medium">
          Update your personal information and profile picture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-2 border-border">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary text-[24px] font-bold">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "CU"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Label
              htmlFor="avatar-upload"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors font-bold text-[14px]"
            >
              <MaterialSymbol icon={Camera01Icon} size={16} />
              Change Avatar
            </Label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <p className="text-[13px] text-muted-foreground font-medium">
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[14px] font-bold">
            Full Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="h-11 rounded-xl"
          />
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[14px] font-bold">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="h-11 rounded-xl"
            disabled
          />
          <p className="text-[13px] text-muted-foreground font-medium">
            Email cannot be changed. Contact support if needed.
          </p>
        </div>

        {/* Bio Textarea */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-[14px] font-bold">
            Bio
          </Label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a bit about yourself..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-medium text-[14px]"
          />
          <p className="text-[13px] text-muted-foreground font-medium">
            {bio.length}/250 characters
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-muted/10">
          <M3Button
            onClick={handleSave}
            isLoading={isSaving}
            className="px-8 font-bold"
          >
            Save Changes
          </M3Button>
        </div>
      </CardContent>
    </Card>
  );
}



