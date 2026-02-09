/**
 * Next.js Middleware
 * Handles authentication, authorization, and route protection
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Paths that require authentication
const PROTECTED_PATHS = [
  "/account",
  "/orders",
  "/wishlist",
  "/checkout",
  "/subscription/manage",
];

// Paths that are only accessible to non-authenticated users
const AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// API paths that don't require auth
const PUBLIC_API_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/google",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/verify-email",
  "/api/auth/resend-verification",
  "/api/auth/refresh",
  "/api/auth/me",
  "/api/auth/logout",
];

// Static paths that should be ignored
const STATIC_PATHS = [
  "/_next",
  "/static",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

/**
 * Check if path is protected
 */
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

/**
 * Check if path is an auth path (login/register pages)
 */
function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((path) => pathname.startsWith(path));
}

/**
 * Check if path is a public API path
 */
function isPublicApiPath(pathname: string): boolean {
  return PUBLIC_API_PATHS.some((path) => pathname.startsWith(path));
}

/**
 * Check if path is static
 */
function isStaticPath(pathname: string): boolean {
  return STATIC_PATHS.some((path) => pathname.startsWith(path));
}

/**
 * Check if user is authenticated via cookies
 */
function isAuthenticated(request: NextRequest): boolean {
  // Check for access token cookie
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  return !!(accessToken || refreshToken);
}

/**
 * Middleware function
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files
  if (isStaticPath(pathname)) {
    return NextResponse.next();
  }

  // Skip public API routes
  if (isPublicApiPath(pathname)) {
    return NextResponse.next();
  }

  // Check authentication status
  const authenticated = isAuthenticated(request);

  // Handle protected routes
  if (isProtectedPath(pathname)) {
    if (!authenticated) {
      // Redirect to home with login modal
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("login", "true");
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Handle auth routes (redirect authenticated users away from login/register)
  if (isAuthPath(pathname)) {
    if (authenticated) {
      // Redirect to account page
      const url = request.nextUrl.clone();
      url.pathname = "/account";
      return NextResponse.redirect(url);
    }
  }

  // Add security headers
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // XSS Protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

/**
 * Config for matching paths
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
