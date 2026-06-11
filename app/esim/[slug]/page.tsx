import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { countries, countriesInRegion, getCountryBySlug } from "@/lib/countries";
import { plansForCountry, formatPrice, formatData } from "@/lib/plans";
import { PlanCard } from "@/components/PlanCard";
import { Faq } from "@/components/Faq";
import {
  JsonLd,
  countryProductLd,
  breadcrumbLd,
} from "@/components/JsonLd";
import { site } from "@/lib/site";
import { corridors, getCorridorBySlug } from "@/lib/corridors";
import { CorridorPage } from "@/components/CorridorPage";

/**
 * Programmatic SEO: one statically generated landing page per destination,
 * each with Product + FAQPage + Breadcrumb structured data and unique copy.
 */

export function generateStaticParams() {
  return [
    ...countries.map((c) => ({ slug: c.slug })),
    ...corridors.map((c) => ({ slug: c.slug })),
  ];
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const corridor = getCorridorBySlug(slug);
  if (corridor) {
    return {
      title: corridor.title,
      description: corridor.intro,
      alternates: { canonical: `/esim/${corridor.slug}` },
      openGraph: {
        title: corridor.title,
        description: corridor.intro,
        url: `/esim/${corridor.slug}`,
      },
    };
  }
  const country = getCountryBySlug(slug);
  if (!country) return {};
  const cheapest = plansForCountry(country)[0];
  const title = `${country.name} eSIM — data plans from ${formatPrice(cheapest.priceUsd)}`;
  const description = `Buy a prepaid ${country.name} eSIM with instant QR delivery. Plans from ${formatData(cheapest.dataGb)}/${cheapest.days} days at ${formatPrice(cheapest.priceUsd)}. 4G/5G data, hotspot included, no roaming fees.`;
  return {
    title,
    description,
    alternates: { canonical: `/esim/${country.slug}` },
    openGraph: { title, description, url: `/esim/${country.slug}` },
  };
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const corridor = getCorridorBySlug(slug);
  if (corridor) return <CorridorPage corridor={corridor} />;
  const country = getCountryBySlug(slug);
  if (!country) notFound();

  const plans = plansForCountry(country);
  const cheapest = plans[0];
  const neighbors = countriesInRegion(country.region)
    .filter((c) => c.code !== country.code)
    .slice(0, 8);

  const faqs = [
    {
      q: `How do I get an eSIM for ${country.name}?`,
      a: `Choose a plan above, pay securely, and your ${country.name} eSIM QR code arrives by email within seconds. Scan it in your phone settings and you're done — install before you fly and data activates automatically when you land.`,
    },
    {
      q: `How much does a ${country.name} eSIM cost?`,
      a: `${site.name} plans for ${country.name} start at ${formatPrice(cheapest.priceUsd)} for ${formatData(cheapest.dataGb)} valid ${cheapest.days} days, up to unlimited data options. No activation fees and no hidden charges.`,
    },
    {
      q: `Will my phone work with an eSIM in ${country.name}?`,
      a: "Any eSIM-compatible, carrier-unlocked phone works: iPhone XS or newer, Pixel 3 or newer, Galaxy S20 or newer, and most recent models. Check our compatibility page for the full list.",
    },
    {
      q: `Can I share data via hotspot in ${country.name}?`,
      a: "Yes — every plan includes hotspot/tethering at no extra cost, so you can share your connection with a laptop or travel companions.",
    },
    {
      q: `What networks does the ${country.name} eSIM use?`,
      a: `Your eSIM connects to leading local networks in ${country.name} with 4G/5G speeds where available, switching automatically to the strongest signal.`,
    },
  ];

  return (
    <>
      <JsonLd data={countryProductLd(country, plans)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Destinations", path: "/destinations" },
          { name: `${country.name} eSIM`, path: `/esim/${country.slug}` },
        ])}
      />

      <section className="aurora relative overflow-hidden border-b border-white/10">
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6">
          <nav className="text-sm text-white/50" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/destinations" className="hover:text-white">Destinations</Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">{country.name}</span>
          </nav>
          <div className="mt-8 flex items-center gap-5">
            <span className="text-6xl sm:text-7xl">{country.flag}</span>
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {country.name} eSIM
              </h1>
              <p className="mt-2 text-lg text-white/65">
                Prepaid data from{" "}
                <span className="font-semibold text-aurora-400">
                  {formatPrice(cheapest.priceUsd)}
                </span>{" "}
                · instant QR delivery · no roaming fees
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/60">
            {["⚡ Delivered in seconds", "📶 4G/5G networks", "🔥 Hotspot included", "💬 24/7 support", "↩️ Money-back guarantee"].map((b) => (
              <span key={b} className="glass rounded-full px-3 py-1.5">{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Choose your {country.name} plan
        </h2>
        <div className="mt-8 grid gap-5 pt-3 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-ink-900/60">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Why use a {site.name} eSIM in {country.name}?
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-white/65">
            <p>
              Roaming with your home carrier in {country.name} can cost ten
              times more than a local data plan — and airport SIM kiosks mean
              queues, paperwork and tourist pricing. A {site.name} eSIM skips
              all of it: buy online in two minutes, scan one QR code, and your
              phone connects to fast local networks in {country.name} the
              moment you arrive.
            </p>
            <p>
              Your regular SIM stays in place, so you keep your home number
              for calls, texts and banking apps while the eSIM quietly handles
              data. Need more mid-trip? Top up from your dashboard without a
              new QR code. And if anything doesn&apos;t work, real humans answer
              24/7 — backed by a connect-or-refund guarantee.
            </p>
          </div>
        </div>
      </section>

      <Faq items={faqs} title={`${country.name} eSIM — FAQ`} />

      {neighbors.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <h2 className="text-xl font-bold">
            Also traveling in {country.region}?
          </h2>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {neighbors.map((n) => (
              <Link
                key={n.code}
                href={`/esim/${n.slug}`}
                className="glass glass-hover rounded-full px-4 py-2 text-sm"
              >
                {n.flag} {n.name} eSIM
              </Link>
            ))}
            <Link
              href="/destinations"
              className="rounded-full px-4 py-2 text-sm font-medium text-aurora-400"
            >
              All destinations →
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
