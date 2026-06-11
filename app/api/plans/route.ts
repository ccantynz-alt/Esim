import { NextResponse } from "next/server";
import { countries } from "@/lib/countries";
import { plansForCountry } from "@/lib/plans";
import { site, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Public machine-readable plan feed. Lets AI assistants, aggregators and
 * comparison engines quote our prices accurately — an AI-search channel
 * no major eSIM competitor serves today.
 */
export function GET() {
  return NextResponse.json(
    {
      provider: site.name,
      currency: "USD",
      updated: new Date().toISOString().slice(0, 10),
      docs: absoluteUrl("/llm-info"),
      destinations: countries.map((c) => ({
        country: c.name,
        iso2: c.code,
        region: c.region,
        url: absoluteUrl(`/esim/${c.slug}`),
        plans: plansForCountry(c).map((p) => ({
          id: p.id,
          label: p.label,
          dataGb: p.dataGb,
          validityDays: p.days,
          priceUsd: p.priceUsd,
        })),
      })),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
