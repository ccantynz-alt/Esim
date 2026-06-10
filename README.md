# Voyamo — travel eSIM store

A premium eSIM e-commerce site: instant prepaid data plans in 190+ countries,
built with Next.js (App Router), Tailwind CSS v4, and Stripe.

> **Brand note:** "Voyamo" is a working title. Shortlisted alternatives and the
> full market analysis live in [docs/COMPETITOR-AUDIT.md](docs/COMPETITOR-AUDIT.md) §5a.
> To rename: edit `lib/site.ts` — everything (metadata, JSON-LD, llms.txt, footer)
> derives from it.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (statically generates ~196 pages)
```

No environment variables are required to run — without Stripe keys the
checkout runs in **preview mode** (simulated orders, no payment taken).

## What's inside

| Area | Route | Notes |
|---|---|---|
| Homepage | `/` | Aurora hero, live country search, trust bar, FAQ |
| Destination pages | `/esim/{country}` | ~190 statically generated SEO money pages with Product/FAQ/Breadcrumb schema and per-GB pricing |
| All destinations | `/destinations` | Filterable by region + search |
| Content pages | `/how-it-works`, `/compatibility`, `/help` | FAQ schema on each |
| Customer dashboard | `/dashboard` | eSIM usage bars, top-ups, orders, account (demo data) |
| Admin dashboard | `/admin` | Revenue stats, orders, plan catalog, customers (demo data) |
| Checkout API | `POST /api/checkout` | Stripe Checkout session, or simulated order in preview mode |
| Stripe webhook | `POST /api/webhooks/stripe` | Signature-verified; fulfillment stub ready for the eSIM supplier API |
| AI search | `/llms.txt`, `/llm-info`, `/api/plans` | llms.txt, assistant facts page, machine-readable plan feed |
| SEO infra | `/sitemap.xml`, `/robots.txt` | Full sitemap; AI crawlers explicitly allowed |

## Going live with Stripe

The plumbing is complete but **inert until keys are set** (this is intentional —
payments stay off until the site is finished):

1. Copy `.env.example` → `.env.local`, add `sk_test_…` keys.
2. `stripe listen --forward-to localhost:3000/api/webhooks/stripe` → copy the `whsec_…` into `STRIPE_WEBHOOK_SECRET`.
3. Test with card `4242 4242 4242 4242`.
4. At launch: swap to live keys and set `NEXT_PUBLIC_SITE_URL` to the production domain.

## Before launch (the honest list)

- [ ] Final brand name + domain → `lib/site.ts`
- [ ] Real eSIM supplier API → replace `lib/plans.ts` pricing engine and the `fulfillOrder` stub in the webhook
- [ ] Auth + database → replace `lib/demo-data.ts`; **gate `/admin` behind auth**
- [ ] Email delivery (QR codes) — e.g. Resend/Postmark from the webhook
- [ ] Run the launch-week checklist in [docs/SEO-PLAYBOOK.md](docs/SEO-PLAYBOOK.md)

## Docs

- [docs/COMPETITOR-AUDIT.md](docs/COMPETITOR-AUDIT.md) — internet-wide scan of 28 eSIM brands: names, designs, SEO strategies, and the gaps we exploit
- [docs/SEO-PLAYBOOK.md](docs/SEO-PLAYBOOK.md) — the SEO + AI-search campaign: what's already shipped and the roadmap
