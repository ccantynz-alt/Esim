import Link from "next/link";
import { CountrySearch } from "@/components/CountrySearch";
import { popularCountries } from "@/lib/countries";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="aurora relative overflow-hidden">
      <div className="starfield absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 pb-24 pt-20 text-center sm:px-6 sm:pt-28">
        <p className="glass mx-auto w-fit rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-white/80">
          ⚡ Instant delivery · {site.countryCount}+ countries · 24/7 human support
        </p>

        <h1 className="mt-7 text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
          Land connected.
          <br />
          <span className="text-gradient">Anywhere on Earth.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
          Get a travel eSIM in {site.countryCount}+ countries delivered to your
          phone in seconds. Scan one QR code, skip the roaming bill, and stay
          online from touchdown to takeoff.
        </p>

        <div className="mx-auto mt-10 max-w-2xl">
          <CountrySearch large />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {popularCountries.slice(0, 8).map((c) => (
            <Link
              key={c.code}
              href={`/esim/${c.slug}`}
              className="glass glass-hover rounded-full px-4 py-2 text-sm transition"
            >
              {c.flag} {c.name}
            </Link>
          ))}
          <Link
            href="/destinations"
            className="rounded-full px-4 py-2 text-sm font-medium text-aurora-400 transition hover:text-aurora-500"
          >
            All {site.countryCount}+ destinations →
          </Link>
        </div>
      </div>
    </section>
  );
}
