/**
 * Rate Limiting Utilities
 *
 * This module provides rate limiting functionality using MongoDB.
 * Tracks login attempts and blocks IPs/emails after too many failures.
 *
 * FREE TIER: Uses existing MongoDB connection, no external services
 *
 * Configuration:
 * - Max attempts: 5 per 15 minutes
 * - Block duration: 30 minutes after exceeding limit
 * - Auto-cleanup: Records deleted after 1 hour of inactivity
 *
 * Security:
 * - Prevents brute force attacks
 * - Tracks by both email and IP address
 * - Progressive lockout (increases with repeated violations)
 */

import { LoginAttempt, RATE_LIMIT_CONFIG } from "@/lib/models/login-attempt";

// Re-export configuration for convenience
export { RATE_LIMIT_CONFIG };

/**
 * Rate limit check result
 */
export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  lockoutMinutes?: number;
  totalAttempts?: number;
}

/**
 * Check rate limit for an identifier (email or IP)
 * Does not record the attempt, just checks current status
 *
 * @param identifier - Email address or IP address
 * @returns Rate limit status
 *
 * @example
 * const result = await checkRateLimit("user@example.com");
 * if (!result.allowed) {
 *   return Response.json({ error: `Locked for ${result.lockoutMinutes} minutes` }, { status: 429 });
 * }
 */
export async function checkRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LoginAttempt as any).checkRateLimit(identifier);
}

/**
 * Record a failed login attempt
 * Increments counter and blocks if limit exceeded
 *
 * @param identifier - Email address or IP address
 * @returns Updated rate limit status
 *
 * @example
 * const result = await recordFailedAttempt("user@example.com");
 * if (!result.allowed) {
 *   return Response.json({ error: "Too many attempts" }, { status: 429 });
 * }
 */
export async function recordFailedAttempt(
  identifier: string,
): Promise<RateLimitResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LoginAttempt as any).recordAttempt(identifier);
}

/**
 * Reset rate limit for an identifier
 * Called on successful login to clear failed attempts
 *
 * @param identifier - Email address or IP address
 *
 * @example
 * await resetRateLimit("user@example.com");
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LoginAttempt as any).resetAttempts(identifier);
}

/**
 * Get current attempt count for an identifier
 *
 * @param identifier - Email address or IP address
 * @returns Number of attempts in current window
 */
export async function getAttemptCount(identifier: string): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LoginAttempt as any).getAttemptCount(identifier);
}

/**
 * Check rate limit for both email and IP
 * Combines checks for comprehensive protection
 *
 * @param email - User's email address
 * @param ip - Client IP address
 * @returns Combined rate limit status
 *
 * @example
 * const result = await checkCombinedRateLimit("user@example.com", "192.168.1.1");
 * if (!result.allowed) {
 *   return Response.json({ error: result.reason }, { status: 429 });
 * }
 */
export async function checkCombinedRateLimit(
  email: string,
  ip: string,
): Promise<{
  allowed: boolean;
  reason?: string;
  lockoutMinutes?: number;
  emailStatus: RateLimitResult;
  ipStatus: RateLimitResult;
}> {
  const [emailStatus, ipStatus] = await Promise.all([
    checkRateLimit(email),
    checkRateLimit(ip),
  ]);

  // Check if either is blocked
  if (!emailStatus.allowed) {
    return {
      allowed: false,
      reason: "Account temporarily locked due to too many failed attempts",
      lockoutMinutes: emailStatus.lockoutMinutes,
      emailStatus,
      ipStatus,
    };
  }

  if (!ipStatus.allowed) {
    return {
      allowed: false,
      reason: "IP address temporarily blocked due to too many failed attempts",
      lockoutMinutes: ipStatus.lockoutMinutes,
      emailStatus,
      ipStatus,
    };
  }

  return {
    allowed: true,
    emailStatus,
    ipStatus,
  };
}

/**
 * Record failed attempt for both email and IP
 *
 * @param email - User's email address
 * @param ip - Client IP address
 * @returns Updated rate limit status for both identifiers
 */
