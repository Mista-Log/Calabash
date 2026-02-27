import type { Course, CourseDetails, Material } from "@/services/api";

export type CourseRepoErrorCode =
  | "UNAVAILABLE"
  | "NOT_FOUND"
  | "INVALID_CONTEXT";

export type CourseRepoResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: CourseRepoErrorCode; error: string };

export type CourseSidebarDeadlineColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "error";

export interface CourseSidebarDeadline {
  id: string;
  title: string;
  courseCode: string;
  due: string;
  color: CourseSidebarDeadlineColor;
}

export type CourseSidebarActivityKind =
  | "upload"
  | "progress"
  | "visibility"
  | "announcement";

export interface CourseSidebarActivity {
  id: string;
  text: string;
  time: string;
  kind: CourseSidebarActivityKind;
}

export interface CourseSidebarFeed {
  deadlines: CourseSidebarDeadline[];
  recentActivity: CourseSidebarActivity[];
}

export interface CourseListViewModel {
  courses: Course[];
  courseProgress: Record<string, number>;
  sidebar: CourseSidebarFeed;
}

export interface CourseDetailViewModel {
  course: CourseDetails;
  courseProgress: number;
}

export interface CourseMaterialGroup {
  modules: CourseDetails["modules"];
  materials: Material[];
}
