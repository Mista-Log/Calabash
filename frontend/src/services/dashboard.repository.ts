import type { Course, DashboardData, Material } from "@/services/api";
import { CalabashApiService } from "@/services/api";
import type {
  CourseContentHealth,
  DashboardViewModel,
} from "@/types/dashboard";
import { useMockDataStore } from "@/store/useMockDataStore";
import { notesRepository } from "@/services/notes.repository";
import type { NoteEntity, NotesDashboardSnapshot } from "@/types/notes";
import { useNotesStore } from "@/store/useNotesStore";

type DashboardDataMode = "mock-only" | "api-with-fallback";

const DASHBOARD_DATA_MODE: DashboardDataMode =
  process.env.NEXT_PUBLIC_DASHBOARD_DATA_MODE === "api-with-fallback" ||
  process.env.NEXT_PUBLIC_ENABLE_REAL_DASHBOARD_API === "true"
    ? "api-with-fallback"
    : "mock-only";

function dateToTime(value?: string): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sortByNewest(materials: Material[]): Material[] {
  return [...materials].sort(
    (left, right) => dateToTime(right.uploadDate) - dateToTime(left.uploadDate),
  );
}

function mergeMaterials(preferred: Material[], fallback: Material[]): Material[] {
  const materialMap = new Map<string, Material>();
  for (const material of fallback) {
    materialMap.set(material.id, material);
  }
  for (const material of preferred) {
    materialMap.set(material.id, material);
  }
  return Array.from(materialMap.values());
}

function selectFocusCourse(
  courses: Course[],
  progress: Record<string, number>,
): Course | null {
  const unfinished = courses
    .map((course) => ({
      course,
      progress: progress[course.id] ?? 0,
    }))
    .filter(({ progress: pct }) => pct < 100)
    .sort((left, right) => right.progress - left.progress);

  if (unfinished.length > 0) {
    return unfinished[0].course;
  }

  return courses[0] ?? null;
}

function computeAverageProgress(
  courses: Course[],
  progress: Record<string, number>,
): number {
  if (courses.length === 0) return 0;
  const total = courses.reduce((sum, course) => sum + (progress[course.id] ?? 0), 0);
  return Math.round(total / courses.length);
}

function computeContentHealth(
  courses: Course[],
  materials: Material[],
): CourseContentHealth[] {
  const now = Date.now();
  const TWENTY_ONE_DAYS = 21 * 24 * 60 * 60 * 1000;

  return courses.map((course) => {
    const courseMaterials = materials.filter(
      (material) =>
        material.courseId === course.id || material.courseCode === course.code,
    );
    const sorted = sortByNewest(courseMaterials);
    const latest = sorted[0]?.uploadDate ?? null;
    const latestTime = dateToTime(latest ?? undefined);
    const stale = latestTime === 0 || now - latestTime > TWENTY_ONE_DAYS;

    return {
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,
      materialCount: courseMaterials.length,
      lastUploadDate: latest,
      needsAttention: courseMaterials.length === 0 || stale,
    };
  });
}

function filterMaterialsForCourses(
  courses: Course[],
  materials: Material[],
): Material[] {
  if (materials.length === 0 || courses.length === 0) {
    return [];
  }

  const courseIds = new Set(courses.map((course) => course.id));
  const courseCodes = new Set(courses.map((course) => course.code));

  return materials.filter(
    (material) =>
      (material.courseId && courseIds.has(material.courseId)) ||
      courseCodes.has(material.courseCode),
  );
}

function normalizeDashboardData(
  data: DashboardData,
  role: "student" | "lecturer",
  userId: string,
): DashboardData {
  if (role === "student" && !data.courseProgress) {
    const progress = useMockDataStore.getState().courseProgress[userId] ?? {};
    return {
      ...data,
      courseProgress: progress,
    };
  }

  return data;
}

function isValidDashboardData(value: unknown): value is DashboardData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Partial<DashboardData>;
  
  // Validate user
  if (!data.user || typeof data.user !== "object") {
    return false;
  }
  const user = data.user as unknown as Record<string, unknown>;
  if (typeof user.id !== "string" || !user.id) {
    return false;
  }
  if (user.role !== "student" && user.role !== "lecturer") {
    return false;
  }
  if (typeof user.email !== "string" || !user.email) {
    return false;
  }
  if (typeof user.name !== "string" || !user.name) {
    return false;
  }

  // Validate courses array
  if (!Array.isArray(data.courses)) {
    return false;
  }
  for (const course of data.courses) {
    if (!course || typeof course !== "object") {
      return false;
    }
    const c = course as unknown as Record<string, unknown>;
    if (typeof c.id !== "string" || !c.id) {
      return false;
    }
    if (typeof c.code !== "string" || !c.code) {
      return false;
    }
    if (typeof c.title !== "string" || !c.title) {
      return false;
    }
    if (typeof c.semester !== "number") {
      return false;
    }
  }

  // Validate recentMaterials array
  if (!Array.isArray(data.recentMaterials)) {
    return false;
  }
  for (const material of data.recentMaterials) {
    if (!material || typeof material !== "object") {
      return false;
    }
    const m = material as unknown as Record<string, unknown>;
    if (typeof m.id !== "string" || !m.id) {
      return false;
    }
    if (typeof m.title !== "string" || !m.title) {
      return false;
    }
    if (typeof m.courseCode !== "string" || !m.courseCode) {
      return false;
    }
    if (!["pdf", "past-question", "video", "zip", "image"].includes(String(m.type))) {
      return false;
    }
  }

  return true;
}

