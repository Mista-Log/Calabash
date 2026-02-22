"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MaterialDetail } from "@/components/features/library/MaterialDetail";
import { Material } from "@/services/api";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useMockDataStore } from "@/store/useMockDataStore";
import { Card, CardContent, M3Button } from "@/components/core";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { AlertCircleIcon, InformationCircleIcon } from "@/lib/icons/material-icons";

function hasPlayableVideoSource(material: Material | null | undefined): boolean {
  if (!material || material.type !== "video") {
    return false;
  }

  if (material.youtubeUrl && material.youtubeUrl.trim().length > 0) {
    return true;
  }

  return Boolean(material.url && material.url !== "#");
}

export default function MaterialPage() {
  const params = useParams();
  const materialId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { materials, setSelectedMaterial, status } = useLibraryStore();
  const mockMaterials = useMockDataStore((state) => state.materials);
  const material = React.useMemo<Material | null>(() => {
    if (!materialId) return null;

    const fromMock =
      mockMaterials.find((entry) => entry.id === materialId) ??
      (materialId.startsWith("mocked") ? mockMaterials[0] : null);
    const fromStore = materials.find((entry) => entry.id === materialId);
    if (fromStore) {
      if (
        fromStore.type === "video" &&
        !hasPlayableVideoSource(fromStore) &&
        hasPlayableVideoSource(fromMock)
      ) {
        return {
          ...fromStore,
          youtubeUrl: fromStore.youtubeUrl || fromMock?.youtubeUrl,
          url:
            fromStore.url && fromStore.url !== "#"
              ? fromStore.url
              : (fromMock?.url ?? fromStore.url),
          size: fromStore.size || fromMock?.size,
          duration: fromStore.duration || fromMock?.duration,
        };
      }
      return fromStore;
    }

    if (!fromMock) {
      return null;
    }

    return {
      ...fromMock,
      id: materialId,
      title: materialId.includes("mocked")
        ? `${fromMock.title} (Verified)`
        : fromMock.title,
    };
  }, [materialId, materials, mockMaterials]);

  React.useEffect(() => {
    setSelectedMaterial(material);
    return () => setSelectedMaterial(null);
  }, [material, setSelectedMaterial]);

  if (!materialId) {
    return (
      <div className="w-full px-3 py-5 sm:px-5 sm:py-7 lg:px-7 lg:py-9">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-[1360px] items-center justify-center">
          <Card className="w-full max-w-[920px] border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[color:var(--md-sys-color-error-container)] text-[color:var(--md-sys-color-on-error-container)]">
                <MaterialSymbol icon={AlertCircleIcon} size={22} />
              </div>
              <h1 className="text-[24px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                Invalid material link
              </h1>
              <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                This route is missing a valid material id.
              </p>
              <div className="m3-action-row mt-5 justify-center">
                <Link href="/library">
                  <M3Button layout="mobile-full">Back to Library</M3Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-3 py-5 sm:px-5 sm:py-7 lg:px-7 lg:py-9">
      <div className="mx-auto w-full max-w-[1360px]">
      {status === "loading" && !material ? (
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <div className="size-12 animate-spin rounded-full border-4 border-[color:var(--md-sys-color-primary)] border-t-transparent" />
          <p className="animate-pulse text-sm font-semibold uppercase tracking-widest text-[color:var(--md-sys-color-on-surface-variant)]">
            Opening Archive...
          </p>
        </div>
      ) : material ? (
        <MaterialDetail material={material} />
      ) : (
        <div className="mx-auto flex min-h-[60vh] w-full max-w-[920px] items-center justify-center">
          <Card className="w-full border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)]">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)]">
                <MaterialSymbol icon={InformationCircleIcon} size={22} />
              </div>
              <h1 className="text-[24px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
                Material not found
              </h1>
              <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
                The resource may have been removed or is not part of your current catalog state.
              </p>
              <div className="m3-action-row mt-5 justify-center">
                <Link href="/library">
                  <M3Button layout="mobile-full">Back to Library</M3Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}

