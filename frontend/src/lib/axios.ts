import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/services/config";
import { useUserStore } from "@/store/useUserStore";

const CSRF_COOKIE_NAME = "csrftoken";
const CSRF_HEADER_NAME = "X-CSRFToken";

function getCsrfToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieParts = decodedCookie.split(";");
  for (const part of cookieParts) {
    const [rawName, rawValue] = part.split("=") as [string, string | undefined];
    const cookieName = rawName?.trim();
    const cookieValue = rawValue?.trim();
    if (cookieName === CSRF_COOKIE_NAME && cookieValue) {
      return cookieValue;
    }
  }
  return null;
}

function isSafeMethod(method?: string): boolean {
  if (!method) return true;
  const safeMethods = ["GET", "HEAD", "OPTIONS", "TRACE"];
  return safeMethods.includes(method.toUpperCase());
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

function hasAuthorizationHeader(config: InternalAxiosRequestConfig): boolean {
  const headers = config.headers;
  if (!headers) {
    return false;
  }

  if (headers instanceof AxiosHeaders) {
    return Boolean(headers.get("Authorization") || headers.get("authorization"));
  }

  const record = headers as Record<string, unknown>;
  return Boolean(record.Authorization || record.authorization);
}

function isAuthRequest(url?: string): boolean {
  return typeof url === "string" && url.includes("/api/auth/");
}

function isMeRequest(url?: string): boolean {
  return typeof url === "string" && url.includes("/api/auth/me/");
}

// Request Interceptor: attach JWT token and CSRF token when needed
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = useUserStore.getState();
    const token = state.token;
    
    // Attach JWT token only for non-auth requests, or for /auth/me/.
    // This avoids sending stale/invalid tokens to login/signup endpoints.
    const shouldAttachAuth =
      !isAuthRequest(config.url) || isMeRequest(config.url);
    if (token && shouldAttachAuth && !hasAuthorizationHeader(config)) {
      const nextHeaders = AxiosHeaders.from(config.headers);
      nextHeaders.set("Authorization", `Bearer ${token}`);
      config.headers = nextHeaders;
    }

    // Attach CSRF token for non-safe methods
    if (!isSafeMethod(config.method)) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        const nextHeaders = AxiosHeaders.from(config.headers);
        nextHeaders.set(CSRF_HEADER_NAME, csrfToken);
        config.headers = nextHeaders;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle unauthorized app requests and force clean re-auth.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest(originalRequest.url)
    ) {
      originalRequest._retry = true;
      useUserStore.getState().logout();

      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.assign("/auth");
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
