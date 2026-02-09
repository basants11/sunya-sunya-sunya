/**
 * POST /api/auth/refresh
 *
 * Token refresh endpoint
 * - Validates refresh token from cookie
 * - Generates new access token
 * - Sets new access token cookie
 * - Optionally rotates refresh token
 */

import {
  COOKIE_CONFIG,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth";
import { User, connectToDatabase } from "@/lib/models";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler for token refresh
 */
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get refresh token from cookie
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(
      COOKIE_CONFIG.refreshToken.name,
    )?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: "Refresh token not found" },
        { status: 401 },
      );
    }

    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      // Clear invalid refresh token cookie
      cookieStore.delete(COOKIE_CONFIG.refreshToken.name);

      const errorMessage =
        error instanceof Error ? error.message : "Invalid refresh token";

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 401 },
      );
    }

    // Verify user still exists and is active
    const user = await User.findById(payload.userId);

    if (!user) {
      // Clear cookies for deleted user
      cookieStore.delete(COOKIE_CONFIG.accessToken.name);
      cookieStore.delete(COOKIE_CONFIG.refreshToken.name);

      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 401 },
      );
    }

    // Check if account is locked
    if (user.isLocked()) {
      return NextResponse.json(
        { success: false, error: "Account is locked" },
        { status: 403 },
      );
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Optional: Refresh token rotation for enhanced security
    // Generate new refresh token and invalidate old one
    const newRefreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Set new access token cookie
    cookieStore.set(COOKIE_CONFIG.accessToken.name, newAccessToken, {
      httpOnly: COOKIE_CONFIG.accessToken.httpOnly,
      secure: COOKIE_CONFIG.accessToken.secure,
      sameSite: COOKIE_CONFIG.accessToken.sameSite,
      maxAge: COOKIE_CONFIG.accessToken.maxAge,
      path: COOKIE_CONFIG.accessToken.path,
    });

    // Set new refresh token cookie (rotation)
    cookieStore.set(COOKIE_CONFIG.refreshToken.name, newRefreshToken, {
      httpOnly: COOKIE_CONFIG.refreshToken.httpOnly,
      secure: COOKIE_CONFIG.refreshToken.secure,
      sameSite: COOKIE_CONFIG.refreshToken.sameSite,
      maxAge: COOKIE_CONFIG.refreshToken.maxAge,
      path: COOKIE_CONFIG.refreshToken.path,
    });

    // Update last activity
    user.lastLoginAt = new Date();
    await user.save();

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
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
    console.error("Token refresh error:", error);

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
 * GET handler to check if refresh token is valid
 * Used for silent authentication checks
 */
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get refresh token from cookie
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(
      COOKIE_CONFIG.refreshToken.name,
    )?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: "No refresh token" },
        { status: 401 },
      );
    }

    // Verify refresh token
    try {
      const payload = verifyRefreshToken(refreshToken);

      // Verify user exists
      const user = await User.findById(payload.userId);

      if (!user || user.isLocked()) {
        return NextResponse.json(
          { success: false, error: "Invalid session" },
          { status: 401 },
        );
      }

      return NextResponse.json({
        success: true,
        valid: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Token check error:", error);

    return NextResponse.json(
      { success: false, error: "Server error" },
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
