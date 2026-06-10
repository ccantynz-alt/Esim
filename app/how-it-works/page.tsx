import { Metadata } from "next";
import { HowItWorks, FinalCta } from "@/components/home/sections";
import { Faq } from "@/components/Faq";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "How eSIM works — set up in under 60 seconds",
  description: `How to buy, install and activate a ${site.name} travel eSIM: pick a destination, scan one QR code, land connected. Step-by-step guide for iPhone and Android.`,
  alternates: { canonical: "/how-it-works" },
};

const detailSteps = [
  {
    title: "1 · Check your phone",
    body: "Dial *#06# — if an EID number appears, your phone supports eSIM. Make sure it's carrier-unlocked (almost all phones bought outright are).",
  },
  {
    title: "2 · Buy your plan",
    body: `Pick your destination from ${site.countryCount}+ countries, choose a data size, and pay securely. Your eSIM is generated instantly.`,
  },
  {
    title: "3 · Install before you fly",
    body: "Scan the QR code from your confirmation email (or tap install on the same device). Installation takes about a minute on WiFi — do it at home, not at the airport.",
  },
  {
    title: "4 · Land and connect",
    body: "Turn on the eSIM line and data roaming for it when you arrive. Your phone joins a local network automatically. Your home SIM stays active for calls and texts.",
  },
];

const faqs = [
  {
    q: "Do I need WiFi to install the eSIM?",
    a: "Yes, install on WiFi or your home data before departure. Once installed, the eSIM connects on its own when you reach your destination.",
  },
  {
    q: "When does the validity period start?",
    a: "Only when the eSIM connects to a network at your destination — not at purchase. Buy days or weeks ahead with no penalty.",
  },
  {
    q: "Can I install the eSIM on a second device later?",
    a: "An eSIM installs on one device only. If you switch phones mid-trip, contact support and we'll reissue it.",
  },
  {
    q: "How do I top up?",
    a: "Open your dashboard, pick the active eSIM and tap Top up. New data lands on the same eSIM — no reinstall, no new QR code.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="aurora border-b border-white/10">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Connected in <span className="text-gradient">under a minute</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/65">
            No store visits, no plastic SIM, no paperwork. Here&apos;s exactly how
            it works.
          </p>
        </div>
      </section>

      <HowItWorks />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          The full walkthrough
        </h2>
        <div className="mt-8 space-y-4">
          {detailSteps.map((s) => (
            <div key={s.title} className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-aurora-400">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Faq items={faqs} title="Setup questions" />
      <FinalCta />
    </>
  );
}
