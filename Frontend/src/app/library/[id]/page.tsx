"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { MaterialDetail } from "@/components/features/library/MaterialDetail";
import { CalabashApiService, Material } from "@/services/api";

export default function MaterialPage() {
  const params = useParams();
  const router = useRouter();
  const [material, setMaterial] = React.useState<Material | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchMaterial() {
      try {
        const data = await CalabashApiService.getDashboardData();
        // Since it's a mock API, we search for the material in the recent materials list
        const found =
          data.recentMaterials.find((m) => m.id === params.id) ||
          // Fallback for mock items
          (params.id?.toString().startsWith("mocked")
            ? data.recentMaterials[0]
            : null);

        if (found) {
          setMaterial({
            ...found,
            id: params.id as string,
            title: params.id?.toString().includes("mocked")
              ? `${found.title} (Verified)`
              : found.title,
          });
        }
      } catch (err) {
        console.error("Failed to fetch material:", err);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchMaterial();
    }
  }, [params.id]);

  return (
    <MainLayout>
      {loading ? (
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-widest">
            Opening Archive...
          </p>
        </div>
      ) : material ? (
        <MaterialDetail material={material} />
      ) : (
        <div className="flex h-[60vh] flex-col items-center justify-center text-center px-4">
          <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6 font-black text-2xl">
            !
          </div>
          <h1 className="text-2xl font-bold">Material Not Found</h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            The resource you are looking for might have been moved or deleted.
          </p>
          <button
            onClick={() => router.push("/library")}
            className="mt-8 text-primary font-bold hover:underline"
          >
            Back to Library
          </button>
        </div>
      )}
    </MainLayout>
  );
}
