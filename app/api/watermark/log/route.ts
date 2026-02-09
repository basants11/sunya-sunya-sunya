import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, timestamp } = body;

    // Log the watermark display for security monitoring
    // In production, this would be stored in a database or logging service
    console.log('Watermark display logged:', {
      userId,
      timestamp,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    });

    // Return success response
    return NextResponse.json({ success: true, message: 'Watermark display logged' });
  } catch (error) {
    console.error('Error logging watermark display:', error);
    return NextResponse.json(
      { error: 'Failed to log watermark display' },
      { status: 500 }
    );
  }
}
