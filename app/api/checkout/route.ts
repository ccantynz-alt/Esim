import { NextRequest, NextResponse } from "next/server";
import { getPlanById, formatData } from "@/lib/plans";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/site";
import { getSession } from "@/lib/auth";
import { createOrder, getEsim, logEvent } from "@/lib/db";
import { fulfillOrder } from "@/lib/fulfill";

/**
 * POST /api/checkout  { planId: string, topupEsimId?: string }
 *
 * Creates an order (new eSIM, or top-up of an existing one), then:
 *  - Stripe configured  → returns a Stripe Checkout URL; the webhook fulfills.
 *  - Preview mode       → simulates payment and fulfills immediately.
 */
export async function POST(req: NextRequest) {
  let planId: unknown, topupEsimId: unknown;
  try {
    ({ planId, topupEsimId } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof planId !== "string") {
    return NextResponse.json({ error: "planId is required" }, { status: 400 });
  }

  const found = getPlanById(planId);
  if (!found) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 404 });
  }
  const { plan, country } = found;

  const session = await getSession();
  const email = session?.email ?? "guest@layova.travel";

  let kind: "new" | "topup" = "new";
  if (typeof topupEsimId === "string" && topupEsimId) {
    const esim = getEsim(topupEsimId);
    if (!esim) {
      return NextResponse.json({ error: "Unknown eSIM" }, { status: 404 });
    }
    if (session && esim.email !== session.email) {
      return NextResponse.json({ error: "Not your eSIM" }, { status: 403 });
    }
    kind = "topup";
  }

  const order = createOrder({
    email,
    kind,
    planId: plan.id,
    countryCode: country.code,
    planLabel: plan.label,
    amountUsd: plan.priceUsd,
    esimId: kind === "topup" ? (topupEsimId as string) : undefined,
  });

  if (!isStripeConfigured()) {
    logEvent("info", "payment.simulated", `Order ${order.id.slice(0, 8)} paid (preview mode, no charge)`);
    await fulfillOrder(order);
    return NextResponse.json({
      url: `/checkout/success?order=${order.id}&simulated=1`,
      simulated: true,
    });
  }

  const stripe = getStripe();
  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session?.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(plan.priceUsd * 100),
          product_data: {
            name:
              kind === "topup"
                ? `${country.name} eSIM top-up — ${formatData(plan.dataGb)}`
                : `${country.name} eSIM — ${plan.label}`,
            description: `${formatData(plan.dataGb)} · ${plan.days} days · ${country.name}`,
          },
        },
      },
    ],
    metadata: { orderId: order.id },
    success_url: absoluteUrl(`/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`),
    cancel_url: absoluteUrl(`/esim/${country.slug}`),
  });

  return NextResponse.json({ url: checkout.url });
}
