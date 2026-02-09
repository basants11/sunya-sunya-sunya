/**
 * POST /api/auth/login
 *
 * User login endpoint
 * - Validates credentials
 * - Checks rate limiting
 * - Verifies email is verified
 * - Generates JWT tokens
 * - Sets httpOnly cookies
 *
 * Rate limiting: 5 attempts per 15 minutes, 30 min lockout
 */

import {
  COOKIE_CONFIG,
  checkCombinedRateLimit,
  generateTokenPair,
  getClientIP,
  loginSchema,
  recordCombinedFailedAttempt,
  resetCombinedRateLimit,
  validateData,
  verifyPassword,
} from "@/lib/auth";
import { User, connectToDatabase } from "@/lib/models";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler for user login
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
    const validation = validateData(loginSchema, body);
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

    const { email, password } = validation.data;
    const clientIP = getClientIP(request);

    // Check rate limiting for both email and IP
    const rateLimitCheck = await checkCombinedRateLimit(email, clientIP);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: rateLimitCheck.reason,
          lockoutMinutes: rateLimitCheck.lockoutMinutes,
          retryAfter: rateLimitCheck.lockoutMinutes
            ? rateLimitCheck.lockoutMinutes * 60
            : 1800,
        },
        { status: 429 },
      );
    }

    // Find user by email (include password hash for verification)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordHash",
    );

    // If user not found, record failed attempt and return generic error
    if (!user) {
      await recordCombinedFailedAttempt(email, clientIP);
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check if account is locked
    if (user.isLocked()) {
      const lockoutMinutes = user.lockoutUntil
        ? Math.ceil((user.lockoutUntil.getTime() - Date.now()) / 60000)
        : 30;

      return NextResponse.json(
        {
          success: false,
          error:
            "Account is temporarily locked due to too many failed attempts",
          lockoutMinutes,
          retryAfter: lockoutMinutes * 60,
        },
        { status: 403 },
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(
      password,
      user.passwordHash || "",
    );

    if (!isPasswordValid) {
      // Record failed attempt
      await Promise.all([
        user.incrementLoginAttempts(),
        recordCombinedFailedAttempt(email, clientIP),
      ]);

      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          error: "Please verify your email before logging in",
          requiresVerification: true,
          email: user.email,
        },
        { status: 403 },
      );
    }

    // Reset failed login attempts
    await Promise.all([
      user.resetLoginAttempts(),
      resetCombinedRateLimit(email, clientIP),
    ]);

    // Update last login info
    user.lastLoginAt = new Date();
    user.lastLoginIp = clientIP;
    await user.save();

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Set cookies
    const cookieStore = await cookies();

    // Set access token cookie
    cookieStore.set(COOKIE_CONFIG.accessToken.name, accessToken, {
      httpOnly: COOKIE_CONFIG.accessToken.httpOnly,
      secure: COOKIE_CONFIG.accessToken.secure,
      sameSite: COOKIE_CONFIG.accessToken.sameSite,
      maxAge: COOKIE_CONFIG.accessToken.maxAge,
      path: COOKIE_CONFIG.accessToken.path,
    });

    // Set refresh token cookie
    cookieStore.set(COOKIE_CONFIG.refreshToken.name, refreshToken, {
      httpOnly: COOKIE_CONFIG.refreshToken.httpOnly,
      secure: COOKIE_CONFIG.refreshToken.secure,
      sameSite: COOKIE_CONFIG.refreshToken.sameSite,
      maxAge: COOKIE_CONFIG.refreshToken.maxAge,
      path: COOKIE_CONFIG.refreshToken.path,
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

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
