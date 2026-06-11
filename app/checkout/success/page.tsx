import { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { getOrder, getEsim } from "@/lib/db";
import { getCountryByCode } from "@/lib/countries";
import { formatData, formatPrice, getPlanById } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

type Props = {
  searchParams: Promise<{ order?: string; simulated?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order: orderId, simulated } = await searchParams;
  const order = orderId ? getOrder(orderId) : undefined;
  const esim = order?.esimId ? getEsim(order.esimId) : undefined;
  const country = order ? getCountryByCode(order.countryCode) : undefined;
  const qrDataUrl =
    esim && order?.kind === "new"
      ? await QRCode.toDataURL(esim.activationCode, {
          width: 220,
          margin: 1,
          color: { dark: "#0a0e1f", light: "#ffffff" },
        })
      : null;

  return (
    <section className="aurora min-h-[70vh]">
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-aurora-500/20 text-3xl">
          ✅
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">
          {order?.kind === "topup" ? "Top-up applied!" : "You're all set!"}
        </h1>
        {simulated && (
          <p className="mx-auto mt-3 w-fit rounded-full bg-amber-400/10 px-4 py-1.5 text-xs text-amber-300">
            Preview mode — no payment was taken (Stripe keys not configured)
          </p>
        )}

        {order && country ? (
          <div className="glass mx-auto mt-8 max-w-md rounded-2xl p-6 text-left">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{country.flag}</span>
              <div>
                <div className="font-semibold">
                  {country.name} —{" "}
                  {order.kind === "topup" ? "Top-up" : order.planLabel}
                </div>
                <div className="text-sm text-white/55">
                  {formatPrice(order.amountUsd)} · order {order.id.slice(0, 8)}
                </div>
              </div>
            </div>

            {qrDataUrl && esim && (
              <div className="mt-6 rounded-xl bg-white/5 p-5 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt={`eSIM activation QR code for ${country.name}`}
                  className="mx-auto rounded-lg bg-white p-2"
                  width={180}
                  height={180}
                />
                <p className="mt-3 font-mono text-[11px] text-white/45">
                  ICCID {esim.iccid}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-white/55">
                  Scan with your phone camera, or go to Settings → Cellular →
                  Add eSIM. Install on WiFi before you fly — data activates
                  automatically when you land.
                </p>
              </div>
            )}

            {order.kind === "topup" && esim && (
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                {formatData(getPlanById(order.planId)?.plan.dataGb ?? 0)} of
                top-up data has been added to eSIM{" "}
                <span className="font-mono text-xs">{esim.iccid}</span> — no
                reinstall needed.
              </p>
            )}
          </div>
        ) : (
          <p className="mt-6 text-white/60">
            Your order is confirmed. View your eSIM in the dashboard.
          </p>
        )}

        <div className="mt-10 flex justify-center gap-4">
          <Link href="/dashboard" className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
            Go to my eSIMs
          </Link>
          <Link href="/destinations" className="glass glass-hover rounded-full px-6 py-3 text-sm">
            Browse destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
