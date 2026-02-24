<<<<<<< HEAD
﻿"use client";

import * as React from "react";
import {
  ArrowRight01Icon,
  Download01Icon,
  Share01Icon,
  Bookmark01Icon,
=======
"use client";

import * as React from "react";
import {
  ArrowLeft01Icon,
  Download01Icon,
  Share01Icon,
  BookmarkIcon,
>>>>>>> origin/main
  CourseIcon,
  UserIcon,
  Calendar03Icon,
  InformationCircleIcon,
<<<<<<< HEAD
  Message01Icon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import Link from "next/link";

import { Material } from "@/services/api";
import dynamic from "next/dynamic";
import {
  YouTubeEmbed,
  getYouTubeId,
} from "@/components/features/courses/YouTubeEmbed";
import { ShareMaterialModal } from "@/components/features/library/ShareMaterialModal";
import {
  resolveMaterialAction,
  runMaterialAction,
} from "@/lib/material-actions";
=======
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Material } from "@/services/api";
import dynamic from "next/dynamic";
>>>>>>> origin/main

const DocumentViewer = dynamic(
  () =>
    import("@/components/features/library/DocumentViewer").then(
      (mod) => mod.DocumentViewer,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center gap-4 p-12">
<<<<<<< HEAD
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[color:var(--md-sys-color-primary)] border-t-transparent" />
        <p className="text-[14px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
          Loading Document Viewer...
        </p>
=======
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium">Loading Document Viewer...</p>
>>>>>>> origin/main
      </div>
    ),
  },
);

<<<<<<< HEAD
import {
  M3Button,
  Badge,
  Card,
  CardContent,
  Separator,
} from "@/components/core";
import { useNotesStore } from "@/store/useNotesStore";
import { useUserStore } from "@/store/useUserStore";
import { useToast } from "@/components/core/toast";
=======
import { Button, Badge, Card, CardContent, Separator } from "@/components/core";
>>>>>>> origin/main

interface MaterialDetailProps {
  material: Material;
}

<<<<<<< HEAD
interface VideoComment {
  id: string;
  materialId: string;
  author: string;
  body: string;
  createdAt: string;
}

const VIDEO_COMMENT_STORAGE_KEY = "calabash-video-comments-v1";

// Queue for serializing localStorage writes to prevent race conditions
const videoCommentWriteQueue: Array<() => void> = [];
let isWritingVideoComments = false;

function processVideoCommentWriteQueue(): void {
  if (isWritingVideoComments || videoCommentWriteQueue.length === 0) {
    return;
  }

  isWritingVideoComments = true;
  const write = videoCommentWriteQueue.shift();
  if (write) {
    write();
    isWritingVideoComments = false;
    // Process next item in queue on next tick
    setTimeout(processVideoCommentWriteQueue, 0);
  }
}

function readPersistedVideoComments(): VideoComment[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(VIDEO_COMMENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is VideoComment => {
      return (
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as VideoComment).id === "string" &&
        typeof (entry as VideoComment).materialId === "string" &&
        typeof (entry as VideoComment).author === "string" &&
        typeof (entry as VideoComment).body === "string" &&
        typeof (entry as VideoComment).createdAt === "string"
      );
    });
  } catch {
    return [];
  }
}

