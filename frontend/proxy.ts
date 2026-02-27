import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTE_PATTERNS = [
  /^\/dashboard/,
  /^\/courses/,
  /^\/library/,
  /^\/settings/,
  /^\/onboarding/,
];

const AUTH_ROUTE_PATTERNS = [/^\/auth/, /^\/login/, /^\/signup/];
const AUTH_STATE_COOKIE = "calabash-auth-state";
const SESSION_EXPIRY_COOKIE = "session-expires";

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}

type AuthCookieState = {
  id?: string;
  role?: string;
};

function getAuthStateFromCookie(cookieValue: string | undefined): AuthCookieState | null {
  if (!cookieValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue)) as AuthCookieState;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function hasUnexpiredSession(sessionExpiry: string | undefined): boolean {
  if (!sessionExpiry) {
    return false;
  }

  const expiresAt = new Date(sessionExpiry).getTime();
  if (Number.isNaN(expiresAt)) {
    return false;
  }

  return expiresAt > Date.now();
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authCookie = request.cookies.get(AUTH_STATE_COOKIE)?.value;
  const sessionExpiry = request.cookies.get(SESSION_EXPIRY_COOKIE)?.value;
  const authState = getAuthStateFromCookie(authCookie);
  const isAuthenticated = Boolean(authState?.id) && hasUnexpiredSession(sessionExpiry);
  const userRole = authState?.role;

  // Protect app routes
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      const authUrl = new URL("/auth", request.url);
      authUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(authUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(pathname) && isAuthenticated) {
    // If coming from role-specific auth page, verify role matches
    if (pathname.includes("/student") && userRole !== "student") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (pathname.includes("/lecturer") && userRole !== "lecturer") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Otherwise redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (robots.txt, sitemap.xml, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
