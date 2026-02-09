/**
 * User Model - MongoDB Schema for Authentication
 *
 * This model stores user authentication data including:
 * - Email/password credentials (JWT-based auth)
 * - Google OAuth linking
 * - Email verification status
 * - Password reset tokens
 * - Security tracking (failed logins, lockouts)
 * - Subscription and role information
 *
 * FREE TIER: Part of MongoDB Atlas 512MB free storage
 */

import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * TypeScript interface for User document
 * Defines the shape of user data in the database
 */
export interface IUser extends Document {
  // Primary identifiers
  email: string;
  authProvider: "jwt" | "firebase" | "google";
  firebaseUid?: string;
  googleId?: string;

  // Profile data
  fullName: string;
  avatar?: string;

  // Email/password auth (JWT)
  passwordHash?: string;
  emailVerified: boolean;

  // Password reset
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  // Email verification
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;

  // Security tracking
  failedLoginAttempts: number;
  lockoutUntil?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;

  // Subscription and role
  role: "guest" | "subscriber" | "admin";
  subscriptionStatus: "none" | "active" | "cancelled" | "expired";
  subscriptionPlan?: string;
  subscriptionExpiresAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TypeScript interface for User methods
 * Instance methods available on User documents
 */
export interface IUserMethods {
  /**
   * Check if user account is currently locked
   * @returns {boolean} True if account is locked
   */
  isLocked(): boolean;

  /**
   * Increment failed login attempts
   * Locks account after 5 failed attempts
   */
  incrementLoginAttempts(): Promise<void>;

  /**
   * Reset failed login attempts on successful login
   */
  resetLoginAttempts(): Promise<void>;
}

// Combined type for User model with methods
type UserModel = Model<IUser, {}, IUserMethods>;

/**
 * Mongoose Schema for User collection
 *
 * Security considerations:
 * - Email is unique and indexed for fast lookups
 * - Password hash is never returned in queries by default
 * - Failed login attempts are tracked for rate limiting
 * - Lockout mechanism prevents brute force attacks
 */
const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    // Primary identifiers
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please enter a valid email address",
      ],
    },
    authProvider: {
      type: String,
      enum: ["jwt", "firebase", "google"],
      default: "jwt",
      required: true,
    },
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true, // Allow null/undefined values (only for Firebase users)
      index: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allow null/undefined values (only for Google OAuth users)
      index: true,
    },

    // Profile data
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
      maxlength: [100, "Full name must be less than 100 characters"],
    },
    avatar: {
      type: String,
      trim: true,
    },

    // Email/password auth
    passwordHash: {
      type: String,
      // Required only for JWT auth, not for OAuth
      required: function (this: IUser) {
        return this.authProvider === "jwt";
      },
      select: false, // Don't include passwordHash in queries by default
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },

    // Password reset
    passwordResetToken: {
      type: String,
      select: false, // Don't include in queries by default
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },

    // Email verification
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    // Security tracking
    failedLoginAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    lockoutUntil: {
      type: Date,
      default: undefined,
    },
    lastLoginAt: {
      type: Date,
    },
    lastLoginIp: {
      type: String,
    },

    // Subscription and role
    role: {
      type: String,
      enum: ["guest", "subscriber", "admin"],
      default: "guest",
    },
    subscriptionStatus: {
      type: String,
      enum: ["none", "active", "cancelled", "expired"],
      default: "none",
    },
    subscriptionPlan: {
      type: String,
      trim: true,
    },
    subscriptionExpiresAt: {
      type: Date,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,

    // Transform output to remove sensitive fields
    toJSON: {
      transform: function (_doc, ret) {
        const r = ret as Record<string, unknown>;
        delete r.passwordHash;
        delete r.passwordResetToken;
        delete r.passwordResetExpires;
        delete r.emailVerificationToken;
        delete r.emailVerificationExpires;
        delete r.__v;
        return r;
      },
    },
    toObject: {
      transform: function (_doc, ret: Record<string, unknown>) {
        delete ret.passwordHash;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.emailVerificationToken;
        delete ret.emailVerificationExpires;
        delete ret.__v;
        return ret;
      },
    },
  },
);

/**
 * Instance method: Check if user account is locked
 * Account is locked if lockoutUntil date is in the future
 */
UserSchema.methods.isLocked = function (): boolean {
  return !!(this.lockoutUntil && this.lockoutUntil > new Date());
};

/**
 * Instance method: Increment failed login attempts
 * Automatically locks account after 5 failed attempts for 30 minutes
 */
UserSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  const MAX_FAILED_ATTEMPTS = 5;
  const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

  this.failedLoginAttempts += 1;

  // Lock account if max attempts reached
  if (this.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
    this.lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
  }

  await this.save();
};

/**
 * Instance method: Reset failed login attempts
 * Called on successful login to clear failed attempts and lockout
 */
UserSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  this.failedLoginAttempts = 0;
  this.lockoutUntil = undefined;
  await this.save();
};

/**
 * Static method: Find user by email (case-insensitive)
 * @param email - User email address
 * @returns User document or null
 */
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

/**
 * Static method: Find user by Google ID
 * @param googleId - Google OAuth ID
 * @returns User document or null
 */
UserSchema.statics.findByGoogleId = function (googleId: string) {
  return this.findOne({ googleId });
};

/**
 * Index for efficient queries
 * Compound index for auth provider + provider ID lookups
 */
UserSchema.index({ authProvider: 1, googleId: 1 });
UserSchema.index({ authProvider: 1, firebaseUid: 1 });

/**
 * Pre-save middleware to normalize email
 * Ensures email is always stored in lowercase
 */
UserSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});

/**
 * User Model
 * Export the Mongoose model for User collection
 * Uses existing model if available (hot reload support)
 */
export const User =
  (mongoose.models.User as UserModel) ||
  mongoose.model<IUser, UserModel>("User", UserSchema);

export default User;
