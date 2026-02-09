/**
 * JWT Token Utilities using jsonwebtoken
 *
 * This module provides JWT token generation, verification, and management.
 * Implements a dual-token strategy: short-lived access tokens + long-lived refresh tokens.
 *
 * FREE TIER: jsonwebtoken is a free, open-source library
 *
 * Security:
 * - Access tokens expire in 15 minutes (short-lived)
 * - Refresh tokens expire in 7 days (long-lived, path-restricted)
 * - Tokens are signed with strong secrets from environment variables
 * - Different secrets for access and refresh tokens
 */

import jwt from 'jsonwebtoken';

/**
 * Validate required environment variables at module load time
 * In development, uses defaults; in production, requires proper values
 */
function validateEnvVars() {
  const requiredVars = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    if (process.env.NODE_ENV === 'production') {
      const error = new Error(`Missing required environment variables: ${missing.join(', ')}`);
      console.error('Failed to start application:', error.message);
      throw error;
    } else {
      // Development mode: use default secrets, warn user
      console.warn('[JWT] Missing environment variables in development:', missing.join(', '));
      console.warn('[JWT] Using default development secrets - DO NOT USE IN PRODUCTION');
      // Set defaults for development
      process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-production';
      process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production';
    }
  }
}

// Call validation immediately when module is imported
try {
  validateEnvVars();
} catch (error) {
  // Log error but only throw in production
  console.error('JWT Configuration Error:', error);
  if (process.env.NODE_ENV === 'production') {
    throw error;
  }
}

/**
 * JWT Token payload structure
 * Contains minimal user information (no sensitive data)
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
  iat?: number; // Issued at (added by JWT)
  exp?: number; // Expiration time (added by JWT)
}

/**
 * Decoded JWT token structure
 */
export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

/**
 * JWT Configuration
 * Loaded from environment variables (validated above)
 */
const JWT_CONFIG = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET!,
    expiresIn: '15m', // 15 minutes
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: '7d', // 7 days
  },
} as const;

/**
 * Cookie configuration for tokens
 * httpOnly: Prevents JavaScript access (XSS protection)
 * secure: Only sent over HTTPS in production
 * sameSite: Prevents CSRF attacks
 */
export const COOKIE_CONFIG = {
  accessToken: {
    name: 'access_token',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    path: '/',
  },
  refreshToken: {
    name: 'refresh_token',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/api/auth/refresh', // Only sent to refresh endpoint
  },
} as const;

/**
 * Generate JWT access token
 * Short-lived token for API authentication
 *
 * @param payload - Token payload (userId, email, role)
 * @returns Signed JWT access token
 * @throws Error if JWT_ACCESS_SECRET is not set
 */
export function generateAccessToken(payload: Omit<TokenPayload, 'type'>): string {
  if (!JWT_CONFIG.accessToken.secret) {
    throw new Error('JWT_ACCESS_SECRET environment variable is not set');
  }

  const tokenPayload: TokenPayload = {
    ...payload,
    type: 'access',
  };

  return jwt.sign(tokenPayload, JWT_CONFIG.accessToken.secret, {
    expiresIn: JWT_CONFIG.accessToken.expiresIn,
  });
}

/**
 * Generate JWT refresh token
 * Long-lived token for obtaining new access tokens
 *
 * @param payload - Token payload (userId, email, role)
 * @returns Signed JWT refresh token
 * @throws Error if JWT_REFRESH_SECRET is not set
 */
export function generateRefreshToken(payload: Omit<TokenPayload, 'type'>): string {
  if (!JWT_CONFIG.refreshToken.secret) {
    throw new Error('JWT_REFRESH_SECRET environment variable is not set');
  }

  const tokenPayload: TokenPayload = {
    ...payload,
    type: 'refresh',
  };

  return jwt.sign(tokenPayload, JWT_CONFIG.refreshToken.secret, {
    expiresIn: JWT_CONFIG.refreshToken.expiresIn,
  });
}

/**
 * Generate both access and refresh tokens
 * Convenience function for login/registration
 *
 * @param payload - Token payload (userId, email, role)
 * @returns Object containing both tokens
 */
export function generateTokenPair(payload: Omit<TokenPayload, 'type'>): {
  accessToken: string;
  refreshToken: string;
} {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

/**
 * Verify JWT access token
 *
 * @param token - JWT token to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid, expired, or wrong type
 */
export function verifyAccessToken(token: string): TokenPayload {
  if (!JWT_CONFIG.accessToken.secret) {
    throw new Error('JWT_ACCESS_SECRET environment variable is not set');
  }

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.accessToken.secret) as DecodedToken;

    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    }
    throw error;
  }
}

/**
 * Verify JWT refresh token
 *
 * @param token - JWT token to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid, expired, or wrong type
 */
export function verifyRefreshToken(token: string): TokenPayload {
  if (!JWT_CONFIG.refreshToken.secret) {
    throw new Error('JWT_REFRESH_SECRET environment variable is not set');
  }

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.refreshToken.secret) as DecodedToken;

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
}

/**
 * Decode JWT token without verification
 * Useful for extracting payload from expired tokens
 *
 * @param token - JWT token to decode
 * @returns Decoded payload or null if invalid
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload | null;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 *
 * @param token - JWT token to check
 * @returns True if token is expired or invalid
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

/**
 * Get token expiration date
 *
 * @param token - JWT token
 * @returns Expiration date or null if invalid
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}

/**
 * Get time until token expiration in seconds
 *
 * @param token - JWT token
 * @returns Seconds until expiration, 0 if expired, null if invalid
 */
export function getTimeUntilExpiration(token: string): number | null {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    const secondsLeft = decoded.exp - Math.floor(Date.now() / 1000);
    return Math.max(0, secondsLeft);
  } catch {
    return null;
  }
}

/**
 * Refresh access token using refresh token
 * Generates new access token if refresh token is valid
 *
 * @param refreshToken - Valid refresh token
 * @returns New access token
 * @throws Error if refresh token is invalid
 */
export function refreshAccessToken(refreshToken: string): string {
  const decoded = verifyRefreshToken(refreshToken);

  // Generate new access token with same payload
  return generateAccessToken({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  });
}

/**
 * Generate secure random JWT secret
 * Use this to generate secrets for environment variables
 *
 * @param length - Length of secret in bytes (default: 32)
 * @returns Base64-encoded random string
 *
 * @example
 * // Run in Node.js to generate secrets:
 * console.log(generateSecureSecret());
 */
export function generateSecureSecret(length: number = 32): string {
  // This function is for documentation purposes
  // In practice, run: openssl rand -base64 32
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('base64');
}

/**
 * Token validation result type
 */
export interface TokenValidationResult {
  valid: boolean;
  payload?: TokenPayload;
  error?: string;
}

/**
 * Safely verify access token without throwing
 * Returns result object instead of throwing
 *
 * @param token - JWT token to verify
 * @returns Validation result with payload or error
 */
export function safeVerifyAccessToken(token: string): TokenValidationResult {
  try {
    const payload = verifyAccessToken(token);
    return { valid: true, payload };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Safely verify refresh token without throwing
 * Returns result object instead of throwing
 *
 * @param token - JWT token to verify
 * @returns Validation result with payload or error
 */
export function safeVerifyRefreshToken(token: string): TokenValidationResult {
  try {
    const payload = verifyRefreshToken(token);
    return { valid: true, payload };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
