import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getOrder, logEvent } from "@/lib/db";
import { fulfillOrder } from "@/lib/fulfill";

/**
 * Stripe webhook receiver. Verifies signatures and fulfills paid orders
 * through the same path as preview-mode checkout.
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
    logEvent("warn", "stripe.bad_signature", "Webhook received with invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const order = orderId ? getOrder(orderId) : undefined;
      if (!order) {
        logEvent("error", "stripe.orphan_session", `Checkout session ${session.id} has no matching order`);
        break;
      }
      if (order.status === "paid") break; // idempotency: webhooks can repeat
      logEvent("info", "payment.paid", `Order ${order.id.slice(0, 8)} paid via Stripe (${session.id})`);
      await fulfillOrder({ ...order, stripeSessionId: session.id });
      break;
    }
    case "charge.refunded":
      logEvent("warn", "stripe.refund", "Charge refunded in Stripe — reconcile in admin → orders");
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
