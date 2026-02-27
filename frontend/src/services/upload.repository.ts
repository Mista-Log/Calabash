import type { Material } from "@/services/api";
import { useMockDataStore } from "@/store/useMockDataStore";

export interface UploadDraft {
  title: string;
  courseCode: string;
  semester: number;
  type: Material["type"];
  description: string;
  visibility: "public" | "private";
  videoSource: "file" | "youtube";
  youtubeUrl: string;
}

export interface UploadDraftValidation {
  valid: boolean;
  errors: Partial<Record<keyof UploadDraft | "file", string>>;
}

interface PublishContext {
  uploaderName: string;
  courseId?: string;
}

function inferCourseId(courseCode: string): string | undefined {
  const normalized = courseCode.trim().toLowerCase();
  if (!normalized) return undefined;
  return useMockDataStore
    .getState()
    .courses.find((course) => course.code.toLowerCase() === normalized)?.id;
}

function inferMaterialType(file?: { name?: string } | null): Material["type"] {
  if (!file?.name) return "pdf";
  const name = file.name.toLowerCase();
  if (name.endsWith(".mp4") || name.endsWith(".mov")) return "video";
  if (name.endsWith(".zip")) return "zip";
  if (name.includes("past") || name.includes("question")) return "past-question";
  if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg")) {
    return "image";
  }
  return "pdf";
}

function getYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function isValidYouTubeUrl(url: string): boolean {
  return Boolean(getYouTubeVideoId(url));
}

function formatFileSize(file: File): string {
  const mb = file.size / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

export const uploadRepository = {
  validateUploadDraft(
    draft: UploadDraft,
    file?: File | null,
  ): UploadDraftValidation {
    const errors: UploadDraftValidation["errors"] = {};
    const youtubeUrl = (draft.youtubeUrl ?? "").trim();
    const isYouTubeVideo = draft.type === "video" && draft.videoSource === "youtube";

    if (isYouTubeVideo) {
      if (!youtubeUrl) {
        errors.youtubeUrl = "Paste a YouTube URL to publish this video.";
      } else if (!isValidYouTubeUrl(youtubeUrl)) {
        errors.youtubeUrl = "Enter a valid YouTube link (watch, share, or embed URL).";
      }
    } else if (!file) {
      errors.file = "Select a file before publishing.";
    }
    if (!draft.title.trim()) {
      errors.title = "Resource title is required.";
    }
    if (!draft.courseCode.trim()) {
      errors.courseCode = "Course code is required.";
    }
    if (!Number.isFinite(draft.semester) || draft.semester < 1) {
      errors.semester = "Semester must be a valid number.";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },

  mapUploadToMaterial(
    draft: UploadDraft,
    fileMeta: { name: string; size: number; type: string } | null,
    context: PublishContext,
  ): Material {
    const fallbackType = inferMaterialType(fileMeta ? { name: fileMeta.name } : null);
    const normalizedYouTube = (draft.youtubeUrl ?? "").trim();
    const isYouTubeVideo =
      draft.type === "video" &&
      draft.videoSource === "youtube" &&
      normalizedYouTube.length > 0 &&
      isValidYouTubeUrl(normalizedYouTube);

    return {
      id: "",
      title: draft.title.trim(),
      courseCode: draft.courseCode.trim().toUpperCase(),
      courseId: context.courseId || inferCourseId(draft.courseCode),
      type: draft.type || fallbackType,
      semester: draft.semester,
      uploadDate: new Date().toISOString(),
      url: isYouTubeVideo ? normalizedYouTube : "#",
      uploader: context.uploaderName,
      size: fileMeta ? `${(fileMeta.size / (1024 * 1024)).toFixed(2)} MB` : "Streaming",
      visibility: draft.visibility,
      youtubeUrl: isYouTubeVideo ? normalizedYouTube : undefined,
    };
  },

  async publishUpload(
    draft: UploadDraft,
    file: File | null,
    context: PublishContext,
  ): Promise<Material> {
    const mapped = this.mapUploadToMaterial(
      draft,
      file
        ? { name: file.name, size: file.size, type: file.type }
        : null,
      {
        ...context,
        courseId: context.courseId || inferCourseId(draft.courseCode),
      },
    );

    if (file && mapped.type !== "video") {
      mapped.url = URL.createObjectURL(file);
    }

    if (file && mapped.type === "video" && !mapped.youtubeUrl) {
      mapped.url = URL.createObjectURL(file);
    }

    if (file && !mapped.size) {
      mapped.size = formatFileSize(file);
    }

    await Promise.resolve();
    return mapped;
  },
};
