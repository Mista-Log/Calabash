"use client";

import React, { useState } from "react";
import {
  PlusSignIcon,
  Delete02Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  VideoReplayIcon,
  File01Icon,
  Link01Icon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { motion, AnimatePresence } from "@/lib/motion-foundations";

import { M3Button, Input, Card, CardContent, Badge } from "@/components/core";
import { Material } from "@/services/api";

export interface Module {
  id: string;
  title: string;
  order: number;
  materials: Material[];
}

interface ModuleEditorProps {
  initialModules?: Module[];
  onChange: (modules: Module[]) => void;
  courseCode: string;
}

export function ModuleEditor({
  initialModules = [],
  onChange,
  courseCode,
}: ModuleEditorProps) {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  const updateModules = (newModules: Module[]) => {
    setModules(newModules);
    onChange(newModules);
  };

  const addModule = () => {
    if (!newModuleTitle.trim()) return;
    const newModule: Module = {
      id: `m-${Date.now()}`,
      title: newModuleTitle,
      order: modules.length + 1,
      materials: [],
    };
    updateModules([...modules, newModule]);
    setNewModuleTitle("");
  };

  const removeModule = (id: string) => {
    updateModules(
      modules
        .filter((m) => m.id !== id)
        .map((m, i) => ({ ...m, order: i + 1 })),
    );
  };

  const moveModule = (index: number, direction: "up" | "down") => {
    const newModules = [...modules];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newModules.length) return;

    [newModules[index], newModules[targetIndex]] = [
      newModules[targetIndex],
      newModules[index],
    ];
    updateModules(newModules.map((m, i) => ({ ...m, order: i + 1 })));
  };

  const addMaterial = (
    moduleId: string,
    type: Material["type"],
    title: string = "New Material",
    url: string = "#",
  ) => {
    const newMaterial: Material = {
      id: `mat-${Date.now()}`,
      title,
      courseCode,
      type,
      semester: 1, // Fallback
      uploadDate: new Date().toISOString(),
      url,
      uploader: "Current User",
      size: type === "video" ? undefined : "0.5MB",
      duration: type === "video" ? "0:00" : undefined,
    };

    updateModules(
      modules.map((m) =>
        m.id === moduleId
          ? { ...m, materials: [...m.materials, newMaterial] }
          : m,
      ),
    );
  };

  const removeMaterial = (moduleId: string, materialId: string) => {
    updateModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              materials: m.materials.filter((mat) => mat.id !== materialId),
            }
          : m,
      ),
    );
  };

  return (
    <div className="space-y-8">
      {/* Module Creation */}
      <div className="flex gap-4">
        <Input
          placeholder="New Module Title (e.g. Week 1: Introduction)"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
          className="h-12 text-[16px] font-bold"
          onKeyDown={(e) => e.key === "Enter" && addModule()}
        />
        <M3Button
          onClick={addModule}
          className="h-12 px-6 gap-2 font-bold whitespace-nowrap"
        >
          <MaterialSymbol icon={PlusSignIcon} size={20} />
          Add Module
        </M3Button>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <Card className="border-muted/20 bg-muted/5 group">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <M3Button
                          size="sm"
                          className="h-6 w-6 text-muted-foreground hover:text-primary disabled:opacity-30"
                          onClick={() => moveModule(index, "up")}
                          disabled={index === 0}
                        >
                          <MaterialSymbol icon={ArrowUp01Icon} size={14} />
                        </M3Button>
                        <M3Button
                          size="sm"
                          className="h-6 w-6 text-muted-foreground hover:text-primary disabled:opacity-30"
                          onClick={() => moveModule(index, "down")}
                          disabled={index === modules.length - 1}
                        >
                          <MaterialSymbol icon={ArrowDown01Icon} size={14} />
                        </M3Button>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">
                          Module {module.order}
                        </span>
                        <h3 className="text-[20px] font-bold tracking-tight text-foreground">
                          {module.title}
                        </h3>
                      </div>
                    </div>
                    <M3Button
                      size="sm"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeModule(module.id)}
                    >
                      <MaterialSymbol icon={Delete02Icon} size={18} />
                    </M3Button>
                  </div>

                  <div className="pl-14 space-y-3">
                    {/* Materials List */}
                    {module.materials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-card border border-muted/10 group/item"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-muted/20 flex items-center justify-center text-muted-foreground/60">
                            <MaterialSymbol
                              icon={
                                material.type === "video"
                                  ? VideoReplayIcon
                                  : File01Icon
                              }
                              size={16}
                            />
                          </div>
                          <span className="text-[14px] font-bold">
                            {material.title}
                          </span>
                          {material.type === "video" && (
                            <Badge
                              variant="outline"
                              className="h-5 bg-[color:var(--md-sys-color-tertiary-container)] px-1.5 text-[10px] font-black uppercase tracking-widest text-[color:var(--md-sys-color-on-tertiary-container)] border-[color:var(--md-sys-color-tertiary)]/30"
                            >
                              YouTube
                            </Badge>
                          )}
                        </div>
                        <M3Button
                          size="sm"
                          className="h-8 w-8 text-muted-foreground/40 hover:text-destructive group-hover/item:opacity-100 opacity-0 transition-opacity"
                          onClick={() => removeMaterial(module.id, material.id)}
                        >
                          <MaterialSymbol icon={Delete02Icon} size={14} />
                        </M3Button>
                      </div>
                    ))}

                    {/* Quick Adding */}
                    <div className="flex items-center gap-3 pt-2">
                      <M3Button
                        variant="outlined"
                        size="sm"
                        className="h-9 px-4 gap-2 text-[13px] font-bold rounded-xl border-dashed hover:border-primary/50 hover:bg-primary/5"
                        onClick={() =>
                          addMaterial(module.id, "pdf", "Lecture Slides")
                        }
                      >
                        <MaterialSymbol icon={File01Icon} size={14} />
                        Add Doc
                      </M3Button>
                      <M3Button
                        variant="outlined"
                        size="sm"
                        className="h-9 rounded-xl border-dashed px-4 text-[13px] font-bold text-[color:var(--md-sys-color-tertiary)] hover:border-[color:var(--md-sys-color-tertiary)]/50 hover:bg-[color:var(--md-sys-color-tertiary-container)]/40 hover:text-[color:var(--md-sys-color-tertiary)] gap-2"
                        onClick={() => {
                          const url = prompt("Enter YouTube URL:");
                          if (url)
                            addMaterial(
                              module.id,
                              "video",
                              "Video Lecture",
                              url,
                            );
                        }}
                      >
                        <MaterialSymbol icon={Link01Icon} size={14} />
                        Add Video
                      </M3Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {modules.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-muted/10 rounded-3xl opacity-50">
            <div className="h-16 w-16 rounded-2xl bg-muted/10 flex items-center justify-center text-muted-foreground/40">
              <MaterialSymbol icon={PlusSignIcon} size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-[18px] font-bold">No modules created yet</p>
              <p className="text-[14px] text-muted-foreground">
                Start by adding your first module above
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
