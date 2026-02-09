/**
 * Subscription Creation API Route
 * Creates a new subscription after verifying Firebase ID token
 * Integrates with payment gateway for processing
 */

import type { SubscriptionActionRequest } from "@/lib/auth/types";
import { NextResponse, type NextRequest } from "next/server";

/**
 * POST /api/subscription/create
 * Creates a new subscription with token verification
 */
export async function POST(request: NextRequest) {
  try {
    // Get Authorization header
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Authorization token required",
        },
        { status: 401 },
      );
    }

    const idToken = authHeader.split("Bearer ")[1];

    if (!idToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid authorization format",
        },
        { status: 401 },
      );
    }

    // Verify Firebase token (in production, use Firebase Admin SDK)
    // const decodedToken = await getAuth().verifyIdToken(idToken);

    // For now, do basic validation
    if (idToken.length < 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
        },
        { status: 401 },
      );
    }

    // Parse request body
    const body: SubscriptionActionRequest & { planName?: string } =
      await request.json();
    const { planId, planName } = body;

    if (!planId) {
      return NextResponse.json(
        {
          success: false,
          error: "Plan ID is required",
        },
        { status: 400 },
      );
    }

    // TODO: Verify user in database
    // const user = await db.users.findUnique({ where: { uid: decodedToken.uid } });

    // TODO: Check if user already has active subscription
    // const existingSubscription = await db.subscriptions.findFirst({
    //   where: { userId: user.id, status: 'active' }
    // });

    // TODO: Create subscription record
    // const subscription = await db.subscriptions.create({
    //   data: {
    //     userId: user.id,
    //     planId,
    //     status: 'pending',
    //     createdAt: new Date(),
    //   }
    // });

    // TODO: Create payment session with your payment provider
    // const paymentSession = await createPaymentSession({
    //   subscriptionId: subscription.id,
    //   planId,
    //   amount: getPlanAmount(planId),
    //   currency: 'NPR',
    // });

    // Mock response - replace with actual implementation
    return NextResponse.json({
      success: true,
      message: "Subscription initiated",
      subscriptionId: "sub_" + Date.now(),
      // checkoutUrl: paymentSession.url, // Redirect to payment gateway
      planId,
      planName: planName || planId,
      status: "pending_payment",
    });
  } catch (error) {
    console.error("Subscription creation error:", error);

    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/subscription/create
 * Returns available subscription plans
 */
export async function GET() {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 2199,
      currency: "NPR",
      interval: "monthly",
      features: [
        "1 premium fruit variety (250g)",
        "Monthly delivery",
        "10% subscriber discount",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 5299,
      currency: "NPR",
      interval: "monthly",
      features: [
        "3 premium fruit varieties (250g each)",
        "Monthly delivery",
        "20% subscriber discount",
        "Early access to limited batches",
      ],
    },
    {
      id: "elite",
      name: "Elite",
      price: 9999,
      currency: "NPR",
      interval: "monthly",
      features: [
        "6 premium fruit varieties (250g each)",
        "Monthly delivery",
        "30% subscriber discount",
        "Dedicated WhatsApp concierge",
      ],
    },
  ];

  return NextResponse.json({ plans });
}
