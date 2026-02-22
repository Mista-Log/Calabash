import axios from "axios";
import type { UserProfile } from "./api";
import { API_BASE_URL, API_ENDPOINTS } from "./config";

export type BackendRole = "student" | "lecturer" | "admin";

export interface LoginResponse {
  email?: string;
  access?: string;
  refresh?: string;
  token?: string;
}

export interface SignupRequest {
  email: string;
  full_name: string;
  password: string;
  role: "student" | "lecturer";
}

export interface SignupResponse {
  email: string;
  full_name: string;
  role: BackendRole;
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

const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

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

function mapToUserProfile(me: UserMeResponse, role: "student" | "lecturer"): UserProfile {
  return {
    id: String(me.id),
    name: me.full_name || me.email,
    email: me.email,
    role,
    department: "Academic Department",
    semester: role === "student" ? 1 : undefined,
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
    const response = await authApi.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  },

  async signup(details: SignupRequest): Promise<SignupResponse> {
    const response = await authApi.post<SignupResponse>(API_ENDPOINTS.AUTH.SIGNUP, {
      email: details.email,
      full_name: details.full_name,
      password: details.password,
      role: details.role,
    });
    return response.data;
  },

  async getCurrentUser(accessToken?: string): Promise<UserMeResponse> {
    const response = await authApi.get<UserMeResponse>(API_ENDPOINTS.AUTH.ME, {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    });
    return response.data;
  },

  async loginAndResolveUser(
    credentials: LoginCredentials,
  ): Promise<ResolvedAuthSession> {
    const loginResponse = await this.login(credentials);
    const accessToken = loginResponse.access ?? loginResponse.token ?? "";
    const refreshToken = loginResponse.refresh ?? null;
    const me = await this.getCurrentUser(accessToken || undefined);
    const backendRole = parseBackendRole(me.role);

    if (!backendRole) {
      throw new Error("Unable to determine account role from profile.");
    }

    const user =
      backendRole === "admin"
        ? null
        : mapToUserProfile(me, backendRole);

    return {
      user,
      backendRole,
      accessToken,
      refreshToken,
      me,
    };
  },
};