const emptyNotesSnapshot: NotesDashboardSnapshot = {
  recentNotes: [],
  pinnedCount: 0,
  draftCount: 0,
  continueNoteId: null,
};

function buildNotesSnapshot(notes: NoteEntity[]): NotesDashboardSnapshot {
  const sorted = [...notes].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
  const recentNotes = sorted.slice(0, 3);
  const pinnedCount = notes.filter((note) => note.pinned).length;
  const draftNotes = notes.filter((note) => note.status === "draft");
  const continueNoteId = draftNotes[0]?.id ?? recentNotes[0]?.id ?? null;

  return {
    recentNotes,
    pinnedCount,
    draftCount: draftNotes.length,
    continueNoteId,
  };
}

async function getStudentNotesSnapshot(
  userId: string,
): Promise<NotesDashboardSnapshot> {
  const notesState = useNotesStore.getState();
  const storeMatchesUser = notesState.loadedContext?.userId === userId;
  if (storeMatchesUser) {
    const roleNotes = notesState.notes.filter((note) => note.userId === userId);
    if (roleNotes.length > 0) {
      return buildNotesSnapshot(roleNotes);
    }
  }

  const repositoryResult = await notesRepository.getDashboardNotesSnapshot(userId);
  return repositoryResult.ok ? repositoryResult.data : emptyNotesSnapshot;
}

export function mapApiToViewModel(
  data: DashboardData,
  materialsSource?: Material[],
  notesSnapshot: NotesDashboardSnapshot = emptyNotesSnapshot,
): DashboardViewModel {
  const sourceMaterials = mergeMaterials(
    materialsSource ?? [],
    data.recentMaterials ?? [],
  );
  const visibleMaterials =
    data.user.role === "student"
      ? sourceMaterials.filter((material) => material.visibility !== "private")
      : sourceMaterials;
  const filteredByCourses = filterMaterialsForCourses(data.courses, visibleMaterials);
  const materials = sortByNewest(
    filteredByCourses.length > 0 ? filteredByCourses : visibleMaterials,
  );
  const courseProgress = data.courseProgress ?? {};
  const focusCourse = selectFocusCourse(data.courses, courseProgress);
  const focusCourseProgress = focusCourse ? courseProgress[focusCourse.id] ?? 0 : 0;
  const averageProgress = computeAverageProgress(data.courses, courseProgress);

  const studentView =
    data.user.role === "student"
      ? {
          role: "student" as const,
          data,
          courseProgress,
          focusCourse,
          continueCourseId: focusCourse?.id ?? null,
          focusCourseProgress,
          averageProgress,
          deadlines: data.studentStats?.upcomingDeadlines ?? [],
          recentMaterials: materials.slice(0, 8),
          gamification: data.gamification ?? null,
          notesSnapshot,
        }
      : null;

  const lecturerView =
    data.user.role === "lecturer"
      ? {
          role: "lecturer" as const,
          data,
          recentUploads: materials.slice(0, 12),
          contentHealth: computeContentHealth(data.courses, materials),
        }
      : null;

  return {
    raw: data,
    studentView,
    lecturerView,
  };
}

export const dashboardRepository = {
  async getDashboard(
    role: "student" | "lecturer",
    userId: string,
  ): Promise<DashboardViewModel> {
    if (DASHBOARD_DATA_MODE === "mock-only") {
      const mockData = useMockDataStore.getState().getDashboardData(userId, role);
      const notesSnapshot =
        role === "student" ? await getStudentNotesSnapshot(userId) : emptyNotesSnapshot;
      return mapApiToViewModel(
        normalizeDashboardData(mockData, role, userId),
        undefined,
        notesSnapshot,
      );
    }

    try {
      const response = await CalabashApiService.getDashboardData();
      if (!isValidDashboardData(response)) {
        const fallback = useMockDataStore.getState().getDashboardData(userId, role);
        const notesSnapshot =
          role === "student" ? await getStudentNotesSnapshot(userId) : emptyNotesSnapshot;
        return mapApiToViewModel(
          normalizeDashboardData(fallback, role, userId),
          undefined,
          notesSnapshot,
        );
      }

      const data =
        response.user.role === role
          ? response
          : useMockDataStore.getState().getDashboardData(userId, role);
      const notesSnapshot =
        role === "student" ? await getStudentNotesSnapshot(userId) : emptyNotesSnapshot;
      return mapApiToViewModel(
        normalizeDashboardData(data, role, userId),
        undefined,
        notesSnapshot,
      );
    } catch {
      const fallback = useMockDataStore.getState().getDashboardData(userId, role);
      const notesSnapshot =
        role === "student" ? await getStudentNotesSnapshot(userId) : emptyNotesSnapshot;
      return mapApiToViewModel(
        normalizeDashboardData(fallback, role, userId),
        undefined,
        notesSnapshot,
      );
    }
  },

  async getLecturerContentOps(
    role: "student" | "lecturer",
    userId: string,
  ): Promise<DashboardViewModel> {
    return this.getDashboard(role, userId);
  },

  mapApiToViewModel,
};
