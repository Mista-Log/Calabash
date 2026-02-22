"use client";

import * as React from "react";
import {
  CheckmarkCircle02Icon,
  Note01Icon,
  ViewIcon,
  ViewOffIcon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  M3Button,
  Input,
  Label,
  Separator,
} from "@/components/core";
import { Material } from "@/services/api";

interface EditMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material | null;
  onSave: (updatedMaterial: Partial<Material>) => void | Promise<void>;
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
  };

  if (!material) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[min(96vw,32rem)] max-h-[calc(100dvh-2rem)] overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] p-0">
        <DialogHeader className="border-b border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
              <MaterialSymbol icon={Note01Icon} size={20} />
            </div>
            <div>
              <DialogTitle className="text-[20px] font-bold">
                Edit Material
              </DialogTitle>
              <p className="mt-1 text-[13px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                Update details for "{material.title}"
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[13px] font-black uppercase tracking-widest text-muted-foreground">
                Title
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)] font-bold"
              />
            </div>

            <div className="space-y-2">
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
              </div>
            </div>
          </div>

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
                {material.size || "2.4 MB"}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
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
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="size-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  <MaterialSymbol icon={CheckmarkCircle02Icon} size={18} />
                  Save Changes
                </>
              )}
            </M3Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
