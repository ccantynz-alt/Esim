import { Country, Region, countries, getCountryBySlug } from "./countries";

/**
 * Plan catalog. Prices are deterministic per country (seeded by region +
 * country code) so every page renders stable, realistic pricing until the
 * real carrier rate sheet is plugged in. Replace `priceFor` with live
 * inventory once an eSIM supplier (e.g. an MVNO aggregator API) is wired up.
 */

export interface Plan {
  id: string;
  countryCode: string;
  label: string;
  dataGb: number | "unlimited";
  days: number;
  priceUsd: number;
  popular?: boolean;
}

interface PlanShape {
  label: string;
  dataGb: number | "unlimited";
  days: number;
  /** multiplier applied to the country's base per-GB-ish rate */
  factor: number;
  popular?: boolean;
}

const SHAPES: PlanShape[] = [
  { label: "Starter", dataGb: 1, days: 7, factor: 1 },
  { label: "Traveler", dataGb: 3, days: 30, factor: 2.1 },
  { label: "Explorer", dataGb: 5, days: 30, factor: 2.9, popular: true },
  { label: "Nomad", dataGb: 10, days: 30, factor: 4.6 },
  { label: "Resident", dataGb: 20, days: 30, factor: 7.2 },
  { label: "Unlimited", dataGb: "unlimited", days: 10, factor: 8.5 },
];

/** Base 1GB price band per region, in USD. */
const REGION_BASE: Record<Region, number> = {
  Europe: 3.5,
  Asia: 3.0,
  "North America": 4.5,
  "South America": 5.0,
  Africa: 6.0,
  Oceania: 5.0,
  "Middle East": 5.5,
  Caribbean: 6.5,
};

function seed(code: string): number {
  // Small deterministic jitter (0–1) so countries in a region don't all
  // share identical prices.
  return ((code.charCodeAt(0) * 31 + code.charCodeAt(1) * 7) % 100) / 100;
}

function priceFor(country: Country, shape: PlanShape): number {
  const base = REGION_BASE[country.region] * (0.85 + seed(country.code) * 0.4);
  const raw = base * shape.factor;
  // Round to a .99-style price point.
  return Math.max(2.99, Math.round(raw) - 0.01);
}

export function plansForCountry(country: Country): Plan[] {
  return SHAPES.map((shape) => ({
    id: `${country.code.toLowerCase()}-${shape.label.toLowerCase()}`,
    countryCode: country.code,
    label: shape.label,
    dataGb: shape.dataGb,
    days: shape.days,
    priceUsd: priceFor(country, shape),
    popular: shape.popular,
  }));
}

export function cheapestPlan(country: Country): Plan {
  return plansForCountry(country)[0];
}

export function getPlanById(id: string): { plan: Plan; country: Country } | undefined {
  const code = id.split("-")[0]?.toUpperCase();
  const country = countries.find((c) => c.code === code);
  if (!country) return undefined;
  const plan = plansForCountry(country).find((p) => p.id === id);
  return plan ? { plan, country } : undefined;
}

export function getPlansBySlug(slug: string): { country: Country; plans: Plan[] } | undefined {
  const country = getCountrySafe(slug);
  return country ? { country, plans: plansForCountry(country) } : undefined;
}

function getCountrySafe(slug: string): Country | undefined {
  return getCountryBySlug(slug);
}

export function formatData(dataGb: number | "unlimited"): string {
  return dataGb === "unlimited" ? "Unlimited" : `${dataGb} GB`;
}

export function formatPrice(usd: number): string {
  return `$${usd.toFixed(2)}`;
}
