import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/services/api';

interface UserState {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: UserProfile, token: string, refreshToken?: string | null) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, token, refreshToken = null) =>
        set({ user, token, refreshToken, isAuthenticated: true }),
      logout: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'calabash-user-storage',
    }
  )
);
