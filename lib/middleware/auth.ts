/**
 * Authentication Middleware
 * Utilities for protecting API routes and verifying Firebase tokens
 */

import type { TokenVerificationResponse } from "@/lib/auth/types";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Extract and validate Bearer token from Authorization header
 */
export function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];
  return token || null;
}

/**
 * Verify Firebase ID token
 * In production, this should use Firebase Admin SDK
 */
export async function verifyFirebaseToken(
  idToken: string,
): Promise<TokenVerificationResponse> {
  try {
    // TODO: Replace with actual Firebase Admin verification
    // const decodedToken = await getAuth().verifyIdToken(idToken);

    // Basic validation for now
    if (!idToken || idToken.length < 100) {
      return {
        valid: false,
        uid: null,
        email: null,
        role: "guest",
        subscriptionStatus: "none",
        error: "Invalid token format",
      };
    }

    // Mock verification - replace with actual Firebase Admin
    // This is where you'd verify the token with Firebase Admin SDK
    // and fetch user data from your database

    return {
      valid: true,
      uid: "decoded-uid",
      email: "user@example.com",
      role: "guest",
      subscriptionStatus: "none",
    };
  } catch (error) {
    const err = error as Error;
    console.error("Token verification error:", err);

    return {
      valid: false,
      uid: null,
      email: null,
      role: "guest",
      subscriptionStatus: "none",
      error: err.message || "Token verification failed",
    };
  }
}

/**
 * Middleware response for unauthorized requests
 */
export function unauthorizedResponse(message: string = "Unauthorized") {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 401 },
  );
}

/**
 * Middleware response for forbidden requests
 */
export function forbiddenResponse(message: string = "Forbidden") {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 403 },
  );
}

/**
 * Higher-order function to protect API routes
 * Usage:
 * export const GET = withAuth(async (request, user) => {
 *   // Handler code with authenticated user
 * });
 */
export function withAuth(
  handler: (
    request: NextRequest,
    user: TokenVerificationResponse,
  ) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const token = extractBearerToken(request);

    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const verification = await verifyFirebaseToken(token);

    if (!verification.valid) {
      return unauthorizedResponse(verification.error || "Invalid token");
    }

    return handler(request, verification);
  };
}

/**
 * Higher-order function to protect routes requiring active subscription
 */
export function withSubscription(
  handler: (
    request: NextRequest,
    user: TokenVerificationResponse,
  ) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const token = extractBearerToken(request);

    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const verification = await verifyFirebaseToken(token);

    if (!verification.valid) {
      return unauthorizedResponse(verification.error || "Invalid token");
    }

    if (verification.subscriptionStatus !== "active") {
      return forbiddenResponse("Active subscription required");
    }

    return handler(request, verification);
  };
}

/**
 * Higher-order function to protect admin routes
 */
export function withAdmin(
  handler: (
    request: NextRequest,
    user: TokenVerificationResponse,
  ) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const token = extractBearerToken(request);

    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const verification = await verifyFirebaseToken(token);

    if (!verification.valid) {
      return unauthorizedResponse(verification.error || "Invalid token");
    }

    if (verification.role !== "admin") {
      return forbiddenResponse("Admin access required");
    }

    return handler(request, verification);
  };
}
