"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { countries, regions, Region } from "@/lib/countries";
import { cheapestPlan, formatPrice } from "@/lib/plans";

/** Filterable grid of every destination, grouped by region. */
export function DestinationsExplorer() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "All">("All");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return countries.filter(
      (c) =>
        (region === "All" || c.region === region) &&
        (!q || c.name.toLowerCase().includes(q)),
    );
  }, [query, region]);

  const grouped = useMemo(() => {
    const map = new Map<Region, typeof visible>();
    for (const c of visible) {
      const list = map.get(c.region) ?? [];
      list.push(c);
      map.set(c.region, list);
    }
    return regions
      .filter((r) => map.has(r))
      .map((r) => ({ region: r, items: map.get(r)! }));
  }, [visible]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search countries…"
          aria-label="Search countries"
          className="glass h-12 w-full rounded-xl px-4 text-sm text-white placeholder-white/40 outline-none focus:border-white/30 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {(["All", ...regions] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                region === r
                  ? "btn-primary font-semibold"
                  : "glass glass-hover text-white/70"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {grouped.length === 0 && (
        <p className="mt-16 text-center text-white/50">
          No destinations match “{query}”.
        </p>
      )}

      {grouped.map(({ region: r, items }) => (
        <section key={r} id={r.toLowerCase().replace(/ /g, "-")} className="mt-12">
          <h2 className="text-xl font-bold">
            {r} <span className="ml-2 text-sm font-normal text-white/40">{items.length} destinations</span>
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((c) => (
              <Link
                key={c.code}
                href={`/esim/${c.slug}`}
                className="glass glass-hover flex items-center gap-3 rounded-xl px-4 py-3.5 transition"
              >
                <span className="text-2xl">{c.flag}</span>
                <span className="text-sm font-medium">{c.name}</span>
                <span className="ml-auto text-xs text-white/45">
                  from{" "}
                  <span className="font-semibold text-aurora-400">
                    {formatPrice(cheapestPlan(c).priceUsd)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
