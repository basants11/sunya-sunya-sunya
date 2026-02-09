/**
 * Authentication Utilities Index
 *
 * Central export point for all authentication utilities.
 * Import from this file to access all auth functionality.
 *
 * Usage:
 *   import {
 *     hashPassword,
 *     verifyPassword,
 *     generateAccessToken,
 *     verifyAccessToken,
 *     sendEmail,
 *     validateCSRFToken,
 *     checkRateLimit,
 *     registerSchema,
 *     validateData
 *   } from "@/lib/auth";
 */

// Password utilities
// CSRF protection utilities
export {
  CSRF_HEADER_NAME,
  CSRF_TOKEN_COOKIE,
  clearCSRFTokenCookie,
  generateCSRFToken,
  getCSRFTokenFromCookie,
  getCSRFTokenFromHeader,
  getOrCreateCSRFToken,
  refreshCSRFToken,
  requiresCSRFProtection,
  setCSRFTokenCookie,
  validateCSRFToken,
  validateCSRFTokenWithError,
  type CSRFTokenResponse,
  type CSRFValidationResult,
} from "./csrf";
// Email utilities
export {
  createPasswordResetEmail,
  createVerificationEmail,
  createWelcomeEmail,
  sendEmail,
  testEmailConfig,
  verifyEmailConfig,
  type EmailData,
  type EmailResult,
} from "./email";
// JWT utilities
export {
  COOKIE_CONFIG,
  decodeToken,
  generateAccessToken,
  generateRefreshToken,
  generateSecureSecret,
  generateTokenPair,
  getTimeUntilExpiration,
  getTokenExpiration,
  isTokenExpired,
  refreshAccessToken,
  safeVerifyAccessToken,
  safeVerifyRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  type DecodedToken,
  type TokenPayload,
  type TokenValidationResult,
} from "./jwt";
export {
  analyzePasswordStrength,
  checkPasswordCompromised,
  generateSecurePassword,
  getPasswordStrengthLabel,
  hashPassword,
  isValidHash,
  needsRehash,
  verifyPassword,
} from "./password";
// Rate limiting utilities
export {
  PROGRESSIVE_RATE_LIMIT,
  RATE_LIMIT_CONFIG,
  calculateProgressiveLockout,
  checkCombinedRateLimit,
  checkRateLimit,
  createRateLimitResponse,
  getAttemptCount,
  getClientIP,
  getRateLimitStatus,
  recordCombinedFailedAttempt,
  recordFailedAttempt,
  resetCombinedRateLimit,
  resetRateLimit,
  type RateLimitResponse,
  type RateLimitResult,
  type RateLimitStatus,
} from "./rate-limit";
// Validation utilities
export {
  checkPasswordStrength,
  csrfTokenSchema,
  emailSchema,
  forgotPasswordSchema,
  formatZodErrors,
  fullNameSchema,
  getPasswordStrengthLabel as getValidationPasswordStrengthLabel,
  googleCallbackSchema,
  loginSchema,
  passwordSchema,
  refreshTokenSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  sanitizeInput,
  validateData,
  verifyEmailSchema,
  type CsrfTokenInput,
  type ForgotPasswordInput,
  type GoogleCallbackInput,
  type LoginInput,
  type RefreshTokenInput,
  type RegisterInput,
  type ResendVerificationInput,
  type ResetPasswordInput,
  type VerifyEmailInput,
} from "./validation";
