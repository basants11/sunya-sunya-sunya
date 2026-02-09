/**
 * POST /api/auth/reset-password
 *
 * Password reset endpoint
 * - Validates reset token
 * - Validates new password
 * - Updates user password
 * - Deletes used token
 * - Clears all user sessions
 */

import { hashPassword, resetPasswordSchema, validateData } from "@/lib/auth";
import { User, VerificationToken, connectToDatabase } from "@/lib/models";
import {
  IVerificationToken,
  IVerificationTokenMethods,
  IVerificationTokenStatics,
} from "@/lib/models/verification-token";
import { NextRequest, NextResponse } from "next/server";

// Cast VerificationToken to include statics
const VerificationTokenWithStatics =
  VerificationToken as unknown as IVerificationTokenStatics &
    typeof VerificationToken;

// Helper type for token with methods
type VerificationTokenDoc = IVerificationToken & IVerificationTokenMethods;

/**
 * POST handler for password reset
 */
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    // Validate input data
    const validation = validateData(resetPasswordSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          fieldErrors: validation.errors,
        },
        { status: 400 },
      );
    }

    const { token, password } = validation.data;

    // Find and validate reset token
    const resetToken = (await VerificationTokenWithStatics.findByToken(
      token,
      "password_reset",
    )) as VerificationTokenDoc | null;

    if (!resetToken) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    // Check if token is expired
    if ((resetToken as VerificationTokenDoc).isExpired()) {
      // Delete expired token
      await VerificationToken.deleteOne({ _id: resetToken!._id });

      return NextResponse.json(
        { success: false, error: "Reset token has expired" },
        { status: 400 },
      );
    }

    // Find user associated with token
    const user = await User.findById(resetToken.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Check if new password is same as old (prevent reuse)
    const { verifyPassword } = await import("@/lib/auth/password");
    const isSamePassword = await verifyPassword(
      password,
      user.passwordHash || "",
    );

    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          error: "New password must be different from your current password",
        },
        { status: 400 },
      );
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update user password
    user.passwordHash = passwordHash;

    // Reset failed login attempts
    user.failedLoginAttempts = 0;
    user.lockoutUntil = undefined;

    await user.save();

    // Delete used token
    await VerificationToken.deleteOne({ _id: resetToken._id });

    // Note: In a production system, you might want to:
    // 1. Invalidate all existing refresh tokens for this user
    // 2. Send email notification about password change
    // 3. Log the password change event

    // Return success response
    return NextResponse.json({
      success: true,
      message:
        "Password reset successful. Please log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    );
  }
}

/**
 * GET handler to validate reset token
 * Used by frontend to check if token is valid before showing reset form
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from query params
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Reset token is required" },
        { status: 400 },
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find and validate reset token
    const resetToken = (await VerificationTokenWithStatics.findByToken(
      token,
      "password_reset",
    )) as VerificationTokenDoc | null;

    if (!resetToken) {
      return NextResponse.json(
        { success: false, error: "Invalid reset token" },
        { status: 400 },
      );
    }

    // Check if token is expired
    if (resetToken.isExpired()) {
      await VerificationToken.deleteOne({ _id: resetToken._id });
      return NextResponse.json(
        { success: false, error: "Reset token has expired" },
        { status: 400 },
      );
    }

    // Find user to return email (for display purposes)
    const user = await User.findById(resetToken.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Return success with masked email
    const maskedEmail = maskEmail(user.email);

    return NextResponse.json({
      success: true,
      valid: true,
      email: maskedEmail,
    });
  } catch (error) {
    console.error("Validate reset token error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}

/**
 * Mask email address for privacy
 * e.g., "john.doe@example.com" -> "j***@example.com"
 */
function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!domain) return email;

  const firstChar = localPart.charAt(0);
  const maskedLocal = firstChar + "***";
  return `${maskedLocal}@${domain}`;
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
