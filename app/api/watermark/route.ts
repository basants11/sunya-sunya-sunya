import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/watermark
 * Generates a watermark payload with user information
 * In production, this requires authentication and signs the payload with HMAC-SHA256
 */
export async function GET(request: NextRequest) {
  try {
    // Generate a session ID for tracking
    const sessionId = crypto.randomUUID();

    // Get user information from session/auth headers
    // In production, this would come from a verified session
    const authHeader = request.headers.get('Authorization');
    let email = 'guest';

    if (authHeader) {
      // In production, decode JWT and extract email
      // For now, we'll use a placeholder
      email = 'user@authenticated';
    }

    // Create watermark payload
    const payload = {
      email: email,
      phone: '', // Only include if user has provided phone and is authenticated
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
    };

    // Sign payload with HMAC-SHA256 for security in production
    const secret = process.env.WATERMARK_SECRET;
    const signature = secret
      ? crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex')
      : 'demo-signature';

    return NextResponse.json({
      payload: JSON.stringify(payload),
      signature: signature,
    });
  } catch (error) {
    console.error('Error generating watermark:', error);
    return NextResponse.json({ error: 'Failed to generate watermark' }, { status: 500 });
  }
}
