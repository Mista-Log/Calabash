"use client";

<<<<<<< HEAD
import * as React from "react";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  LockPasswordIcon,
  PlayIcon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import type { Material } from "@/services/api";
import { cn } from "@/lib/utils";

interface CourseContentSidebarProps {
  modules: {
    id: string;
    title: string;
=======
import {
  CheckmarkCircle02Icon,
  PlayIcon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import * as React from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import { Material } from "@/services/api";
import { Button } from "@/components/core/button";

interface CourseContentSidebarProps {
  sections: {
    id: string;
    name: string;
>>>>>>> origin/main
    materials: Material[];
  }[];
  activeMaterialId?: string;
  completedMaterials?: string[];
<<<<<<< HEAD
  lockedModuleIds?: string[];
  onMaterialClick?: (id: string) => void;
  containerClassName?: string;
  onClose?: () => void;
}

function getMaterialTypeLabel(material: Material): string {
  switch (material.type) {
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

export function CourseContentSidebar({
  modules,
  activeMaterialId,
  completedMaterials = [],
  lockedModuleIds = [],
  onMaterialClick,
  containerClassName,
  onClose,
}: CourseContentSidebarProps) {
  const [expandedModules, setExpandedModules] = React.useState<Set<string>>(
    new Set(),
  );
  const completedSet = React.useMemo(
    () => new Set(completedMaterials),
    [completedMaterials],
  );
  const totalMaterials = React.useMemo(
    () =>
      modules.reduce(
        (count, module) => count + (module.materials?.length ?? 0),
        0,
      ),
    [modules],
  );
  const totalCompleted = React.useMemo(() => {
    if (completedSet.size === 0 || totalMaterials === 0) return 0;
    let count = 0;
    modules.forEach((module) => {
      module.materials.forEach((material) => {
        if (completedSet.has(material.id)) {
          count += 1;
        }
      });
    });
    return count;
  }, [completedSet, modules, totalMaterials]);

  React.useEffect(() => {
    if (modules.length === 0) {
      setExpandedModules(new Set());
      return;
    }

    setExpandedModules((previous) => {
      if (previous.size > 0) return previous;
      return new Set([modules[0].id]);
    });
  }, [modules]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((previous) => {
      const nextExpanded = new Set(previous);
      if (nextExpanded.has(moduleId)) {
        nextExpanded.delete(moduleId);
      } else {
        nextExpanded.add(moduleId);
      }
      return nextExpanded;
    });
  };

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden bg-[color:var(--md-sys-color-surface-container-lowest)]",
        containerClassName,
      )}
    >
      <div className="flex items-start justify-between border-b border-[color:var(--md-sys-color-outline-variant)] px-5 py-5">
        <div>
          <h2 className="text-[18px] font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)]">
            Course Content
          </h2>
          <p className="mt-1 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
            {totalCompleted} of {totalMaterials} lessons completed
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[color:var(--md-sys-color-on-surface-variant)] transition-colors hover:bg-[color:var(--md-sys-color-surface-container-high)] xl:hidden"
            aria-label="Close sidebar"
          >
            <MaterialSymbol icon={Cancel01Icon} size={18} />
          </button>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {modules.length === 0 ? (
          <div className="px-5 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
            No materials available yet for this course.
          </div>
        ) : (
          modules.map((module) => {
            const isLocked = lockedModuleIds.includes(module.id);
            const isExpanded = expandedModules.has(module.id);
            const moduleCompleted = module.materials.reduce(
              (count, material) =>
                completedSet.has(material.id) ? count + 1 : count,
              0,
            );

            return (
              <section
                key={module.id}
                className={cn(
                  "mx-3 mb-3 overflow-hidden rounded-[20px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]",
                  isLocked && "opacity-80",
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (!isLocked) {
                      toggleModule(module.id);
                    }
                  }}
                  className={cn(
                    "w-full px-4 py-4 text-left transition-colors",
                    isLocked
                      ? "cursor-not-allowed"
                      : "hover:bg-[color:var(--md-sys-color-surface-container)]",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--md-sys-color-on-surface-variant)]">
                        {module.title}
                      </h3>
                      <p className="mt-1 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                        {moduleCompleted}/{module.materials.length} completed
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLocked ? (
                        <MaterialSymbol
                          icon={LockPasswordIcon}
                          size={14}
                          className="text-[color:var(--md-sys-color-on-surface-variant)]"
                        />
                      ) : null}
                      <MaterialSymbol
                        icon={ArrowDown01Icon}
                        size={14}
                        className={cn(
                          "text-[color:var(--md-sys-color-on-surface-variant)] transition-transform",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </div>
                  </div>
                  {isLocked ? (
                    <p className="mt-2 text-[11px] text-[color:var(--md-sys-color-on-surface-variant)]">
                      Complete the previous module to unlock this section.
                    </p>
                  ) : null}
                </button>

                {isExpanded ? (
                  <div className="divide-y divide-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-lowest)]">
                    {module.materials.length > 0 ? (
                      module.materials.map((material, index) => {
                        const isActive = activeMaterialId === material.id;
                        const isCompleted = completedSet.has(material.id);

                        return (
                          <button
                            key={material.id}
                            type="button"
                            onClick={() => {
                              if (!isLocked) {
                                onMaterialClick?.(material.id);
                              }
                            }}
                            disabled={isLocked}
                            className={cn(
                              "group flex min-h-[76px] w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                              isActive
                                ? "bg-[color:var(--md-sys-color-primary-container)]/35"
                                : "hover:bg-[color:var(--md-sys-color-surface-container-low)]",
                            )}
                          >
                            <div className="shrink-0">
                              {isCompleted ? (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
                                  <MaterialSymbol icon={CheckmarkCircle02Icon} size={18} />
                                </div>
                              ) : (
                                <div
                                  className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full",
                                    isActive
                                      ? "bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)]"
                                      : "bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface-variant)]",
                                  )}
                                >
                                  <MaterialSymbol
                                    icon={
                                      material.type === "video"
                                        ? PlayIcon
                                        : File01Icon
                                    }
                                    size={17}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4
                                className={cn(
                                  "line-clamp-2 text-[14px] font-semibold",
                                  isActive
                                    ? "text-[color:var(--md-sys-color-primary)]"
                                    : "text-[color:var(--md-sys-color-on-surface)]",
                                )}
                              >
                                {index + 1}. {material.title}
                              </h4>
                              <div className="mt-1.5 flex items-center gap-2 text-[12px] text-[color:var(--md-sys-color-on-surface-variant)]">
                                <span>{material.duration || "Self-paced"}</span>
                                <span className="h-1 w-1 rounded-full bg-[color:var(--md-sys-color-outline)]" />
                                <span>{getMaterialTypeLabel(material)}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-5 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
                        No materials in this module yet.
                      </div>
                    )}
                  </div>
                ) : null}
              </section>
            );
          })
        )}
=======
}

export function CourseContentSidebar({
  sections,
  activeMaterialId,
  completedMaterials = [],
}: CourseContentSidebarProps) {
  return (
    <div className="w-[380px] border-l border-border/40 bg-card hidden xl:flex flex-col h-full sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-border/40 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight">Course Content</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground/40"
        >
          <HugeiconsIcon icon={Settings02Icon} size={18} />
        </Button>
      </div>

      <div className="flex-1">
        {sections.map((section) => (
          <div key={section.id}>
            <div className="divide-y divide-border/10">
              {section.materials.map((material, idx) => {
                const isActive = activeMaterialId === material.id;
                const isCompleted = completedMaterials.includes(material.id);

                return (
                  <div
                    key={material.id}
                    className={`group flex items-center gap-4 p-6 cursor-pointer transition-all hover:bg-muted/30 ${
                      isActive ? "bg-primary/5 border-r-2 border-primary" : ""
                    }`}
                  >
                    <div className="shrink-0">
                      {isCompleted ? (
                        <div className="h-8 w-8 rounded-full bg-accent/20 text-accent-foreground flex items-center justify-center">
                          <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            size={18}
                          />
                        </div>
                      ) : (
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                              : "bg-muted/10 text-muted-foreground/40 group-hover:bg-muted/20"
                          }`}
                        >
                          <HugeiconsIcon icon={PlayIcon} size={18} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-bold truncate ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {idx + 1}. {material.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                          <HugeiconsIcon icon={PlayIcon} size={10} />
                          <span>{material.duration || "45min"}</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-muted/20" />
                        <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                          25 Notes
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
>>>>>>> origin/main
      </div>
    </div>
  );
}
