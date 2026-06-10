import Link from "next/link";
import { popularCountries } from "@/lib/countries";
import { cheapestPlan, formatPrice } from "@/lib/plans";
import { site } from "@/lib/site";

export function TrustBar() {
  const stats = [
    { value: "190+", label: "countries covered" },
    { value: "4.8★", label: "average rating" },
    { value: "<60s", label: "average setup time" },
    { value: "24/7", label: "human support" },
  ];
  return (
    <section className="border-y border-white/10 bg-ink-900/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-bold text-gradient">{s.value}</div>
            <div className="mt-1 text-sm text-white/55">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PopularDestinations() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Popular destinations
          </h2>
          <p className="mt-2 text-white/60">
            Where travelers are connecting right now.
          </p>
        </div>
        <Link
          href="/destinations"
          className="hidden text-sm font-medium text-aurora-400 hover:text-aurora-500 sm:block"
        >
          View all {site.countryCount}+ →
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {popularCountries.slice(0, 12).map((c) => {
          const plan = cheapestPlan(c);
          return (
            <Link
              key={c.code}
              href={`/esim/${c.slug}`}
              className="glass glass-hover group rounded-2xl p-5 transition"
            >
              <div className="text-4xl">{c.flag}</div>
              <div className="mt-3 font-semibold group-hover:text-white">
                {c.name}
              </div>
              <div className="mt-1 text-sm text-white/50">
                From{" "}
                <span className="font-semibold text-aurora-400">
                  {formatPrice(plan.priceUsd)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Pick your destination",
    body: `Choose from ${site.countryCount}+ countries and regional plans. Transparent pricing, no hidden fees.`,
    icon: "🌍",
  },
  {
    title: "Scan the QR code",
    body: "Your eSIM arrives by email in seconds. Scan it once and the plan installs itself — no store visits, no plastic.",
    icon: "📲",
  },
  {
    title: "Land connected",
    body: "Data switches on automatically when you arrive. Keep your home number for calls and texts.",
    icon: "✈️",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-white/10 bg-ink-900/60">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Connected in three steps
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-white/60">
          If you can scan a QR code, you can use {site.name}.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="glass rounded-2xl p-7">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{step.icon}</span>
                <span className="text-sm font-mono text-white/30">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const reasons = [
  {
    title: "Instant, always",
    body: "QR code delivered the second payment clears. Install before you fly and land online.",
  },
  {
    title: "Honest pricing",
    body: "The price on the page is the price you pay. No activation fees, no auto-renew traps.",
  },
  {
    title: "Keep your number",
    body: "Your eSIM handles data while your home SIM stays active for calls and texts.",
  },
  {
    title: "Top-up anytime",
    body: "Running low mid-trip? Add data from your dashboard in two taps — no new QR needed.",
  },
  {
    title: "Real humans, 24/7",
    body: "Talk to a person at 3am in any timezone. Average first response under 2 minutes.",
  },
  {
    title: "Money-back guarantee",
    body: "If your eSIM doesn't connect, we refund it. Simple as that.",
  },
];

export function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Why travelers choose {site.name}
      </h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r) => (
          <div key={r.title} className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-aurora-400">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{r.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="aurora relative overflow-hidden border-t border-white/10">
      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Your next trip starts <span className="text-gradient">connected</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/65">
          Join travelers in {site.countryCount}+ countries who never think
          about roaming again.
        </p>
        <Link
          href="/destinations"
          className="btn-primary mt-9 inline-block rounded-full px-8 py-4 text-base font-semibold"
        >
          Find your eSIM →
        </Link>
      </div>
    </section>
  );
}
