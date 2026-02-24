import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
<<<<<<< HEAD
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  toggleReducedMotion: () => void;
=======
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
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
<<<<<<< HEAD
      reducedMotion: false,
      setReducedMotion: (value) => set({ reducedMotion: value }),
      toggleReducedMotion: () =>
        set((state) => ({ reducedMotion: !state.reducedMotion })),
=======
      // Default values
      reducedMotion: false,
      theme: 'light',
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
>>>>>>> 4e84afb555dea8266411ce233f4e83fd5a07858e
    }),
    {
      name: "calabash-settings",
    }
  )
);
