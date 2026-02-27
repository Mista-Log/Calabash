"use client";

import * as React from "react";
import Link from "next/link";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { M3Button } from "@/components/core";
import type { Material } from "@/services/api";

interface MaterialNavigationProps {
  materials: Material[];
  currentMaterialId: string;
  onNavigate?: (material: Material) => void;
}

export function MaterialNavigation({ 
  materials, 
  currentMaterialId,
  onNavigate 
}: MaterialNavigationProps) {
  const currentIndex = materials.findIndex(m => m.id === currentMaterialId);
  const previousMaterial = currentIndex > 0 ? materials[currentIndex - 1] : null;
  const nextMaterial = currentIndex < materials.length - 1 ? materials[currentIndex + 1] : null;

  if (!previousMaterial && !nextMaterial) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 w-full max-w-4xl mx-auto mt-6">
      {/* Previous Material */}
      {previousMaterial ? (
        <Link 
          href={`/courses/material/${previousMaterial.id}`}
          className="flex-1"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate(previousMaterial);
            }
          }}
        >
          <M3Button variant="outlined" className="w-full justify-start gap-2 h-auto py-3 px-4">
            <MaterialSymbol icon="arrow_back" size={18} />
            <div className="text-left overflow-hidden">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-surface-variant)]">
                Previous
              </p>
              <p className="text-[14px] font-medium text-[color:var(--md-sys-color-on-surface)] truncate">
                {previousMaterial.title}
              </p>
            </div>
          </M3Button>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-[13px] text-[color:var(--md-sys-color-on-surface-variant)]">
        <span className="font-medium text-[color:var(--md-sys-color-on-surface)]">
          {currentIndex + 1}
        </span>
        <span>/</span>
        <span>{materials.length}</span>
      </div>

      {/* Next Material */}
      {nextMaterial ? (
        <Link 
          href={`/courses/material/${nextMaterial.id}`}
          className="flex-1"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate(nextMaterial);
            }
          }}
        >
          <M3Button variant="outlined" className="w-full justify-end gap-2 h-auto py-3 px-4">
            <div className="text-right overflow-hidden">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-surface-variant)]">
                Next
              </p>
              <p className="text-[14px] font-medium text-[color:var(--md-sys-color-on-surface)] truncate">
                {nextMaterial.title}
              </p>
            </div>
            <MaterialSymbol icon="arrow_forward" size={18} />
          </M3Button>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
