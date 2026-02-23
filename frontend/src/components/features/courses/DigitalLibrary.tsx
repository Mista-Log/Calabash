"use client";

import * as React from "react";
import Image from "next/image";
import {
  CodeFolderIcon,
  NoteEditIcon,
  ViewOffIcon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import type { CourseDetails, Material } from "@/services/api";
import {
  Card,
  CardContent,
  Checkbox,
  M3Button,
  SearchInput,
} from "@/components/core";
import { EditMaterialModal } from "@/components/features/library/EditMaterialModal";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useToast } from "@/components/core/toast";

interface DigitalLibraryProps {
  courseDetails: CourseDetails;
}

function materialBelongsToCourse(material: Material, course: CourseDetails): boolean {
  return material.courseId === course.id || material.courseCode === course.code;
}

function toDisplayDate(value?: string): string {
  if (!value) return "No date";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DigitalLibrary({ courseDetails }: DigitalLibraryProps) {
  const { addToast } = useToast();
  const {
    materials: libraryMaterials,
    updateMaterial,
    batchSetVisibility,
    setVisibility,
  } = useLibraryStore();

  const [selectedMaterials, setSelectedMaterials] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [editingMaterial, setEditingMaterial] = React.useState<Material | null>(null);
  const [pendingIds, setPendingIds] = React.useState<Set<string>>(new Set());
  const [isBatchUpdating, setIsBatchUpdating] = React.useState(false);

  const fallbackMaterials = React.useMemo(
    () => courseDetails.modules.flatMap((module) => module.materials),
    [courseDetails.modules],
  );

  const courseMaterials = React.useMemo(() => {
    const fromStore = libraryMaterials.filter((material) =>
      materialBelongsToCourse(material, courseDetails),
    );
    return fromStore.length > 0 ? fromStore : fallbackMaterials;
  }, [courseDetails, fallbackMaterials, libraryMaterials]);

  const filteredMaterials = React.useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) {
      return courseMaterials;
    }

    return courseMaterials.filter(
      (material) =>
        material.title.toLowerCase().includes(normalized) ||
        material.uploader.toLowerCase().includes(normalized) ||
        material.type.toLowerCase().includes(normalized),
    );
  }, [courseMaterials, searchQuery]);

  React.useEffect(() => {
    const visibleIds = new Set(filteredMaterials.map((material) => material.id));
    setSelectedMaterials((previous) =>
      previous.filter((materialId) => visibleIds.has(materialId)),
    );
  }, [filteredMaterials]);

  const withPending = async (materialId: string, operation: () => Promise<void>) => {
    setPendingIds((previous) => new Set(previous).add(materialId));
    try {
      await operation();
    } finally {
      setPendingIds((previous) => {
        const next = new Set(previous);
        next.delete(materialId);
        return next;
      });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedMaterials((previous) =>
      previous.includes(id)
        ? previous.filter((materialId) => materialId !== id)
        : [...previous, id],
    );
  };

  const toggleSelectAll = () => {
    const visibleIds = filteredMaterials.map((material) => material.id);
    const allSelected = visibleIds.every((id) => selectedMaterials.includes(id));
    setSelectedMaterials(allSelected ? [] : visibleIds);
  };

  const handleBatchVisibility = async (visibility: "public" | "private") => {
    if (selectedMaterials.length === 0) return;

    setIsBatchUpdating(true);
    try {
      await batchSetVisibility(selectedMaterials, visibility);
      addToast(
        visibility === "private"
          ? "Selected files are now private."
          : "Selected files are now public.",
        "success",
      );
      setSelectedMaterials([]);
    } catch {
      addToast("Batch visibility update failed. Changes were reverted.", "error");
    } finally {
      setIsBatchUpdating(false);
    }
  };

  const handleSaveMaterial = async (updates: Partial<Material>) => {
    if (!editingMaterial) return;
    const targetId = editingMaterial.id;

    await withPending(targetId, async () => {
      try {
        await updateMaterial(targetId, updates);
        addToast("Material updated successfully.", "success");
        setEditingMaterial(null);
      } catch {
        addToast("Failed to save material updates.", "error");
      }
    });
  };

  const handleToggleVisibility = async (material: Material) => {
    const nextVisibility = material.visibility === "private" ? "public" : "private";

    await withPending(material.id, async () => {
      try {
        await setVisibility(material.id, nextVisibility);
        addToast(
          nextVisibility === "private"
            ? "Material visibility set to private."
            : "Material visibility set to public.",
          "success",
        );
      } catch {
        addToast("Failed to update visibility.", "error");
      }
    });
  };

  const suggestedMaterials = filteredMaterials.slice(0, 4);
  const selectedMaterial =
    selectedMaterials.length === 1
      ? courseMaterials.find((material) => material.id === selectedMaterials[0]) ?? null
      : null;

  return (
    <div className="mx-auto max-w-7xl space-y-10 pb-20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search files and folders..."
          className="h-11 w-full max-w-xl rounded-xl"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />

        <div className="flex items-center gap-2">
          {selectedMaterial ? (
            <M3Button
              variant="outlined"
              className="h-10 px-4 text-[13px] font-semibold"
              onClick={() => setEditingMaterial(selectedMaterial)}
            >
              Edit Selected
            </M3Button>
          ) : null}
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--md-sys-color-on-surface-variant)]">
            {filteredMaterials.length} result{filteredMaterials.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-surface-variant)]">
          Suggested Files
        </h2>
        {suggestedMaterials.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {suggestedMaterials.map((material) => (
              <Card
                key={material.id}
                className="overflow-hidden border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] transition-colors hover:bg-[color:var(--md-sys-color-surface-container)]"
              >
                <div className="relative flex aspect-[16/10] items-center justify-center bg-[color:var(--md-sys-color-surface-container-high)] p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-primary-container)] text-[20px] font-semibold text-[color:var(--md-sys-color-on-primary-container)]">
                    {material.title.charAt(0).toUpperCase()}
                  </div>
                </div>
                <CardContent className="border-t border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] p-3.5">
                  <span className="block truncate text-[13px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                    {material.title}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
            <CardContent className="p-5 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
              No files match your current search query.
            </CardContent>
          </Card>
        )}
      </div>

      {selectedMaterials.length > 0 ? (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-4 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] px-6 py-4 text-[color:var(--md-sys-color-on-surface)]">
            <div className="flex items-center gap-3 border-r border-[color:var(--md-sys-color-outline-variant)] pr-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-surface-variant)]">
                Selected
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary)] text-xs font-semibold text-[color:var(--md-sys-color-on-primary)]">
                {selectedMaterials.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <M3Button
                variant="ghost"
                className="h-10 gap-2 text-[13px] font-semibold"
                onClick={() => void handleBatchVisibility("private")}
                disabled={isBatchUpdating}
              >
                <MaterialSymbol icon={ViewOffIcon} size={16} />
                Set Private
              </M3Button>
              <M3Button
                variant="ghost"
                className="h-10 gap-2 text-[13px] font-semibold"
                onClick={() => void handleBatchVisibility("public")}
                disabled={isBatchUpdating}
              >
                <MaterialSymbol icon={CodeFolderIcon} size={16} />
                Set Public
              </M3Button>
            </div>

            <M3Button
              variant="text"
              onClick={() => setSelectedMaterials([])}
              className="h-8 w-8 rounded-full p-0"
              disabled={isBatchUpdating}
            >
              <MaterialSymbol icon="close" size={16} />
            </M3Button>
          </div>
        </div>
      ) : null}

      <div className="space-y-6 border-t border-[color:var(--md-sys-color-outline-variant)] pt-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-[30px] font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)]">
              All Files
            </h2>
          </div>
          <div className="text-[13px] font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-surface-variant)]">
            {filteredMaterials.length} file{filteredMaterials.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[color:var(--md-sys-color-outline-variant)]">
                <th className="w-8 px-4 py-4">
                  <Checkbox
                    checked={
                      filteredMaterials.length > 0 &&
                      selectedMaterials.length === filteredMaterials.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-surface-variant)]">
                  File Name
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-surface-variant)]">
                  Modified
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-surface-variant)]">
                  File Size
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-surface-variant)]">
                  Owner
                </th>
                <th className="w-40 px-4 py-4 text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--md-sys-color-outline-variant)]">
              {filteredMaterials.map((material) => {
                const isSelected = selectedMaterials.includes(material.id);
                const isPending = pendingIds.has(material.id) || isBatchUpdating;
                const isPublic = material.visibility !== "private";

                return (
                  <tr
                    key={material.id}
                    className={
                      isSelected
                        ? "bg-[color:var(--md-sys-color-primary-container)]/35"
                        : "hover:bg-[color:var(--md-sys-color-surface-container-low)]"
                    }
                  >
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(material.id)}
                        disabled={isBatchUpdating}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--md-sys-color-primary-container)] text-[14px] font-semibold text-[color:var(--md-sys-color-on-primary-container)]">
                          {material.title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="block text-[14px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                            {material.title}
                          </span>
                          <span className="text-[11px] text-[color:var(--md-sys-color-on-surface-variant)]">
                            {isPublic ? "Public" : "Private"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                      {toDisplayDate(material.uploadDate)}
                    </td>
                    <td className="px-4 py-4 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                      {material.size || "2.4 MB"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 overflow-hidden rounded-full border border-[color:var(--md-sys-color-outline-variant)]">
                          <Image
                            src={material.ownerAvatar || "/placeholder-avatar.png"}
                            alt={material.uploader}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-[14px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                          {material.uploader}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <M3Button
                          size="sm"
                          className="h-8 w-8 text-[color:var(--md-sys-color-on-surface-variant)]"
                          onClick={() => setEditingMaterial(material)}
                          disabled={isPending}
                        >
                          <MaterialSymbol icon={NoteEditIcon} size={18} />
                        </M3Button>
                        <M3Button
                          size="sm"
                          className="h-8 px-3 text-[12px] font-semibold"
                          onClick={() => void handleToggleVisibility(material)}
                          disabled={isPending}
                        >
                          {isPending
                            ? "Saving"
                            : isPublic
                              ? "Private"
                              : "Public"}
                        </M3Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <EditMaterialModal
        isOpen={Boolean(editingMaterial)}
        onClose={() => setEditingMaterial(null)}
        material={editingMaterial}
        onSave={handleSaveMaterial}
      />
    </div>
  );
}
