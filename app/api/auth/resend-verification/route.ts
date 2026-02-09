/**
 * POST /api/auth/resend-verification
 *
 * Resend email verification endpoint
 * - Validates email
 * - Checks if user exists and is not verified
 * - Generates new verification token
 * - Sends verification email
 *
 * Rate limiting: 3 attempts per hour per email
 */

import {
  checkRateLimit,
  createVerificationEmail,
  getAttemptCount,
  recordFailedAttempt,
  resendVerificationSchema,
  sendEmail,
  validateData,
} from "@/lib/auth";
import { User, VerificationToken, connectToDatabase } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

// Rate limit configuration for resend verification
const RESEND_RATE_LIMIT = {
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
};

/**
 * POST handler for resending verification email
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
    const validation = validateData(resendVerificationSchema, body);
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

    // Check rate limit for resend verification (separate from login rate limit)
    const rateLimitKey = `resend-verification:${email}`;
    const rateLimitResult = await checkRateLimit(rateLimitKey);

    // Custom rate limit check for resend - use total attempts from the model
    const attemptCount = await getAttemptCount(rateLimitKey);
    if (attemptCount >= RESEND_RATE_LIMIT.maxAttempts) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many verification email requests. Please try again in 1 hour.",
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
            "If an account exists with this email, a verification link has been sent.",
        },
        { status: 200 },
      );
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account exists with this email, a verification link has been sent.",
          alreadyVerified: true,
        },
        { status: 200 },
      );
    }

    // Record the attempt
    await recordFailedAttempt(rateLimitKey);

    // Delete any existing verification tokens for this user
    await VerificationToken.deleteMany({
      userId: user._id,
      type: "email",
    });

    // Generate new verification token
    // @ts-expect-error - Mongoose model statics not properly typed
    const { rawToken } = await VerificationToken.createToken(
      user._id,
      "email",
      24, // 24 hours expiry
    );

    // Build verification URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${appUrl}/verify-email?token=${rawToken}`;

    // Send verification email
    const emailResult = await sendEmail({
      to: email,
      ...createVerificationEmail(user.fullName, verificationUrl),
    });

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send verification email. Please try again later.",
        },
        { status: 500 },
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully. Please check your inbox.",
      remainingAttempts: Math.max(
        0,
        RESEND_RATE_LIMIT.maxAttempts - attemptCount - 1,
      ),
    });
  } catch (error) {
    console.error("Resend verification error:", error);

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
