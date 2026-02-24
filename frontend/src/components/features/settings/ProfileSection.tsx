"use client";

import { UserIcon, Camera01Icon } from "@hugeicons/core-free-icons";
import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/core";
import { useUserStore } from "@/store/useUserStore";

export function ProfileSection() {
  const { user, updateUser } = useUserStore();
  const [name, setName] = React.useState(user?.name || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [bio, setBio] = React.useState(
    "Passionate about technology and education.",
  ); // Mock default bio
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (user) {
      updateUser({
        name: name,
        // In a real app, bio and avatar would be part of the user profile
      });
    }

    setIsSaving(false);
    // Show success feedback (simulated)
    alert("Profile updated successfully!");
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
        <CardTitle className="text-xl font-bold">Profile Information</CardTitle>
        <CardDescription className="font-medium">
          Update your personal information and profile picture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-2 border-border">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
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
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors font-bold text-sm"
            >
              <HugeiconsIcon icon={Camera01Icon} size={16} />
              Change Avatar
            </Label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <p className="text-xs text-muted-foreground font-medium">
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-bold">
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
          <Label htmlFor="email" className="text-sm font-bold">
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
          <p className="text-xs text-muted-foreground font-medium">
            Email cannot be changed. Contact support if needed.
          </p>
        </div>

        {/* Bio Textarea */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-bold">
            Bio
          </Label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a bit about yourself..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-medium text-sm"
          />
          <p className="text-xs text-muted-foreground font-medium">
            {bio.length}/250 characters
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-muted/10">
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            loadingText="Saving..."
            className="px-8 font-bold shadow-lg"
          >
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
