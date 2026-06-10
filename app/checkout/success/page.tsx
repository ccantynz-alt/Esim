import { Metadata } from "next";
import Link from "next/link";
import { getPlanById, formatData, formatPrice } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

type Props = {
  searchParams: Promise<{ plan?: string; simulated?: string; session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { plan: planId, simulated } = await searchParams;
  const found = planId ? getPlanById(planId) : undefined;

  return (
    <section className="aurora min-h-[70vh]">
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-aurora-500/20 text-3xl">
          ✅
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">
          {simulated ? "Test order complete" : "You're all set!"}
        </h1>

        {found ? (
          <div className="glass mx-auto mt-8 max-w-md rounded-2xl p-6 text-left">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{found.country.flag}</span>
              <div>
                <div className="font-semibold">
                  {found.country.name} eSIM — {found.plan.label}
                </div>
                <div className="text-sm text-white/55">
                  {formatData(found.plan.dataGb)} · {found.plan.days} days ·{" "}
                  {formatPrice(found.plan.priceUsd)}
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {simulated
                ? "This was a simulated checkout — Stripe keys aren't configured yet, so no payment was taken. Once Stripe goes live, the QR code is emailed here instead."
                : "Your QR code is on its way to your inbox and is also available in your dashboard. Install it on WiFi before you fly."}
            </p>
          </div>
        ) : (
          <p className="mt-6 text-white/60">
            Your order is confirmed. Check your email for the eSIM QR code.
          </p>
        )}

        <div className="mt-10 flex justify-center gap-4">
          <Link href="/dashboard" className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
            Go to my eSIMs
          </Link>
          <Link href="/destinations" className="glass glass-hover rounded-full px-6 py-3 text-sm">
            Browse more destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
