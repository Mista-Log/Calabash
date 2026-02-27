import type {
  Course,
  CourseDetails,
  Material,
  UserProfile,
} from "@/services/api";
import { useCourseStore } from "@/store/useCourseStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useMockDataStore } from "@/store/useMockDataStore";
import type {
  CourseDetailViewModel,
  CourseListViewModel,
  CourseMaterialGroup,
  CourseRepoResult,
  CourseSidebarActivity,
  CourseSidebarDeadline,
  CourseSidebarFeed,
} from "@/types/courses";

type AppRole = "student" | "lecturer";
type RepositoryContext =
  | {
      user: UserProfile;
      courses: Course[];
      courseProgress: Record<string, number>;
      materials: Material[];
      studentStats:
        | {
            gpa: string;
            attendance: string;
            upcomingDeadlines: {
              title: string;
              due: string;
              color: "orange" | "sage" | "green";
            }[];
          }
        | undefined;
    }
  | {
      error: Extract<CourseRepoResult<never>, { ok: false }>;
    };

function normalizeDate(value?: string): string {
  if (!value) return new Date().toISOString();
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? new Date().toISOString() : value;
}

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
  return sortByNewest(Array.from(materialMap.values()));
}

function dedupeCourses(primary: Course[], secondary: Course[]): Course[] {
  const map = new Map<string, Course>();
  for (const course of [...primary, ...secondary]) {
    map.set(course.id, map.has(course.id) ? { ...map.get(course.id), ...course } : course);
  }
  return Array.from(map.values());
}

function getRoleUser(users: UserProfile[], role: AppRole, userId: string): UserProfile | null {
  const explicit = users.find((user) => user.id === userId && user.role === role);
  if (explicit) return explicit;
  const byId = users.find((user) => user.id === userId);
  if (byId && byId.role === role) return byId;
  return users.find((user) => user.role === role) ?? null;
}

function getRoleCourses(role: AppRole, user: UserProfile, courses: Course[]): Course[] {
  if (role === "lecturer") {
    const taught = courses.filter(
      (course) =>
        course.lecturerName?.toLowerCase() === user.name.toLowerCase() ||
        course.lecturerName?.toLowerCase().includes(user.name.split(" ")[0].toLowerCase()),
    );
    return taught.length > 0 ? taught : courses;
  }

  const semester = user.semester ?? 1;
  const semesterCourses = courses.filter((course) => course.semester === semester);
  return semesterCourses.length > 0 ? semesterCourses : courses;
}

function filterMaterialsByCourse(course: Course, materials: Material[]): Material[] {
  return materials.filter(
    (material) =>
      material.courseId === course.id || material.courseCode === course.code,
  );
}

function mapStudentDeadlines(
  courses: Course[],
  upcomingDeadlines: {
    title: string;
    due: string;
    color: "orange" | "sage" | "green";
  }[],
): CourseSidebarDeadline[] {
  if (upcomingDeadlines.length === 0) {
    return [];
  }

  const fallbackCourseCode = courses[0]?.code ?? "COURSE";
  return upcomingDeadlines.map((deadline, index) => ({
    id: `deadline-${index}-${deadline.title}`,
    title: deadline.title,
    courseCode: fallbackCourseCode,
    due: deadline.due,
    color:
      deadline.color === "orange"
        ? "tertiary"
        : deadline.color === "sage"
          ? "secondary"
          : "primary",
  }));
}

function mapLecturerDeadlines(courses: Course[], materials: Material[]): CourseSidebarDeadline[] {
  return courses
    .map((course) => {
      const courseMaterials = filterMaterialsByCourse(course, materials);
      return {
        course,
        materialCount: courseMaterials.length,
      };
    })
    .sort((left, right) => left.materialCount - right.materialCount)
    .slice(0, 3)
    .map(({ course, materialCount }, index) => ({
      id: `lecturer-deadline-${course.id}`,
      title:
        materialCount === 0
          ? `Publish first material for ${course.code}`
          : `Refresh ${course.code} resources`,
      courseCode: course.code,
      due: index === 0 ? "Today" : "This week",
      color: materialCount === 0 ? "error" : "secondary",
    }));
}

