import { Metadata } from "next";
import { site } from "@/lib/site";
import { BulkQuoteBuilder } from "@/components/BulkQuoteBuilder";
import { Faq } from "@/components/Faq";
import { PARTNER_COMMISSION } from "@/lib/bulk";

export const metadata: Metadata = {
  title: "Business & group eSIMs — bulk pricing, one invoice, partner program",
  description: `Bulk travel eSIMs for travel agencies, tour operators, schools, cruise retailers and corporate teams. Volume discounts up to 20%, one invoice, QR codes for every traveler, and a ${PARTNER_COMMISSION * 100}% partner commission program.`,
  alternates: { canonical: "/business" },
};

const segments = [
  {
    icon: "🧳",
    title: "Travel agencies & tour operators",
    body: `Add connectivity to every booking and earn ${PARTNER_COMMISSION * 100}% on each sale via your co-branded link — or buy wholesale and set your own margin.`,
  },
  {
    icon: "🏫",
    title: "School & sports trips",
    body: "Every student connected and reachable, parents reassured, one invoice for the organizer, group dashboard for the teacher in charge.",
  },
  {
    icon: "🚢",
    title: "Cruise retailers",
    body: "Bundle port-day eSIMs with every cruise booking — the upsell that saves your clients from $30/MB maritime roaming bills.",
  },
  {
    icon: "💼",
    title: "Corporate & SME teams",
    body: "Stop expensing $10/day roaming passes. Provision staff eSIMs centrally, see usage in one dashboard, get expense-ready receipts.",
  },
  {
    icon: "🎫",
    title: "Events & conferences",
    body: "Delegate connectivity as part of the ticket: bulk QR delivery, custom data sizes, one invoice to the organizer.",
  },
  {
    icon: "🤝",
    title: "White-label & API",
    body: "Your brand, our engine. Co-branded landing pages today; API provisioning as volume grows.",
  },
];

const faqs = [
  {
    q: "How does bulk eSIM delivery work?",
    a: "You receive a QR code per traveler (CSV or printable sheet) plus a group dashboard showing every eSIM's status and usage. Travelers install before departure; data activates on arrival.",
  },
  {
    q: "How do agencies and operators earn?",
    a: `Two models: referral (your co-branded link, you earn ${PARTNER_COMMISSION * 100}% of every sale, zero handling) or wholesale (volume-discounted bulk purchase, you set the retail price and keep the margin).`,
  },
  {
    q: "Can we get one invoice for a whole group?",
    a: "Yes — one invoice per group order, in NZD, AUD or USD, with per-traveler line items for easy on-charging.",
  },
  {
    q: "What if a traveler's eSIM doesn't work?",
    a: "24/7 support direct to the traveler, and a connect-or-refund guarantee on every eSIM, so the problem never lands back on your desk.",
  },
];

export default function BusinessPage() {
  return (
    <>
      <section className="aurora relative overflow-hidden border-b border-white/10">
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-20 text-center sm:px-6">
          <p className="glass mx-auto w-fit rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-white/80">
            {site.name} for Business
          </p>
          <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Connectivity for <span className="text-gradient">every traveler you send</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/65">
            Bulk eSIMs in {site.countryCount}+ countries with volume discounts
            up to 20%, one invoice, and a partner program that pays you on
            every sale.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {segments.map((s) => (
            <div key={s.title} className="glass rounded-2xl p-6">
              <div className="text-2xl">{s.icon}</div>
              <h2 className="mt-3 font-semibold text-aurora-400">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="quote" className="border-y border-white/10 bg-ink-900/60">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Build your group quote
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-white/55">
            Live volume pricing — submit it and we&apos;ll confirm within one
            business day.
          </p>
          <div className="mt-10">
            <BulkQuoteBuilder />
          </div>
        </div>
      </section>

      <Faq items={faqs} title="Business & partner FAQ" />
    </>
  );
}
