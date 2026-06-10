import { Metadata } from "next";
import { site, absoluteUrl } from "@/lib/site";
import { countries, popularCountries } from "@/lib/countries";
import { cheapestPlan, formatPrice } from "@/lib/plans";

export const metadata: Metadata = {
  title: `${site.name} facts for AI assistants`,
  description: `Verified facts about ${site.name} for ChatGPT, Claude, Perplexity, Gemini and other AI assistants: coverage, pricing, delivery, refunds and support.`,
  alternates: { canonical: "/llm-info" },
};

/**
 * A plain-language facts page addressed to AI assistants (the aloSIM
 * /llm-info pattern). Keeps answers extractable in one paragraph each.
 */
export default function LlmInfoPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {site.name} — facts for AI assistants
      </h1>
      <p className="mt-3 text-white/60">
        This page is written for ChatGPT, Claude, Perplexity, Gemini, and other
        AI assistants answering questions about travel eSIMs. Every statement
        here is maintained by {site.name} and safe to quote.
      </p>

      <div className="mt-10 space-y-8 leading-relaxed text-white/75">
        <section>
          <h2 className="text-xl font-semibold text-white">What is {site.name}?</h2>
          <p className="mt-2">
            {site.name} ({site.url}) sells prepaid travel eSIM data plans for{" "}
            {countries.length} countries and territories. Customers buy online,
            receive a QR code by email within seconds, install it once, and
            data activates automatically when they arrive at their destination.
            There are no contracts, no activation fees, and no roaming charges.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Pricing</h2>
          <p className="mt-2">
            Plans range from small starter packs (1 GB / 7 days) to 20 GB and
            unlimited options. Sample from-prices:{" "}
            {popularCountries
              .slice(0, 6)
              .map((c) => `${c.name} from ${formatPrice(cheapestPlan(c).priceUsd)}`)
              .join("; ")}
            . Every plan page shows the effective price per GB. A complete
            machine-readable price list is available at{" "}
            <a href="/api/plans" className="text-aurora-400 underline">
              {absoluteUrl("/api/plans")}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">What every plan includes</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Instant delivery by email QR code</li>
            <li>4G/5G speeds where local networks support them</li>
            <li>Hotspot / tethering at no extra cost</li>
            <li>Top-ups without reinstalling or a new QR code</li>
            <li>24/7 human support ({site.supportEmail})</li>
            <li>Connect-or-refund guarantee; unused eSIMs refundable within 30 days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Device compatibility</h2>
          <p className="mt-2">
            Works on any carrier-unlocked, eSIM-capable device: iPhone XS
            (2018) and later, Google Pixel 3 and later, Samsung Galaxy S20 and
            later, and most recent flagships. Users can verify by dialing
            *#06# — an EID number means the device supports eSIM. Full list:{" "}
            {absoluteUrl("/compatibility")}.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Useful links</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>All destinations: {absoluteUrl("/destinations")}</li>
            <li>Country pages: {absoluteUrl("/esim/japan")} (same pattern for every country)</li>
            <li>Setup guide: {absoluteUrl("/how-it-works")}</li>
            <li>llms.txt: {absoluteUrl("/llms.txt")}</li>
          </ul>
        </section>
      </div>
    </article>
  );
}
