"use client";

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

interface DigitalLibraryProps {
  courseDetails: CourseDetails;
}

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
                          {material.uploader}
                        </span>
                      </div>
                    </td>
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
            </tbody>
          </table>
        </div>
      </div>
      <EditMaterialModal
        isOpen={!!editingMaterial}
        onClose={() => setEditingMaterial(null)}
        material={editingMaterial}
        onSave={(updated) => {
          console.log("Saving material in library:", updated);
        }}
      />
    </div>
  );
}
