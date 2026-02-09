/**
 * POST /api/auth/google
 *
 * Google OAuth callback handler
 * - Validates Google ID token
 * - Creates or updates user
 * - Generates JWT tokens
 * - Sets cookies
 *
 * FREE TIER: Google OAuth is free for standard usage
 */

import {
  COOKIE_CONFIG,
  createWelcomeEmail,
  generateTokenPair,
  googleCallbackSchema,
  sendEmail,
  validateData,
} from '@/lib/auth';
import { User, connectToDatabase } from '@/lib/models';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Google OAuth token response
 */
interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

/**
 * Google user info
 */
interface GoogleUserInfo {
  sub: string; // Google ID
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

/**
 * POST handler for Google OAuth callback
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
      return NextResponse.json({ success: false, error: 'Invalid JSON in request body' }, { status: 400 });
    }

    // Validate input data - accept both idToken (Firebase) and code (OAuth)
    const validation = validateData(googleCallbackSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          fieldErrors: validation.errors,
        },
        { status: 400 }
      );
    }

    const { idToken, code } = validation.data;

    // Handle Firebase idToken or OAuth code
    let tokens: GoogleTokenResponse | null;
    let googleUser: GoogleUserInfo | null;

    if (code) {
      // OAuth code - exchange for tokens
      tokens = await exchangeCodeForTokens(code);
      if (!tokens) {
        return NextResponse.json({ success: false, error: 'Failed to exchange authorization code' }, { status: 400 });
      }

      // Get user info from Google
      googleUser = await getGoogleUserInfo(tokens.access_token);
      if (!googleUser) {
        return NextResponse.json({ success: false, error: 'Failed to get user info from Google' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ success: false, error: 'Missing authentication token' }, { status: 400 });
    }

    // Verify email is confirmed with Google
    if (!googleUser.email_verified) {
      return NextResponse.json({ success: false, error: 'Google email not verified' }, { status: 400 });
    }

    // Find existing user by Google ID
    let user = await User.findOne({ googleId: googleUser.sub });

    // If no user found by Google ID, check by email
    if (!user) {
      user = await User.findOne({ email: googleUser.email.toLowerCase() });

      if (user) {
        // Link Google account to existing user
        user.googleId = googleUser.sub;
        user.authProvider = 'google';
        if (googleUser.picture && !user.avatar) {
          user.avatar = googleUser.picture;
        }
        await user.save();
      }
    }

    // Create new user if not found
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = await User.create({
        email: googleUser.email,
        fullName: googleUser.name,
        googleId: googleUser.sub,
        authProvider: 'google',
        avatar: googleUser.picture,
        emailVerified: true, // Google already verified the email
        role: 'guest',
        subscriptionStatus: 'none',
      });

      // Send welcome email for new users
      sendEmail({
        to: user.email,
        ...createWelcomeEmail(user.fullName),
      }).catch((error) => {
        console.error('Failed to send welcome email:', error);
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return NextResponse.json({ success: false, error: 'Account is locked' }, { status: 403 });
    }

    // Reset failed login attempts
    await user.resetLoginAttempts();

    // Update last login info
    user.lastLoginAt = new Date();
    await user.save();

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Set cookies
    const cookieStore = await cookies();

    cookieStore.set(COOKIE_CONFIG.accessToken.name, accessToken, {
      httpOnly: COOKIE_CONFIG.accessToken.httpOnly,
      secure: COOKIE_CONFIG.accessToken.secure,
      sameSite: COOKIE_CONFIG.accessToken.sameSite,
      maxAge: COOKIE_CONFIG.accessToken.maxAge,
      path: COOKIE_CONFIG.accessToken.path,
    });

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
      message: isNewUser ? 'Account created successfully' : 'Login successful',
      isNewUser,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        emailVerified: user.emailVerified,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error('Google OAuth error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

/**
 * Exchange authorization code for access token
 *
 * @param code - Authorization code from Google
 * @returns Token response or null if failed
 */
async function exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse | null> {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google`;

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials not configured');
    }

    const tokenUrl = 'https://oauth2.googleapis.com/token';

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Google token exchange error:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Exchange code error:', error);
    return null;
  }
}

/**
 * Get user info from Google
 *
 * @param accessToken - Google access token
 * @returns User info or null if failed
 */
async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Google user info error:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Get user info error:', error);
    return null;
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
