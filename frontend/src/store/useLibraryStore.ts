import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Material } from "@/services/api";

type LibraryStatus = "idle" | "loading" | "success" | "error";

interface LibraryMutationOptions {
  simulateFailure?: boolean;
}

interface SetMaterialsOptions {
  source?: "dashboard" | "catalog" | "manual";
}

interface LibraryState {
  materials: Material[];
  filteredMaterials: Material[];
  searchQuery: string;
  selectedMaterial: Material | null;
  status: LibraryStatus;
  error: string | null;
  catalogInitialized: boolean;
  setMaterials: (materials: Material[], options?: SetMaterialsOptions) => void;
  mergeMaterials: (materials: Material[]) => void;
  refreshMaterials: (materials?: Material[]) => void;
  createMaterial: (
    material: Material,
    options?: LibraryMutationOptions,
  ) => Promise<Material>;
  addMaterial: (
    material: Material,
    options?: LibraryMutationOptions,
  ) => Promise<Material>;
  updateMaterial: (
    id: string,
    updates: Partial<Material>,
    options?: LibraryMutationOptions,
  ) => Promise<void>;
  setVisibility: (
    id: string,
    visibility: "public" | "private",
    options?: LibraryMutationOptions,
  ) => Promise<void>;
  batchSetVisibility: (
    ids: string[],
    visibility: "public" | "private",
    options?: LibraryMutationOptions,
  ) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedMaterial: (material: Material | null) => void;
  getRecentMaterials: (limit?: number) => Material[];
}

function dateToTime(value?: string): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sortByNewest(materials: Material[]): Material[] {
  return [...materials].sort(
    (left, right) => dateToTime(right.uploadDate) - dateToTime(left.uploadDate),
  );
}

function filterMaterials(materials: Material[], query: string): Material[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return materials;
  }

  return materials.filter(
    (material) =>
      material.title.toLowerCase().includes(normalized) ||
      material.courseCode.toLowerCase().includes(normalized) ||
      material.uploader.toLowerCase().includes(normalized),
  );
}

function mergeMaterialLists(current: Material[], incoming: Material[]): Material[] {
  const map = new Map<string, Material>();

  for (const material of current) {
    map.set(material.id, material);
  }

  for (const material of incoming) {
    const existing = map.get(material.id);
    map.set(material.id, existing ? { ...existing, ...material } : material);
  }

  return sortByNewest(Array.from(map.values()));
}

function updateFiltered(
  materials: Material[],
  query: string,
): Pick<LibraryState, "materials" | "filteredMaterials"> {
  return {
    materials,
    filteredMaterials: filterMaterials(materials, query),
  };
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      materials: [],
      filteredMaterials: [],
      searchQuery: "",
      selectedMaterial: null,
      status: "idle",
      error: null,
      catalogInitialized: false,

      setMaterials: (materials, options) => {
        const sorted = sortByNewest(materials);
        set((state) => ({
          ...updateFiltered(sorted, state.searchQuery),
          status: "success",
          error: null,
          catalogInitialized:
            options?.source === "catalog" ? true : state.catalogInitialized,
        }));
      },

      mergeMaterials: (materials) => {
        set((state) => {
          const merged = mergeMaterialLists(state.materials, materials);
          return {
            ...updateFiltered(merged, state.searchQuery),
            status: "success",
            error: null,
          };
        });
      },

      refreshMaterials: (materials) => {
        set((state) => {
          const nextMaterials = materials
            ? sortByNewest(materials)
            : sortByNewest(state.materials);
          return {
            ...updateFiltered(nextMaterials, state.searchQuery),
            status: "success",
            error: null,
          };
        });
      },

      createMaterial: async (material, options) => {
        const previous = get();
        const createdMaterial: Material = {
          ...material,
          id: material.id || `mat-${Math.random().toString(36).slice(2, 10)}`,
          uploadDate: material.uploadDate || new Date().toISOString(),
          visibility: material.visibility || "public",
          lastEditedAt: new Date().toISOString(),
        };

        set((state) => {
          const merged = mergeMaterialLists([createdMaterial, ...state.materials], []);
          return {
            ...updateFiltered(merged, state.searchQuery),
            status: "loading",
            error: null,
          };
        });

        try {
          if (options?.simulateFailure) {
            throw new Error("Simulated create material failure");
          }
          await Promise.resolve();
          set({ status: "success", error: null });
          return createdMaterial;
        } catch (error) {
          set({
            ...updateFiltered(previous.materials, previous.searchQuery),
            status: "error",
            error:
              error instanceof Error
                ? error.message
                : "Failed to create material",
          });
          throw error;
        }
      },

      addMaterial: async (material, options) => {
        return get().createMaterial(material, options);
      },

      updateMaterial: async (id, updates, options) => {
        const previous = get();
        set((state) => {
          const next = state.materials.map((material) =>
            material.id === id
              ? { ...material, ...updates, lastEditedAt: new Date().toISOString() }
              : material,
          );
          return {
            ...updateFiltered(next, state.searchQuery),
            status: "loading",
            error: null,
          };
        });

        try {
          if (options?.simulateFailure) {
            throw new Error("Simulated update material failure");
          }
          await Promise.resolve();
          set({ status: "success", error: null });
        } catch (error) {
          set({
            ...updateFiltered(previous.materials, previous.searchQuery),
            status: "error",
            error:
              error instanceof Error
                ? error.message
                : "Failed to update material",
          });
          throw error;
        }
      },

      setVisibility: async (id, visibility, options) => {
        await get().updateMaterial(id, { visibility }, options);
      },

      batchSetVisibility: async (ids, visibility, options) => {
        if (ids.length === 0) return;

        const previous = get();
        set((state) => {
          const next = state.materials.map((material) =>
            ids.includes(material.id)
              ? {
                  ...material,
                  visibility,
                  lastEditedAt: new Date().toISOString(),
                }
              : material,
          );

          return {
            ...updateFiltered(next, state.searchQuery),
            status: "loading",
            error: null,
          };
        });

        try {
          if (options?.simulateFailure) {
            throw new Error("Simulated batch visibility failure");
          }
          await Promise.resolve();
          set({ status: "success", error: null });
        } catch (error) {
          set({
            ...updateFiltered(previous.materials, previous.searchQuery),
            status: "error",
            error:
              error instanceof Error
                ? error.message
                : "Failed to update material visibility",
          });
          throw error;
        }
      },

      setSearchQuery: (query) =>
        set((state) => ({
          searchQuery: query,
          filteredMaterials: filterMaterials(state.materials, query),
        })),

      setSelectedMaterial: (material) => set({ selectedMaterial: material }),

      getRecentMaterials: (limit = 5) => {
        return sortByNewest(get().materials).slice(0, limit);
      },
    }),
    {
      name: "calabash-library-storage",
    },
  ),
);
