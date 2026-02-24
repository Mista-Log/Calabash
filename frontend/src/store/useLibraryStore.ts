import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Material } from '@/services/api';

interface LibraryState {
  materials: Material[];
  filteredMaterials: Material[];
  searchQuery: string;
  selectedMaterial: Material | null;
  setMaterials: (materials: Material[]) => void;
  addMaterial: (material: Material) => void;
  setSearchQuery: (query: string) => void;
  setSelectedMaterial: (material: Material | null) => void;
}

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
