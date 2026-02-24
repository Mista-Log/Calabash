"use client";

<<<<<<< HEAD
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
=======
import {
  FolderIcon,
  Search01Icon,
  Sorting05Icon,
  ViewIcon,
  ViewOffIcon,
  Delete02Icon,
  Download01Icon,
  CheckmarkCircle02Icon,
  Upload01Icon,
  Settings02Icon,
  RecordIcon,
  NoteEditIcon,
  Menu01Icon,
  GridIcon,
  GridTableIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import * as React from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import { Material, CourseDetails, CalabashApiService } from "@/services/api";
import {
  Card,
  CardContent,
  Button,
  Input,
  Checkbox,
  Badge,
  SearchInput,
} from "@/components/core";
import { MaterialCard } from "@/components/features/library/MaterialCard";
import { EditMaterialModal } from "@/components/features/library/EditMaterialModal";
import { NoteEditIcon as Edit01Icon } from "@hugeicons/core-free-icons";

import Image from "next/image"; // Import Image component
>>>>>>> origin/main

interface DigitalLibraryProps {
  courseDetails: CourseDetails;
}

<<<<<<< HEAD
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
=======
export function DigitalLibrary({ courseDetails }: DigitalLibraryProps) {
  const [selectedMaterials, setSelectedMaterials] = React.useState<string[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [editingMaterial, setEditingMaterial] = React.useState<Material | null>(
    null,
  );

  const materials = courseDetails.sections.flatMap((s) => s.materials);

  const toggleSelect = (id: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = (sectionMaterials: Material[]) => {
    const ids = sectionMaterials.map((m) => m.id);
    const allSelected = ids.every((id) => selectedMaterials.includes(id));

    if (allSelected) {
      setSelectedMaterials((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedMaterials((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  const handleBulkAction = async (action: "delete" | "move" | "hide") => {
    if (selectedMaterials.length === 0) return;
    try {
      await CalabashApiService.bulkActionMaterials(selectedMaterials, action);
      setSelectedMaterials([]);
      // In a real app, you'd trigger a data refresh here
    } catch (error) {
      console.error(`Bulk action ${action} failed:`, error);
    }
  };

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      {/* Top Bar: Search & Utility */}
      <div className="flex items-center justify-between gap-4">
        <SearchInput
          placeholder="Search files and folders..."
          className="max-w-xl h-11 rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-xl"
          >
            <HugeiconsIcon icon={Upload01Icon} size={20} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-xl"
          >
            <HugeiconsIcon icon={Sorting05Icon} size={20} />
          </Button>
          <div className="h-11 w-11 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 overflow-hidden">
            <Image
              src={
                courseDetails.sections[0]?.materials[0]?.ownerAvatar ||
                "/placeholder-avatar.png"
              }
              alt="User"
              width={44} // h-11 * 4 (tailwind unit is 4px)
              height={44} // w-11 * 4
              className="h-full w-full object-cover"
            />
          </div>
          <Button className="h-11 px-6 rounded-xl font-bold bg-[#6366f1] hover:bg-[#4f46e5] text-white border-none shadow-lg shadow-indigo-500/20">
            Upgrade Space
          </Button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {
            label: "Create",
            icon: PlusSignIcon,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
            border: "border-indigo-100",
          },
          { label: "Upload", icon: Upload01Icon },
          { label: "New Folder", icon: FolderIcon },
          { label: "Record", icon: RecordIcon },
          { label: "Edit", icon: NoteEditIcon },
        ].map((action, i) => (
          <Card
            key={i}
            className={`group cursor-pointer hover:shadow-md transition-all duration-300 border-muted/10 ${i === 0 ? "border-indigo-200 bg-indigo-50/30 ring-1 ring-indigo-200" : ""}`}
            onClick={() => {
              if (action.label === "Edit" && selectedMaterials.length === 1) {
                const mat = materials.find(
                  (m) => m.id === selectedMaterials[0],
                );
                if (mat) setEditingMaterial(mat);
              }
            }}
          >
            <CardContent className="p-6 flex flex-col items-start gap-4">
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${i === 0 ? "bg-white text-indigo-500 shadow-sm" : "bg-muted/10 group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary"}`}
              >
                <HugeiconsIcon icon={action.icon} size={24} />
              </div>
              <span
                className={`text-sm font-bold ${i === 0 ? "text-indigo-600" : "text-muted-foreground"}`}
              >
                {action.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Suggested Files */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
            Suggested Files
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courseDetails.sections[0]?.materials.slice(0, 4).map((m, i) => (
            <Card
              key={m.id}
              className="group cursor-pointer border-muted/10 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-16/10 bg-muted/5 flex items-center justify-center p-8 bg-linear-to-br from-muted/5 via-transparent to-muted/10 relative">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary/40 group-hover:scale-110 transition-transform duration-500">
                  📄
                </div>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
              </div>
              <CardContent className="p-3.5 flex items-center justify-between border-t border-muted/10 bg-card">
                <span className="text-xs font-bold truncate pr-3 text-muted-foreground group-hover:text-foreground transition-colors">
                  {m.title}
                </span>
                <div className="h-1.5 w-1.5 rounded-full bg-muted/20 group-hover:bg-primary/40 transition-colors" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bulk Action Toolbar (Sticky) */}
      {selectedMaterials.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-6 px-6 py-4 bg-[#1a1f2e] text-white rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-3 pr-6 border-r border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">
                Selected
              </span>
              <span className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                {selectedMaterials.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleBulkAction("move")}
                variant="ghost"
                className="h-10 text-xs font-bold text-white/80 hover:bg-white/10 hover:text-white gap-2"
              >
                <HugeiconsIcon icon={FolderIcon} size={16} /> Move
              </Button>
              <Button
                onClick={() => handleBulkAction("hide")}
                variant="ghost"
                className="h-10 text-xs font-bold text-white/80 hover:bg-white/10 hover:text-white gap-2"
              >
                <HugeiconsIcon icon={ViewOffIcon} size={16} /> Hide
              </Button>
              <Button
                onClick={() => handleBulkAction("delete")}
                variant="ghost"
                className="h-10 text-xs font-bold text-red-400 hover:bg-red-400/10 hover:text-red-400 gap-2"
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} /> Delete
              </Button>
              <Button
                variant="ghost"
                className="h-10 text-xs font-bold text-white/80 hover:bg-white/10 hover:text-white gap-2"
              >
                <HugeiconsIcon icon={Download01Icon} size={16} /> ZIP
              </Button>
            </div>
            <Button
              variant="ghost"
              onClick={() => setSelectedMaterials([])}
              className="h-8 w-8 p-0 rounded-full hover:bg-white/10"
            >
              <HugeiconsIcon
                icon={Sorting05Icon}
                size={14}
                className="rotate-45"
              />
            </Button>
          </div>
        </div>
      )}

      {/* All Files Section */}
      <div className="space-y-6 pt-6 border-t border-muted/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">All Files</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-primary transition-colors"
            >
              <HugeiconsIcon icon={Settings02Icon} size={18} />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/30">
            <span>Only you have access to these files.</span>
          </div>
        </div>

        {/* Tab Navigation & View Toggles */}
        <div className="flex items-center justify-between border-b border-muted/10 pb-4">
          <div className="flex items-center gap-8">
            {["Recents", "Starred", "Important", "Oldest"].map((tab, i) => (
              <button
                key={tab}
                className={`text-sm font-bold transition-all relative ${i === 0 ? "text-indigo-600" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab}
                {i === 0 && (
                  <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 p-1 bg-muted/5 rounded-xl border border-muted/10">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg bg-white shadow-sm text-foreground"
            >
              <HugeiconsIcon icon={Menu01Icon} size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:bg-white/50"
            >
              <HugeiconsIcon icon={GridIcon} size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:bg-white/50"
            >
              <HugeiconsIcon icon={GridTableIcon} size={16} />
            </Button>
          </div>
        </div>

        {/* File Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-muted/5">
                <th className="py-4 px-4 w-8">
                  <Checkbox
                    checked={
                      selectedMaterials.length > 0 &&
                      selectedMaterials.length ===
                        courseDetails.sections.flatMap((s) => s.materials)
                          .length
                    }
                    onCheckedChange={() =>
                      selectAll(
                        courseDetails.sections.flatMap((s) => s.materials),
                      )
                    }
                  />
                </th>
                <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-50">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group">
                    File Name
                  </div>
                </th>
                <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-50">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group">
                    Modified
                  </div>
                </th>
                <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-50">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group">
                    File Size
                  </div>
                </th>
                <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group">
                    Owner
                  </div>
                </th>
                <th className="py-4 px-4 text-right w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/5">
              {courseDetails.sections
                .flatMap((s) => s.materials)
                .map((material) => (
                  <tr
                    key={material.id}
                    className={`group transition-colors ${selectedMaterials.includes(material.id) ? "bg-indigo-50/30" : "hover:bg-muted/5"}`}
                  >
                    <td className="py-4 px-4">
                      <Checkbox
                        checked={selectedMaterials.includes(material.id)}
                        onCheckedChange={() => toggleSelect(material.id)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors font-bold text-sm ${selectedMaterials.includes(material.id) ? "bg-white text-indigo-500 shadow-sm" : "bg-indigo-50/50 text-indigo-500"}`}
                        >
                          {material.title.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-foreground transition-colors group-hover:text-indigo-600">
                          {material.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-muted-foreground">
                      {material.uploadDate}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-muted-foreground">
                      {material.size || "2.4 MB"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-accent/20 overflow-hidden border border-accent/30 ring-2 ring-white ring-offset-1">
                          <Image
                            src={
                              material.ownerAvatar || "/placeholder-avatar.png"
                            }
                            alt={material.uploader}
                            width={32} // h-8 * 4
                            height={32} // w-8 * 4
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-bold text-foreground">
>>>>>>> origin/main
                          {material.uploader}
                        </span>
                      </div>
                    </td>
<<<<<<< HEAD
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
=======
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50"
                          onClick={() => setEditingMaterial(material)}
                        >
                          <HugeiconsIcon icon={NoteEditIcon} size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <HugeiconsIcon icon={Download01Icon} size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <HugeiconsIcon icon={Sorting05Icon} size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
>>>>>>> origin/main
            </tbody>
          </table>
        </div>
      </div>
<<<<<<< HEAD

      <EditMaterialModal
        isOpen={Boolean(editingMaterial)}
        onClose={() => setEditingMaterial(null)}
        material={editingMaterial}
        onSave={handleSaveMaterial}
=======
      <EditMaterialModal
        isOpen={!!editingMaterial}
        onClose={() => setEditingMaterial(null)}
        material={editingMaterial}
        onSave={(updated) => {
          console.log("Saving material in library:", updated);
        }}
>>>>>>> origin/main
      />
    </div>
  );
}
