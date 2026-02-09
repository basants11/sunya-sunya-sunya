/**
 * POST /api/auth/verify-email
 *
 * Email verification endpoint
 * - Validates verification token
 * - Updates user emailVerified status
 * - Deletes used token
 * - Sends welcome email
 */

import {
  createWelcomeEmail,
  sendEmail,
  validateData,
  verifyEmailSchema,
} from "@/lib/auth";
import { User, VerificationToken, connectToDatabase } from "@/lib/models";
import { IVerificationTokenMethods } from "@/lib/models/verification-token";
import { NextRequest, NextResponse } from "next/server";

// Cast VerificationToken to include statics (for findByToken method)
const VerificationTokenWithStatics =
  VerificationToken as typeof VerificationToken & {
    findByToken: (token: string, type: string) => Promise<any>;
  };

/**
 * POST handler for email verification
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
    const validation = validateData(verifyEmailSchema, body);
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

    const { token } = validation.data;

    // Find and validate verification token
    const verificationToken = await VerificationTokenWithStatics.findByToken(
      token,
      "email",
    );

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification token" },
        { status: 400 },
      );
    }

    // Check if token is expired
    if (
      (verificationToken as unknown as IVerificationTokenMethods).isExpired()
    ) {
      // Delete expired token
      await VerificationToken.deleteOne({ _id: verificationToken._id });

      return NextResponse.json(
        { success: false, error: "Verification token has expired" },
        { status: 400 },
      );
    }

    // Find user associated with token
    const user = await User.findById(verificationToken.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Check if email is already verified
    if (user.emailVerified) {
      // Delete token anyway (cleanup)
      await VerificationToken.deleteOne({ _id: verificationToken._id });

      return NextResponse.json(
        {
          success: true,
          message: "Email is already verified",
          alreadyVerified: true,
        },
        { status: 200 },
      );
    }

    // Update user emailVerified status
    user.emailVerified = true;
    await user.save();

    // Delete used token
    await VerificationToken.deleteOne({ _id: verificationToken._id });

    // Send welcome email (don't await)
    sendEmail({
      to: user.email,
      ...createWelcomeEmail(user.fullName),
    }).catch((error) => {
      console.error("Failed to send welcome email:", error);
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        emailVerified: true,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);

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
 * GET handler for email verification via query parameter
 * Alternative to POST for direct link clicks
 * Redirects to frontend with result
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from query params
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!token) {
      // Redirect to frontend with error
      return NextResponse.redirect(
        `${appUrl}/verify-email?error=missing_token`,
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find and validate verification token
    const verificationToken = await VerificationTokenWithStatics.findByToken(
      token,
      "email",
    );

    if (!verificationToken) {
      return NextResponse.redirect(
        `${appUrl}/verify-email?error=invalid_token`,
      );
    }

    // Check if token is expired
    if (
      (verificationToken as unknown as IVerificationTokenMethods).isExpired()
    ) {
      await VerificationToken.deleteOne({ _id: verificationToken._id });
      return NextResponse.redirect(
        `${appUrl}/verify-email?error=expired_token`,
      );
    }

    // Find user
    const user = await User.findById(verificationToken.userId);

    if (!user) {
      return NextResponse.redirect(
        `${appUrl}/verify-email?error=user_not_found`,
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      await VerificationToken.deleteOne({ _id: verificationToken._id });
      return NextResponse.redirect(
        `${appUrl}/verify-email?success=already_verified`,
      );
    }

    // Verify email
    user.emailVerified = true;
    await user.save();

    // Delete used token
    await VerificationToken.deleteOne({ _id: verificationToken._id });

    // Send welcome email
    sendEmail({
      to: user.email,
      ...createWelcomeEmail(user.fullName),
    }).catch((error) => {
      console.error("Failed to send welcome email:", error);
    });

    // Redirect to frontend with success
    return NextResponse.redirect(`${appUrl}/verify-email?success=true`);
  } catch (error) {
    console.error("Email verification GET error:", error);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/verify-email?error=server_error`);
  }
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
