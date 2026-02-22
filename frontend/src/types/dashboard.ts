import type {
  Course,
  DashboardData,
  Material,
  StudentGamificationProfile,
  StudentStats,
} from "@/services/api";
import type { NotesDashboardSnapshot } from "@/types/notes";

export type DashboardStatus = "idle" | "loading" | "success" | "error";

export interface CourseContentHealth {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  materialCount: number;
  lastUploadDate: string | null;
  needsAttention: boolean;
}

export interface StudentDashboardView {
  role: "student";
  data: DashboardData;
  courseProgress: Record<string, number>;
  focusCourse: Course | null;
  continueCourseId: string | null;
  focusCourseProgress: number;
  averageProgress: number;
  deadlines: StudentStats["upcomingDeadlines"];
  recentMaterials: Material[];
  gamification: StudentGamificationProfile | null;
  notesSnapshot: NotesDashboardSnapshot;
}

export interface StudentActivityCardVM {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  typeLabel: string;
  href: string;
  ctaLabel: string;
}

export interface StudentPathCardVM {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  progress: number;
  href: string;
  ctaLabel: string;
}

export interface StudentProgressSummaryVM {
  coursesInProgress: number;
  coursesCompleted: number;
  materialsReviewed: number;
  activeStreak: number;
  longestStreak: number;
}

export interface LecturerDashboardView {
  role: "lecturer";
  data: DashboardData;
  recentUploads: Material[];
  contentHealth: CourseContentHealth[];
}

export interface DashboardViewModel {
  raw: DashboardData;
  studentView: StudentDashboardView | null;
  lecturerView: LecturerDashboardView | null;
}
