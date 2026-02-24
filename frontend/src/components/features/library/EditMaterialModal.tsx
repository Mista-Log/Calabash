<<<<<<< HEAD
﻿"use client";

import * as React from "react";
import {
=======
"use client";

import * as React from "react";
import {
  Cancel01Icon,
>>>>>>> origin/main
  CheckmarkCircle02Icon,
  Note01Icon,
  ViewIcon,
  ViewOffIcon,
<<<<<<< HEAD
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
=======
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
>>>>>>> origin/main
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
<<<<<<< HEAD
  M3Button,
  Input,
  Label,
  Separator,
=======
  Button,
  Input,
  Label,
  Separator,
  Badge,
>>>>>>> origin/main
} from "@/components/core";
import { Material } from "@/services/api";

interface EditMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material | null;
<<<<<<< HEAD
  onSave: (updatedMaterial: Partial<Material>) => void | Promise<void>;
=======
  onSave: (updatedMaterial: Partial<Material>) => void;
>>>>>>> origin/main
}

export function EditMaterialModal({
  isOpen,
  onClose,
  material,
  onSave,
}: EditMaterialModalProps) {
  const [title, setTitle] = React.useState("");
  const [isPublic, setIsPublic] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (material) {
      setTitle(material.title);
<<<<<<< HEAD
      setIsPublic(material.visibility !== "private");
    }
  }, [material]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        title,
        visibility: isPublic ? "public" : "private",
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
=======
      setIsPublic(true); // Default mock behavior
    }
  }, [material]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onSave({ title });
      setIsSaving(false);
      onClose();
    }, 1000);
>>>>>>> origin/main
  };

  if (!material) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
<<<<<<< HEAD
      <DialogContent className="w-[min(96vw,38rem)] max-h-[calc(100dvh-2rem)] overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline-variant)]">
        <DialogHeader className="bg-[color:var(--md-sys-color-surface-container-low)]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
              <MaterialSymbol icon={Note01Icon} size={20} />
            </div>
            <div>
              <DialogTitle className="text-[20px] font-bold">
                Edit Material
              </DialogTitle>
              <p className="mt-1 text-[13px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
=======
      <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-8 bg-muted/20 border-b border-border/10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <HugeiconsIcon icon={Note01Icon} size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Edit Material
              </DialogTitle>
              <p className="text-xs text-muted-foreground font-medium mt-1">
>>>>>>> origin/main
                Update details for "{material.title}"
              </p>
            </div>
          </div>
        </DialogHeader>

<<<<<<< HEAD
        <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[13px] font-black uppercase tracking-widest text-muted-foreground">
=======
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
>>>>>>> origin/main
                Title
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
<<<<<<< HEAD
                className="rounded-xl border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)] font-bold"
=======
                className="h-12 rounded-xl border-border/40 font-bold"
>>>>>>> origin/main
              />
            </div>

            <div className="space-y-2">
<<<<<<< HEAD
              <Label className="text-[13px] font-black uppercase tracking-widest text-muted-foreground">
                Visibility
              </Label>
              <div className="flex gap-2">
                <M3Button
                  variant={isPublic ? "filled" : "outlined"}
                  className="flex-1 gap-2 rounded-xl font-bold"
                  onClick={() => setIsPublic(true)}
                >
                  <MaterialSymbol icon={ViewIcon} size={18} />
                  Public
                </M3Button>
                <M3Button
                  variant={!isPublic ? "tonal" : "outlined"}
                  className="flex-1 gap-2 rounded-xl font-bold"
                  onClick={() => setIsPublic(false)}
                >
                  <MaterialSymbol icon={ViewOffIcon} size={18} />
                  Private
                </M3Button>
=======
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Visibility
              </Label>
              <div className="flex gap-2">
                <Button
                  variant={isPublic ? "default" : "outline"}
                  className="flex-1 rounded-xl h-12 font-bold gap-2"
                  onClick={() => setIsPublic(true)}
                >
                  <HugeiconsIcon icon={ViewIcon} size={18} />
                  Public
                </Button>
                <Button
                  variant={!isPublic ? "secondary" : "outline"}
                  className="flex-1 rounded-xl h-12 font-bold gap-2"
                  onClick={() => setIsPublic(false)}
                >
                  <HugeiconsIcon icon={ViewOffIcon} size={18} />
                  Private
                </Button>
>>>>>>> origin/main
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <Separator className="bg-[color:var(--md-sys-color-outline-variant)]" />

          <div className="flex items-center justify-between rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4 text-[13px] font-bold text-[color:var(--md-sys-color-on-surface-variant)]">
            <div className="flex flex-col">
              <span className="uppercase opacity-50">Last Edited</span>
              <span className="text-[color:var(--md-sys-color-on-surface)]">
                {material.uploadDate}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="uppercase opacity-50">File Size</span>
              <span className="text-[color:var(--md-sys-color-on-surface)]">
=======
          <Separator className="bg-border/10" />

          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground bg-accent/5 p-4 rounded-2xl border border-border/10">
            <div className="flex flex-col">
              <span className="uppercase opacity-50">Last Edited</span>
              <span className="text-foreground">{material.uploadDate}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="uppercase opacity-50">File Size</span>
              <span className="text-foreground">
>>>>>>> origin/main
                {material.size || "2.4 MB"}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
<<<<<<< HEAD
            <M3Button
              variant="text"
              className="flex-1 rounded-xl font-bold"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </M3Button>
            <M3Button
              className="flex-1 gap-2 rounded-xl font-bold"
              onClick={() => void handleSave()}
=======
            <Button
              variant="ghost"
              className="flex-1 h-12 rounded-xl font-bold"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2"
              onClick={handleSave}
>>>>>>> origin/main
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="size-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
<<<<<<< HEAD
                  <MaterialSymbol icon={CheckmarkCircle02Icon} size={18} />
                  Save Changes
                </>
              )}
            </M3Button>
=======
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                  Save Changes
                </>
              )}
            </Button>
>>>>>>> origin/main
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
