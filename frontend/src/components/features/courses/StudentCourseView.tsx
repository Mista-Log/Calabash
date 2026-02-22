"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight01Icon,
  BookOpen01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  CodeFolderIcon,
  DocumentCodeIcon,
  Download01Icon,
  FileZipIcon,
  Image01Icon,
  LibraryIcon,
  Menu02Icon,
  StarIcon,
  VideoReplayIcon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import {
  Card,
  CardContent,
  M3Button,
} from "@/components/core";
import type { CourseDetails, Material } from "@/services/api";
import { CourseContentSidebar } from "./CourseContentSidebar";
import { CourseQA } from "./CourseQA";
import { CourseNotes } from "./CourseNotes";
import { CourseAnnouncements } from "./CourseAnnouncements";
import { YouTubeEmbed, getYouTubeId } from "./YouTubeEmbed";
import { EmptyState } from "@/components/core/empty-state";
import { useCourseStore } from "@/store/useCourseStore";
import { useUserStore } from "@/store/useUserStore";

interface StudentCourseViewProps {
  course: CourseDetails;
}

function isPlayableVideo(material: Material | undefined): boolean {
  if (!material || material.type !== "video") return false;
  return Boolean(getYouTubeId(material.youtubeUrl || material.url || ""));
}

function getPlayableVideoUrl(material: Material | undefined): string | null {
  if (!isPlayableVideo(material)) return null;
  return material?.youtubeUrl || material?.url || null;
}

function hasActionableUrl(url: string | undefined): boolean {
  return Boolean(url && url.trim().length > 0 && url !== "#");
}

function getMaterialTypeLabel(type: Material["type"]): string {
  switch (type) {
    case "past-question":
      return "Past Question";
    case "zip":
      return "Archive";
    case "image":
      return "Image";
    case "video":
      return "Video";
    default:
      return "Document";
  }
}

function getMaterialTypeIcon(type: Material["type"]) {
  switch (type) {
    case "past-question":
      return DocumentCodeIcon;
    case "zip":
      return FileZipIcon;
    case "image":
      return Image01Icon;
    case "video":
      return VideoReplayIcon;
    default:
      return BookOpen01Icon;
  }
}

function formatUploadDate(value?: string): string {
  if (!value) return "Recently";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Recently";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getFirstPlayableVideo(materials: Material[]): Material | undefined {
  return materials.find((material) => isPlayableVideo(material));
}

function getInitialActiveMaterialId(materials: Material[]): string | undefined {
  const firstPlayable = getFirstPlayableVideo(materials);
  if (firstPlayable) {
    return firstPlayable.id;
  }
  return materials[0]?.id;
}

