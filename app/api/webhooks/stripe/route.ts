import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

/**
 * Stripe webhook receiver. Verifies signatures and handles the events
 * that matter for eSIM fulfillment. Provisioning is stubbed — connect
 * the eSIM supplier API inside `fulfillOrder` when ready.
 *
 * Local testing:  stripe listen --forward-to localhost:3000/api/webhooks/stripe
 */
export async function POST(req: NextRequest) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhooks not configured" },
      { status: 503 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      await fulfillOrder({
        sessionId: session.id,
        planId: session.metadata?.planId,
        countryCode: session.metadata?.countryCode,
        customerEmail: session.customer_details?.email ?? undefined,
      });
      break;
    }
    case "charge.refunded":
      // TODO: deactivate the eSIM profile tied to this charge.
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function fulfillOrder(order: {
  sessionId: string;
  planId?: string;
  countryCode?: string;
  customerEmail?: string;
}) {
  // TODO when the eSIM supplier is chosen:
  //  1. Call the supplier API to provision a profile for order.planId.
  //  2. Store the order + ICCID + QR activation code in the database.
  //  3. Email the QR code to order.customerEmail.
  console.log("[fulfill] checkout completed", order);
}
