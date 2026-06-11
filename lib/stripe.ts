import Stripe from "stripe";

/**
 * Stripe plumbing. Fully wired but inert until the secret keys are set —
 * the site runs in "preview mode" without them and checkout falls back to
 * a simulated order. Nothing goes live until STRIPE_SECRET_KEY exists.
 *
 * Required env (see .env.example):
 *   STRIPE_SECRET_KEY            sk_test_... (then sk_live_... at launch)
 *   STRIPE_WEBHOOK_SECRET        whsec_...   (from `stripe listen` or dashboard)
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  pk_test_...
 */

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "Stripe is not configured. Set STRIPE_SECRET_KEY (see .env.example).",
    );
  }
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}