export function StudentCourseView({ course }: StudentCourseViewProps) {
  const { user } = useUserStore();
  const { materialCompletion, toggleMaterialCompletion } = useCourseStore();
  const modules = React.useMemo(() => course.modules ?? [], [course.modules]);
  const supplements = React.useMemo(() => course.supplements ?? [], [course.supplements]);
  const lecturer = React.useMemo(
    () => ({
      name: course.lecturer?.name ?? course.lecturerName ?? "Course Lecturer",
      role: course.lecturer?.role ?? "Course Lecturer",
      avatar:
        course.lecturer?.avatar ??
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          course.lecturer?.name ?? course.lecturerName ?? course.code ?? "lecturer",
        )}`,
    }),
    [course.code, course.lecturer, course.lecturerName],
  );
  const stats = React.useMemo(
    () => ({
      rating: Number(course.stats?.rating ?? 0),
      totalRatings: Number(course.stats?.totalRatings ?? 0),
      duration: course.stats?.duration ?? "N/A",
    }),
    [course.stats],
  );

  const allMaterials = React.useMemo(
    () => modules.flatMap((module) => module.materials ?? []),
    [modules],
  );
  const hasMaterials = allMaterials.length > 0;

  const completedMaterials = React.useMemo(() => {
    if (!user?.id) return [];
    return materialCompletion[user.id]?.[course.id] ?? [];
  }, [course.id, materialCompletion, user]);

  const lockedModuleIds = React.useMemo(() => {
    const locked: string[] = [];
    modules.forEach((module, index) => {
      if (index === 0) return;
      const previousModule = modules[index - 1];
      const previousComplete = (previousModule.materials ?? []).every((material) =>
        completedMaterials.includes(material.id),
      );
      if (!previousComplete) {
        locked.push(module.id);
      }
    });
    return locked;
  }, [completedMaterials, modules]);

  const materialModuleMap = React.useMemo(() => {
    const map = new Map<string, string>();
    modules.forEach((module) => {
      (module.materials ?? []).forEach((material) => {
        map.set(material.id, module.id);
      });
    });
    return map;
  }, [modules]);

  const accessibleMaterials = React.useMemo(
    () =>
      modules
        .filter((module) => !lockedModuleIds.includes(module.id))
        .flatMap((module) => module.materials ?? []),
    [lockedModuleIds, modules],
  );

  const initialActiveMaterialId = React.useMemo(
    () =>
      getInitialActiveMaterialId(
        accessibleMaterials.length > 0 ? accessibleMaterials : allMaterials,
      ),
    [accessibleMaterials, allMaterials],
  );

  const [activeMaterialId, setActiveMaterialId] = React.useState<string | undefined>(
    initialActiveMaterialId,
  );
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [recoveryNotice, setRecoveryNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!sidebarOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen]);

  React.useEffect(() => {
    if (!hasMaterials) {
      setActiveMaterialId(undefined);
      setRecoveryNotice(null);
      return;
    }

    const activeExists = allMaterials.some((material) => material.id === activeMaterialId);
    const activeModuleId = activeMaterialId ? materialModuleMap.get(activeMaterialId) : undefined;
    const activeLocked = Boolean(
      activeModuleId && lockedModuleIds.includes(activeModuleId),
    );

    if (!activeExists || activeLocked) {
      setActiveMaterialId(initialActiveMaterialId);
    }
  }, [
    activeMaterialId,
    allMaterials,
    hasMaterials,
    initialActiveMaterialId,
    lockedModuleIds,
    materialModuleMap,
  ]);

  const activeMaterial = React.useMemo(
    () => allMaterials.find((material) => material.id === activeMaterialId),
    [activeMaterialId, allMaterials],
  );

  const activeVideoUrl = React.useMemo(
    () => getPlayableVideoUrl(activeMaterial),
    [activeMaterial],
  );

  const firstPlayableVideo = React.useMemo(
    () =>
      getFirstPlayableVideo(
        accessibleMaterials.length > 0 ? accessibleMaterials : allMaterials,
      ),
    [accessibleMaterials, allMaterials],
  );

  React.useEffect(() => {
    if (!activeMaterial || activeMaterial.type !== "video") return;
    if (activeVideoUrl) return;

    if (firstPlayableVideo && firstPlayableVideo.id !== activeMaterial.id) {
      setActiveMaterialId(firstPlayableVideo.id);
      setRecoveryNotice(
        `"${activeMaterial.title}" is unavailable right now. We switched you to "${firstPlayableVideo.title}".`,
      );
      return;
    }

    setRecoveryNotice(
      "This lesson video is unavailable right now. Choose another lesson from Course Content.",
    );
  }, [activeMaterial, activeVideoUrl, firstPlayableVideo]);

  const handleMaterialSelect = React.useCallback((id: string) => {
    setRecoveryNotice(null);
    setActiveMaterialId(id);
    setSidebarOpen(false);
  }, []);

  const toggleComplete = React.useCallback(
    (id: string) => {
      if (!user?.id) return;
      toggleMaterialCompletion(user.id, course.id, id);
    },
    [course.id, toggleMaterialCompletion, user],
  );

  const isCompleted = activeMaterialId
    ? completedMaterials.includes(activeMaterialId)
    : false;

  const completedCount = React.useMemo(() => {
    if (allMaterials.length === 0) return 0;
    const materialIds = new Set(allMaterials.map((material) => material.id));
    return completedMaterials.filter((id) => materialIds.has(id)).length;
  }, [allMaterials, completedMaterials]);

  const activeSourceUrl = React.useMemo(() => {
    if (!activeMaterial) return null;
    if (hasActionableUrl(activeMaterial.url)) {
      return activeMaterial.url;
    }
    if (activeMaterial.type === "video" && activeVideoUrl) {
      return activeVideoUrl;
    }
    return null;
  }, [activeMaterial, activeVideoUrl]);

  const openExternal = React.useCallback((url: string | null) => {
    if (!url || typeof window === "undefined") return;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);
  const studentTabs = React.useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "qa", label: "Q&A" },
      { id: "notes", label: "Notes" },
      { id: "announcements", label: "Updates" },
    ],
    [],
  );
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const activeTabId =
    studentTabs[activeTabIndex]?.id ?? studentTabs[0]?.id ?? "overview";

  const handleTabChange = React.useCallback(
    (event: React.FormEvent<HTMLElement>) => {
      const target = event.currentTarget as HTMLElement & {
        activeTabIndex?: number;
      };
      const nextIndex = target.activeTabIndex ?? 0;
      const boundedIndex = Math.max(0, Math.min(nextIndex, studentTabs.length - 1));
      setActiveTabIndex(boundedIndex);
    },
    [studentTabs.length],
  );

  return (
    <section className="relative rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)]">
      <div className="grid xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0">
          <div className="border-b border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--md-sys-color-on-surface-variant)]">
                  Now Learning
                </p>
                <h2 className="mt-1 line-clamp-1 text-[18px] font-semibold text-[color:var(--md-sys-color-on-surface)] sm:text-[20px]">
                  {activeMaterial?.title ?? "Choose a lesson to begin"}
                </h2>
                <p className="mt-1 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                  {hasMaterials
                    ? `${completedCount} of ${allMaterials.length} materials completed`
                    : "No learning materials have been published yet."}
                </p>
              </div>

              <M3Button
                size="sm"
                variant="outlined"
                onClick={() => setSidebarOpen((open) => !open)}
                className="xl:hidden"
                icon={
                  <MaterialSymbol
                    icon={sidebarOpen ? Cancel01Icon : Menu02Icon}
                    size={18}
                  />
                }
              >
                Course Content
              </M3Button>
            </div>

            {activeMaterial ? (
              activeMaterial.type === "video" ? (
                activeVideoUrl ? (
                  <YouTubeEmbed
                    url={activeVideoUrl}
                    title={activeMaterial.title}
                    className="rounded-[24px]"
                  />
                ) : (
                  <div className="flex min-h-[320px] items-center justify-center rounded-[24px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] px-6 text-center">
                    <div className="max-w-[540px]">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
                        <MaterialSymbol icon={VideoReplayIcon} size={22} />
                      </div>
                      <h3 className="mt-4 text-[20px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                        Video currently unavailable
                      </h3>
                      <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                        This lesson does not have a playable source yet. Pick another
                        lesson from Course Content.
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="rounded-[24px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] p-5 sm:p-7">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
                      <MaterialSymbol
                        icon={getMaterialTypeIcon(activeMaterial.type)}
                        size={22}
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-[20px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                        Resource ready to review
                      </h3>
                      <p className="text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                        This lesson is provided as a {getMaterialTypeLabel(activeMaterial.type).toLowerCase()}.
                        Open it in Library for reading, downloads, and annotations.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[14px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
                        Type
                      </p>
                      <p className="mt-1 text-[14px] font-medium text-[color:var(--md-sys-color-on-surface)]">
                        {getMaterialTypeLabel(activeMaterial.type)}
                      </p>
                    </div>
                    <div className="rounded-[14px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
                        File Size
                      </p>
                      <p className="mt-1 text-[14px] font-medium text-[color:var(--md-sys-color-on-surface)]">
                        {activeMaterial.size ?? "Not specified"}
                      </p>
                    </div>
                    <div className="rounded-[14px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
                        Uploaded
                      </p>
                      <p className="mt-1 text-[14px] font-medium text-[color:var(--md-sys-color-on-surface)]">
                        {formatUploadDate(activeMaterial.uploadDate)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="flex min-h-[320px] items-center justify-center rounded-[24px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)]">
                <EmptyState
                  icon={BookOpen01Icon}
                  title="No material selected"
                  description="Choose a lesson from Course Content to start learning."
                />
              </div>
            )}

            {recoveryNotice ? (
              <div className="mt-3 flex items-start gap-2 rounded-[14px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)] px-3 py-2.5 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                <MaterialSymbol icon={VideoReplayIcon} size={16} />
                <p>{recoveryNotice}</p>
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <M3Button
                variant={isCompleted ? "filled" : "outlined"}
                size="sm"
                disabled={!activeMaterialId}
                onClick={() => {
                  if (activeMaterialId) {
                    toggleComplete(activeMaterialId);
                  }
                }}
                icon={
                  <MaterialSymbol
                    icon={isCompleted ? CheckmarkCircle02Icon : StarIcon}
                    size={18}
                  />
                }
              >
                {isCompleted ? "Completed" : "Mark Complete"}
              </M3Button>

              <M3Button
                variant="outlined"
                size="sm"
                disabled={!activeSourceUrl}
                onClick={() => openExternal(activeSourceUrl)}
                icon={<MaterialSymbol icon={Download01Icon} size={18} />}
              >
                Download
              </M3Button>

              {activeMaterial && activeMaterial.type !== "video" ? (
                <Link href={`/library/${activeMaterial.id}`} className="inline-flex">
                  <M3Button
                    variant="text"
                    size="sm"
                    icon={<MaterialSymbol icon={LibraryIcon} size={18} />}
                  >
                    Open in Library
                  </M3Button>
                </Link>
              ) : null}

              {activeMaterial?.type === "video" && activeVideoUrl ? (
                <M3Button
                  variant="text"
                  size="sm"
                  onClick={() => openExternal(activeVideoUrl)}
                  icon={<MaterialSymbol icon={ArrowUpRight01Icon} size={18} />}
                >
                  Open Source
                </M3Button>
              ) : null}
            </div>
          </div>

          <div className="space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-start">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-3 py-1 text-[12px] font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
                  <MaterialSymbol icon={CodeFolderIcon} size={14} />
                  {course.code}
                </div>

                <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[color:var(--md-sys-color-on-surface)] sm:text-4xl">
                  {course.title}
                </h1>

                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full border border-[color:var(--md-sys-color-outline-variant)]">
                    <Image
                      src={lecturer.avatar}
                      alt={lecturer.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                      {lecturer.name}
                    </p>
                    <p className="text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                      {lecturer.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
                    Course Rating
                  </p>
                  <p className="mt-1 text-[21px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                    {stats.rating}
                  </p>
                  <p className="text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                    {stats.totalRatings} ratings
                  </p>
                </div>
                <div className="rounded-[18px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
                    Students Enrolled
                  </p>
                  <p className="mt-1 text-[21px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                    {Number(course.studentCount ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
                    Total Duration
                  </p>
                  <p className="mt-1 text-[21px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                    {stats.duration}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--md-sys-color-on-surface-variant)]">
                    Learning Materials
                  </p>
                  <p className="mt-1 text-[21px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                    {Number(course.materialCount ?? 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-8">
              <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <md-tabs
                  active-tab-index={activeTabIndex}
                  onChange={handleTabChange}
                  className="course-tabs"
                  aria-label="Student course sections"
                >
                  {studentTabs.map((tab) => (
                    <md-tab key={tab.id}>{tab.label}</md-tab>
                  ))}
                </md-tabs>
              </div>

              {activeTabId === "overview" ? (
                <>
                  <section className="space-y-4">
                    <h3 className="text-[24px] font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)]">
                      About this course
                    </h3>
                    <p className="max-w-4xl text-[16px] leading-7 text-[color:var(--md-sys-color-on-surface-variant)]">
                      {course.description}
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-[24px] font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)]">
                      Course resources
                    </h3>
                    {supplements.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {supplements.map((item) => {
                          const canOpen = hasActionableUrl(item.url);
                          return (
                            <Card
                              key={item.id}
                              className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]"
                            >
                              <CardContent className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <h4 className="line-clamp-2 text-[15px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                                      {item.title}
                                    </h4>
                                    <div className="mt-2 flex items-center gap-2 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                                      <span>{item.size ?? "N/A"}</span>
                                      <span className="h-1 w-1 rounded-full bg-[color:var(--md-sys-color-outline)]" />
                                      <span>{getMaterialTypeLabel(item.type)}</span>
                                    </div>
                                  </div>
                                  <M3Button
                                    size="sm"
                                    variant="outlined"
                                    disabled={!canOpen}
                                    onClick={() => openExternal(canOpen ? item.url : null)}
                                    icon={<MaterialSymbol icon={Download01Icon} size={16} />}
                                  >
                                    Open
                                  </M3Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <Card className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
                        <CardContent className="p-8">
                          <EmptyState
                            icon={BookOpen01Icon}
                            title="No resources yet"
                            description="Additional resources will appear here when they are published."
                          />
                        </CardContent>
                      </Card>
                    )}
                  </section>
                </>
              ) : null}

              {activeTabId === "qa" ? (
                <div className="mt-8 outline-none">
                  <CourseQA />
                </div>
              ) : null}

              {activeTabId === "notes" ? (
                <div className="mt-8 outline-none">
                  <CourseNotes courseId={course.id} courseCode={course.code} />
                </div>
              ) : null}

              {activeTabId === "announcements" ? (
                <div className="mt-8 outline-none">
                  <CourseAnnouncements />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <CourseContentSidebar
          modules={modules}
          activeMaterialId={activeMaterialId}
          completedMaterials={completedMaterials}
          lockedModuleIds={lockedModuleIds}
          onMaterialClick={handleMaterialSelect}
          containerClassName="hidden xl:flex xl:sticky xl:top-4 xl:h-[calc(100dvh-8rem)] xl:border-l xl:border-[color:var(--md-sys-color-outline-variant)]"
        />
      </div>

      {sidebarOpen ? (
        <div className="app-overlay-root xl:hidden">
          <button
            type="button"
            className="app-overlay-scrim"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar backdrop"
          />
          <div className="app-overlay-center">
            <CourseContentSidebar
              modules={modules}
              activeMaterialId={activeMaterialId}
              completedMaterials={completedMaterials}
              lockedModuleIds={lockedModuleIds}
              onMaterialClick={handleMaterialSelect}
              onClose={() => setSidebarOpen(false)}
              containerClassName="app-overlay-panel h-[min(92dvh,760px)] w-[min(94vw,380px)]"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
