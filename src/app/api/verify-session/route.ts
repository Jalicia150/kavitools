import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { pro: false, error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { pro: false, error: "Missing session_id" },
      { status: 400 }
    );
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2023-10-16",
  });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const now = new Date();
      const expires = new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000);

      return NextResponse.json({
        pro: true,
        email: session.customer_email || session.customer_details?.email || "",
        expires: expires.toISOString(),
      });
    }

    return NextResponse.json({ pro: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Session verification failed: ${message}`);
    return NextResponse.json(
      { pro: false, error: "Invalid session" },
      { status: 400 }
    );
  }
}
