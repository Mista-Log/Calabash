"use client";

import * as React from "react";
import Link from "next/link";
import {
  Upload02Icon,
  Note01Icon,
  VideoReplayIcon,
  FileZipIcon,
  CourseIcon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { Card, CardContent, M3Button, Input, Label } from "@/components/core";
import { useUploadStore } from "@/store/useUploadStore";
import { useUserStore } from "@/store/useUserStore";
import { useToast } from "@/components/core/toast";
import { APP_PAGE_CONTAINER, APP_PAGE_SHELL, APP_SURFACE_CARD } from "@/lib/ui-sync";
import { cn } from "@/lib/utils";

type StepId = "details" | "file" | "review";

const stepOrder: StepId[] = ["details", "file", "review"];

const typeOptions = [
  { value: "pdf", label: "PDF Document", icon: Note01Icon },
  { value: "video", label: "Video Lecture", icon: VideoReplayIcon },
  { value: "zip", label: "ZIP Archive", icon: FileZipIcon },
  { value: "past-question", label: "Past Questions", icon: CourseIcon },
] as const;

const videoSourceOptions = [
  {
    value: "file",
    label: "Upload video file",
    helper: "MP4, MOV, and other standard video files.",
  },
  {
    value: "youtube",
    label: "Use YouTube URL",
    helper: "Paste a YouTube link students can stream directly.",
  },
] as const;

export default function UploadPage() {
  const { user } = useUserStore();
  const { addToast } = useToast();
  const {
    draft,
    selectedFile,
    status,
    error,
    progress,
    validationErrors,
    lastSuccess,
    setDraftField,
    setFile,
    publish,
    reset,
  } = useUploadStore();

  const [step, setStep] = React.useState<StepId>("details");
  const [fileInputKey, setFileInputKey] = React.useState(0);
  const videoSource = draft.videoSource ?? "file";
  const youtubeUrl = draft.youtubeUrl ?? "";

  React.useEffect(() => {
    if (user?.semester && draft.semester !== user.semester) {
      setDraftField("semester", user.semester);
    }
  }, [draft.semester, setDraftField, user?.semester]);

  React.useEffect(() => {
    if (typeof draft.videoSource === "undefined") {
      setDraftField("videoSource", "file");
    }
    if (typeof draft.youtubeUrl === "undefined") {
      setDraftField("youtubeUrl", "");
    }
  }, [draft.videoSource, draft.youtubeUrl, setDraftField]);

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[860px] items-center justify-center">
        <Card className={cn(APP_SURFACE_CARD, "w-full")}>
          <CardContent className="p-8 text-center">
            <h1 className="text-[24px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              Sign in to upload materials
            </h1>
            <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
              Upload workflow requires an authenticated lecturer profile.
            </p>
            <Link href="/auth/login" className="mt-5 inline-block">
              <M3Button>Go to Login</M3Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user && user.role !== "lecturer") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[860px] items-center justify-center">
        <Card className={cn(APP_SURFACE_CARD, "w-full")}>
          <CardContent className="p-8 text-center">
            <h1 className="text-[24px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              Upload is lecturer-only
            </h1>
            <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
              Students can access shared resources from the Library tab.
            </p>
            <Link href="/library" className="mt-5 inline-block">
              <M3Button>Open Library</M3Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepIndex = stepOrder.indexOf(step);
  const isYouTubeVideo = draft.type === "video" && videoSource === "youtube";
  const requiresFile = !isYouTubeVideo;

  const goToStep = (nextStep: StepId) => {
    setStep(nextStep);
  };

  const nextStep = () => {
    if (step === "details") {
      if (!draft.title.trim() || !draft.courseCode.trim()) {
        addToast("Title and course code are required before continuing.", "error");
        return;
      }
      goToStep("file");
      return;
    }

    if (step === "file") {
      if (requiresFile && !selectedFile) {
        addToast("Select a file before review.", "error");
        return;
      }

      if (isYouTubeVideo && !youtubeUrl.trim()) {
        addToast("Paste the YouTube URL before review.", "error");
        return;
      }
      goToStep("review");
    }
  };

  const previousStep = () => {
    if (currentStepIndex <= 0) return;
    goToStep(stepOrder[currentStepIndex - 1]);
  };

  const handlePublish = async () => {
    const material = await publish();
    if (material) {
      addToast("Resource published successfully.", "success");
    } else {
      addToast("Publish failed. Check required fields and retry.", "error");
    }
  };

  const handleReset = () => {
    reset();
    setStep("details");
    setFileInputKey((value) => value + 1);
  };

  if (status === "success" && lastSuccess) {
    return (
      <div className="mx-auto flex min-h-[68vh] max-w-[740px] items-center justify-center">
        <Card className={cn(APP_SURFACE_CARD, "w-full")}>
          <CardContent className="space-y-6 p-8 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
              <MaterialSymbol icon={CheckmarkCircle01Icon} size={34} />
            </div>
            <div>
              <h1 className="text-[30px] font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)]">
                Upload Complete
              </h1>
              <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">
                  {lastSuccess.title}
                </span>{" "}
                was added to {lastSuccess.courseCode}.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <M3Button className="h-11 w-full rounded-xl sm:w-auto">
                  Go to Dashboard
                </M3Button>
              </Link>
              <Link href="/library">
                <M3Button variant="outlined" className="h-11 w-full rounded-xl sm:w-auto">
                  Open Library
                </M3Button>
              </Link>
              <M3Button variant="text" className="h-11 rounded-xl" onClick={handleReset}>
                Upload Another
              </M3Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={APP_PAGE_SHELL}>
      <div className={cn(APP_PAGE_CONTAINER, "space-y-6")}>
      <div className="space-y-2">
        <h1 className="text-[34px] font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)]">
          Upload Resource
        </h1>
        <p className="text-[15px] text-[color:var(--md-sys-color-on-surface-variant)]">
          Publish course resources with a guided draft, review, and release flow.
        </p>
      </div>

      <Card className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
        <CardContent className="space-y-6 p-4 sm:p-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {stepOrder.map((item, index) => {
              const active = item === step;
              const complete = index < currentStepIndex;
              return (
                <div
                  key={item}
                  className={`rounded-xl border px-3 py-2 text-center ${
                    active
                      ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]"
                      : complete
                        ? "border-[color:var(--md-sys-color-secondary)] bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]"
                        : "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)] text-[color:var(--md-sys-color-on-surface-variant)]"
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                    Step {index + 1}
                  </p>
                  <p className="mt-0.5 text-[13px] font-semibold capitalize">{item}</p>
                </div>
              );
            })}
          </div>

          {step === "details" ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="resource-title">Resource Title</Label>
                <Input
                  id="resource-title"
                  value={draft.title}
                  onChange={(event) => setDraftField("title", event.target.value)}
                  placeholder="Introduction to Data Structures"
                  className="h-11 rounded-xl border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)]"
                />
                {validationErrors.title ? (
                  <p className="text-[12px] text-[color:var(--md-sys-color-error)]">
                    {validationErrors.title}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="course-code">Course Code</Label>
                  <Input
                    id="course-code"
                    value={draft.courseCode}
                    onChange={(event) => setDraftField("courseCode", event.target.value)}
                    placeholder="CSC 201"
                    className="h-11 rounded-xl border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)]"
                  />
                  {validationErrors.courseCode ? (
                    <p className="text-[12px] text-[color:var(--md-sys-color-error)]">
                      {validationErrors.courseCode}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    type="number"
                    min={1}
                    value={draft.semester}
                    onChange={(event) =>
                      setDraftField("semester", Math.max(1, Number(event.target.value) || 1))
                    }
                    className="h-11 rounded-xl border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)]"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Material Type</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {typeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setDraftField("type", option.value);
                        if (option.value !== "video") {
                          setDraftField("videoSource", "file");
                          setDraftField("youtubeUrl", "");
                        }
                      }}
                      className={`rounded-xl border px-2 py-2 text-left transition-colors ${
                        draft.type === option.value
                          ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]"
                          : "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)]"
                      }`}
                    >
                      <MaterialSymbol icon={option.icon} size={16} />
                      <p className="mt-1 text-[12px] font-semibold">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {draft.type === "video" ? (
                <div className="grid gap-2">
                  <Label>Video Source</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {videoSourceOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setDraftField("videoSource", option.value);
                          if (option.value === "youtube") {
                            setFile(null);
                          } else {
                            setDraftField("youtubeUrl", "");
                          }
                        }}
                        className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                          videoSource === option.value
                            ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]"
                            : "border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)]"
                        }`}
                      >
                        <p className="text-[13px] font-semibold">{option.label}</p>
                        <p className="mt-1 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                          {option.helper}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={draft.description}
                  onChange={(event) => setDraftField("description", event.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)] p-3 text-[14px] text-[color:var(--md-sys-color-on-surface)] focus:border-[color:var(--md-sys-color-primary)] focus:outline-none"
                  placeholder="Optional description for students..."
                />
              </div>
            </div>
          ) : null}

          {step === "file" ? (
            <div className="space-y-3">
              {isYouTubeVideo ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="youtube-url">YouTube Video URL</Label>
                    <Input
                      id="youtube-url"
                      type="url"
                      value={youtubeUrl}
                      onChange={(event) => setDraftField("youtubeUrl", event.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      leadingIcon="link"
                      className="h-11 rounded-xl border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)]"
                    />
                    <p className="text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                      Use a public `youtube.com/watch`, `youtu.be`, or embed link.
                    </p>
                  </div>
                  {youtubeUrl.trim() ? (
                    <div className="rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-secondary-container)] px-3 py-2 text-[13px] text-[color:var(--md-sys-color-on-secondary-container)]">
                      Students will stream this video directly from YouTube.
                    </div>
                  ) : null}
                  {validationErrors.youtubeUrl ? (
                    <p className="text-[12px] text-[color:var(--md-sys-color-error)]">
                      {validationErrors.youtubeUrl}
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <label
                    htmlFor="upload-file"
                    className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface-container-lowest)] p-6 text-center transition-colors hover:border-[color:var(--md-sys-color-primary)]"
                  >
                    <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
                      <MaterialSymbol icon={Upload02Icon} size={22} />
                    </div>
                    <p className="text-[15px] font-semibold">Select file to upload</p>
                    <p className="mt-1 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                      PDF, video, zip, and image resources are supported.
                    </p>
                  </label>
                  <input
                    id="upload-file"
                    key={fileInputKey}
                    type="file"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setFile(file);
                    }}
                  />
                  {selectedFile ? (
                    <div className="rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-secondary-container)] px-3 py-2 text-[13px] text-[color:var(--md-sys-color-on-secondary-container)]">
                      {selectedFile.name} • {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  ) : null}
                  {validationErrors.file ? (
                    <p className="text-[12px] text-[color:var(--md-sys-color-error)]">
                      {validationErrors.file}
                    </p>
                  ) : null}
                </>
              )}
            </div>
          ) : null}

          {step === "review" ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <ReviewItem label="Title" value={draft.title} />
                <ReviewItem label="Course" value={draft.courseCode.toUpperCase()} />
                <ReviewItem label="Semester" value={`Semester ${draft.semester}`} />
                <ReviewItem
                  label="Type"
                  value={
                    typeOptions.find((option) => option.value === draft.type)?.label ??
                    draft.type
                  }
                />
                <ReviewItem
                  label="File"
                  value={
                    isYouTubeVideo
                      ? "YouTube stream"
                      : selectedFile
                        ? `${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)`
                        : "No file selected"
                  }
                />
                {isYouTubeVideo ? (
                  <ReviewItem label="YouTube URL" value={youtubeUrl.trim()} />
                ) : null}
                <ReviewItem label="Visibility" value={draft.visibility} />
              </div>

              {status === "publishing" ? (
                <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)] p-4">
                  <div className="mb-2 flex items-center justify-between text-[12px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">
                    <span>Publishing resource</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[color:var(--md-sys-color-surface-container-high)]">
                    <div
                      className="h-full rounded-full bg-[color:var(--md-sys-color-primary)] transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-[color:var(--md-sys-color-error)] bg-[color:var(--md-sys-color-error-container)] px-3 py-2 text-[13px] text-[color:var(--md-sys-color-on-error-container)]">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              <M3Button
                variant="text"
                className="h-10 gap-1 rounded-xl"
                onClick={previousStep}
                disabled={currentStepIndex === 0 || status === "publishing"}
              >
                <MaterialSymbol icon={ArrowLeft01Icon} size={14} />
                Back
              </M3Button>
              <M3Button
                variant="outlined"
                className="h-10 rounded-xl"
                onClick={handleReset}
                disabled={status === "publishing"}
              >
                Reset
              </M3Button>
            </div>

            {step === "review" ? (
              <M3Button
                className="h-10 gap-2 rounded-xl"
                onClick={() => void handlePublish()}
                disabled={status === "publishing"}
              >
                <MaterialSymbol icon={Upload02Icon} size={15} />
                {status === "publishing" ? "Publishing..." : "Publish Resource"}
              </M3Button>
            ) : (
              <M3Button className="h-10 gap-2 rounded-xl" onClick={nextStep}>
                Continue
                <MaterialSymbol icon={ArrowRight01Icon} size={14} />
              </M3Button>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)] px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
        {label}
      </p>
      <p className="mt-1 text-[13px] font-medium text-[color:var(--md-sys-color-on-surface)]">
        {value || "N/A"}
      </p>
    </div>
  );
}
