/**
 * Database Models Index
 *
 * Central export point for all MongoDB models.
 * Import models from this file to ensure proper initialization order.
 *
 * Usage:
 *   import { User, VerificationToken, LoginAttempt } from "@/lib/models";
 */

// Export database connection
export {
  connectToDatabase,
  disconnectFromDatabase,
  isDatabaseConnected,
} from "../db";
// Export Login Attempt model and types
export { LoginAttempt, RATE_LIMIT_CONFIG } from "./login-attempt";
export type { ILoginAttempt, ILoginAttemptMethods } from "./login-attempt";
// Export User model and types
export { User } from "./user";
export type { IUser, IUserMethods } from "./user";
// Export Verification Token model and types
export { VerificationToken } from "./verification-token";
export type {
  IVerificationToken,
  IVerificationTokenMethods,
  TokenType,
} from "./verification-token";
