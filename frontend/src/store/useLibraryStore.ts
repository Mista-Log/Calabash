import { create } from 'zustand';
import { Material, UserProfile } from '@/services/api';

interface LibraryState {
  materials: Material[];
  filteredMaterials: Material[];
  searchQuery: string;
  selectedMaterial: Material | null;
  setMaterials: (materials: Material[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedMaterial: (material: Material | null) => void;
}

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
