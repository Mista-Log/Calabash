import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  toggleReducedMotion: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      reducedMotion: false,
      setReducedMotion: (value) => set({ reducedMotion: value }),
      toggleReducedMotion: () =>
        set((state) => ({ reducedMotion: !state.reducedMotion })),
    }),
    {
      name: "calabash-settings",
    }
  )
);