export async function recordCombinedFailedAttempt(
  email: string,
  ip: string,
): Promise<{
  emailStatus: RateLimitResult;
  ipStatus: RateLimitResult;
}> {
  const [emailStatus, ipStatus] = await Promise.all([
    recordFailedAttempt(email),
    recordFailedAttempt(ip),
  ]);

  return { emailStatus, ipStatus };
}

/**
 * Reset rate limit for both email and IP
 * Called on successful login
 *
 * @param email - User's email address
 * @param ip - Client IP address
 */
export async function resetCombinedRateLimit(
  email: string,
  ip: string,
): Promise<void> {
  await Promise.all([resetRateLimit(email), resetRateLimit(ip)]);
}

/**
 * Get client IP address from request
 * Handles various proxy headers and falls back to connection IP
 *
 * @param request - Next.js request object or Headers
 * @returns IP address string
 */
export function getClientIP(request: Request | Headers): string {
  let headers: Headers;

  if (request instanceof Request) {
    headers = request.headers;
  } else {
    headers = request;
  }

  // Check various proxy headers (in order of preference)
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = headers.get("cf-connecting-ip");
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback to a placeholder (for development/testing)
  return "unknown";
}

/**
 * Rate limit middleware response
 * Standardized response for rate limited requests
 */
export interface RateLimitResponse {
  success: false;
  error: string;
  retryAfter?: number; // Seconds until retry
  lockoutMinutes?: number;
}

/**
 * Create rate limit error response
 *
 * @param lockoutMinutes - Minutes until retry is allowed
 * @param customMessage - Optional custom error message
 * @returns Standardized rate limit response
 */
export function createRateLimitResponse(
  lockoutMinutes?: number,
  customMessage?: string,
): RateLimitResponse {
  const message =
    customMessage || "Too many failed attempts. Please try again later.";

  return {
    success: false,
    error: message,
    retryAfter: lockoutMinutes ? lockoutMinutes * 60 : undefined,
    lockoutMinutes,
  };
}

/**
 * Rate limit status for display
 * Used to show remaining attempts to user
 */
export interface RateLimitStatus {
  attempts: number;
  maxAttempts: number;
  remainingAttempts: number;
  isLocked: boolean;
  lockoutExpiresAt?: Date;
}

/**
 * Get detailed rate limit status for an identifier
 *
 * @param identifier - Email address or IP address
 * @returns Detailed rate limit status
 */
export async function getRateLimitStatus(
  identifier: string,
): Promise<RateLimitStatus> {
  const attempt = await LoginAttempt.findOne({ identifier });

  if (!attempt) {
    return {
      attempts: 0,
      maxAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS,
      remainingAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS,
      isLocked: false,
    };
  }

  const isLocked = attempt.isBlocked();

  return {
    attempts: attempt.attempts,
    maxAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS,
    remainingAttempts: Math.max(
      0,
      RATE_LIMIT_CONFIG.MAX_ATTEMPTS - attempt.attempts,
    ),
    isLocked,
    lockoutExpiresAt: attempt.blockedUntil ?? undefined,
  };
}

/**
 * Progressive rate limiting configuration
 * Increases lockout duration with repeated violations
 */
export const PROGRESSIVE_RATE_LIMIT = {
  // First violation: standard 30 minutes
  baseLockoutMinutes: 30,

  // Each subsequent violation multiplies by this factor
  multiplier: 2,

  // Maximum lockout duration (24 hours)
  maxLockoutMinutes: 24 * 60,
} as const;

/**
 * Calculate progressive lockout duration
 * Increases lockout time for repeat offenders
 *
 * @param violationCount - Number of times rate limit was exceeded
 * @returns Lockout duration in minutes
 */
export function calculateProgressiveLockout(violationCount: number): number {
  const { baseLockoutMinutes, multiplier, maxLockoutMinutes } =
    PROGRESSIVE_RATE_LIMIT;

  const lockoutMinutes = Math.min(
    baseLockoutMinutes * Math.pow(multiplier, violationCount),
    maxLockoutMinutes,
  );

  return Math.round(lockoutMinutes);
}
