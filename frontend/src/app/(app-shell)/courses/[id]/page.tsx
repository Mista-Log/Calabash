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
import { LecturerCourseView } from "@/components/features/courses/LecturerCourseView";
import { StudentCourseView } from "@/components/features/courses/StudentCourseView";
import { useUserStore } from "@/store/useUserStore";
import { courseRepository } from "@/services/course.repository";
import { cn } from "@/lib/utils";

type DetailViewState = "loading" | "ready" | "error" | "not-found";

const PAGE_SHELL_CLASS =
  "w-full px-2 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8";
const PAGE_CONTAINER_CLASS = "mx-auto w-full max-w-[1600px]";

function CourseDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-5 w-36 rounded-full bg-[color:var(--md-sys-color-surface-container-high)]" />
      <div className="h-12 w-2/3 rounded-2xl bg-[color:var(--md-sys-color-surface-container-low)]" />
      <div className="h-80 w-full rounded-[28px] bg-[color:var(--md-sys-color-surface-container-low)]" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-44 rounded-3xl bg-[color:var(--md-sys-color-surface-container-low)]"
          />
        ))}
      </div>
    </div>
  );
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, hasHydrated } = useUserStore();
  const [course, setCourse] = React.useState<CourseDetails | null>(null);
  const [state, setState] = React.useState<DetailViewState>("loading");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const courseId = React.useMemo(() => {
    const idParam = params?.id;
    return Array.isArray(idParam) ? idParam[0] : idParam;
  }, [params]);

  const loadCourse = React.useCallback(async () => {
    if (!user?.id || !courseId) {
      setState("error");
      setErrorMessage("Missing user or course context.");
      return;
    }

    setState("loading");
    setErrorMessage(null);

    const result = await courseRepository.getCourseDetails(
      courseId,
      user.role,
      user.id,
    );

    if (!result.ok) {
      if (result.code === "NOT_FOUND") {
        setCourse(null);
        setState("not-found");
        return;
      }

      setCourse(null);
      setErrorMessage(result.error);
      setState("error");
      return;
    }

    setCourse(result.data.course);
    setState("ready");
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

  if (!hasHydrated) {
    return (
      <div className={PAGE_SHELL_CLASS}>
        <div className={PAGE_CONTAINER_CLASS}>
          <CourseDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={PAGE_SHELL_CLASS}>
        <div className={cn(PAGE_CONTAINER_CLASS, "max-w-[920px]")}>
          <div className="flex min-h-[50vh] w-full items-center justify-center">
            <div className="w-full rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-8 text-center">
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

  if (state === "loading") {
    return (
      <div className={PAGE_SHELL_CLASS}>
        <div className={PAGE_CONTAINER_CLASS}>
          <CourseDetailSkeleton />
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className={PAGE_SHELL_CLASS}>
        <div className={cn(PAGE_CONTAINER_CLASS, "max-w-[920px]")}>
          <div className="flex min-h-[60vh] w-full items-center justify-center">
            <div className="w-full rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--md-sys-color-error-container)] text-[color:var(--md-sys-color-on-error-container)]">
                  <MaterialSymbol icon={AlertCircleIcon} size={18} />
                </div>
                <div className="min-w-0">
                  <h1 className="text-[22px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                    Unable to load course
                  </h1>
                  <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                    {errorMessage ?? "An unknown error occurred while loading this course."}
                  </p>
                </div>
              </div>
              <div className="m3-action-row mt-6">
                <M3Button
                  variant="outlined"
                  layout="mobile-full"
                  onClick={() => void loadCourse()}
                >
                  Retry
                </M3Button>
                <Link href="/courses">
                  <M3Button layout="mobile-full">
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

  if (state === "not-found" || !course) {
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

  return (
    <div className={PAGE_SHELL_CLASS}>
      <div className={cn(PAGE_CONTAINER_CLASS, "space-y-6 lg:space-y-8")}>
        <M3Button
          variant="text"
          onClick={handleBackToCourses}
          className="group h-auto gap-2 self-start p-0 text-[color:var(--md-sys-color-on-surface-variant)]"
        >
          <MaterialSymbol
            icon={ArrowLeft01Icon}
            size={18}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Courses
        </M3Button>

        {user.role === "lecturer" ? (
          <LecturerCourseView course={course} />
        ) : (
          <StudentCourseView course={course} />
        )}
      </div>
    </div>
  );
}
