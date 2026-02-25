"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft01Icon,
  AlertCircleIcon,
  InformationCircleIcon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { M3Button } from "@/components/core";
import type { CourseDetails } from "@/services/api";
import type { CourseDetailViewModel, CourseRepoErrorCode } from "@/types/courses";
import type { ApiErrorResponse } from "@/types/api-responses";
import { LecturerCourseView } from "@/components/features/courses/LecturerCourseView";
import { StudentCourseView } from "@/components/features/courses/StudentCourseView";
import { useUserStore } from "@/store/useUserStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { courseRepository } from "@/services/course.repository";
import { cn } from "@/lib/utils";
import {
  CourseDetailPageSkeleton,
  CompactCourseDetailSkeleton,
} from "@/components/features/courses/CourseDetailSkeletons";

type DetailViewState = "loading" | "ready" | "error" | "not-found";

interface CourseDetailError {
  code: CourseRepoErrorCode;
  message: string;
  details?: string;
}

const PAGE_SHELL_CLASS =
  "w-full px-2 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8";
const PAGE_CONTAINER_CLASS = "mx-auto w-full max-w-[1600px]";

const ERROR_MESSAGES: Record<CourseRepoErrorCode, string> = {
  UNAVAILABLE: "The course service is temporarily unavailable. Please try again.",
  NOT_FOUND: "This course could not be found. It may have been removed or is not available in your current role context.",
  INVALID_CONTEXT: "Unable to load course due to invalid user context. Please sign in again.",
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, hasHydrated } = useUserStore();
  const [viewModel, setViewModel] = React.useState<CourseDetailViewModel | null>(null);
  const [state, setState] = React.useState<DetailViewState>("loading");
  const [error, setError] = React.useState<CourseDetailError | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const courseId = React.useMemo(() => {
    const idParam = params?.id;
    return Array.isArray(idParam) ? idParam[0] : idParam;
  }, [params]);

  const loadCourse = React.useCallback(async (isRefresh = false) => {
    if (!user?.id || !courseId) {
      setError({
        code: "INVALID_CONTEXT",
        message: ERROR_MESSAGES.INVALID_CONTEXT,
      });
      setState("error");
      return;
    }

    if (!isRefresh) {
      setState("loading");
      setError(null);
    } else {
      setIsRefreshing(true);
    }

    const result = await courseRepository.getCourseDetails(
      courseId,
      user.role,
      user.id,
    );

    if (!result.ok) {
      if (result.code === "NOT_FOUND") {
        setViewModel(null);
        setState("not-found");
      } else {
        setViewModel(null);
        setError({
          code: result.code,
          message: result.error || ERROR_MESSAGES[result.code],
        });
        setState("error");
      }
      setIsRefreshing(false);
      return;
    }

    setViewModel(result.data);
    setState("ready");
    setIsRefreshing(false);

    // Send course view notification (real-time tracking)
    useNotificationStore.getState().initialize(user.id);
  }, [courseId, user]);

  React.useEffect(() => {
    if (!hasHydrated || !user || !courseId) return;
    void loadCourse();
  }, [courseId, hasHydrated, loadCourse, user]);

  const handleBackToCourses = React.useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/courses");
  }, [router]);

  const handleRetry = React.useCallback(() => {
    void loadCourse(true);
  }, [loadCourse]);

  // Loading state - show full skeleton
  if (!hasHydrated || state === "loading") {
    return (
      <div className={PAGE_SHELL_CLASS}>
        <div className={PAGE_CONTAINER_CLASS}>
          <CourseDetailPageSkeleton />
        </div>
      </div>
    );
  }

  // Unauthenticated state
  if (!user) {
    return (
      <div className={PAGE_SHELL_CLASS}>
        <div className={cn(PAGE_CONTAINER_CLASS, "max-w-[920px]")}>
          <div className="flex min-h-[50vh] w-full items-center justify-center">
            <div className="w-full rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary-container)]">
                <MaterialSymbol
                  icon="lock"
                  size={28}
                  className="text-[color:var(--md-sys-color-on-primary-container)]"
                />
              </div>
              <h1 className="text-[24px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                Sign in to open this course
              </h1>
              <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                Course details are available only in authenticated mode.
              </p>
              <Link href="/auth/login" className="mt-5 inline-block">
                <M3Button layout="mobile-full">
                  Go to Login
                </M3Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state === "error" && error) {
    return (
      <div className={PAGE_SHELL_CLASS}>
        <div className={cn(PAGE_CONTAINER_CLASS, "max-w-[920px]")}>
          <div className="flex min-h-[60vh] w-full items-center justify-center">
            <div className="w-full rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--md-sys-color-error-container)] text-[color:var(--md-sys-color-on-error-container)]">
                  <MaterialSymbol icon={AlertCircleIcon} size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-[22px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                    Unable to load course
                  </h1>
                  <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                    {error.message}
                  </p>
                  {error.details && (
                    <p className="mt-2 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                      Error code: {error.code}
                    </p>
                  )}
                </div>
              </div>
              <div className="m3-action-row mt-6">
                <M3Button
                  variant="filled"
                  layout="mobile-full"
                  onClick={handleRetry}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Retrying...
                    </span>
                  ) : (
                    "Retry"
                  )}
                </M3Button>
                <Link href="/courses">
                  <M3Button variant="outlined" layout="mobile-full">
                    Back to Courses
                  </M3Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (state === "not-found" || !viewModel) {
    return (
      <div className={PAGE_SHELL_CLASS}>
        <div className={cn(PAGE_CONTAINER_CLASS, "max-w-[920px]")}>
          <div className="flex min-h-[60vh] w-full items-center justify-center">
            <div className="w-full rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
                <MaterialSymbol icon={InformationCircleIcon} size={22} />
              </div>
              <h1 className="text-[24px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                Course not found
              </h1>
              <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                This course is not available in your current role context.
              </p>
              <Link href="/courses" className="mt-5 inline-block">
                <M3Button layout="mobile-full">
                  Back to Courses
                </M3Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render course view
  const course = viewModel.course;
  const progress = viewModel.courseProgress;

  return (
    <div className={PAGE_SHELL_CLASS}>
      <div className={cn(PAGE_CONTAINER_CLASS, "space-y-6 lg:space-y-8")}>
        {/* Back Button */}
        <M3Button
          variant="text"
          onClick={handleBackToCourses}
          className="group h-auto gap-2 self-start p-0 text-[color:var(--md-sys-color-on-surface-variant)]"
          disabled={isRefreshing}
        >
          <MaterialSymbol
            icon={ArrowLeft01Icon}
            size={18}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Courses
        </M3Button>

        {/* Refreshing indicator */}
        {isRefreshing && (
          <div className="flex items-center gap-2 text-[color:var(--md-sys-color-primary)]">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="m3-body-small">Refreshing course data...</span>
          </div>
        )}

        {/* Role-based course view */}
        {user.role === "lecturer" ? (
          <LecturerCourseView course={course} />
        ) : (
          <StudentCourseView course={course} progress={progress} />
        )}
      </div>
    </div>
  );
}
