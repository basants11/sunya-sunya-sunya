/**
 * Login Attempt Model - MongoDB Schema for Rate Limiting
 *
 * This model tracks login attempts for rate limiting purposes.
 * It prevents brute force attacks by tracking failed attempts
 * and temporarily blocking IPs/emails after too many failures.
 *
 * FREE TIER: Part of MongoDB Atlas 512MB free storage
 */

import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * TypeScript interface for Login Attempt document
 */
export interface ILoginAttempt extends Document {
  identifier: string; // Email or IP address
  attempts: number;
  lastAttemptAt: Date;
  blockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TypeScript interface for Login Attempt methods
 */
export interface ILoginAttemptMethods {
  /**
   * Check if this identifier is currently blocked
   * @returns {boolean} True if blocked
   */
  isBlocked(): boolean;

  /**
   * Get remaining lockout time in minutes
   * @returns {number} Minutes remaining, 0 if not blocked
   */
  getLockoutMinutes(): number;
}

/**
 * TypeScript interface for Login Attempt static methods
 */
export interface ILoginAttemptStatics {
  checkRateLimit(identifier: string): Promise<{
    allowed: boolean;
    remainingAttempts: number;
    lockoutMinutes?: number;
  }>;
  recordAttempt(identifier: string): Promise<{
    allowed: boolean;
    remainingAttempts: number;
    lockoutMinutes?: number;
  }>;
  resetAttempts(identifier: string): Promise<void>;
  getAttemptCount(identifier: string): Promise<number>;
}

// Combined type for Login Attempt model with methods and statics
export type LoginAttemptModel = Model<
  ILoginAttempt,
  object,
  ILoginAttemptMethods,
  ILoginAttemptStatics
>;

/**
 * Rate limiting configuration
 * These values control the rate limiting behavior
 */
export const RATE_LIMIT_CONFIG = {
  // Maximum failed attempts before lockout
  MAX_ATTEMPTS: 5,

  // Time window for counting attempts (15 minutes in milliseconds)
  WINDOW_MS: 15 * 60 * 1000,

  // Duration of lockout after max attempts exceeded (30 minutes in milliseconds)
  BLOCK_DURATION_MS: 30 * 60 * 1000,
} as const;

/**
 * Mongoose Schema for Login Attempt collection
 *
 * Security considerations:
 * - Identifier is indexed for fast lookups
 * - TTL index automatically cleans up old records
 * - Block status is checked on each login attempt
 */
const LoginAttemptSchema = new Schema<
  ILoginAttempt,
  LoginAttemptModel,
  ILoginAttemptMethods,
  ILoginAttemptStatics
>(
  {
    identifier: {
      type: String,
      required: [true, "Identifier (email or IP) is required"],
      index: true,
      trim: true,
    },
    attempts: {
      type: Number,
      default: 1,
      min: 0,
    },
    lastAttemptAt: {
      type: Date,
      default: Date.now,
    },
    blockedUntil: {
      type: Date,
      default: undefined,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * TTL Index: Automatically delete old login attempt records
 * Records are deleted 1 hour after last attempt to keep collection small
 * This is separate from the rate limiting window
 */
LoginAttemptSchema.index(
  { lastAttemptAt: 1 },
  { expireAfterSeconds: 3600 }, // 1 hour
);

/**
 * Instance method: Check if identifier is currently blocked
 */
LoginAttemptSchema.methods.isBlocked = function (): boolean {
  return !!(this.blockedUntil && this.blockedUntil > new Date());
};

/**
 * Instance method: Get remaining lockout time in minutes
 */
LoginAttemptSchema.methods.getLockoutMinutes = function (): number {
  if (!this.blockedUntil || this.blockedUntil <= new Date()) {
    return 0;
  }
  return Math.ceil((this.blockedUntil.getTime() - Date.now()) / 60000);
};

/**
 * Static method: Record a failed login attempt
 * Increments attempt counter and blocks if limit exceeded
 * @param identifier - Email or IP address
 * @returns Object with allowed status and remaining attempts/lockout time
 */
LoginAttemptSchema.statics.recordAttempt = async function (
  identifier: string,
): Promise<{
  allowed: boolean;
  remainingAttempts: number;
  lockoutMinutes?: number;
}> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_CONFIG.WINDOW_MS);

  // Find or create login attempt record
  let attempt = await this.findOne({ identifier });

  if (!attempt) {
    attempt = new this({
      identifier,
      attempts: 0,
      lastAttemptAt: now,
    });
  }

  // Reset attempts if outside the time window
  if (attempt.lastAttemptAt < windowStart) {
    attempt.attempts = 0;
    attempt.blockedUntil = undefined;
  }

  // Check if currently blocked
  if (attempt.isBlocked()) {
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutMinutes: attempt.getLockoutMinutes(),
    };
  }

  // Increment attempt counter
  attempt.attempts += 1;
  attempt.lastAttemptAt = now;

  // Block if max attempts reached
  if (attempt.attempts >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
    attempt.blockedUntil = new Date(
      now.getTime() + RATE_LIMIT_CONFIG.BLOCK_DURATION_MS,
    );
    await attempt.save();
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutMinutes: RATE_LIMIT_CONFIG.BLOCK_DURATION_MS / 60000,
    };
  }

  await attempt.save();

  return {
    allowed: true,
    remainingAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS - attempt.attempts,
  };
};

/**
 * Static method: Check rate limit status without recording attempt
 * Useful for checking status before processing login
 * @param identifier - Email or IP address
 * @returns Object with allowed status and remaining attempts/lockout time
 */
LoginAttemptSchema.statics.checkRateLimit = async function (
  identifier: string,
): Promise<{
  allowed: boolean;
  remainingAttempts: number;
  lockoutMinutes?: number;
}> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_CONFIG.WINDOW_MS);

  const attempt = await this.findOne({ identifier });

  if (!attempt) {
    return {
      allowed: true,
      remainingAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS,
    };
  }

  // Reset if outside window
  if (attempt.lastAttemptAt < windowStart) {
    return {
      allowed: true,
      remainingAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS,
    };
  }

  // Check if blocked
  if (attempt.isBlocked()) {
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutMinutes: attempt.getLockoutMinutes(),
    };
  }

  return {
    allowed: true,
    remainingAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS - attempt.attempts,
  };
};

/**
 * Static method: Reset login attempts for an identifier
 * Called on successful login to clear failed attempts
 * @param identifier - Email or IP address
 */
LoginAttemptSchema.statics.resetAttempts = async function (
  identifier: string,
): Promise<void> {
  await this.deleteOne({ identifier });
};

/**
 * Static method: Get current attempt count for an identifier
 * @param identifier - Email or IP address
 * @returns Number of attempts in current window
 */
LoginAttemptSchema.statics.getAttemptCount = async function (
  identifier: string,
): Promise<number> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_CONFIG.WINDOW_MS);

  const attempt = await this.findOne({
    identifier,
    lastAttemptAt: { $gte: windowStart },
  });

  return attempt?.attempts ?? 0;
};

/**
 * Login Attempt Model
 * Export the Mongoose model for LoginAttempt collection
 */
// Use 'as any' to bypass complex union type inference issues with Mongoose
const LoginAttemptModel =
  mongoose.models.LoginAttempt ||
  (mongoose.model("LoginAttempt", LoginAttemptSchema) as any);

export const LoginAttempt = LoginAttemptModel as LoginAttemptModel;

export default LoginAttempt;
