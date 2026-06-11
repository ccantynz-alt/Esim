import Link from "next/link";
import { site } from "@/lib/site";
import { popularCountries, regions } from "@/lib/countries";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-ink-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="text-lg font-bold">{site.name}</div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
            {site.tagline}. Scan, connect, explore — no roaming fees, no
            plastic SIMs, no contracts.
          </p>
        </div>
        <FooterCol
          title="Top destinations"
          links={popularCountries.slice(0, 6).map((c) => ({
            href: `/esim/${c.slug}`,
            label: `${c.name} eSIM`,
          }))}
        />
        <FooterCol
          title="Regions"
          links={regions.map((r) => ({
            href: `/destinations#${r.toLowerCase().replace(/ /g, "-")}`,
            label: r,
          }))}
        />
        <FooterCol
          title="Company"
          links={[
            { href: "/how-it-works", label: "How it works" },
            { href: "/compatibility", label: "Device compatibility" },
            { href: "/help", label: "Help center" },
            { href: "/dashboard", label: "My eSIMs" },
          ]}
        />
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {year} {site.legalName}. All rights reserved.
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-white/90">{title}</div>
      <ul className="mt-4 space-y-2.5 text-sm text-white/60">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="transition hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
