/**
 * Password Utilities using bcryptjs
 *
 * This module provides secure password hashing and verification.
 * Uses bcryptjs for cross-platform compatibility (works on Windows, Linux, macOS).
 *
 * FREE TIER: bcryptjs is a free, open-source library
 *
 * Security:
 * - Salt rounds: 12 (recommended for 2024, takes ~250ms to hash)
 * - One-way hashing - passwords cannot be reversed
 * - Timing-safe comparison prevents timing attacks
 */

import bcrypt from "bcryptjs";

/**
 * Number of salt rounds for bcrypt
 * Higher = more secure but slower
 * 12 rounds takes approximately 250ms on modern hardware
 * This is the recommended minimum for production systems
 */
const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password
 *
 * @param password - Plaintext password to hash
 * @returns Promise resolving to hashed password
 * @throws Error if hashing fails
 *
 * @example
 * const hashedPassword = await hashPassword("mySecurePassword123!");
 * // Returns: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiAYMyzJ/IyK"
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // Generate salt with specified rounds
    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    // Hash password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Failed to hash password");
  }
}

/**
 * Verify a plaintext password against a hash
 * Uses timing-safe comparison to prevent timing attacks
 *
 * @param password - Plaintext password to verify
 * @param hash - Stored hash to compare against
 * @returns Promise resolving to true if password matches, false otherwise
 * @throws Error if verification fails
 *
 * @example
 * const isValid = await verifyPassword("mySecurePassword123!", storedHash);
 * // Returns: true or false
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    // bcrypt.compare uses timing-safe comparison internally
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    console.error("Password verification error:", error);
    throw new Error("Failed to verify password");
  }
}

/**
 * Check if a string is a valid bcrypt hash
 * Useful for validating stored hashes
 *
 * @param hash - String to check
 * @returns True if string appears to be a bcrypt hash
 *
 * @example
 * const isValid = isValidHash("$2a$12$..."); // true
 * const isValid = isValidHash("plaintext"); // false
 */
export function isValidHash(hash: string): boolean {
  // bcrypt hashes start with $2a$, $2b$, $2x$, $2y$, or $2$
  // followed by $ and two digits for cost factor
  const bcryptPattern = /^\$2[abyx]?\$\d{2}\$/;
  return bcryptPattern.test(hash);
}

/**
 * Generate a secure random password
 * Useful for generating temporary passwords or reset tokens
 *
 * @param length - Length of password (default: 16)
 * @returns Randomly generated password string
 *
 * @example
 * const tempPassword = generateSecurePassword(20);
 * // Returns: "k9#mP2$vL5nQ8*wR4jX"
 */
export function generateSecurePassword(length: number = 16): string {
  const charset = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    special: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  const allChars =
    charset.uppercase + charset.lowercase + charset.numbers + charset.special;

  // Ensure at least one of each character type
  let password = "";
  password +=
    charset.uppercase[Math.floor(Math.random() * charset.uppercase.length)];
  password +=
    charset.lowercase[Math.floor(Math.random() * charset.lowercase.length)];
  password +=
    charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
  password +=
    charset.special[Math.floor(Math.random() * charset.special.length)];

  // Fill remaining length with random characters
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

/**
 * Check password strength
 * Returns detailed analysis of password security
 *
 * @param password - Password to analyze
 * @returns Object with score and detailed feedback
 *
 * @example
 * const analysis = analyzePasswordStrength("Weak");
 * // Returns: { score: 0, isStrong: false, feedback: [...] }
 */
export function analyzePasswordStrength(password: string): {
  score: number;
  isStrong: boolean;
  feedback: string[];
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    special: boolean;
  };
} {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const feedback: string[] = [];

  if (!requirements.length) {
    feedback.push("Password must be at least 8 characters long");
  }
  if (!requirements.uppercase) {
    feedback.push("Add uppercase letters (A-Z)");
  }
  if (!requirements.lowercase) {
    feedback.push("Add lowercase letters (a-z)");
  }
  if (!requirements.numbers) {
    feedback.push("Add numbers (0-9)");
  }
  if (!requirements.special) {
    feedback.push("Add special characters (!@#$%^&*)");
  }

  // Calculate score (0-5)
  let score = 0;
  if (requirements.length) score++;
  if (requirements.uppercase) score++;
  if (requirements.lowercase) score++;
  if (requirements.numbers) score++;
  if (requirements.special) score++;

  // Bonus for extra length
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Cap at 5
  score = Math.min(score, 5);

  return {
    score,
    isStrong: score >= 4 && requirements.length,
    feedback,
    requirements,
  };
}

/**
 * Get password strength label
 * Converts numeric score to human-readable label
 *
 * @param score - Password strength score (0-5)
 * @returns Human-readable strength label
 */
export function getPasswordStrengthLabel(score: number): string {
  const labels: Record<number, string> = {
    0: "Very Weak",
    1: "Weak",
    2: "Fair",
    3: "Good",
    4: "Strong",
    5: "Very Strong",
  };
  return labels[score] ?? "Unknown";
}

/**
 * Check if password has been compromised (basic check)
 * In production, consider using Have I Been Pwned API
 *
 * @param password - Password to check
 * @returns Object with compromised status and warning
 */
export function checkPasswordCompromised(password: string): {
  isCompromised: boolean;
  warning: string | null;
} {
  // List of commonly used weak passwords
  const commonPasswords = [
    "password",
    "123456",
    "12345678",
    "qwerty",
    "abc123",
    "password123",
    "admin",
    "letmein",
    "welcome",
    "monkey",
    "dragon",
    "master",
    "sunshine",
    "princess",
    "football",
    "baseball",
    "iloveyou",
    "trustno1",
    "1234567",
    "123456789",
    "adobe123",
    "admin123",
    "letmein1",
    "photoshop",
    "123123",
    "000000",
    "qazwsx",
    "password1",
    "1q2w3e4r",
    "zaq12wsx",
  ];

  const lowerPassword = password.toLowerCase();

  if (commonPasswords.includes(lowerPassword)) {
    return {
      isCompromised: true,
      warning:
        "This password is commonly used and easily guessed. Please choose a more unique password.",
    };
  }

  // Check for sequential patterns
  const sequentialPatterns = [
    "123",
    "abc",
    "qwe",
    "asd",
    "zxc",
    "password",
    "qwerty",
  ];

  for (const pattern of sequentialPatterns) {
    if (lowerPassword.includes(pattern)) {
      return {
        isCompromised: false,
        warning:
          "Avoid using sequential patterns or common words in your password.",
      };
    }
  }

  return {
    isCompromised: false,
    warning: null,
  };
}

/**
 * Rehash password if needed
 * Checks if password needs rehashing (e.g., if salt rounds changed)
 *
 * @param hash - Current password hash
 * @returns True if password should be rehashed
 */
export function needsRehash(hash: string): boolean {
  // Extract cost factor from hash
  const match = hash.match(/^\$2[abyx]?\$(\d{2})\$/);
  if (!match) return true; // Invalid hash, needs rehashing

  const currentRounds = parseInt(match[1], 10);
  return currentRounds < SALT_ROUNDS;
}
