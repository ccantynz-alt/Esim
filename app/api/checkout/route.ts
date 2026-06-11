import { NextRequest, NextResponse } from "next/server";
import { getPlanById, formatData } from "@/lib/plans";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/site";

/**
 * POST /api/checkout  { planId: string }
 *
 * With Stripe configured: creates a Checkout Session and returns its URL.
 * Without keys (preview mode): returns a simulated success URL so the
 * full purchase flow is testable before payments go live.
 */
export async function POST(req: NextRequest) {
  let planId: unknown;
  try {
    ({ planId } = await req.json());
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

  if (!isStripeConfigured()) {
    return NextResponse.json({
      url: `/checkout/success?plan=${encodeURIComponent(plan.id)}&simulated=1`,
      simulated: true,
    });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(plan.priceUsd * 100),
          product_data: {
            name: `${country.name} eSIM — ${plan.label}`,
            description: `${formatData(plan.dataGb)} · ${plan.days} days · ${country.name}`,
            metadata: { planId: plan.id, countryCode: country.code },
          },
        },
      },
    ],
    metadata: { planId: plan.id, countryCode: country.code },
    success_url: absoluteUrl(`/checkout/success?plan=${plan.id}&session_id={CHECKOUT_SESSION_ID}`),
    cancel_url: absoluteUrl(`/esim/${country.slug}`),
    automatic_tax: { enabled: false },
  });

  return NextResponse.json({ url: session.url });
}