function formatCommentTime(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MaterialDetail({ material }: MaterialDetailProps) {
  const isVideo = material.type === "video";
  const isPdf = material.type === "pdf" || material.type === "past-question";
  const youtubeUrl = React.useMemo(() => {
    if (material.youtubeUrl && getYouTubeId(material.youtubeUrl)) {
      return material.youtubeUrl;
    }
    if (material.url && getYouTubeId(material.url)) {
      return material.url;
    }
    return null;
  }, [material.url, material.youtubeUrl]);
  const hasPlayableVideoSource = Boolean(
    youtubeUrl || (material.url && material.url !== "#"),
  );
  const { user } = useUserStore();
  const { addToast } = useToast();
  const {
    notes,
    loadedContext,
    hydrateForContext,
    createDraft,
    attachMaterial,
    setActiveNote,
  } = useNotesStore();
  const [isSavingToNotes, setIsSavingToNotes] = React.useState(false);
  const [isShareOpen, setIsShareOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState(`/library/${material.id}`);
  const [commentDraft, setCommentDraft] = React.useState("");
  const [videoComments, setVideoComments] = React.useState<VideoComment[]>([]);
  const primaryMaterialAction = React.useMemo(
    () => resolveMaterialAction(material),
    [material],
  );

  React.useEffect(() => {
    setShareUrl(`/library/${material.id}`);
    if (typeof window === "undefined") {
      return;
    }
    setShareUrl(`${window.location.origin}/library/${material.id}`);
  }, [material.id]);

  React.useEffect(() => {
    if (!user) {
      return;
    }

    const context = { userId: user.id, role: user.role };
    const contextMismatch =
      !loadedContext ||
      loadedContext.userId !== context.userId ||
      loadedContext.role !== context.role;

    if (contextMismatch) {
      void hydrateForContext(context);
    }
  }, [hydrateForContext, loadedContext, user]);

  const isSavedToNotes = React.useMemo(() => {
    if (!user) {
      return false;
    }
    return notes.some((note) => {
      if (note.userId !== user.id || note.role !== user.role) {
        return false;
      }
      return note.attachments.some(
        (attachment) => attachment.materialId === material.id,
      );
    });
  }, [material.id, notes, user]);

  const persistVideoComments = React.useCallback(
    (nextCommentsForMaterial: VideoComment[]) => {
      if (typeof window === "undefined") return;

      // Queue the write operation to prevent race conditions
      const writeOperation = () => {
        const allComments = readPersistedVideoComments();
        const commentsForOtherMaterials = allComments.filter(
          (comment) => comment.materialId !== material.id,
        );
        const merged = [
          ...nextCommentsForMaterial,
          ...commentsForOtherMaterials,
        ];
        window.localStorage.setItem(
          VIDEO_COMMENT_STORAGE_KEY,
          JSON.stringify(merged),
        );
      };

      videoCommentWriteQueue.push(writeOperation);
      processVideoCommentWriteQueue();
    },
    [material.id],
  );

  React.useEffect(() => {
    if (!isVideo) {
      setVideoComments([]);
      return;
    }

    const allComments = readPersistedVideoComments();
    const commentsForMaterial = allComments
      .filter((comment) => comment.materialId === material.id)
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
      );
    setVideoComments(commentsForMaterial);
  }, [isVideo, material.id]);

  const handleSaveToNotes = async () => {
    if (!user) {
      addToast("Sign in to save notes.", "error");
      return;
    }

    if (isSavedToNotes) {
      addToast("Already saved to notes.", "info");
      return;
    }

    setIsSavingToNotes(true);

    const context = { userId: user.id, role: user.role };
    const contextMismatch =
      !loadedContext ||
      loadedContext.userId !== context.userId ||
      loadedContext.role !== context.role;

    if (contextMismatch) {
      await hydrateForContext(context);
    }

    const latestNotes = useNotesStore.getState().notes;
    const latestActiveNoteId = useNotesStore.getState().activeNoteId;

    const roleNotes = latestNotes.filter(
      (note) => note.userId === user.id && note.role === user.role,
    );
    const existingActive = roleNotes.find(
      (note) => note.id === latestActiveNoteId,
    );
    let targetNoteId = existingActive?.id ?? null;

    if (!targetNoteId) {
      targetNoteId = await createDraft(context, {
        title: `${material.courseCode} • ${material.title}`,
        content: `<p>Summary note for <strong>${material.title}</strong></p><p></p>`,
        courseId: material.courseId,
        courseCode: material.courseCode,
        materialId: material.id,
        scope: "material",
      });
    }

    if (!targetNoteId) {
      addToast("Unable to create a note right now.", "error");
      setIsSavingToNotes(false);
      return;
    }

    const attached = await attachMaterial(targetNoteId, material);
    if (attached) {
      setActiveNote(targetNoteId);
      addToast("Saved to notes workspace.", "success");
    } else {
      addToast("Failed to save material to notes.", "error");
    }

    setIsSavingToNotes(false);
  };

  const handlePostVideoComment = () => {
    const content = commentDraft.trim();
    if (!content) {
      return;
    }
    if (!isVideo) {
      return;
    }

    const newComment: VideoComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      materialId: material.id,
      author: user?.name?.trim() || "Anonymous",
      body: content,
      createdAt: new Date().toISOString(),
    };

    const next = [newComment, ...videoComments];
    setVideoComments(next);
    persistVideoComments(next);
    setCommentDraft("");
    addToast("Comment posted.", "success");
  };

  const handlePrimaryMaterialAction = React.useCallback(() => {
    if (primaryMaterialAction.kind === "none") {
      addToast(
        primaryMaterialAction.reason ?? "This action is unavailable right now.",
        "info",
      );
      return;
    }

    const executed = runMaterialAction(primaryMaterialAction);
    if (!executed) {
      addToast("Unable to open this resource right now.", "error");
    }
  }, [addToast, primaryMaterialAction]);
=======
export function MaterialDetail({ material }: MaterialDetailProps) {
  const isVideo = material.type === "video";
  const isPdf = material.type === "pdf" || material.type === "past-question";
>>>>>>> origin/main

  return (
    <div className="space-y-8 pb-20">
      {/* Navigation Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
<<<<<<< HEAD
        <Link
          href="/library"
          className="inline-block text-[15px] font-medium text-[color:var(--md-sys-color-on-surface-variant)] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-sys-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--md-sys-color-surface)]"
        >
          Back to Library
        </Link>
        <div className="m3-action-row m3-action-row--end w-full md:w-auto">
          <M3Button
            variant={isSavedToNotes ? "filled" : "outlined"}
            size="lg"
            className="h-11 gap-2 px-4 text-[15px] font-medium"
            onClick={() => void handleSaveToNotes()}
            disabled={isSavingToNotes}
          >
            <MaterialSymbol icon={Bookmark01Icon} size={18} />
            {isSavingToNotes
              ? "Saving..."
              : isSavedToNotes
                ? "Saved to Notes"
                : "Save to Notes"}
          </M3Button>
          <M3Button
            variant="outlined"
            size="lg"
            className="h-11 gap-2 px-4 text-[15px] font-medium"
            onClick={() => setIsShareOpen(true)}
            aria-label="Share this resource"
          >
            <MaterialSymbol icon={Share01Icon} size={18} />
            Share
          </M3Button>
          <M3Button
            size="lg"
            className="h-11 gap-2 px-4 text-[15px] font-medium"
            onClick={handlePrimaryMaterialAction}
            disabled={primaryMaterialAction.kind === "none"}
          >
            <MaterialSymbol icon={Download01Icon} size={18} />
            {primaryMaterialAction.kind === "open-source"
              ? "Open Source"
              : `Download${material.size ? ` (${material.size})` : ""}`}
          </M3Button>
        </div>
      </div>
      {primaryMaterialAction.kind === "none" && primaryMaterialAction.reason ? (
        <p className="mt-1 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)] md:text-right">
          {primaryMaterialAction.reason}
        </p>
      ) : null}
=======
        <Link href="/library">
          <Button
            variant="ghost"
            className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            Back to Library
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl h-10">
            <HugeiconsIcon icon={BookmarkIcon} size={18} />
            Save to Notes
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl h-10">
            <HugeiconsIcon icon={Share01Icon} size={18} />
            Share
          </Button>
          <Button className="gap-2 rounded-xl h-10 shadow-lg shadow-primary/20">
            <HugeiconsIcon icon={Download01Icon} size={18} />
            Download {material.size && `(${material.size})`}
          </Button>
        </div>
      </div>
>>>>>>> origin/main

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Content Area (Resource Viewer) */}
        <div className="xl:col-span-3 space-y-6">
<<<<<<< HEAD
          <div className="overflow-hidden rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)]">
            {isVideo ? (
              youtubeUrl ? (
                <YouTubeEmbed
                  url={youtubeUrl}
                  title={material.title}
                  className="rounded-none shadow-none"
                />
              ) : hasPlayableVideoSource ? (
                <div className="aspect-video bg-black flex items-center justify-center">
                  <video
                    src={material.url}
                    controls
                    className="h-full w-full object-contain"
                    poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
                  />
                </div>
              ) : (
                <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-10 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
                    <MaterialSymbol icon={InformationCircleIcon} size={24} />
                  </div>
                  <h3 className="text-[20px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                    Video source unavailable
                  </h3>
                  <p className="max-w-lg text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                    This video does not have a playable source yet. Ask the
                    lecturer to upload a video file or provide a YouTube URL.
                  </p>
                </div>
              )
            ) : isPdf ? (
              <div className="bg-[color:var(--md-sys-color-surface-container-low)] p-4 md:p-8">
                <DocumentViewer url={material.url} title={material.title} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-20 text-center">
                <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[color:var(--md-sys-color-secondary-container)]">
                  <MaterialSymbol
                    icon={InformationCircleIcon}
                    size={40}
                    className="text-[color:var(--md-sys-color-on-secondary-container)]"
                  />
                </div>
                <h3 className="text-[20px] font-bold text-[color:var(--md-sys-color-on-surface)]">
                  Preview not available
                </h3>
                <p className="mt-2 max-w-md text-[color:var(--md-sys-color-on-surface-variant)]">
                  This file type ({material.type}) cannot be previewed directly.
                  Please download it to view the content.
                </p>
                <M3Button
                  className="mt-8 gap-2"
                  onClick={handlePrimaryMaterialAction}
                  disabled={primaryMaterialAction.kind === "none"}
                >
                  <MaterialSymbol icon={Download01Icon} size={18} />
                  {primaryMaterialAction.kind === "open-source"
                    ? "Open Source"
                    : "Download Resource"}
                </M3Button>
=======
          <div className="rounded-3xl overflow-hidden border border-border/40 bg-card shadow-sm">
            {isVideo ? (
              <div className="aspect-video bg-black flex items-center justify-center group relative">
                {/* Mock Video Player */}
                <video
                  src={material.url}
                  controls
                  className="w-full h-full object-contain"
                  poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
                />
              </div>
            ) : isPdf ? (
              <div className="bg-accent/5 p-4 md:p-8">
                <DocumentViewer url={material.url} title={material.title} />
              </div>
            ) : (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <HugeiconsIcon
                    icon={InformationCircleIcon}
                    size={40}
                    className="text-primary"
                  />
                </div>
                <h3 className="text-xl font-bold">Preview not available</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  This file type ({material.type}) cannot be previewed directly.
                  Please download it to view the content.
                </p>
                <Button className="mt-8 gap-2">
                  <HugeiconsIcon icon={Download01Icon} size={18} />
                  Download Resource
                </Button>
>>>>>>> origin/main
              </div>
            )}
          </div>

<<<<<<< HEAD
          {isVideo ? (
            <Card className="border-[color:var(--md-sys-color-outline-variant)]">
              <CardContent className="space-y-5 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
                      <MaterialSymbol icon={Message01Icon} size={16} />
                    </div>
                    <h2 className="text-[18px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                      Video Discussion
                    </h2>
                  </div>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--md-sys-color-on-surface-variant)]">
                    {videoComments.length} comment
                    {videoComments.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={`video-comment-${material.id}`}
                    className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]"
                  >
                    Add a comment
                  </label>
                  <textarea
                    id={`video-comment-${material.id}`}
                    value={commentDraft}
                    onChange={(event) => setCommentDraft(event.target.value)}
                    rows={3}
                    disabled={!user}
                    placeholder={
                      user
                        ? "Share a question or insight about this video..."
                        : "Sign in to join the discussion."
                    }
                    className="w-full rounded-[var(--md-sys-shape-corner-large)] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)] p-3 text-[14px] text-[color:var(--md-sys-color-on-surface)] focus:border-[color:var(--md-sys-color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                  />
                  <div className="m3-action-row m3-action-row--end">
                    <M3Button
                      variant={
                        !user || commentDraft.trim().length === 0
                          ? "outlined"
                          : "filled"
                      }
                      size="md"
                      className="h-10 gap-2 px-4 text-[14px] font-medium"
                      onClick={handlePostVideoComment}
                      disabled={!user || commentDraft.trim().length === 0}
                    >
                      Post Comment
                      <MaterialSymbol icon={ArrowRight01Icon} size={16} />
                    </M3Button>
                  </div>
                </div>

                <Separator className="bg-[color:var(--md-sys-color-outline-variant)]" />

                {videoComments.length === 0 ? (
                  <p className="text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                    No comments yet. Start the discussion with a question or key
                    takeaway.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {videoComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-[var(--md-sys-shape-corner-large)] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)] p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-[14px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                            {comment.author}
                          </p>
                          <p className="text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                            {formatCommentTime(comment.createdAt)}
                          </p>
                        </div>
                        <p className="mt-1 text-[14px] leading-relaxed text-[color:var(--md-sys-color-on-surface-variant)]">
                          {comment.body}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Info Card for mobile/smaller screens */}
          <Card className="border-[color:var(--md-sys-color-outline-variant)] xl:hidden">
=======
          {/* Info Card for mobile/smaller screens */}
          <Card className="xl:hidden">
>>>>>>> origin/main
            <CardContent className="p-6 space-y-6">
              <MaterialInfo material={material} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info (Desktop) */}
        <div className="hidden xl:block space-y-6">
<<<<<<< HEAD
          <Card className="sticky top-8 border-[color:var(--md-sys-color-outline-variant)]">
=======
          <Card className="sticky top-8 border-border/40">
>>>>>>> origin/main
            <CardContent className="p-6 space-y-8">
              <MaterialInfo material={material} />
            </CardContent>
          </Card>
        </div>
      </div>
<<<<<<< HEAD
      <ShareMaterialModal
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        material={material}
        shareUrl={shareUrl}
      />
=======
>>>>>>> origin/main
    </div>
  );
}

function MaterialInfo({ material }: { material: Material }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Badge
          variant="secondary"
<<<<<<< HEAD
          className="border-none bg-[color:var(--md-sys-color-primary-container)] text-[13px] font-bold uppercase tracking-widest text-[color:var(--md-sys-color-on-primary-container)]"
        >
          {material.courseCode}
        </Badge>
        <h1 className="text-[24px] font-bold leading-tight text-[color:var(--md-sys-color-on-surface)]">
          {material.title}
        </h1>
      </div>

      <Separator className="bg-[color:var(--md-sys-color-outline-variant)]" />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
            <MaterialSymbol icon={UserIcon} size={20} />
          </div>
          <div>
            <p className="text-[13px] uppercase tracking-widest font-bold text-muted-foreground">
              Uploader
            </p>
            <p className="text-[14px] font-bold">{material.uploader}</p>
=======
          className="bg-primary/5 text-primary border-none font-bold uppercase tracking-widest text-xs"
        >
          {material.courseCode}
        </Badge>
        <h1 className="text-2xl font-bold leading-tight">{material.title}</h1>
      </div>

      <Separator className="bg-border/50" />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <HugeiconsIcon icon={UserIcon} size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
              Uploader
            </p>
            <p className="text-sm font-bold">{material.uploader}</p>
>>>>>>> origin/main
          </div>
        </div>

        <div className="flex items-center gap-3">
<<<<<<< HEAD
          <div className="flex size-10 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
            <MaterialSymbol icon={Calendar03Icon} size={20} />
          </div>
          <div>
            <p className="text-[13px] uppercase tracking-widest font-bold text-muted-foreground">
              Upload Date
            </p>
            <p className="text-[14px] font-bold">
=======
          <div className="size-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <HugeiconsIcon icon={Calendar03Icon} size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
              Upload Date
            </p>
            <p className="text-sm font-bold">
>>>>>>> origin/main
              {new Date(material.uploadDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
<<<<<<< HEAD
          <div className="flex size-10 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
            <MaterialSymbol icon={CourseIcon} size={20} />
          </div>
          <div>
            <p className="text-[13px] uppercase tracking-widest font-bold text-muted-foreground">
              Semester
            </p>
            <p className="text-[14px] font-bold">{material.semester}</p>
=======
          <div className="size-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <HugeiconsIcon icon={CourseIcon} size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
              Semester
            </p>
            <p className="text-sm font-bold">{material.semester}</p>
>>>>>>> origin/main
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <Separator className="bg-[color:var(--md-sys-color-outline-variant)]" />

      <div className="space-y-2">
        <p className="text-[13px] uppercase tracking-widest font-bold text-muted-foreground px-1">
          Description
        </p>
        <p className="text-[14px] leading-relaxed text-[color:var(--md-sys-color-on-surface-variant)]">
=======
      <Separator className="bg-border/50" />

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground px-1">
          Description
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
>>>>>>> origin/main
          This resource was curated to help students in {material.courseCode}{" "}
          better understand the core concepts. Make sure to review the
          accompanying notes and participate in the course Q&A if you have
          questions.
        </p>
      </div>
    </div>
  );
}
