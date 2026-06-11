# SEO & AI-Search Campaign Playbook

The growth engine for the site. Built from the gaps found in
[COMPETITOR-AUDIT.md](./COMPETITOR-AUDIT.md). Items marked ✅ ship in this
codebase today; the rest are the campaign roadmap.

---

## 1. What's already live in the code ✅

| Asset | Where | Why it matters |
|---|---|---|
| ~190 programmatic country pages | `app/esim/[slug]/page.tsx` | The money-page long tail ("Japan eSIM", "eSIM for Italy") — statically generated, unique copy, per-GB pricing |
| Product + AggregateOffer schema | `components/JsonLd.tsx` | Price-rich results in Google ("from $3.99") like Airalo gets |
| FAQPage schema on every country page + content pages | `components/Faq.tsx` | FAQ rich results + extractable answers for AI search |
| Organization + WebSite + SearchAction schema | root layout | Sitelinks search box eligibility, brand entity |
| BreadcrumbList schema | country pages | Breadcrumb rich results |
| XML sitemap (all ~196 URLs) | `app/sitemap.ts` | Instant full-site indexing |
| robots.txt welcoming GPTBot/ClaudeBot/PerplexityBot | `app/robots.ts` | AI crawlers explicitly allowed |
| llms.txt | `app/llms.txt/route.ts` | Emerging AI-search standard; ~zero adoption among competitors |
| /llm-info facts page | `app/llm-info/page.tsx` | The aloSIM pattern — quotable facts for assistants |
| JSON plan feed | `app/api/plans/route.ts` | Lets AI agents/aggregators quote prices accurately — nobody else does this |
| Canonical URLs, OG/Twitter cards, title templates | every page | Baseline hygiene leaders get wrong on long-tail pages |
| Static rendering, no client JS on content sections | architecture | Core Web Vitals edge — leaders' pages are heavy |

## 2. Launch-week checklist

1. Pick final brand + domain (see audit §5a), update `lib/site.ts`, set `NEXT_PUBLIC_SITE_URL`.
2. Google Search Console + Bing Webmaster: verify, submit sitemap.
3. Set up GA4 (or Plausible) + conversion events on `/api/checkout` clicks.
4. Trustpilot company profile — seed reviews from day one (leaders have 13k–31k; volume is the trust signal).
5. OG image generation (`next/og`) — one branded card per country page.
6. hreflang plan: ship English first, structure URLs for `/es/`, `/de/`, `/fr/` later (Holafly's multilingual moat).

## 3. Content roadmap (priority order)

1. **Deepen the 24 popular country pages** with real local data: carrier networks used, 5G status, measured speeds, airport arrival tips. Quality bar: beat eSIMDB's data tables. This is the single biggest ranking lever.
2. **Comparison layer:** `/compare/airalo-vs-holafly` etc. + `/alternatives/{brand}` — genuinely honest, dated, data-table-driven (every competitor does this dishonestly; honesty earns links).
3. **"Best eSIM for {country}"** editorial guides for the top 30 destinations.
4. **Regional hub pages:** `/esim/europe`, `/esim/asia` (regional multi-country plans).
5. **Airport pages** for the top 50 airports ("eSIM at Narita Airport") — unserved intent.
6. **Annual "State of Roaming Prices" report** — the linkable asset for digital-PR outreach.
7. **Interactive compatibility checker** ("is my phone eSIM compatible" has big volume; we have the static page, make it a tool).

## 4. AI-search (AEO/GEO) campaign

- Keep `/llms.txt`, `/llm-info`, and `/api/plans` updated automatically from the plan catalog (already wired to the same source of truth).
- Every country page leads with a one-paragraph extractable answer ("A {country} eSIM from {brand} costs from $X for Y GB…") — shipped in the FAQ blocks.
- Monitor AI referral traffic separately (utm-less referrers from chat.openai.com, perplexity.ai, claude.ai) — ChatGPT search referrals grew ~740% YoY.
- Submit the plan feed to eSIM aggregators (eSIMDB, MobiMatter listings, esims.ai) — they own the mid-funnel.

## 5. Off-site

- **Affiliate program at 20–30% commission** with a self-serve portal. "Best eSIM for X" SERPs are pay-to-play via travel bloggers; under-commissioning = invisibility.
- Influencer seeding with free plans + unique codes (Airalo's documented playbook).
- Digital PR around the annual pricing report and "roaming rip-off" data stories.

## 6. Measurement

- Rank tracking: "{country} esim" × top 50 countries + "best esim for {country}".
- Search Console: country-page CTR (rich results should lift it), crawl stats for AI bots.
- North-star: organic + AI-referral sessions → checkout conversion (target ≥3%).
