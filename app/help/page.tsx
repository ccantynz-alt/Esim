import { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Help center — eSIM setup, billing and troubleshooting",
  description: `Get help with your ${site.name} eSIM: installation guides, troubleshooting, billing and refunds. 24/7 support at ${site.supportEmail}.`,
  alternates: { canonical: "/help" },
};

const topics = [
  { title: "Getting started", body: "Buying your first eSIM, checking compatibility, and installing before you fly.", href: "/how-it-works" },
  { title: "Device compatibility", body: "Full list of eSIM-ready phones and the 10-second EID test.", href: "/compatibility" },
  { title: "Manage your eSIMs", body: "Check data usage, top up, and view your QR codes in the dashboard.", href: "/dashboard" },
  { title: "Find a destination", body: `Browse plans for all ${site.countryCount}+ countries we cover.`, href: "/destinations" },
];

const faqs = [
  {
    q: "My eSIM won't connect — what do I do?",
    a: "1) Make sure the eSIM line is turned on and data roaming is enabled for it. 2) Select the network manually in settings if auto-connect fails. 3) Restart your phone. Still stuck? Contact support — if we can't get you online, you get a refund.",
  },
  {
    q: "How do refunds work?",
    a: "Un-activated eSIMs are refundable within 30 days, no questions asked. Activated eSIMs that never managed to connect are refunded in full after our team confirms the fault.",
  },
  {
    q: "I deleted my eSIM by accident.",
    a: "Contact support with your order number. Deleted eSIM profiles usually can't be reinstalled from the same QR code, but we'll reissue one for any plan with remaining data.",
  },
  {
    q: "Where is my QR code?",
    a: "In your confirmation email and in your dashboard under My eSIMs. Both stay available for the life of the plan.",
  },
  {
    q: "How do I contact support?",
    a: `Email ${site.supportEmail} any time — we're 24/7 and aim to respond within minutes. Live chat is coming to the dashboard soon.`,
  },
];

export default function HelpPage() {
  return (
    <>
      <section className="aurora border-b border-white/10">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            How can we <span className="text-gradient">help?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/65">
            Real humans, around the clock. Most questions are answered below in
            seconds.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {topics.map((t) => (
            <Link key={t.title} href={t.href} className="glass glass-hover rounded-2xl p-6 transition">
              <h2 className="font-semibold text-aurora-400">{t.title}</h2>
              <p className="mt-2 text-sm text-white/60">{t.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <Faq items={faqs} title="Common questions" />

      <section className="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6">
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-bold">Still need a human?</h2>
          <p className="mt-2 text-sm text-white/60">
            We answer 24/7, average first response under 2 minutes.
          </p>
          <a
            href={`mailto:${site.supportEmail}`}
            className="btn-primary mt-5 inline-block rounded-full px-6 py-3 text-sm font-semibold"
          >
            Email {site.supportEmail}
          </a>
        </div>
      </section>
    </>
  );
}
