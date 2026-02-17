"use client";

import * as React from "react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Note01Icon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Separator,
  Badge,
} from "@/components/core";
import { Material } from "@/services/api";

interface EditMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material | null;
  onSave: (updatedMaterial: Partial<Material>) => void;
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
  };

  if (!material) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                Update details for "{material.title}"
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Title
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 rounded-xl border-border/40 font-bold"
              />
            </div>

            <div className="space-y-2">
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
              </div>
            </div>
          </div>

          <Separator className="bg-border/10" />

          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground bg-accent/5 p-4 rounded-2xl border border-border/10">
            <div className="flex flex-col">
              <span className="uppercase opacity-50">Last Edited</span>
              <span className="text-foreground">{material.uploadDate}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="uppercase opacity-50">File Size</span>
              <span className="text-foreground">
                {material.size || "2.4 MB"}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
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
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="size-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
