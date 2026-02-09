/**
 * Input Validation Schemas using Zod
 *
 * This module provides validation schemas for all authentication inputs.
 * Zod provides runtime type checking and detailed error messages.
 *
 * FREE TIER: Zod is a free, open-source library
 */

import { z } from "zod";

/**
 * Password validation requirements:
 * - Minimum 8 characters
 * - Maximum 128 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
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
 * Email validation schema
 * Uses built-in email validation with custom error message
 */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(254, "Email must be less than 254 characters")
  .transform((email) => email.toLowerCase().trim());

/**
 * Full name validation schema
 */
export const fullNameSchema = z
  .string()
  .min(2, "Full name must be at least 2 characters")
  .max(100, "Full name must be less than 100 characters")
  .regex(
    /^[a-zA-Z\s'-]+$/,
    "Full name can only contain letters, spaces, hyphens, and apostrophes",
  )
  .transform((name) => name.trim());

/**
 * Registration request validation schema
 * Used for POST /api/auth/register
 */
export const registerSchema = z
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
 * Type inference for registration input
 */
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Login request validation schema
 * Used for POST /api/auth/login
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

/**
 * Type inference for login input
 */
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Email verification request validation schema
 * Used for POST /api/auth/verify-email
 */
export const verifyEmailSchema = z.object({
  token: z
    .string()
    .min(1, "Verification token is required")
    .length(64, "Invalid verification token format"),
});

/**
 * Type inference for email verification input
 */
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

/**
 * Resend verification email request validation schema
 * Used for POST /api/auth/resend-verification
 */
export const resendVerificationSchema = z.object({
  email: emailSchema,
});

/**
 * Type inference for resend verification input
 */
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

/**
 * Forgot password request validation schema
 * Used for POST /api/auth/forgot-password
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Type inference for forgot password input
 */
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password request validation schema
 * Used for POST /api/auth/reset-password
 */
export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .min(1, "Reset token is required")
      .length(64, "Invalid reset token format"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Type inference for reset password input
 */
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Refresh token request validation schema
 * Used for POST /api/auth/refresh
 * Note: Refresh token is typically sent via cookie, not body
 * This schema is for cases where it might be sent in the body
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

/**
 * Type inference for refresh token input
 */
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

/**
 * Google OAuth callback validation schema
 * Used for POST /api/auth/google
 * Accepts authorization code from OAuth flow
 */
export const googleCallbackSchema = z.object({
  code: z.string().min(1, "Authorization code is required").optional(),
  redirectUri: z.string().url("Invalid redirect URI").optional(),
});

/**
 * Type inference for Google callback input
 */
export type GoogleCallbackInput = z.infer<typeof googleCallbackSchema>;

/**
 * CSRF token validation schema
 * Used to validate CSRF tokens in request headers
 */
export const csrfTokenSchema = z.object({
  csrfToken: z.string().uuid("Invalid CSRF token format"),
});

/**
 * Type inference for CSRF token input
 */
export type CsrfTokenInput = z.infer<typeof csrfTokenSchema>;

/**
 * Helper function: Format Zod validation errors
 * Converts Zod error format to a more user-friendly format
 *
 * @param error - ZodError instance
 * @returns Array of field errors with field name and message
 */
export function formatZodErrors(error: z.ZodError): Array<{
  field: string;
  message: string;
}> {
  return error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
}

/**
 * Helper function: Validate data against a schema
 * Returns either the validated data or formatted errors
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Object with success flag, data (if successful), or errors (if failed)
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
):
  | { success: true; data: T; errors: null }
  | {
      success: false;
      data: null;
      errors: Array<{ field: string; message: string }>;
    } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data, errors: null };
  } else {
    return {
      success: false,
      data: null,
      errors: formatZodErrors(result.error),
    };
  }
}

/**
 * Helper function: Check password strength
 * Returns a score and feedback for password strength indicator
 *
 * @param password - Password to check
 * @returns Object with score (0-4) and feedback messages
 */
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) score++;
  else feedback.push("Use at least 8 characters");

  if (password.length >= 12) score++;

  // Complexity checks
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (hasUppercase && hasLowercase) score++;
  else {
    if (!hasUppercase) feedback.push("Add uppercase letters");
    if (!hasLowercase) feedback.push("Add lowercase letters");
  }

  if (hasNumbers && hasSpecial) score++;
  else {
    if (!hasNumbers) feedback.push("Add numbers");
    if (!hasSpecial) feedback.push("Add special characters");
  }

  // Cap score at 4
  score = Math.min(score, 4);

  return { score, feedback };
}

/**
 * Helper function: Get password strength label
 *
 * @param score - Password strength score (0-4)
 * @returns Human-readable label
 */
export function getPasswordStrengthLabel(score: number): string {
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  return labels[score] ?? "Unknown";
}

/**
 * Helper function: Sanitize user input
 * Removes potentially dangerous characters from string input
 *
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < and > to prevent HTML injection
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .slice(0, 1000); // Limit length
}
