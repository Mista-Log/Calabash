import { create } from 'zustand';
<<<<<<< HEAD
import { Material, UserProfile } from '@/services/api';
=======
import { persist } from 'zustand/middleware';
import { Material } from '@/services/api';
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e

interface LibraryState {
  materials: Material[];
  filteredMaterials: Material[];
  searchQuery: string;
  selectedMaterial: Material | null;
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
