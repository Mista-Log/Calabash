import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MaterialType = 'pdf' | 'video' | 'past-question' | 'zip' | 'all';

export interface FilterOptions {
    courses: string[];      // ["CSC 201", "CSC 301"]
    semesters: number[];    // [1, 2] or [] for all
    materialTypes: MaterialType[];
}

interface SearchState {
    query: string;
    filters: FilterOptions;

    // Actions
    setQuery: (query: string) => void;
    applyFilters: (filters: FilterOptions) => void;
    clearFilters: () => void;
    toggleCourse: (course: string) => void;
    toggleSemester: (semester: number) => void;
    toggleMaterialType: (type: MaterialType) => void;
}

const defaultFilters: FilterOptions = {
    courses: [],
    semesters: [],
    materialTypes: [],
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
        }),
        {
            name: "calabash-search",
        }
    )
);
