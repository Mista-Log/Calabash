import type { UserProfile } from "./api";
import axios from "axios";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "./config";

export type BackendRole = "student" | "lecturer" | "admin";

export interface LoginResponse {
  email?: string;
  user?: {
    id?: number | string;
    email?: string;
    role?: BackendRole | string;
  };
  access?: string;
  refresh?: string;
  token?: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  new_password: string;
}

export interface PasswordResetConfirmResponse {
  message: string;
}

export interface SignupRequest {
  email: string;
  full_name: string;
  password: string;
  role: "student" | "lecturer";
}

export interface SignupResponse {
  email?: string;
  full_name?: string;
  role?: BackendRole | string;
  user?: {
    id?: number | string;
    email?: string;
    role?: BackendRole | string;
  };
  access?: string;
  refresh?: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserMeResponse {
  id: number | string;
  email: string;
  full_name: string;
  role: BackendRole | string;
  is_active?: boolean;
  date_joined?: string;
  profile?: unknown;
}

export interface ResolvedAuthSession {
  user: UserProfile | null;
  backendRole: BackendRole;
  accessToken: string;
  refreshToken: string | null;
  me: UserMeResponse;
}

const AUTH_ERROR_KEYS = [
  "detail",
  "message",
  "non_field_errors",
  "email",
  "password",
  "full_name",
  "role",
] as const;

function firstString(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }
  if (Array.isArray(value)) {
    const first = value.find(
      (entry): entry is string =>
        typeof entry === "string" && entry.trim().length > 0,
    );
    return first ?? null;
  }
  return null;
}

function parseBackendRole(value: unknown): BackendRole | null {
  if (value === "student" || value === "lecturer" || value === "admin") {
    return value;
  }
  return null;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function trimmedEmail(email: string): string {
  return email.trim();
}

function isInvalidCredentialsError(error: unknown): boolean {
  if (!axios.isAxiosError(error) || !error.response) {
    return false;
  }

  if (error.response.status !== 400 && error.response.status !== 401) {
    return false;
  }

  const payload = error.response.data as Record<string, unknown> | undefined;
  const nonFieldError = firstString(payload?.non_field_errors);
  const detail = firstString(payload?.detail);
  const message = (nonFieldError ?? detail ?? "").toLowerCase();

  return message.includes("invalid credential");
}

function mapToUserProfile(me: UserMeResponse, role: "student" | "lecturer" | "admin"): UserProfile {
  // Admin users default to lecturer role for UI purposes
  const uiRole = role === "admin" ? "lecturer" : role;
  return {
    id: String(me.id),
    name: me.full_name || me.email,
    email: me.email,
    role: uiRole,
    department: "Academic Department",
    semester: uiRole === "student" ? 1 : undefined,
    isNewUser: false,
  };
}

export function extractAuthErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  if (!error.response) {
    return "Unable to connect to the server. Check your network and session settings.";
  }

  const { status, data } = error.response;

  if (typeof data === "string" && data.trim().length > 0) {
    return data;
  }

  if (data && typeof data === "object") {
    const payload = data as Record<string, unknown>;
    for (const key of AUTH_ERROR_KEYS) {
      const parsed = firstString(payload[key]);
      if (parsed) {
        return parsed;
      }
    }
  }

  if (status === 401) {
    return "Invalid email or password.";
  }
  if (status === 403) {
    return "This account does not have permission to access this portal.";
  }
  if (status >= 500) {
    return "Server error. Please try again shortly.";
  }

  return fallback;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const normalized = normalizeEmail(credentials.email);
    const raw = trimmedEmail(credentials.email);

    try {
      const response = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
        email: normalized,
        password: credentials.password,
      });
      return response.data;
    } catch (error) {
      // Backward compatibility for legacy mixed-case emails created before normalization.
      if (
        raw &&
        raw !== normalized &&
        isInvalidCredentialsError(error)
      ) {
        const retryResponse = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
          email: raw,
          password: credentials.password,
        });
        return retryResponse.data;
      }
      throw error;
    }
  },

  async signup(details: SignupRequest): Promise<SignupResponse> {
    const response = await api.post<SignupResponse>(API_ENDPOINTS.AUTH.SIGNUP, {
      email: normalizeEmail(details.email),
      full_name: details.full_name,
      password: details.password,
      role: details.role,
    });
    return response.data;
  },

  async getCurrentUser(accessToken?: string): Promise<UserMeResponse> {
    const response = await api.get<UserMeResponse>(API_ENDPOINTS.AUTH.ME, {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    });
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refresh: refreshToken }
    );
    return response.data;
  },

  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    const response = await api.post<PasswordResetResponse>(
      API_ENDPOINTS.AUTH.PASSWORD_RESET,
      { email: normalizeEmail(email) }
    );
    return response.data;
  },

  async confirmPasswordReset(
    token: string,
    newPassword: string
  ): Promise<PasswordResetConfirmResponse> {
    const response = await api.post<PasswordResetConfirmResponse>(
      API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM,
      { token, new_password: newPassword }
    );
    return response.data;
  },

  async loginAndResolveUser(
    credentials: LoginCredentials,
    expectedRole?: "student" | "lecturer",
  ): Promise<ResolvedAuthSession> {
    const loginResponse = await this.login(credentials);
    const accessToken = loginResponse.access ?? loginResponse.token ?? "";
    const refreshToken = loginResponse.refresh ?? null;

    if (!accessToken) {
      throw new Error("Unable to complete sign-in. Access token is missing.");
    }

    const me = await this.getCurrentUser(accessToken || undefined);
    const backendRole = parseBackendRole(me.role);

    if (!backendRole) {
      throw new Error("Unable to determine account role from profile.");
    }

    // Check role mismatch only for non-admin users
    if (expectedRole && backendRole !== "admin" && backendRole !== expectedRole) {
      throw new Error(
        "This account is not permitted on the selected sign-in portal.",
      );
    }

    const user = mapToUserProfile(me, backendRole);

    return {
      user,
      backendRole,
      accessToken,
      refreshToken,
      me,
    };
  },
};
