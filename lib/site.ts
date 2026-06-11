/**
 * Single source of truth for brand + site identity.
 * Brand: Layova (from "layover") — vetted June 2026: no existing brand,
 * app, or eSIM service collisions found. Primary domain: layova.travel
 * (register layova.shop / layova.online as defensive redirects).
 */
export const site = {
  name: "Layova",
  legalName: "Layova Ltd",
  tagline: "Instant eSIM data in 190+ countries",
  description:
    "Layova gives travelers instant eSIM data plans in 190+ countries. Scan a QR code, connect in seconds, and skip roaming fees forever. No physical SIM, no contracts, no surprises.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.layova.travel",
  twitter: "@layova",
  supportEmail: "support@layova.travel",
  countryCount: 190,
} as const;

export function absoluteUrl(path: string): string {
  return `${site.url.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
