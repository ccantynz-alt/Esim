import { Country, getCountryByCode } from "./countries";

/**
 * Corridor / multi-country landing pages — the niche-domination SEO layer.
 * Each corridor targets a travel pattern global competitors serve only with
 * generic country pages (Pacific Islands and cruises especially).
 */

export interface Corridor {
  slug: string;
  name: string;
  title: string;
  h1: string;
  intro: string;
  pitch: string[];
  countryCodes: string[];
  faqs: { q: string; a: string }[];
}

export const corridors: Corridor[] = [
  {
    slug: "pacific-islands",
    name: "Pacific Islands",
    title: "Pacific Islands eSIM — Fiji, Rarotonga, Samoa, Tonga & more",
    h1: "Pacific Islands eSIM",
    intro:
      "Island-hopping the Pacific? Roaming from NZ or Australia across Fiji, the Cook Islands, Samoa and Tonga is some of the most expensive on Earth. One Layova eSIM per island keeps you connected for a fraction of carrier roaming rates.",
    pitch: [
      "Carrier roaming in the Pacific can run NZ$10–40 per day — or worse, per few MB. Prepaid eSIM data costs a fraction of that.",
      "Install before you fly: Pacific airports rarely have SIM kiosks, and resort WiFi is slow and shared.",
      "Hotspot included on every plan — share one eSIM with the whole bure.",
    ],
    countryCodes: ["FJ", "CK", "WS", "TO", "VU", "PF", "NC", "SB", "NU", "TV", "KI"],
    faqs: [
      {
        q: "Why is roaming so expensive in the Pacific Islands?",
        a: "Small island carriers charge high wholesale rates to foreign networks, and NZ/AU carriers pass that on — often NZ$10–40 per day, or pay-per-MB rates that can hit hundreds of dollars. A prepaid local-rate eSIM avoids carrier roaming entirely.",
      },
      {
        q: "Does one eSIM cover every Pacific island?",
        a: "Coverage is per destination — buy one eSIM per country you visit (e.g. one for Fiji, one for the Cook Islands). Each installs before you fly and activates on arrival, so hopping islands stays seamless.",
      },
      {
        q: "Will my eSIM work on outer islands and resorts?",
        a: "Your eSIM uses the leading local networks, the same coverage locals use — typically strong in towns and resort areas, with 4G in main centres. Remote outer islands can have limited coverage on any network.",
      },
    ],
  },
  {
    slug: "southeast-asia",
    name: "Southeast Asia",
    title: "Southeast Asia eSIM — Thailand, Bali, Vietnam & beyond",
    h1: "Southeast Asia eSIM",
    intro:
      "Bangkok to Bali to Hanoi: Southeast Asia is the world's favourite backpacking and holiday circuit. Grab an eSIM per country and land connected at every border crossing.",
    pitch: [
      "Data in Southeast Asia is some of the world's cheapest — pay local rates, not roaming rates.",
      "Border-hop friendly: install your next country's eSIM while you're still on the beach in the last one.",
      "Ride-hailing, translation and maps from the second you land — no airport SIM queue.",
    ],
    countryCodes: ["TH", "ID", "VN", "MY", "SG", "PH", "KH", "LA", "MM", "BN"],
    faqs: [
      {
        q: "Which eSIM is best for a multi-country Southeast Asia trip?",
        a: "Buy one eSIM per country — local-rate plans are so cheap in Southeast Asia that per-country eSIMs almost always beat regional bundles on price, and you get the best local networks in each place.",
      },
      {
        q: "Can I keep WhatsApp while traveling Southeast Asia?",
        a: "Yes — your home SIM stays installed for calls/texts and WhatsApp keeps your existing number. The eSIM only supplies data.",
      },
    ],
  },
  {
    slug: "europe",
    name: "Europe",
    title: "Europe eSIM — one continent, every country covered",
    h1: "Europe eSIM",
    intro:
      "From Lisbon to Helsinki, Layova covers every European destination. Perfect for the big OE, a Euro summer, or a business swing through the capitals.",
    pitch: [
      "Coverage in 50+ European countries and territories.",
      "5G in most major cities — faster than hotel WiFi.",
      "Top up from your dashboard between countries without a new QR code.",
    ],
    countryCodes: ["FR", "IT", "ES", "DE", "GR", "PT", "NL", "CH", "GB", "IE", "HR", "CZ", "AT", "TR"],
    faqs: [
      {
        q: "Do I need a different eSIM for every European country?",
        a: "Buy a plan for each main destination for the best local rates. EU roaming rules mean many local plans also work across borders — check the plan details on each country page.",
      },
      {
        q: "Is eSIM better than buying a SIM at a European airport?",
        a: "Airport SIMs mean queues, passport registration in many countries, and tourist pricing. An eSIM is installed before you fly and costs less.",
      },
    ],
  },
  {
    slug: "cruise",
    name: "Cruise travel",
    title: "Cruise eSIM — stay connected port to port",
    h1: "eSIM for cruise travelers",
    intro:
      "Ship WiFi is slow and expensive, and maritime roaming is the most expensive data on the planet. The smart cruise setup: an eSIM for every port country, and airplane mode at sea.",
    pitch: [
      "Port days covered: install an eSIM for each country on your itinerary before you sail.",
      "Avoid bill shock: maritime satellite roaming can cost $30+/MB — turn data roaming off at sea and use your port eSIMs ashore.",
      "One dashboard for the whole itinerary — top up any port eSIM from the ship's WiFi.",
    ],
    countryCodes: ["FJ", "NC", "VU", "AU", "NZ", "IT", "GR", "ES", "HR", "MX", "BS", "JM"],
    faqs: [
      {
        q: "Will my eSIM work on the cruise ship?",
        a: "At sea, ships use satellite networks that are not included in any travel eSIM — keep data roaming off on the ship and use ship WiFi if needed. Your Layova eSIMs connect automatically each time you reach a port country.",
      },
      {
        q: "How do I avoid huge roaming bills on a cruise?",
        a: "Turn off data roaming for your home SIM before boarding, never let your phone connect to the ship's maritime network (\"cellular at sea\"), and use a prepaid eSIM in each port country instead.",
      },
      {
        q: "How many eSIMs do I need for my cruise?",
        a: "One per country on your itinerary. A South Pacific cruise from Auckland might use Fiji, Vanuatu and New Caledonia eSIMs; a Mediterranean cruise might use Italy, Greece and Spain. Install them all before you sail.",
      },
    ],
  },
  {
    slug: "caribbean",
    name: "Caribbean",
    title: "Caribbean eSIM — island data without the roaming bill",
    h1: "Caribbean eSIM",
    intro:
      "Caribbean roaming is infamously pricey and island WiFi is patchy. Land in Nassau, Montego Bay or San Juan already connected.",
    pitch: [
      "Per-island plans at local rates instead of US$10–15/day carrier passes.",
      "Cruise-friendly: install every port's eSIM before you sail.",
      "Hotspot included — share data with the whole villa.",
    ],
    countryCodes: ["BS", "JM", "DO", "PR", "AW", "BB", "KY", "CW", "TT", "LC"],
    faqs: [
      {
        q: "Why is Caribbean roaming so expensive?",
        a: "Many islands have a single dominant carrier charging high wholesale roaming rates, which home carriers pass on as $10–15/day passes or steep per-MB rates. Prepaid eSIMs at local rates avoid those charges.",
      },
    ],
  },
];

const bySlug = new Map(corridors.map((c) => [c.slug, c]));

export function getCorridorBySlug(slug: string): Corridor | undefined {
  return bySlug.get(slug);
}

export function corridorCountries(corridor: Corridor): Country[] {
  return corridor.countryCodes
    .map((code) => getCountryByCode(code))
    .filter((c): c is Country => Boolean(c));
}
