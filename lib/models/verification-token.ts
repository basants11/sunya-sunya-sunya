/**
 * Verification Token Model - MongoDB Schema
 *
 * This model stores temporary tokens for:
 * - Email verification
 * - Password reset
 *
 * Tokens are hashed before storage for security.
 * Expired tokens are automatically cleaned up.
 *
 * FREE TIER: Part of MongoDB Atlas 512MB free storage
 */

import crypto from "crypto";
import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Token types supported by the system
 */
export type TokenType = "email" | "password_reset";

/**
 * TypeScript interface for Verification Token document
 */
export interface IVerificationToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string; // Hashed token
  type: TokenType;
  expiresAt: Date;
  createdAt: Date;
}

/**
 * TypeScript interface for Verification Token methods
 */
export interface IVerificationTokenMethods {
  /**
   * Check if token is expired
   * @returns {boolean} True if token is expired
   */
  isExpired(): boolean;
}

/**
 * TypeScript interface for Verification Token static methods
 */
export interface IVerificationTokenStatics {
  hashToken(rawToken: string): string;
  generateToken(): { rawToken: string; hashedToken: string };
  findByToken(
    rawToken: string,
    type: TokenType,
  ): Promise<IVerificationToken | null>;
  createToken(
    userId: mongoose.Types.ObjectId,
    type: TokenType,
    expiresInHours?: number,
  ): Promise<{ token: IVerificationToken; rawToken: string }>;
}

// Combined type for Verification Token model with methods and statics
export type VerificationTokenModel = Model<
  IVerificationToken,
  object,
  IVerificationTokenMethods,
  IVerificationTokenStatics
>;

/**
 * Mongoose Schema for Verification Token collection
 *
 * Security considerations:
 * - Tokens are hashed before storage
 * - TTL index automatically removes expired tokens
 * - User ID is indexed for fast lookups
 */
const VerificationTokenSchema = new Schema<
  IVerificationToken,
  VerificationTokenModel,
  IVerificationTokenMethods,
  IVerificationTokenStatics
>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    token: {
      type: String,
      required: [true, "Token is required"],
      index: true,
    },
    type: {
      type: String,
      enum: ["email", "password_reset"],
      required: [true, "Token type is required"],
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // TTL index: automatically delete documents when expiresAt is reached
    // This ensures cleanup of expired tokens
    timestamps: { createdAt: true, updatedAt: false },
  },
);

/**
 * TTL Index: Automatically delete expired tokens
 * MongoDB will check every 60 seconds and remove expired documents
 */
VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * Compound index for userId + type lookups
 * Used when finding tokens for a specific user and type
 */
VerificationTokenSchema.index({ userId: 1, type: 1 });

/**
 * Instance method: Check if token is expired
 */
VerificationTokenSchema.methods.isExpired = function (): boolean {
  return this.expiresAt < new Date();
};

/**
 * Static method: Hash a raw token
 * Uses SHA-256 for one-way hashing
 * @param rawToken - The raw token string
 * @returns Hashed token string
 */
VerificationTokenSchema.statics.hashToken = function (
  this: VerificationTokenModel,
  rawToken: string,
): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
};

/**
 * Static method: Generate a new random token
 * @returns Object containing raw token (for email) and hashed token (for storage)
 */
VerificationTokenSchema.statics.generateToken = function (
  this: VerificationTokenModel,
): {
  rawToken: string;
  hashedToken: string;
} {
  // Generate cryptographically secure random token
  const rawToken = crypto.randomBytes(32).toString("hex");
  // @ts-expect-error - hashToken is a static method
  const hashedToken = this.hashToken(rawToken);
  return { rawToken, hashedToken };
};

/**
 * Static method: Find token by raw token value
 * Hashes the raw token before querying
 * @param rawToken - The raw token from email/link
 * @param type - Token type
 * @returns Token document or null
 */
VerificationTokenSchema.statics.findByToken = function (
  this: VerificationTokenModel,
  rawToken: string,
  type: TokenType,
) {
  // @ts-expect-error - hashToken is a static method
  const hashedToken = this.hashToken(rawToken);
  return this.findOne({ token: hashedToken, type });
};

/**
 * Static method: Create a new verification token
 * @param userId - User ID to associate with token
 * @param type - Token type (email or password_reset)
 * @param expiresInHours - Hours until token expires (default: 24)
 * @returns Object with token document and raw token (for email)
 */
VerificationTokenSchema.statics.createToken = async function (
  userId: mongoose.Types.ObjectId,
  type: TokenType,
  expiresInHours: number = 24,
): Promise<{ token: IVerificationToken; rawToken: string }> {
  // Delete any existing tokens of this type for the user
  await this.deleteMany({ userId, type });

  // Generate new token
  // @ts-expect-error - generateToken is a static method
  const { rawToken, hashedToken } = this.generateToken();

  // Calculate expiration
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  // Create token document
  const token = await this.create({
    userId,
    token: hashedToken,
    type,
    expiresAt,
  });

  return { token, rawToken };
};

/**
 * Verification Token Model
 * Export the Mongoose model for VerificationToken collection
 */
export const VerificationToken = ((mongoose.models
  .VerificationToken as unknown as VerificationTokenModel) ||
  mongoose.model(
    "VerificationToken",
    VerificationTokenSchema,
  )) as VerificationTokenModel;

export default VerificationToken;
