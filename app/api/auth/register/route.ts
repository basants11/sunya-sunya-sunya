/**
 * POST /api/auth/register
 *
 * User registration endpoint
 * - Validates input data
 * - Checks for existing email
 * - Hashes password
 * - Creates user in database
 * - Generates verification token
 * - Sends verification email
 *
 * Rate limiting: 5 attempts per 15 minutes per IP
 */

import {
  checkCombinedRateLimit,
  createVerificationEmail,
  getClientIP,
  hashPassword,
  recordFailedAttempt,
  registerSchema,
  sendEmail,
  validateData,
} from "@/lib/auth";
import { User, VerificationToken, connectToDatabase } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler for user registration
 */
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limit by IP
    const rateLimitCheck = await checkCombinedRateLimit(
      "register:" + clientIP,
      clientIP,
    );
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many registration attempts. Please try again later.",
          retryAfter: rateLimitCheck.lockoutMinutes
            ? rateLimitCheck.lockoutMinutes * 60
            : 900,
        },
        { status: 429 },
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      await recordFailedAttempt("register:" + clientIP);
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    // Validate input data
    const validation = validateData(registerSchema, body);
    if (!validation.success) {
      await recordFailedAttempt("register:" + clientIP);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          fieldErrors: validation.errors,
        },
        { status: 400 },
      );
    }

    const { fullName, email, password } = validation.data;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      // Return generic error to prevent email enumeration
      await recordFailedAttempt("register:" + clientIP);
      return NextResponse.json(
        {
          success: false,
          error: "Registration failed. Please try again.",
        },
        { status: 409 },
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      fullName,
      passwordHash,
      authProvider: "jwt",
      emailVerified: false,
      role: "guest",
      subscriptionStatus: "none",
    });

    // Generate email verification token
    // @ts-expect-error - Mongoose model statics not properly typed
    const { rawToken } = await VerificationToken.createToken(
      user._id,
      "email",
      24, // 24 hours expiry
    );

    // Build verification URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${appUrl}/verify-email?token=${rawToken}`;

    // Send verification email (don't await - let it happen in background)
    sendEmail({
      to: email,
      ...createVerificationEmail(fullName, verificationUrl),
    }).catch((error) => {
      console.error("Failed to send verification email:", error);
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message:
          "Registration successful. Please check your email to verify your account.",
        user: {
          id: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
          emailVerified: user.emailVerified,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.message.includes("E11000")) {
        return NextResponse.json(
          {
            success: false,
            error: "Registration failed. Please try again.",
          },
          { status: 409 },
        );
      }
    }

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
      "Access-Control-Allow-Headers": "Content-Type, X-CSRF-Token",
    },
  });
}
