"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useUserStore } from "@/store/useUserStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { M3Button } from "@/components/core";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { LastUpdated } from "@/components/core/last-updated";
import { AlertCircleIcon } from "@/lib/icons/material-icons";
import { DASHBOARD_ERROR_CODES } from "@/services/dashboard.repository";
import {
  DashboardHeaderSkeleton,
  LecturerDashboardSkeleton,
  StudentDashboardSkeleton,
} from "@/components/features/dashboard/DashboardSkeletons";
import { PersistentLayout } from "@/components/layout/PersistentLayout";
import {
  APP_PAGE_CONTAINER,
  APP_PAGE_SHELL,
  APP_SECTION_STACK,
  APP_SURFACE_CARD,
} from "@/lib/ui-sync";
import { cn } from "@/lib/utils";

const StudentDashboard = dynamic(
  () =>
    import("@/components/features/dashboard/StudentDashboard").then(
      (mod) => mod.StudentDashboard,
    ),
  {
    loading: () => <RoleDashboardSkeleton />,
    ssr: false,
  },
);

const LecturerDashboard = dynamic(
  () =>
    import("@/components/features/dashboard/LecturerDashboard").then(
      (mod) => mod.LecturerDashboard,
    ),
  {
    loading: () => <RoleDashboardSkeleton />,
    ssr: false,
  },
);

const COPY = {
  unauthTitle: "Sign in to access your academic dashboard",
  unauthDescription:
    "Your academic profile is required before dashboard records can be displayed.",
  lecturerHeading: "Faculty Academic Dashboard",
  studentHeading: (name: string) => `Academic Overview for ${name}`,
  lecturerSubheading: (department?: string) =>
    `Review course delivery, academic content operations, and instructional performance${department ? ` in ${department}` : ""}.`,
  studentSubheading: (semester?: number | null) =>
    `Review coursework progress, assessment readiness, and milestone records for semester ${semester ?? 1}.`,
  loadErrorTitle: "Unable to load dashboard records",
  loadErrorFallback:
    "Dashboard data could not be loaded. Please try again.",
  schemaInvalidError:
    "Dashboard data format is invalid. Please contact support if this continues.",
  roleMismatchError:
    "This account does not match the selected dashboard role. Sign in again with the correct profile.",
  networkError:
    "Dashboard service is unavailable right now. Check your connection and try again.",
  retry: "Reload Dashboard",
};

function RoleDashboardSkeleton() {
  const { user } = useUserStore();
  return user?.role === "lecturer" ? (
    <LecturerDashboardSkeleton />
  ) : (
    <StudentDashboardSkeleton />
  );
}

function DashboardLoadingState({ role }: { role?: "student" | "lecturer" | null }) {
  return (
    <div className={APP_PAGE_SHELL}>
      <div className={cn(APP_PAGE_CONTAINER, APP_SECTION_STACK)}>
        <DashboardHeaderSkeleton />
        {role === "lecturer" ? (
          <LecturerDashboardSkeleton />
        ) : (
          <StudentDashboardSkeleton />
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, hasHydrated } = useUserStore();
  const { materials } = useLibraryStore();
  const {
    status,
    error,
    errorCode,
    lastUpdated,
    studentView,
    lecturerView,
    fetchDashboard,
    refresh,
    syncRecentMaterials,
  } = useDashboardStore();

  const isLoading = status === "loading" || status === "idle";

  React.useEffect(() => {
    if (!user?.id) return;
    void fetchDashboard(user.role, user.id);
  }, [user?.id, user?.role, fetchDashboard]);

  React.useEffect(() => {
    if (status !== "success") return;
    syncRecentMaterials(materials);
  }, [materials, status, syncRecentMaterials]);

  const resolvedLoadErrorMessage =
    errorCode === DASHBOARD_ERROR_CODES.SCHEMA_INVALID
      ? COPY.schemaInvalidError
      : errorCode === DASHBOARD_ERROR_CODES.ROLE_MISMATCH
        ? COPY.roleMismatchError
        : errorCode === DASHBOARD_ERROR_CODES.NETWORK_ERROR
          ? COPY.networkError
          : error || COPY.loadErrorFallback;

  // Show initial loading skeleton before hydration
  if (!hasHydrated) {
    return (
      <PersistentLayout isLoading={true}>
        <DashboardLoadingState role={null} />
      </PersistentLayout>
    );
  }

  // Show sign-in prompt for unauthenticated users
  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[960px] items-center justify-center px-4">
        <div className={cn(APP_SURFACE_CARD, "p-8 text-center")}>
          <h1 className="text-[24px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
            {COPY.unauthTitle}
          </h1>
          <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
            {COPY.unauthDescription}
          </p>
        </div>
      </div>
    );
  }

  const isLecturer = user.role === "lecturer";
  const activeView = isLecturer ? lecturerView : studentView;
  const firstName = user.name?.split(" ")[0] || "User";

  // Show loading skeleton during data fetch
  if (isLoading) {
    return (
      <PersistentLayout isLoading={true}>
        <DashboardLoadingState role={user.role} />
      </PersistentLayout>
    );
  }

  return (
    <PersistentLayout isLoading={false}>
      <div className={APP_PAGE_SHELL}>
        <div className={cn(APP_PAGE_CONTAINER, APP_SECTION_STACK)}>
          {/* Page Header */}
          <div className="space-y-2.5 sm:space-y-3">
            <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-[color:var(--md-sys-color-on-surface)] sm:text-[36px] md:text-[42px]">
              {isLecturer ? COPY.lecturerHeading : COPY.studentHeading(firstName)}
            </h1>
            <p className="text-[14px] font-medium text-[color:var(--md-sys-color-on-surface-variant)] sm:text-base">
              {isLecturer
                ? COPY.lecturerSubheading(user.department)
                : COPY.studentSubheading(user.semester)}
            </p>
            {lastUpdated ? <LastUpdated timestamp={lastUpdated} /> : null}
          </div>

          {status === "error" && (
            <div className="flex min-h-[44vh] items-center justify-center">
              <div className={cn(APP_SURFACE_CARD, "w-full max-w-[920px] p-6 sm:p-8")}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--md-sys-color-error-container)] text-[color:var(--md-sys-color-on-error-container)]">
                    <MaterialSymbol icon={AlertCircleIcon} size={18} />
                  </div>
                  <div>
                    <p className="text-[20px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                      {COPY.loadErrorTitle}
                    </p>
                    <p className="mt-1 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                      {resolvedLoadErrorMessage}
                    </p>
                  </div>
                </div>
                <div className="m3-action-row mt-5">
                  <M3Button
                    variant="outlined"
                    layout="mobile-full"
                    onClick={() => void refresh(user.role, user.id)}
                  >
                    {COPY.retry}
                  </M3Button>
                </div>
              </div>
            </div>
          )}

          {status === "success" && activeView && (
            <>
              {isLecturer && lecturerView ? (
                <LecturerDashboard
                  view={lecturerView}
                  onRefresh={() => refresh(user.role, user.id)}
                />
              ) : studentView ? (
                <StudentDashboard
                  view={studentView}
                  onRefresh={() => refresh(user.role, user.id)}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
    </PersistentLayout>
  );
}
