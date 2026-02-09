/**
 * Auth Verification API Route
 * Verifies JWT tokens and returns user data
 * Used for secure backend authentication
 */

import type { TokenVerificationResponse } from "@/lib/auth/types";
import { NextResponse, type NextRequest } from "next/server";

/**
 * POST /api/auth/verify
 * Verifies a JWT token and returns user data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json<TokenVerificationResponse>(
        {
          valid: false,
          uid: null,
          email: null,
          role: "guest",
          subscriptionStatus: "none",
          error: "Token is required",
        },
        { status: 400 },
      );
    }

    // Verify JWT token - implement based on your backend auth system
    // This would typically verify the JWT and fetch user data from your database
    const isValidToken = token.length > 0; // Basic validation

    if (!isValidToken) {
      return NextResponse.json<TokenVerificationResponse>(
        {
          valid: false,
          uid: null,
          email: null,
          role: "guest",
          subscriptionStatus: "none",
          error: "Invalid token",
        },
        { status: 401 },
      );
    }

    // TODO: Fetch user data from your database using the verified token
    // const userData = await db.users.findUnique({ where: { id: decodedToken.userId } });

    // Mock response - replace with actual user data lookup
    return NextResponse.json<TokenVerificationResponse>({
      valid: true,
      uid: "mock-uid-123",
      email: "user@example.com",
      role: "guest",
      subscriptionStatus: "none",
    });
  } catch (error) {
    console.error("Token verification error:", error);

    return NextResponse.json<TokenVerificationResponse>(
      {
        valid: false,
        uid: null,
        email: null,
        role: "guest",
        subscriptionStatus: "none",
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/auth/verify
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Auth verification endpoint is running",
  });
}
