import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  // Display preferences
  reducedMotion: boolean;
  theme: 'light' | 'dark' | 'system';

  // Notification preferences
  emailNotifications: boolean;
  pushNotifications: boolean;

  // Privacy preferences
  profileVisibility: 'public' | 'private';

  // Actions
  setReducedMotion: (value: boolean) => void;
  toggleReducedMotion: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setEmailNotifications: (enabled: boolean) => void;
  setPushNotifications: (enabled: boolean) => void;
  setProfileVisibility: (visibility: 'public' | 'private') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default values
      reducedMotion: false,
      theme: 'system',
      emailNotifications: true,
      pushNotifications: false,
      profileVisibility: 'public',

      // Actions
      setReducedMotion: (value) => set({ reducedMotion: value }),
      toggleReducedMotion: () =>
        set((state) => ({ reducedMotion: !state.reducedMotion })),
      setTheme: (theme) => set({ theme }),
      setEmailNotifications: (enabled) => set({ emailNotifications: enabled }),
      setPushNotifications: (enabled) => set({ pushNotifications: enabled }),
      setProfileVisibility: (visibility) => set({ profileVisibility: visibility }),
    }),
    {
      name: "calabash-settings",
    }
  )
);
