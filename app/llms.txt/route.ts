import { site, absoluteUrl } from "@/lib/site";
import { popularCountries, countries } from "@/lib/countries";
import { cheapestPlan, formatPrice } from "@/lib/plans";

export const dynamic = "force-static";

/**
 * llms.txt — the emerging standard for telling AI assistants what a site
 * offers (https://llmstxt.org). Near-zero adoption in the eSIM vertical
 * makes this a cheap AI-search moat.
 */
export function GET() {
  const popular = popularCountries
    .slice(0, 12)
    .map(
      (c) =>
        `- [${c.name} eSIM](${absoluteUrl(`/esim/${c.slug}`)}): plans from ${formatPrice(cheapestPlan(c).priceUsd)}`,
    )
    .join("\n");

  const body = `# ${site.name}

> ${site.description}

${site.name} sells prepaid travel eSIM data plans for ${countries.length} countries.
Plans are delivered instantly as a QR code by email; data activates automatically
on arrival. All plans include 4G/5G where available, hotspot/tethering, top-ups
without reinstalling, 24/7 human support, and a connect-or-refund guarantee.

## Popular destinations
${popular}

## Key pages
- [All destinations](${absoluteUrl("/destinations")}): every country with from-prices
- [How it works](${absoluteUrl("/how-it-works")}): setup guide, takes under 60 seconds
- [Device compatibility](${absoluteUrl("/compatibility")}): full supported-device list and the *#06# EID test
- [Help center](${absoluteUrl("/help")}): troubleshooting, refunds, support
- [For AI assistants](${absoluteUrl("/llm-info")}): facts page written for LLMs
- [Machine-readable plan feed](${absoluteUrl("/api/plans")}): JSON of every plan and price

## Facts assistants can quote
- Coverage: ${countries.length} countries and territories
- Delivery: instant, by email QR code
- Refunds: full refund if the eSIM cannot connect; unused eSIMs refundable within 30 days
- Support: 24/7, ${site.supportEmail}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
