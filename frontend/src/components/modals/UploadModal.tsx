"use client";

import * as React from "react";
import {
  Upload01Icon,
  Cancel01Icon,
  DocumentCodeIcon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
} from "@/components/core";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [step, setStep] = React.useState<"upload" | "details" | "success">(
    "upload",
  );
  const [file, setFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStep("details");
    }
  };

  const handleUpload = () => {
    setStep("success");
    setTimeout(() => {
      onClose();
      setStep("upload");
      setFile(null);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl overflow-hidden p-0">
        <div className="h-2 bg-primary/20" />
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Upload Knowledge
            </DialogTitle>
            <DialogDescription>
              Contribute to the Calabash ecosystem by sharing academic
              materials.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8">
            {step === "upload" && (
              <div
                className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-accent/5 p-12 transition-all hover:border-primary/50 hover:bg-accent/10 cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary transition-transform group-hover:scale-110">
                  <HugeiconsIcon icon={Upload01Icon} size={32} />
                </div>
                <h3 className="text-lg font-semibold">Drop your files here</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  PDF, Docx, or Images (Max 50MB)
                </p>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {step === "details" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/10 border border-primary/20">
                  <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center text-primary">
                    <HugeiconsIcon icon={DocumentCodeIcon} size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {file?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ready to tag
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setStep("upload")}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={16} />
                  </Button>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Material Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Introduction to Algorithms Lecture 1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Course Code</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csc101">CSC 101</SelectItem>
                          <SelectItem value="csc102">CSC 102</SelectItem>
                          <SelectItem value="mth101">MTH 101</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Material Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lecture">Lecture Note</SelectItem>
                          <SelectItem value="past">Past Question</SelectItem>
                          <SelectItem value="manual">Lab Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    className="px-8 shadow-lg shadow-primary/20"
                  >
                    Finish Upload
                  </Button>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-300">
                <div className="mb-6 rounded-full bg-green-500/10 p-6 text-green-500">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={64} />
                </div>
                <h2 className="text-2xl font-bold">Successfully Uploaded!</h2>
                <p className="text-muted-foreground mt-2">
                  Your contribution is being processed and will be available
                  shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
