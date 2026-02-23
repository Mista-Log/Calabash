import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  // Display preferences
  reducedMotion: boolean;
  theme: 'light' | 'dark' | 'system';
  themePreferenceSet: boolean;

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
      theme: 'light',
      themePreferenceSet: false,
      emailNotifications: true,
      pushNotifications: false,
      profileVisibility: 'public',

      // Actions
      setReducedMotion: (value) => set({ reducedMotion: value }),
      toggleReducedMotion: () =>
        set((state) => ({ reducedMotion: !state.reducedMotion })),
      setTheme: (theme) => set({ theme, themePreferenceSet: true }),
      setEmailNotifications: (enabled) => set({ emailNotifications: enabled }),
      setPushNotifications: (enabled) => set({ pushNotifications: enabled }),
      setProfileVisibility: (visibility) => set({ profileVisibility: visibility }),
    }),
    {
      name: "calabash-settings",
      version: 2,
      migrate: (persistedState) => {
        const state = (persistedState ?? {}) as Partial<SettingsState>;
        const hadExplicitPreference = state.themePreferenceSet ?? false;
        const persistedTheme = state.theme;

        const normalizedTheme =
          persistedTheme === "system" && !hadExplicitPreference
            ? "light"
            : persistedTheme ?? "light";

        return {
          ...state,
          theme: normalizedTheme,
          themePreferenceSet:
            state.themePreferenceSet ??
            (normalizedTheme === "dark" || normalizedTheme === "system"),
        } as SettingsState;
      },
    }
  )
);
