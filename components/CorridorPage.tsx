import Link from "next/link";
import { Corridor, corridorCountries } from "@/lib/corridors";
import { cheapestPlan, formatPrice } from "@/lib/plans";
import { Faq } from "@/components/Faq";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

/** Multi-country corridor landing page (Pacific Islands, cruise, etc.). */
export function CorridorPage({ corridor }: { corridor: Corridor }) {
  const items = corridorCountries(corridor);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Destinations", path: "/destinations" },
          { name: corridor.name, path: `/esim/${corridor.slug}` },
        ])}
      />

      <section className="aurora relative overflow-hidden border-b border-white/10">
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6">
          <nav className="text-sm text-white/50" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/destinations" className="hover:text-white">Destinations</Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">{corridor.name}</span>
          </nav>
          <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
            {corridor.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/65">
            {corridor.intro}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {corridor.pitch.map((p) => (
            <div key={p} className="glass rounded-2xl p-6 text-sm leading-relaxed text-white/70">
              {p}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Pick your destinations
        </h2>
        <p className="mt-2 text-sm text-white/55">
          One eSIM per country — install them all before you leave.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((c) => {
            const plan = cheapestPlan(c);
            return (
              <Link
                key={c.code}
                href={`/esim/${c.slug}`}
                className="glass glass-hover group rounded-2xl p-5 transition"
              >
                <div className="text-4xl">{c.flag}</div>
                <div className="mt-3 font-semibold group-hover:text-white">{c.name}</div>
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

      <section className="border-y border-white/10 bg-ink-900/60">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
          <h2 className="text-xl font-bold">
            Traveling as a group, school or business?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/60">
            Bulk pricing, one invoice, and QR codes delivered for every
            traveler. Tour operators and agencies earn on every sale.
          </p>
          <Link
            href="/business"
            className="btn-primary mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold"
          >
            Get a group quote →
          </Link>
        </div>
      </section>

      <Faq items={corridor.faqs} title={`${corridor.name} — FAQ`} />
    </>
  );
}
