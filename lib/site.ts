/**
 * Single source of truth for brand + site identity.
 * The brand name is a working title — swap it here once the final
 * name is chosen from docs/COMPETITOR-AUDIT.md and the change
 * propagates everywhere (metadata, JSON-LD, llms.txt, emails).
 */
export const site = {
  name: "Voyamo",
  legalName: "Voyamo Ltd",
  tagline: "Instant eSIM data in 190+ countries",
  description:
    "Voyamo gives travelers instant eSIM data plans in 190+ countries. Scan a QR code, connect in seconds, and skip roaming fees forever. No physical SIM, no contracts, no surprises.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.voyamo.com",
  twitter: "@voyamo",
  supportEmail: "support@voyamo.com",
  countryCount: 190,
} as const;

export function absoluteUrl(path: string): string {
  return `${site.url.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
