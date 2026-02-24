"use client";

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
    materials: Material[];
  }[];
  activeMaterialId?: string;
  completedMaterials?: string[];
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
      </div>
    </div>
  );
}
