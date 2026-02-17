"use client";

import {
  Upload01Icon,
  Cancel01Icon,
  DocumentCodeIcon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import * as React from "react";

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

import { useLibraryStore } from "@/store/useLibraryStore";
import { Material } from "@/services/api";

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { addMaterial } = useLibraryStore();
  const [step, setStep] = React.useState<"upload" | "details" | "success">(
    "upload",
  );
  const [file, setFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState("");
  const [courseCode, setCourseCode] = React.useState("");
  const [type, setType] = React.useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setTitle(
        e.target.files[0].name
          ? e.target.files[0].name.split(".")[0]
          : "Untitled Material",
      ); // Default title
      setStep("details");
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const newMaterial: Material = {
      id: "m-" + Math.random().toString(36).substr(2, 9),
      title: title || file.name,
      courseCode: courseCode || "GEN 101",
      type: (type as any) || "pdf",
      semester: 2, // Default
      uploadDate: new Date().toISOString(),
      url: "#", // Mock URL
      uploader: "Current User", // Should come from user store but for now mock
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
    };

    addMaterial(newMaterial);
    setStep("success");

    setTimeout(() => {
      onClose();
      setStep("upload");
      setFile(null);
      setTitle("");
      setCourseCode("");
      setType("");
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
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Course Code</Label>
                      <Input
                        placeholder="CSC 101"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Material Type</Label>
                      <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="pdf">PDF</option>
                        <option value="video">Video</option>
                        <option value="past-question">Past Question</option>
                        <option value="zip">ZIP Archive</option>
                      </select>
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
