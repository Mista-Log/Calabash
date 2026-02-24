<<<<<<< HEAD
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

// Queue for serializing async mutations to prevent race conditions
const libraryMutationQueue: Array<() => Promise<unknown>> = [];
let isProcessingLibraryMutation = false;

async function processLibraryMutationQueue(): Promise<void> {
  if (isProcessingLibraryMutation || libraryMutationQueue.length === 0) {
    return;
  }

  isProcessingLibraryMutation = true;
  while (libraryMutationQueue.length > 0) {
    const mutation = libraryMutationQueue.shift();
    if (mutation) {
      try {
        await mutation();
      } catch {
        // Error handled by individual mutation
      }
    }
  }
  isProcessingLibraryMutation = false;
}
=======
import { create } from 'zustand';
<<<<<<< HEAD
import { Material, UserProfile } from '@/services/api';
=======
import { persist } from 'zustand/middleware';
import { Material } from '@/services/api';
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
>>>>>>> origin/main

interface LibraryState {
  materials: Material[];
  filteredMaterials: Material[];
  searchQuery: string;
  selectedMaterial: Material | null;
<<<<<<< HEAD
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

function mergeMaterialLists(
  current: Material[],
  incoming: Material[],
): Material[] {
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
          const merged = mergeMaterialLists(
            [createdMaterial, ...state.materials],
            [],
          );
          return {
            ...updateFiltered(merged, state.searchQuery),
            status: "loading",
            error: null,
          };
        });

        const mutationPromise = new Promise<Material>((resolve, reject) => {
          const doMutation = async () => {
            try {
              if (options?.simulateFailure) {
                throw new Error("Simulated create material failure");
              }
              await Promise.resolve();
              set({ status: "success", error: null });
              resolve(createdMaterial);
            } catch (error) {
              set({
                ...updateFiltered(previous.materials, previous.searchQuery),
                status: "error",
                error:
                  error instanceof Error
                    ? error.message
                    : "Failed to create material",
              });
              reject(error);
            }
          };
          doMutation();
        });

        libraryMutationQueue.push(() => mutationPromise);
        processLibraryMutationQueue();

        return mutationPromise;
      },

      addMaterial: async (material, options) => {
        return get().createMaterial(material, options);
      },

      updateMaterial: async (id, updates, options) => {
        const previous = get();
        set((state) => {
          const next = state.materials.map((material) =>
            material.id === id
              ? {
                  ...material,
                  ...updates,
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

        const mutationPromise = new Promise<void>((resolve, reject) => {
          const doMutation = async () => {
            try {
              if (options?.simulateFailure) {
                throw new Error("Simulated update material failure");
              }
              await Promise.resolve();
              set({ status: "success", error: null });
              resolve();
            } catch (error) {
              set({
                ...updateFiltered(previous.materials, previous.searchQuery),
                status: "error",
                error:
                  error instanceof Error
                    ? error.message
                    : "Failed to update material",
              });
              reject(error);
            }
          };
          doMutation();
        });

        libraryMutationQueue.push(() => mutationPromise);
        processLibraryMutationQueue();

        return mutationPromise;
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
=======
  setMaterials: (materials: Material[]) => void;
<<<<<<< HEAD
=======
  addMaterial: (material: Material) => void;
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
  setSearchQuery: (query: string) => void;
  setSelectedMaterial: (material: Material | null) => void;
}

<<<<<<< HEAD
export const useLibraryStore = create<LibraryState>((set) => ({
  materials: [],
  filteredMaterials: [],
  searchQuery: '',
  selectedMaterial: null,
  setMaterials: (materials) => set({ 
    materials, 
    filteredMaterials: materials 
  }),
  setSearchQuery: (query) => set((state) => ({
    searchQuery: query,
    filteredMaterials: state.materials.filter(m => 
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.courseCode.toLowerCase().includes(query.toLowerCase())
    )
  })),
  setSelectedMaterial: (material) => set({ selectedMaterial: material }),
}));

interface AuthState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
=======
export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      materials: [],
      filteredMaterials: [],
      searchQuery: '',
      selectedMaterial: null,
      setMaterials: (materials) => set({ 
        materials, 
        filteredMaterials: materials 
      }),
      addMaterial: (material) => set((state) => ({
        materials: [material, ...state.materials],
        filteredMaterials: [material, ...state.filteredMaterials] // Simple update, assumes no active filter
      })),
      setSearchQuery: (query) => set((state) => ({
        searchQuery: query,
        filteredMaterials: state.materials.filter(m => 
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.courseCode.toLowerCase().includes(query.toLowerCase())
        )
      })),
      setSelectedMaterial: (material) => set({ selectedMaterial: material }),
    }),
    {
      name: 'calabash-library-storage',
    }
  )
);
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
>>>>>>> origin/main
