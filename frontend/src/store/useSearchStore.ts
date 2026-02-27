import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MaterialType = 'pdf' | 'video' | 'past-question' | 'zip' | 'all';
export type SortOption = "newest" | "oldest" | "course_code" | "title";

export interface SearchFilters {
    courses: string[];      // ["CSC 201", "CSC 301"]
    semesters: number[];    // [1, 2] or [] for all
    materialTypes: MaterialType[];
    uploaders: string[]; // Filter by uploader names
    dateRange: { from?: Date; to?: Date }; // Filter by upload date range
    sortBy: SortOption; // Sort order for results
}

interface SearchState {
    query: string;
    filters: SearchFilters;

    // Actions
    setQuery: (query: string) => void;
    applyFilters: (filters: SearchFilters) => void;
    clearFilters: () => void;
    toggleCourse: (course: string) => void;
    toggleSemester: (semester: number) => void;
    toggleMaterialType: (type: MaterialType) => void;
    toggleUploader: (uploader: string) => void;
    setDateRange: (range: { from?: Date; to?: Date }) => void;
    setSortBy: (sortBy: SortOption) => void;
}

const defaultFilters: SearchFilters = {
    courses: [],
    semesters: [],
    materialTypes: [],
    uploaders: [],
    dateRange: {},
    sortBy: "newest",
};

export const useSearchStore = create<SearchState>()(
    persist(
        (set) => ({
            query: "",
            filters: defaultFilters,

            setQuery: (query) => set({ query }),

            applyFilters: (filters) => set({ filters }),

            clearFilters: () => set({ filters: defaultFilters }),

            toggleCourse: (course) =>
                set((state) => ({
                    filters: {
                        ...state.filters,
                        courses: state.filters.courses.includes(course)
                            ? state.filters.courses.filter((c) => c !== course)
                            : [...state.filters.courses, course],
                    },
                })),

            toggleSemester: (semester) =>
                set((state) => ({
                    filters: {
                        ...state.filters,
                        semesters: state.filters.semesters.includes(semester)
                            ? state.filters.semesters.filter((s) => s !== semester)
                            : [...state.filters.semesters, semester],
                    },
                })),

            toggleMaterialType: (type) =>
                set((state) => ({
                    filters: {
                        ...state.filters,
                        materialTypes: state.filters.materialTypes.includes(type)
                            ? state.filters.materialTypes.filter((t) => t !== type)
                            : [...state.filters.materialTypes, type],
                    },
                })),

            toggleUploader: (uploader) =>
                set((state) => ({
                    filters: {
                        ...state.filters,
                        uploaders: state.filters.uploaders.includes(uploader)
                            ? state.filters.uploaders.filter((u) => u !== uploader)
                            : [...state.filters.uploaders, uploader],
                    },
                })),

            setDateRange: (range) =>
                set((state) => ({
                    filters: {
                        ...state.filters,
                        dateRange: range,
                    },
                })),

            setSortBy: (sortBy) =>
                set((state) => ({
                    filters: {
                        ...state.filters,
                        sortBy,
                    },
                })),
        }),
        {
            name: "calabash-search",
            merge: (persistedState, currentState) => {
                const typedPersisted = persistedState as Partial<SearchState> | undefined;
                const persistedFilters = typedPersisted?.filters;

                return {
                    ...currentState,
                    ...typedPersisted,
                    filters: {
                        ...defaultFilters,
                        ...(persistedFilters ?? {}),
                        dateRange: {
                            ...defaultFilters.dateRange,
                            ...(persistedFilters?.dateRange ?? {}),
                        },
                    },
                } as SearchState;
            },
        }
    )
);
