import { create } from "zustand";
import { uploadRepository, type UploadDraft } from "@/services/upload.repository";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useUserStore } from "@/store/useUserStore";
import type { Material } from "@/services/api";

type UploadStatus = "idle" | "drafting" | "validating" | "publishing" | "success" | "error";

interface UploadStoreState {
  draft: UploadDraft;
  selectedFile: File | null;
  status: UploadStatus;
  error: string | null;
  progress: number;
  validationErrors: Partial<Record<keyof UploadDraft | "file", string>>;
  lastSuccess: Material | null;
  setDraftField: <K extends keyof UploadDraft>(key: K, value: UploadDraft[K]) => void;
  setFile: (file: File | null) => void;
  validate: () => boolean;
  publish: () => Promise<Material | null>;
  reset: () => void;
}

const initialDraft: UploadDraft = {
  title: "",
  courseCode: "",
  semester: 1,
  type: "pdf",
  description: "",
  visibility: "public",
  videoSource: "file",
  youtubeUrl: "",
};

export const useUploadStore = create<UploadStoreState>((set, get) => ({
  draft: initialDraft,
  selectedFile: null,
  status: "idle",
  error: null,
  progress: 0,
  validationErrors: {},
  lastSuccess: null,

  setDraftField: (key, value) =>
    set((state) => ({
      ...state,
      draft: {
        ...state.draft,
        [key]: value,
      },
      status: state.status === "idle" ? "drafting" : state.status,
      validationErrors: {
        ...state.validationErrors,
        [key]: undefined,
      },
    })),

  setFile: (file) =>
    set((state) => ({
      ...state,
      selectedFile: file,
      status: file ? "drafting" : state.status,
      validationErrors: {
        ...state.validationErrors,
        file: undefined,
      },
    })),

  validate: () => {
    const { draft, selectedFile } = get();
    set((state) => ({ ...state, status: "validating", error: null }));

    const validation = uploadRepository.validateUploadDraft(draft, selectedFile);
    if (!validation.valid) {
      set((state) => ({
        ...state,
        status: "error",
        validationErrors: validation.errors,
        error: "Please complete required upload fields.",
      }));
      return false;
    }

    set((state) => ({
      ...state,
      status: "drafting",
      validationErrors: {},
      error: null,
    }));
    return true;
  },

  publish: async () => {
    const state = get();
    if (!get().validate()) {
      return null;
    }
    const file = state.selectedFile;

    const user = useUserStore.getState().user;
    const uploaderName = user?.name || "Current User";
    const uploaderRole = user?.role ?? "lecturer";
    const uploaderId = user?.id ?? "u-lecturer-01";

    set((prev) => ({
      ...prev,
      status: "publishing",
      error: null,
      progress: 8,
      validationErrors: {},
    }));

    let interval: NodeJS.Timeout | null = null;
    try {
      interval = setInterval(() => {
        const current = get().progress;
        const next = Math.min(94, current + 11);
        set((prev) => ({ ...prev, progress: next }));
      }, 180);

      const mapped = await uploadRepository.publishUpload(state.draft, file, {
        uploaderName,
      });

      const created = await useLibraryStore.getState().createMaterial(mapped);
      const materials = useLibraryStore.getState().materials;
      useDashboardStore.getState().syncRecentMaterials(materials);

      set((prev) => ({
        ...prev,
        status: "success",
        progress: 100,
        error: null,
        lastSuccess: created,
        draft: {
          ...initialDraft,
          semester: uploaderRole === "lecturer" ? prev.draft.semester : 1,
        },
        selectedFile: null,
      }));

      try {
        await useDashboardStore.getState().refresh(uploaderRole, uploaderId);
      } catch {
        // Dashboard refresh failure should not block a completed upload.
      }
      return created;
    } catch (error) {
      set((prev) => ({
        ...prev,
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Upload failed. Please retry.",
      }));
      return null;
    } finally {
      if (interval) {
        clearInterval(interval);
      }
    }
  },

  reset: () =>
    set((state) => ({
      ...state,
      draft: initialDraft,
      selectedFile: null,
      status: "idle",
      error: null,
      progress: 0,
      validationErrors: {},
      lastSuccess: null,
    })),
}));
