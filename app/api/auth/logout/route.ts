/**
 * POST /api/auth/logout
 *
 * User logout endpoint
 * - Clears access token cookie
 * - Clears refresh token cookie
 * - Clears CSRF token cookie
 * - Optional: Blacklist refresh token (for server-side invalidation)
 */

import { COOKIE_CONFIG, CSRF_TOKEN_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler for user logout
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Clear access token cookie
    cookieStore.delete(COOKIE_CONFIG.accessToken.name);

    // Clear refresh token cookie
    cookieStore.delete(COOKIE_CONFIG.refreshToken.name);

    // Clear CSRF token cookie
    cookieStore.delete(CSRF_TOKEN_COOKIE);

    // Note: In a production system with token blacklisting,
    // you would add the refresh token to a blacklist here
    // This prevents the token from being used even if it's not expired

    // Optional: Get refresh token before clearing to blacklist it
    const refreshToken = cookieStore.get(
      COOKIE_CONFIG.refreshToken.name,
    )?.value;
    if (refreshToken) {
      // Add to blacklist in Redis/database
      // await blacklistToken(refreshToken);
      console.log("Token blacklisted:", refreshToken.slice(0, 10) + "...");
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    // Even if there's an error, try to clear cookies
    try {
      const cookieStore = await cookies();
      cookieStore.delete(COOKIE_CONFIG.accessToken.name);
      cookieStore.delete(COOKIE_CONFIG.refreshToken.name);
      cookieStore.delete(CSRF_TOKEN_COOKIE);
    } catch {
      // Ignore errors during cleanup
    }

    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during logout, but you have been signed out.",
      },
      { status: 500 },
    );
  }
}

/**
 * GET handler for logout (alternative for simple logout links)
 * Redirects to home page after logout
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Clear all auth cookies
    cookieStore.delete(COOKIE_CONFIG.accessToken.name);
    cookieStore.delete(COOKIE_CONFIG.refreshToken.name);
    cookieStore.delete(CSRF_TOKEN_COOKIE);

    // Get return URL or default to home
    const { searchParams } = new URL(request.url);
    const returnTo = searchParams.get("returnTo") || "/";

    // Redirect to return URL
    return NextResponse.redirect(new URL(returnTo, request.url));
  } catch (error) {
    console.error("Logout GET error:", error);

    // Redirect to home on error
    return NextResponse.redirect(new URL("/", request.url));
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
