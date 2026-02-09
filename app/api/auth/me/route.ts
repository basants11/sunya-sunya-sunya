/**
 * GET /api/auth/me
 *
 * Get current user endpoint
 * - Validates access token from cookie
 * - Returns current user data
 * - Used for session validation and user info
 */

import { COOKIE_CONFIG, verifyAccessToken } from "@/lib/auth";
import { User, connectToDatabase } from "@/lib/models";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler to get current user
 */
export async function GET(request: NextRequest) {
  try {
    // Connect to database (graceful fallback in dev mode if no MONGODB_URI)
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('[API] Database connection error in dev mode:', dbError);
      // In development, return a guest user instead of erroring
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json(
          { success: true, data: { user: { id: 'dev-guest', email: 'guest@dev.local', role: 'guest' } } },
          { status: 200 },
        );
      }
      throw dbError;
    }

    // Get access token from cookie
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_CONFIG.accessToken.name)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    // Verify access token
    let payload;
    try {
      payload = verifyAccessToken(accessToken);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid token";

      // If token is expired, suggest refresh
      if (errorMessage.includes("expired")) {
        return NextResponse.json(
          {
            success: false,
            error: "Token expired",
            code: "TOKEN_EXPIRED",
          },
          { status: 401 },
        );
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 401 },
      );
    }

    // Get user from database
    try {
      const user = await User.findById(payload.userId);

      if (!user) {
      // Clear invalid cookies
      cookieStore.delete(COOKIE_CONFIG.accessToken.name);
      cookieStore.delete(COOKIE_CONFIG.refreshToken.name);

      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Check if account is locked
    if (user.isLocked()) {
      return NextResponse.json(
        { success: false, error: "Account is locked" },
        { status: 403 },
      );
    }

      // Return user data
      return NextResponse.json({
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          role: user.role,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionPlan: user.subscriptionPlan,
          subscriptionExpiresAt: user.subscriptionExpiresAt,
          emailVerified: user.emailVerified,
          authProvider: user.authProvider,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
        },
      });
    } catch (dbError) {
      // If user lookup fails in dev, return mock user
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({
          success: true,
          user: {
            id: payload.userId,
            email: 'dev-user@local',
            fullName: 'Development User',
            role: 'user',
            subscriptionStatus: 'active',
            emailVerified: true,
          },
        });
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Get user error:", error);

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
 * PATCH handler to update current user
 * Allows updating user profile information
 */
export async function PATCH(request: NextRequest) {
  try {
    // Connect to database (graceful fallback in dev mode)
    try {
      await connectToDatabase();
    } catch (dbError) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[API] Database connection unavailable in dev mode');
        // Return error in dev mode for PATCH since updates don't work without DB
        return NextResponse.json(
          { success: false, error: "Database not available for updates" },
          { status: 503 },
        );
      }
      throw dbError;
    }

    // Get access token from cookie
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_CONFIG.accessToken.name)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    // Verify access token
    let payload;
    try {
      payload = verifyAccessToken(accessToken);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid token";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 401 },
      );
    }

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

    // Find user
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Fields that can be updated
    const allowedUpdates = ["fullName", "avatar"];
    const updates: Record<string, unknown> = {};

    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    // Validate fullName if provided
    if (updates.fullName !== undefined) {
      const { fullNameSchema } = await import("@/lib/auth/validation");
      const result = fullNameSchema.safeParse(updates.fullName);
      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid full name",
            fieldErrors: [
              {
                field: "fullName",
                message: result.error.errors[0]?.message || "Invalid",
              },
            ],
          },
          { status: 400 },
        );
      }
    }

    // Apply updates
    if (Object.keys(updates).length > 0) {
      Object.assign(user, updates);
      await user.save();
    }

    // Return updated user data
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);

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
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
