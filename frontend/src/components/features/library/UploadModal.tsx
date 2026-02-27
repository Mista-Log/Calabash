"use client";

import * as React from "react";
import {
  Upload01Icon,
  Cancel01Icon,
  DocumentCodeIcon,
  CheckmarkCircle01Icon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  M3Button,
  Input,
  Label,
} from "@/components/core";
import { useLibraryStore } from "@/store/useLibraryStore";
import type { Material } from "@/services/api";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded?: (material: Material) => void;
  preselectedCourseCode?: string;
}

type UploadStep = "upload" | "details" | "uploading" | "success";

export function UploadModal({ isOpen, onClose, onUploaded, preselectedCourseCode }: UploadModalProps) {
  const { createMaterial } = useLibraryStore();

  const [step, setStep] = React.useState<UploadStep>("upload");
  const [file, setFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState("");
  const [courseCode, setCourseCode] = React.useState(preselectedCourseCode || "");
  const [type, setType] = React.useState<Material["type"]>("pdf");
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const resetState = React.useCallback(() => {
    setStep("upload");
    setFile(null);
    setTitle("");
    setCourseCode(preselectedCourseCode || "");
    setType("pdf");
    setUploadProgress(0);
    setError(null);
  }, [preselectedCourseCode]);

  React.useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  // Update course code when preselectedCourseCode changes
  React.useEffect(() => {
    if (preselectedCourseCode && step === "upload") {
      setCourseCode(preselectedCourseCode);
    }
  }, [preselectedCourseCode, step]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    setFile(nextFile);
    setTitle(nextFile.name ? nextFile.name.split(".")[0] : "Untitled Material");
    setStep("details");
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStep("uploading");
    setError(null);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25;
      setUploadProgress(Math.min(100, Math.round(progress)));
    }, 250);

    try {
      const created = await createMaterial({
        id: "",
        title: title || file.name,
        courseCode: courseCode || "GEN 101",
        type,
        semester: 2,
        uploadDate: new Date().toISOString(),
        url: "#",
        uploader: "Current User",
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        visibility: "public",
      });

      clearInterval(interval);
      setUploadProgress(100);
      setStep("success");
      onUploaded?.(created);

      setTimeout(() => {
        onClose();
        resetState();
      }, 1100);
    } catch (uploadError) {
      clearInterval(interval);
      setStep("details");
      setUploadProgress(0);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed. Please try again.",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[min(96vw,40rem)] max-h-[calc(100dvh-2rem)] overflow-hidden">
        <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <div className="h-1.5 bg-[color:var(--md-sys-color-primary)]" />
          <div>
            <DialogHeader>
              <DialogTitle className="text-[24px] font-bold">
                Upload Knowledge
              </DialogTitle>
              <DialogDescription>
                Contribute to the Calabash ecosystem by sharing academic materials.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8">
              {step === "upload" && (
                <div
                  className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface-container-low)] p-12 transition-all hover:border-[color:var(--md-sys-color-primary)]"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <div className="mb-4 rounded-full bg-[color:var(--md-sys-color-primary-container)] p-4 text-[color:var(--md-sys-color-on-primary-container)]">
                    <MaterialSymbol icon={Upload01Icon} size={32} />
                  </div>
                  <h3 className="text-[18px] font-semibold">Drop your file here</h3>
                  <p className="mt-1 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
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

            {step === "uploading" && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-[color:var(--md-sys-color-outline)] border-t-[color:var(--md-sys-color-primary)]" />
                <h3 className="text-[20px] font-bold">Uploading...</h3>
                <p className="mb-8 mt-1 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                  Please wait while we process your file.
                </p>
                <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-[color:var(--md-sys-color-surface-container-high)]">
                  <div
                    className="h-full bg-[color:var(--md-sys-color-primary)] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
                  {uploadProgress}% Complete
                </p>
              </div>
            )}

            {step === "details" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
                    <MaterialSymbol icon={DocumentCodeIcon} size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold">{file?.name}</p>
                    <p className="text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                      Ready to tag
                    </p>
                  </div>
                  <M3Button size="sm" variant="text" onClick={() => setStep("upload")}>
                    <MaterialSymbol icon={Cancel01Icon} size={16} />
                  </M3Button>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Material Title</Label>
                    <Input
                      id="title"
                      placeholder="Introduction to Algorithms Lecture 1"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Course Code</Label>
                      <Input
                        placeholder="CSC 101"
                        value={courseCode}
                        onChange={(event) => setCourseCode(event.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Material Type</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] px-3 py-2 text-[14px]"
                        value={type}
                        onChange={(event) =>
                          setType(event.target.value as Material["type"])
                        }
                      >
                        <option value="pdf">PDF</option>
                        <option value="video">Video</option>
                        <option value="past-question">Past Question</option>
                        <option value="zip">ZIP Archive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl bg-[color:var(--md-sys-color-error-container)] px-3 py-2 text-[12px] font-medium text-[color:var(--md-sys-color-on-error-container)]">
                    {error}
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <M3Button variant="outlined" onClick={onClose}>
                    Cancel
                  </M3Button>
                  <M3Button onClick={() => void handleUpload()} className="px-8">
                    Finish Upload
                  </M3Button>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-6 rounded-full bg-[color:var(--md-sys-color-primary-container)] p-6 text-[color:var(--md-sys-color-on-primary-container)]">
                  <MaterialSymbol icon={CheckmarkCircle01Icon} size={64} />
                </div>
                <h2 className="text-[24px] font-bold">Successfully Uploaded!</h2>
                <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                  Your material is now available in the dashboard and library.
                </p>
              </div>
            )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
