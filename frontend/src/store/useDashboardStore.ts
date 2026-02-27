import { create } from "zustand";
import {
  DashboardRepositoryError,
  type DashboardErrorCode,
  dashboardRepository,
} from "@/services/dashboard.repository";
import type {
  DashboardStatus,
  LecturerDashboardView,
  StudentDashboardView,
} from "@/types/dashboard";
import type { DashboardData, Material } from "@/services/api";
import { useCourseStore } from "@/store/useCourseStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useMockDataStore } from "@/store/useMockDataStore";

interface DashboardStoreState {
  status: DashboardStatus;
  error: string | null;
  errorCode: DashboardErrorCode | null;
  lastUpdated: string | null;
  rawDashboard: DashboardData | null;
  studentView: StudentDashboardView | null;
  lecturerView: LecturerDashboardView | null;
  canPersistMilestoneClaims: boolean;
  fetchDashboard: (role: "student" | "lecturer", userId: string) => Promise<void>;
  refresh: (role: "student" | "lecturer", userId: string) => Promise<void>;
  syncRecentMaterials: (materials: Material[]) => void;
  claimAchievement: (
    userId: string,
    achievementId: string,
  ) => Promise<{ ok: boolean; persisted: boolean; message?: string }>;
  claimAllAchievements: (
    userId: string,
    achievementIds: string[],
  ) => Promise<{ ok: boolean; persisted: boolean; message?: string }>;
  clearError: () => void;
}

const DASHBOARD_DATA_MODE =
  process.env.NEXT_PUBLIC_DASHBOARD_DATA_MODE === "api-with-fallback" ||
  process.env.NEXT_PUBLIC_ENABLE_REAL_DASHBOARD_API === "true"
    ? "api-with-fallback"
    : "mock-only";

function sortMaterialsByDate(materials: Material[]): Material[] {
  return [...materials].sort((left, right) => {
    const leftTime = new Date(left.uploadDate).getTime();
    const rightTime = new Date(right.uploadDate).getTime();
    return (Number.isFinite(rightTime) ? rightTime : 0) - (Number.isFinite(leftTime) ? leftTime : 0);
  });
}

export const useDashboardStore = create<DashboardStoreState>((set, get) => ({
  status: "idle",
  error: null,
  errorCode: null,
  lastUpdated: null,
  rawDashboard: null,
  studentView: null,
  lecturerView: null,
  canPersistMilestoneClaims: DASHBOARD_DATA_MODE === "mock-only",

  fetchDashboard: async (role, userId) => {
    set({ status: "loading", error: null, errorCode: null });
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
        errorCode: null,
        lastUpdated: new Date().toISOString(),
        rawDashboard: remapped.raw,
        studentView: remapped.studentView,
        lecturerView: remapped.lecturerView,
      });
    } catch (error) {
      let errorCode: DashboardErrorCode | null = null;
      let errorMessage = "Failed to load dashboard";
      if (error instanceof DashboardRepositoryError) {
        errorCode = error.code;
      }
      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      set({
        status: "error",
        error: errorMessage,
        errorCode,
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
    const sortedMaterials = sortMaterialsByDate(materials);

    const nextData: DashboardData = {
      ...current,
      recentMaterials: sortedMaterials.slice(0, 20),
    };
    const remapped = dashboardRepository.mapApiToViewModel(
      nextData,
      sortedMaterials,
      notesSnapshot,
    );
    set({
      rawDashboard: remapped.raw,
      studentView: remapped.studentView,
      lecturerView: remapped.lecturerView,
      lastUpdated: new Date().toISOString(),
    });
  },

  claimAchievement: async (userId, achievementId) => {
    if (DASHBOARD_DATA_MODE !== "mock-only") {
      return {
        ok: false,
        persisted: false,
        message:
          "Achievement updates are not available from the live dashboard API yet.",
      };
    }

    const mockState = useMockDataStore.getState();
    const profile = mockState.gamificationProfiles[userId];
    if (!profile) {
      return { ok: false, persisted: false, message: "Student profile is unavailable." };
    }

    const target = profile.achievements.find((item) => item.id === achievementId);
    if (!target || target.unlocked) {
      return { ok: false, persisted: true, message: "Achievement is already recorded." };
    }

    const canClaim =
      typeof target.progress === "number" &&
      typeof target.target === "number" &&
      target.target > 0 &&
      target.progress >= target.target;
    if (!canClaim) {
      return { ok: false, persisted: true, message: "Achievement is not yet claimable." };
    }

    const updatedAchievements = profile.achievements.map((item) =>
      item.id === achievementId
        ? { ...item, unlocked: true, unlockedAt: new Date().toISOString() }
        : item,
    );
    mockState.updateGamification(userId, { achievements: updatedAchievements });
    mockState.addXP(userId, 15, "achievement-claim");
    return { ok: true, persisted: true };
  },

  claimAllAchievements: async (userId, achievementIds) => {
    if (achievementIds.length === 0) {
      return { ok: false, persisted: true, message: "No achievements selected." };
    }
    if (DASHBOARD_DATA_MODE !== "mock-only") {
      return {
        ok: false,
        persisted: false,
        message:
          "Achievement updates are not available from the live dashboard API yet.",
      };
    }

    const mockState = useMockDataStore.getState();
    const profile = mockState.gamificationProfiles[userId];
    if (!profile) {
      return { ok: false, persisted: false, message: "Student profile is unavailable." };
    }

    const claimableIds = new Set(
      profile.achievements
        .filter(
          (item) =>
            achievementIds.includes(item.id) &&
            !item.unlocked &&
            typeof item.progress === "number" &&
            typeof item.target === "number" &&
            item.target > 0 &&
            item.progress >= item.target,
        )
        .map((item) => item.id),
    );

    if (claimableIds.size === 0) {
      return { ok: false, persisted: true, message: "No eligible achievements to claim." };
    }

    const updatedAchievements = profile.achievements.map((item) =>
      claimableIds.has(item.id)
        ? { ...item, unlocked: true, unlockedAt: new Date().toISOString() }
        : item,
    );
    mockState.updateGamification(userId, { achievements: updatedAchievements });
    mockState.addXP(userId, claimableIds.size * 15, "achievement-claim-all");
    return { ok: true, persisted: true };
  },

  clearError: () => set({ error: null, errorCode: null }),
}));
