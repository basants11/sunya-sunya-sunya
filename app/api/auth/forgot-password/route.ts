/**
 * POST /api/auth/forgot-password
 *
 * Password reset request endpoint
 * - Validates email
 * - Generates password reset token
 * - Sends password reset email
 *
 * Rate limiting: 3 attempts per hour per email
 */

import {
  checkRateLimit,
  createPasswordResetEmail,
  forgotPasswordSchema,
  getAttemptCount,
  recordFailedAttempt,
  sendEmail,
  validateData,
} from "@/lib/auth";
import { User, VerificationToken, connectToDatabase } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

// Rate limit configuration for password reset
const RESET_RATE_LIMIT = {
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
};

/**
 * POST handler for password reset request
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
    const validation = validateData(forgotPasswordSchema, body);
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

    const { email } = validation.data;

    // Check rate limit for password reset
    const rateLimitKey = `forgot-password:${email}`;
    const rateLimitResult = await checkRateLimit(rateLimitKey);

    // Get attempt count for custom rate limiting
    const attemptCount = await getAttemptCount(rateLimitKey);
    if (attemptCount >= RESET_RATE_LIMIT.maxAttempts) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many password reset requests. Please try again in 1 hour.",
          retryAfter: 3600,
        },
        { status: 429 },
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // If user not found, return generic success to prevent email enumeration
    // But still record the attempt to prevent abuse
    if (!user) {
      await recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account exists with this email, a password reset link has been sent.",
        },
        { status: 200 },
      );
    }

    // Check if user has password (OAuth users might not have one)
    if (!user.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This account uses social login. Please sign in with Google or other providers.",
          isOAuthAccount: true,
        },
        { status: 400 },
      );
    }

    // Record the attempt
    await recordFailedAttempt(rateLimitKey);

    // Delete any existing password reset tokens for this user
    await VerificationToken.deleteMany({
      userId: user._id,
      type: "password_reset",
    });

    // Generate password reset token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { rawToken } = await (VerificationToken as any).createToken(
      user._id,
      "password_reset",
      1, // 1 hour expiry for password reset
    );

    // Build reset URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

    // Send password reset email
    const emailResult = await sendEmail({
      to: email,
      ...createPasswordResetEmail(user.fullName, resetUrl),
    });

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send password reset email. Please try again later.",
        },
        { status: 500 },
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message:
        "Password reset link sent successfully. Please check your inbox.",
      remainingAttempts: Math.max(
        0,
        RESET_RATE_LIMIT.maxAttempts - attemptCount - 1,
      ),
    });
  } catch (error) {
    console.error("Forgot password error:", error);

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
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
