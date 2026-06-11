/**
 * Country catalog for all destinations we sell eSIMs in.
 *
 * Names and flag emoji are derived from ISO 3166-1 alpha-2 codes at module
 * load (Intl.DisplayNames + regional indicator code points), so the catalog
 * stays tiny and can't drift out of sync with itself. Regions are grouped
 * by hand because no runtime API exposes them.
 */

export type Region =
  | "Europe"
  | "Asia"
  | "North America"
  | "South America"
  | "Africa"
  | "Oceania"
  | "Middle East"
  | "Caribbean";

const REGION_CODES: Record<Region, string[]> = {
  Europe: [
    "AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE",
    "FO", "FI", "FR", "DE", "GI", "GR", "GG", "HU", "IS", "IE", "IM", "IT",
    "JE", "XK", "LV", "LI", "LT", "LU", "MT", "MD", "MC", "ME", "NL", "MK",
    "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH",
    "UA", "GB", "VA", "AX",
  ],
  Asia: [
    "AF", "AM", "AZ", "BD", "BT", "BN", "KH", "CN", "GE", "HK", "IN", "ID",
    "JP", "KZ", "KG", "LA", "MO", "MY", "MV", "MN", "MM", "NP", "PK", "PH",
    "SG", "KR", "LK", "TW", "TJ", "TH", "TL", "TM", "UZ", "VN",
  ],
  "North America": ["BM", "CA", "CR", "SV", "GL", "GT", "HN", "MX", "NI", "PA", "BZ", "US"],
  "South America": [
    "AR", "BO", "BR", "CL", "CO", "EC", "FK", "GF", "GY", "PY", "PE", "SR",
    "UY", "VE",
  ],
  Africa: [
    "DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG",
    "CD", "CI", "DJ", "EG", "GQ", "SZ", "ET", "GA", "GM", "GH", "GN", "GW",
    "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA",
    "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ",
    "TG", "TN", "UG", "ZM", "ZW", "RE", "ER",
  ],
  Oceania: ["AS", "AU", "FJ", "PF", "GU", "KI", "NR", "NC", "NZ", "PW", "PG", "WS", "SB", "TO", "TV", "VU", "FM", "MH"],
  "Middle East": [
    "BH", "IR", "IQ", "IL", "JO", "KW", "LB", "OM", "PS", "QA", "SA", "SY",
    "TR", "AE", "YE",
  ],
  Caribbean: [
    "AI", "AG", "AW", "BS", "BB", "VG", "KY", "CU", "CW", "DM", "DO", "GD",
    "GP", "HT", "JM", "MQ", "MS", "PR", "KN", "LC", "VC", "SX", "TT", "TC",
    "VI",
  ],
};

/** Destinations highlighted on the homepage and ranked first in search. */
const POPULAR = new Set([
  "US", "GB", "JP", "TH", "TR", "FR", "ES", "IT", "AE", "AU", "ID", "MX",
  "VN", "GR", "PT", "SG", "KR", "EG", "BR", "CA", "DE", "NL", "CH", "NZ",
]);

/** Codes Intl.DisplayNames can't resolve (user-assigned ranges). */
const NAME_OVERRIDES: Record<string, string> = { XK: "Kosovo" };

/** Friendlier names than the official ISO ones for marketing pages. */
const DISPLAY_OVERRIDES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  KR: "South Korea",
  CD: "DR Congo",
  CI: "Ivory Coast",
  VA: "Vatican City",
  PS: "Palestine",
  RU: "Russia",
  SY: "Syria",
  LA: "Laos",
  VN: "Vietnam",
  TZ: "Tanzania",
  FM: "Micronesia",
  MD: "Moldova",
  BN: "Brunei",
};

export interface Country {
  code: string;
  name: string;
  slug: string;
  region: Region;
  flag: string;
  popular: boolean;
}

function flagEmoji(code: string): string {
  if (code === "XK") return "🇽🇰";
  return String.fromCodePoint(
    ...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const displayNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryName(code: string): string {
  if (DISPLAY_OVERRIDES[code]) return DISPLAY_OVERRIDES[code];
  if (NAME_OVERRIDES[code]) return NAME_OVERRIDES[code];
  return displayNames.of(code) ?? code;
}

export const countries: Country[] = (
  Object.entries(REGION_CODES) as [Region, string[]][]
)
  .flatMap(([region, codes]) =>
    codes.map((code) => {
      const name = countryName(code);
      return {
        code,
        name,
        slug: slugify(name),
        region,
        flag: flagEmoji(code),
        popular: POPULAR.has(code),
      };
    }),
  )
  .sort((a, b) => a.name.localeCompare(b.name));

const bySlug = new Map(countries.map((c) => [c.slug, c]));
const byCode = new Map(countries.map((c) => [c.code, c]));

export function getCountryBySlug(slug: string): Country | undefined {
  return bySlug.get(slug);
}

export function getCountryByCode(code: string): Country | undefined {
  return byCode.get(code.toUpperCase());
}

export const popularCountries = countries.filter((c) => c.popular);

export const regions = Object.keys(REGION_CODES) as Region[];

export function countriesInRegion(region: Region): Country[] {
  return countries.filter((c) => c.region === region);
}
