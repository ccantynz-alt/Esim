# Layova — travel eSIM store

A premium eSIM e-commerce site: instant prepaid data plans in 190+ countries,
built with Next.js (App Router), Tailwind CSS v4, and Stripe.

> **Brand:** Layova (from "layover"), primary domain **layova.travel** —
> vetted June 2026 with no existing brand/app/eSIM collisions (see
> [docs/COMPETITOR-AUDIT.md](docs/COMPETITOR-AUDIT.md) §5a). All identity
> lives in `lib/site.ts`; metadata, JSON-LD, llms.txt and the footer derive
> from it.

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
| Customer auth | `/login` | Passwordless demo sign-in (swap for magic links/OAuth at launch) |
| Customer dashboard | `/dashboard` | Real eSIM lifecycle: install QR, live usage, **top-ups/recharges**, activate, orders, account |
| Admin dashboard | `/admin` | Live revenue/orders/customers, eSIM fleet (deactivate, resend QR), one-click refunds |
| Admin monitoring | `/admin/monitoring` | Health checks (provider, Stripe, auth, store) + full event log |
| Checkout API | `POST /api/checkout` | New eSIM **and top-up** orders; Stripe Checkout or simulated in preview mode |
| Stripe webhook | `POST /api/webhooks/stripe` | Signature-verified, idempotent; fulfills through the same path as preview checkout |
| Provider adapter | `lib/provider.ts` | `EsimProvider` interface + mock simulation; the real supplier plugs in here |
| Health endpoint | `GET /api/health` | Machine-readable status for uptime monitors |
| AI search | `/llms.txt`, `/llm-info`, `/api/plans` | llms.txt, assistant facts page, machine-readable plan feed |
| SEO infra | `/sitemap.xml`, `/robots.txt` | Full sitemap; AI crawlers explicitly allowed |

**The full purchase lifecycle works today** (in preview mode): browse → buy →
QR code issued → install → activate → live usage tracking → top up → admin
can refund/deactivate/monitor everything. Two simulation layers keep it safe:
Stripe (inert until keys exist) and the mock eSIM provider (until the supplier
contract is signed). Both flip on without touching the rest of the code.

## Going live with Stripe

The plumbing is complete but **inert until keys are set** (this is intentional —
payments stay off until the site is finished):

1. Copy `.env.example` → `.env.local`, add `sk_test_…` keys.
2. `stripe listen --forward-to localhost:3000/api/webhooks/stripe` → copy the `whsec_…` into `STRIPE_WEBHOOK_SECRET`.
3. Test with card `4242 4242 4242 4242`.
4. At launch: swap to live keys and set `NEXT_PUBLIC_SITE_URL` to the production domain.

## Before launch (the honest list)

- [ ] Register layova.travel → set `NEXT_PUBLIC_SITE_URL`
- [ ] Real eSIM supplier API → implement `EsimProvider` in `lib/provider.ts` and source prices in `lib/plans.ts` from the supplier rate sheet
- [ ] Database → reimplement `lib/db.ts` over Postgres/Neon (file/in-memory store resets on serverless cold starts; the repository interface is the contract)
- [ ] Real auth → replace the passwordless demo login with magic links/OAuth; set `AUTH_SECRET` + `ADMIN_PASSWORD` env vars
- [ ] Email delivery (QR codes, low-data alerts) — e.g. Resend/Postmark, hooks marked TODO in `lib/fulfill.ts` and `app/admin/actions.ts`
- [ ] Stripe live keys (last switch to flip)
- [ ] Point an uptime monitor at `/api/health`
- [ ] Run the launch-week checklist in [docs/SEO-PLAYBOOK.md](docs/SEO-PLAYBOOK.md)

## Docs

- [docs/COMPETITOR-AUDIT.md](docs/COMPETITOR-AUDIT.md) — internet-wide scan of 28 eSIM brands: names, designs, SEO strategies, and the gaps we exploit
- [docs/SEO-PLAYBOOK.md](docs/SEO-PLAYBOOK.md) — the SEO + AI-search campaign: what's already shipped and the roadmap
