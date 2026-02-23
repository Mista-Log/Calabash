import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/services/api';

interface UserState {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  rememberMe: boolean;
  login: (user: UserProfile, token: string, refreshToken?: string | null, rememberMe?: boolean) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  setHasHydrated: (value: boolean) => void;
}

const TOKEN_EXPIRY = {
  NORMAL: 24 * 60 * 60 * 1000, // 24 hours
  EXTENDED: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const AUTH_STATE_COOKIE = "calabash-auth-state";

function cookieSecureSuffix(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.protocol === "https:" ? "; Secure" : "";
}

function setAuthStateCookie(user: UserProfile, maxAgeSeconds: number): void {
  if (typeof document === "undefined") {
    return;
  }

  const payload = encodeURIComponent(
    JSON.stringify({ id: String(user.id), role: user.role }),
  );
  document.cookie = `${AUTH_STATE_COOKIE}=${payload}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${cookieSecureSuffix()}`;
}

function clearAuthStateCookie(): void {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${AUTH_STATE_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${cookieSecureSuffix()}`;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      hasHydrated: false,
      rememberMe: false,
      login: (user, token, refreshToken = null, rememberMe = false) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          rememberMe
        });

        // Set expiry based on remember me preference
        const expiry = rememberMe ? TOKEN_EXPIRY.EXTENDED : TOKEN_EXPIRY.NORMAL;
        const expiryDate = new Date(Date.now() + expiry);
        const maxAgeSeconds = Math.floor(expiry / 1000);
        const secureSuffix = cookieSecureSuffix();
        if (typeof document !== "undefined") {
          document.cookie = `session-expires=${expiryDate.toISOString()}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secureSuffix}`;
          setAuthStateCookie(user, maxAgeSeconds);
        }
      },
      logout: () => {
        // Clear session expiry cookie
        const secureSuffix = cookieSecureSuffix();
        if (typeof document !== "undefined") {
          document.cookie = `session-expires=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secureSuffix}`;
          clearAuthStateCookie();
        }
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, rememberMe: false });
      },
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'calabash-user-storage',
      onRehydrateStorage: () => (state, error) => {
        // Handle rehydration errors
        if (error || !state) {
          return;
        }

        state.setHasHydrated(true);

        // Check if session has expired on rehydration (browser only)
        if (typeof document !== "undefined" && state.isAuthenticated) {
          try {
            const cookies = document.cookie.split(';');
            const expiryCookie = cookies.find(c => c.trim().startsWith('session-expires='));
            if (expiryCookie) {
              const expiryDate = new Date(expiryCookie.split('=')[1]);
              if (new Date() > expiryDate) {
                // Session expired, logout
                state.logout();
              }
            }
          } catch {
            // Cookie parsing failed, continue with current state
          }
        }
      },
    }
  )
);