function buildRecentActivity(
  role: AppRole,
  courses: Course[],
  materials: Material[],
  progress: Record<string, number>,
): CourseSidebarActivity[] {
  if (role === "lecturer") {
    return sortByNewest(materials)
      .slice(0, 5)
      .map((material) => ({
        id: `activity-upload-${material.id}`,
        text: `Uploaded ${material.title}`,
        time: new Date(material.uploadDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        kind: "upload" as const,
      }));
  }

  const progressEvents = courses
    .filter((course) => (progress[course.id] ?? 0) > 0)
    .slice(0, 3)
    .map((course) => ({
      id: `activity-progress-${course.id}`,
      text: `Progress updated in ${course.code}`,
      time: `${progress[course.id] ?? 0}% complete`,
      kind: "progress" as const,
    }));

  const materialEvents = sortByNewest(materials)
    .slice(0, 3)
    .map((material) => ({
      id: `activity-material-${material.id}`,
      text: `New material: ${material.title}`,
      time: new Date(material.uploadDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      kind: "announcement" as const,
    }));

  return [...progressEvents, ...materialEvents].slice(0, 6);
}

function buildModules(course: Course, materials: Material[]): CourseMaterialGroup["modules"] {
  const sorted = sortByNewest(materials);
  if (sorted.length === 0) {
    return [];
  }

  return [
    {
      id: `${course.id}-module-1`,
      title: "Module 1 - Core Materials",
      order: 1,
      materials: sorted.map((material) => ({
        ...material,
        courseId: course.id,
        courseCode: course.code,
        semester: course.semester,
        uploadDate: normalizeDate(material.uploadDate),
      })),
    },
  ];
}

function buildCourseDetails(
  course: Course,
  roleUser: UserProfile,
  materials: Material[],
): CourseDetails {
  const modules = buildModules(course, materials);
  const primaryLecturer =
    useMockDataStore
      .getState()
      .users.find((user) => user.role === "lecturer" && user.name === course.lecturerName) ??
    useMockDataStore.getState().users.find((user) => user.role === "lecturer") ??
    roleUser;

  const ratingBase = 4 + Math.min(materials.length, 20) / 40;
  const rating = Number(ratingBase.toFixed(1));

  return {
    ...course,
    description:
      course.description ??
      "Course content is curated from the current mock library resources.",
    studentCount: course.enrollment ?? 0,
    materialCount: materials.length,
    lecturer: {
      name: course.lecturerName ?? primaryLecturer.name,
      role: "Course Lecturer",
      avatar:
        primaryLecturer.avatarUrl ??
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(primaryLecturer.name)}`,
    },
    stats: {
      rating,
      totalRatings: 120 + materials.length * 6,
      duration: `${Math.max(1, materials.length)}h`,
    },
    youtubeUrl: materials.find((material) => material.type === "video")?.youtubeUrl,
    supplements: sortByNewest(materials).slice(0, 6),
    modules,
    recentActivity: sortByNewest(materials).slice(0, 6).map((material) => ({
      id: `activity-${material.id}`,
      type: "upload",
      description: `Added ${material.title}`,
      date: new Date(material.uploadDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    })),
  };
}

function getRepositoryContext(role: AppRole, userId: string): RepositoryContext {
  const mockState = useMockDataStore.getState();
  const courseState = useCourseStore.getState();
  const libraryState = useLibraryStore.getState();
  const user = getRoleUser(mockState.users, role, userId);

  if (!user) {
    return {
      error: {
        ok: false,
        code: "INVALID_CONTEXT",
        error: "Unable to resolve user context for course data.",
      },
    };
  }

  const canUseCourseStoreContext =
    courseState.loadedContext?.userId === userId &&
    courseState.loadedContext?.role === role;

  const baseCourses = getRoleCourses(role, user, mockState.courses);
  const courses = canUseCourseStoreContext
    ? dedupeCourses(courseState.courses, baseCourses)
    : baseCourses;

  const courseProgress = canUseCourseStoreContext
    ? {
        ...(mockState.courseProgress[userId] ?? {}),
        ...courseState.courseProgress,
      }
    : { ...(mockState.courseProgress[userId] ?? {}) };

  const mockMaterials = mockState.materials;
  const libraryMaterials = libraryState.materials;
  const mergedMaterials = mergeMaterials(libraryMaterials, mockMaterials);
  const materials =
    role === "student"
      ? mergedMaterials.filter((material) => material.visibility !== "private")
      : mergedMaterials;

  return {
    user,
    courses,
    courseProgress,
    materials,
    studentStats: mockState.studentStats[userId],
  };
}

export const courseRepository = {
  async getCourseProgress(userId: string): Promise<CourseRepoResult<Record<string, number>>> {
    if (!userId) {
      return {
        ok: false,
        code: "INVALID_CONTEXT",
        error: "Course progress request requires a valid user id.",
      };
    }

    const context = getRepositoryContext("student", userId);
    if ("error" in context) return context.error;

    return { ok: true, data: context.courseProgress };
  },

  async getCourseSidebarFeed(
    role: AppRole,
    userId: string,
  ): Promise<CourseRepoResult<CourseSidebarFeed>> {
    const context = getRepositoryContext(role, userId);
    if ("error" in context) return context.error;

    const deadlines =
      role === "student"
        ? mapStudentDeadlines(
            context.courses,
            context.studentStats?.upcomingDeadlines ?? [],
          )
        : mapLecturerDeadlines(context.courses, context.materials);

    const recentActivity = buildRecentActivity(
      role,
      context.courses,
      context.materials,
      context.courseProgress,
    );

    return {
      ok: true,
      data: {
        deadlines,
        recentActivity,
      },
    };
  },

  async getCoursesForUser(
    role: AppRole,
    userId: string,
  ): Promise<CourseRepoResult<CourseListViewModel>> {
    const context = getRepositoryContext(role, userId);
    if ("error" in context) return context.error;

    const sidebarResult = await courseRepository.getCourseSidebarFeed(role, userId);
    if (!sidebarResult.ok) {
      return sidebarResult;
    }

    const sortedCourses = [...context.courses].sort((left, right) =>
      left.code.localeCompare(right.code),
    );

    return {
      ok: true,
      data: {
        courses: sortedCourses,
        courseProgress: context.courseProgress,
        sidebar: sidebarResult.data,
      },
    };
  },

  async getCourseDetails(
    courseId: string,
    role: AppRole,
    userId: string,
  ): Promise<CourseRepoResult<CourseDetailViewModel>> {
    if (!courseId) {
      return {
        ok: false,
        code: "INVALID_CONTEXT",
        error: "Course id is required.",
      };
    }

    const context = getRepositoryContext(role, userId);
    if ("error" in context) return context.error;

    const course = context.courses.find((candidate) => candidate.id === courseId);
    if (!course) {
      return {
        ok: false,
        code: "NOT_FOUND",
        error: "Course not found in current role context.",
      };
    }

    const courseMaterials = filterMaterialsByCourse(course, context.materials);
    const details = buildCourseDetails(course, context.user, courseMaterials);
    const courseProgress = context.courseProgress[course.id] ?? 0;

    return {
      ok: true,
      data: {
        course: details,
        courseProgress,
      },
    };
  },
};
