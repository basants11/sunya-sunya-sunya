/**
 * CSRF (Cross-Site Request Forgery) Protection
 *
 * This module provides CSRF protection for state-changing requests.
 * Uses the double-submit cookie pattern:
 * 1. Server sets a random token in a cookie (readable by JS)
 * 2. Client reads cookie and sends token in request header
 * 3. Server validates that header token matches cookie token
 *
 * FREE TIER: Built-in, no external dependencies
 *
 * Security:
 * - Tokens are cryptographically random (UUID v4)
 * - Tokens are short-lived (session duration)
 * - SameSite=strict cookies prevent cross-site attacks
 * - HttpOnly=false allows JS to read the cookie for header submission
 */

import { cookies } from "next/headers";
import { NextRequest } from "next/server";

/**
 * CSRF cookie name
 */
export const CSRF_TOKEN_COOKIE = "csrf_token";

/**
 * CSRF header name
 * Must match the header name used by the client
 */
export const CSRF_HEADER_NAME = "X-CSRF-Token";

/**
 * Generate a cryptographically secure random CSRF token
 * Uses crypto.randomUUID() for UUID v4 generation
 *
 * @returns Random UUID string to use as CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomUUID();
}

/**
 * Set CSRF token cookie
 * Called when user visits the site or logs in
 *
 * @returns The generated token (to be sent to client if needed)
 */
export async function setCSRFTokenCookie(): Promise<string> {
  const token = generateCSRFToken();
  const cookieStore = await cookies();

  cookieStore.set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: false, // Must be accessible by JavaScript to read and send in header
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    // No maxAge = session cookie (expires when browser closes)
    // Or set to 24 hours for persistent sessions
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  });

  return token;
}

/**
 * Get CSRF token from cookies
 *
 * @returns The CSRF token or null if not found
 */
export async function getCSRFTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CSRF_TOKEN_COOKIE);
  return token?.value ?? null;
}

/**
 * Get CSRF token from request headers
 *
 * @param request - Next.js request object
 * @returns The CSRF token from header or null if not found
 */
export function getCSRFTokenFromHeader(request: NextRequest): string | null {
  return request.headers.get(CSRF_HEADER_NAME);
}

/**
 * Validate CSRF token
 * Compares token from header with token from cookie
 *
 * @param request - Next.js request object
 * @returns True if tokens match, false otherwise
 */
export async function validateCSRFToken(
  request: NextRequest,
): Promise<boolean> {
  const cookieToken = await getCSRFTokenFromCookie();
  const headerToken = getCSRFTokenFromHeader(request);

  // Both tokens must exist and match
  if (!cookieToken || !headerToken) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  return timingSafeEqual(cookieToken, headerToken);
}

/**
 * Timing-safe string comparison
 * Prevents timing attacks by comparing all characters regardless of match
 *
 * @param a - First string
 * @param b - Second string
 * @returns True if strings are equal
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Clear CSRF token cookie
 * Called on logout
 */
export async function clearCSRFTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CSRF_TOKEN_COOKIE);
}

/**
 * CSRF protection middleware result
 */
export interface CSRFValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate CSRF token with detailed error message
 * Use this for better error reporting in API routes
 *
 * @param request - Next.js request object
 * @returns Validation result with error details
 */
export async function validateCSRFTokenWithError(
  request: NextRequest,
): Promise<CSRFValidationResult> {
  const cookieToken = await getCSRFTokenFromCookie();
  const headerToken = getCSRFTokenFromHeader(request);

  if (!cookieToken) {
    return {
      valid: false,
      error: "CSRF token cookie not found. Please refresh the page.",
    };
  }

  if (!headerToken) {
    return {
      valid: false,
      error: `CSRF token header (${CSRF_HEADER_NAME}) not found`,
    };
  }

  if (!timingSafeEqual(cookieToken, headerToken)) {
    return {
      valid: false,
      error: "CSRF token mismatch. Please refresh the page and try again.",
    };
  }

  return { valid: true };
}

/**
 * Check if request method requires CSRF protection
 * Only state-changing methods need CSRF protection
 *
 * @param method - HTTP method
 * @returns True if CSRF protection is required
 */
export function requiresCSRFProtection(method: string): boolean {
  const stateChangingMethods = ["POST", "PUT", "PATCH", "DELETE"];
  return stateChangingMethods.includes(method.toUpperCase());
}

/**
 * Refresh CSRF token
 * Generates a new token and updates the cookie
 * Use this after login or periodically for security
 *
 * @returns The new CSRF token
 */
export async function refreshCSRFToken(): Promise<string> {
  return setCSRFTokenCookie();
}

/**
 * CSRF token response for API routes
 * Can be used to send token to client on initial load
 */
export interface CSRFTokenResponse {
  token: string;
}

/**
 * Get or create CSRF token
 * Returns existing token if present, creates new one if not
 *
 * @returns The CSRF token
 */
export async function getOrCreateCSRFToken(): Promise<string> {
  const existingToken = await getCSRFTokenFromCookie();
  if (existingToken) {
    return existingToken;
  }
  return setCSRFTokenCookie();
}
