import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OnboardingRole = "student" | "lecturer";
export type OnboardingAnswers = Record<string, string | string[]>;

interface OnboardingRoleState {
  completed: boolean;
  startedAt: string | null;
  completedAt: string | null;
  answers: OnboardingAnswers;
}

interface OnboardingState {
  student: OnboardingRoleState;
  lecturer: OnboardingRoleState;
  startRoleOnboarding: (role: OnboardingRole) => void;
  upsertRoleAnswers: (
    role: OnboardingRole,
    answers: OnboardingAnswers,
  ) => void;
  completeRoleOnboarding: (
    role: OnboardingRole,
    answers: OnboardingAnswers,
  ) => void;
  resetRoleOnboarding: (role: OnboardingRole) => void;
}

function createInitialRoleState(): OnboardingRoleState {
  return {
    completed: false,
    startedAt: null,
    completedAt: null,
    answers: {},
  };
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      student: createInitialRoleState(),
      lecturer: createInitialRoleState(),
      startRoleOnboarding: (role) =>
        set((state) => ({
          ...state,
          [role]: {
            completed: false,
            startedAt: new Date().toISOString(),
            completedAt: null,
            answers: {},
          },
        })),
      upsertRoleAnswers: (role, answers) =>
        set((state) => ({
          ...state,
          [role]: {
            ...state[role],
            answers: {
              ...state[role].answers,
              ...answers,
            },
          },
        })),
      completeRoleOnboarding: (role, answers) =>
        set((state) => ({
          ...state,
          [role]: {
            ...state[role],
            completed: true,
            completedAt: new Date().toISOString(),
            answers: {
              ...state[role].answers,
              ...answers,
            },
          },
        })),
      resetRoleOnboarding: (role) =>
        set((state) => ({
          ...state,
          [role]: createInitialRoleState(),
        })),
    }),
    {
      name: "calabash-onboarding-storage",
    },
  ),
);

