import { create } from "zustand";
import { dashboardRepository } from "@/services/dashboard.repository";
import type {
  DashboardStatus,
  LecturerDashboardView,
  StudentDashboardView,
} from "@/types/dashboard";
import type { DashboardData, Material } from "@/services/api";
import { useCourseStore } from "@/store/useCourseStore";
import { useLibraryStore } from "@/store/useLibraryStore";

interface DashboardStoreState {
  status: DashboardStatus;
  error: string | null;
  lastUpdated: string | null;
  rawDashboard: DashboardData | null;
  studentView: StudentDashboardView | null;
  lecturerView: LecturerDashboardView | null;
  fetchDashboard: (role: "student" | "lecturer", userId: string) => Promise<void>;
  refresh: (role: "student" | "lecturer", userId: string) => Promise<void>;
  syncRecentMaterials: (materials: Material[]) => void;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardStoreState>((set, get) => ({
  status: "idle",
  error: null,
  lastUpdated: null,
  rawDashboard: null,
  studentView: null,
  lecturerView: null,

  fetchDashboard: async (role, userId) => {
    set({ status: "loading", error: null });
    try {
      const viewModel = await dashboardRepository.getDashboard(role, userId);
      
      // Safely access course store
      const courseState = useCourseStore.getState();
      const progressMap =
        role === "student" ? viewModel.studentView?.courseProgress ?? {} : {};
      courseState.hydrateForContext({ userId, role }, viewModel.raw.courses, progressMap);
      
      // Safely access library store
      const libraryState = useLibraryStore.getState();
      libraryState.mergeMaterials(viewModel.raw.recentMaterials);

      const mergedMaterials = libraryState.materials;
      const remapped = dashboardRepository.mapApiToViewModel(
        viewModel.raw,
        mergedMaterials,
        viewModel.studentView?.notesSnapshot,
      );

      set({
        status: "success",
        error: null,
        lastUpdated: new Date().toISOString(),
        rawDashboard: remapped.raw,
        studentView: remapped.studentView,
        lecturerView: remapped.lecturerView,
      });
    } catch (error) {
      set({
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Failed to load dashboard",
        lastUpdated: null,
      });
    }
  },

  refresh: async (role, userId) => {
    await get().fetchDashboard(role, userId);
  },

  syncRecentMaterials: (materials) => {
    const current = get().rawDashboard;
    if (!current) return;
    const notesSnapshot = get().studentView?.notesSnapshot;

    const nextData: DashboardData = {
      ...current,
      recentMaterials: [...materials].slice(0, 20),
    };
    const remapped = dashboardRepository.mapApiToViewModel(
      nextData,
      materials,
      notesSnapshot,
    );
    set({
      rawDashboard: remapped.raw,
      studentView: remapped.studentView,
      lecturerView: remapped.lecturerView,
      lastUpdated: new Date().toISOString(),
    });
  },

  clearError: () => set({ error: null }),
}));
