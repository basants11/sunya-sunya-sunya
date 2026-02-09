/**
 * Client-side Authentication Utilities
 *
 * This module provides client-side auth utilities including:
 * - CSRF token management
 * - Token storage helpers
 * - API client with auth headers
 * - Password strength checker
 */

import { z } from "zod";

// ============================================================================
// CSRF Token Management
// ============================================================================

const CSRF_TOKEN_KEY = "sunya_csrf_token";

/**
 * Get CSRF token from storage
 */
export function getCSRFToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CSRF_TOKEN_KEY);
}

/**
 * Set CSRF token in storage
 */
export function setCSRFToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CSRF_TOKEN_KEY, token);
}

/**
 * Clear CSRF token from storage
 */
export function clearCSRFToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CSRF_TOKEN_KEY);
}

/**
 * Fetch CSRF token from server
 */
export async function fetchCSRFToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/csrf", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = (await response.json()) as { csrfToken?: string };
      if (data.csrfToken) {
        setCSRFToken(data.csrfToken);
        return data.csrfToken;
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    return null;
  }
}

// ============================================================================
// API Client with Auth
// ============================================================================

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Enhanced fetch with auth headers and CSRF protection
 */
export async function authFetch(
  url: string,
  options: FetchOptions = {},
): Promise<Response> {
  const { requireAuth = true, headers = {}, ...rest } = options;

  // Build headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...((headers as Record<string, string>) || {}),
  };

  // Add CSRF token for mutating requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(options.method || "")) {
    let csrfToken = getCSRFToken();
    if (!csrfToken) {
      csrfToken = await fetchCSRFToken();
    }
    if (csrfToken) {
      requestHeaders["X-CSRF-Token"] = csrfToken;
    }
  }

  const response = await fetch(url, {
    ...rest,
    credentials: "include",
    headers: requestHeaders,
  });

  // Handle 401 by attempting token refresh
  if (response.status === 401 && requireAuth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the original request
      return authFetch(url, { ...options, requireAuth: false });
    }
  }

  return response;
}

/**
 * Refresh access token
 */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
}

// ============================================================================
// Password Strength Checker
// ============================================================================

export interface PasswordStrength {
  score: number; // 0-5
  label: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong" | "Very Strong";
  color: string;
  feedback: string[];
}

/**
 * Check password strength
 */
export function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const feedback: string[] = [];

  if (password.length === 0) {
    return {
      score: 0,
      label: "Very Weak",
      color: "#ef4444", // red-500
      feedback: ["Password is required"],
    };
  }

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("Use at least 8 characters");
  }

  if (password.length >= 12) {
    score += 1;
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add uppercase letters");
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add lowercase letters");
  }

  // Number check
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add numbers");
  }

  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add special characters");
  }

  // Cap score at 5
  score = Math.min(score, 5);

  const strengthMap: Record<
    number,
    { label: PasswordStrength["label"]; color: string }
  > = {
    0: { label: "Very Weak", color: "#ef4444" },
    1: { label: "Weak", color: "#f97316" },
    2: { label: "Fair", color: "#eab308" },
    3: { label: "Good", color: "#84cc16" },
    4: { label: "Strong", color: "#22c55e" },
    5: { label: "Very Strong", color: "#10b981" },
  };

  const { label, color } = strengthMap[score];

  return {
    score,
    label,
    color,
    feedback: feedback.length > 0 ? feedback : ["Great password!"],
  };
}

/**
 * Get password strength color class for Tailwind
 */
export function getPasswordStrengthColorClass(score: number): string {
  const colorClasses: Record<number, string> = {
    0: "bg-red-500",
    1: "bg-orange-500",
    2: "bg-yellow-500",
    3: "bg-lime-500",
    4: "bg-green-500",
    5: "bg-emerald-500",
  };
  return colorClasses[score] || "bg-gray-300";
}

/**
 * Get password strength text color class
 */
export function getPasswordStrengthTextClass(score: number): string {
  const textClasses: Record<number, string> = {
    0: "text-red-500",
    1: "text-orange-500",
    2: "text-yellow-500",
    3: "text-lime-500",
    4: "text-green-500",
    5: "text-emerald-500",
  };
  return textClasses[score] || "text-gray-500";
}

// ============================================================================
// Validation Schemas
// ============================================================================

/**
 * Client-side email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(254, "Email must be less than 254 characters");

/**
 * Client-side password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

/**
 * Client-side full name validation schema
 */
export const fullNameSchema = z
  .string()
  .min(2, "Full name must be at least 2 characters")
  .max(100, "Full name must be less than 100 characters")
  .regex(
    /^[a-zA-Z\s'-]+$/,
    "Full name can only contain letters, spaces, hyphens, and apostrophes",
  );

/**
 * Login form validation schema
 */
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

/**
 * Registration form validation schema
 */
export const registerFormSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Reset password form validation schema
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Export types
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format error message from API response
 */
export function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
}

/**
 * Check if user is on mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/**
 * Store redirect URL for post-login redirect
 */
export function setRedirectUrl(url: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("sunya_auth_redirect", url);
}

/**
 * Get and clear redirect URL
 */
export function getRedirectUrl(): string | null {
  if (typeof window === "undefined") return null;
  const url = sessionStorage.getItem("sunya_auth_redirect");
  sessionStorage.removeItem("sunya_auth_redirect");
  return url;
}

/**
 * Debounce function for input validation
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
