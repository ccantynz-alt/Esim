"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { countries } from "@/lib/countries";

/**
 * Instant destination search — the primary conversion element. Filters all
 * 190+ countries client-side as the user types and routes to the country
 * page on selection.
 */
export function CountrySearch({ large = false }: { large?: boolean }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return countries
      .filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q)
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
        return aStarts - bStarts || Number(b.popular) - Number(a.popular);
      })
      .slice(0, 8);
  }, [query]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/esim/${results[active]?.slug ?? results[0].slug}`);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative w-full">
      <div
        className={`glass flex items-center gap-3 rounded-2xl px-5 transition focus-within:border-white/30 ${
          large ? "h-16 sm:h-[4.5rem]" : "h-12"
        }`}
      >
        <SearchIcon />
        <input
          type="text"
          value={query}
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls="country-search-results"
          aria-label="Search destinations"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
          placeholder="Where are you traveling? Try “Japan”…"
          className={`w-full bg-transparent text-white placeholder-white/40 outline-none ${
            large ? "text-lg" : "text-sm"
          }`}
        />
      </div>

      {open && results.length > 0 && (
        <ul
          id="country-search-results"
          ref={listRef}
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-white/15 bg-ink-800/95 shadow-2xl backdrop-blur-xl"
        >
          {results.map((c, i) => (
            <li key={c.code}>
              <Link
                href={`/esim/${c.slug}`}
                onMouseEnter={() => setActive(i)}
                className={`flex items-center gap-3 px-5 py-3.5 text-sm transition ${
                  i === active ? "bg-white/10" : ""
                }`}
              >
                <span className="text-xl">{c.flag}</span>
                <span className="font-medium">{c.name}</span>
                <span className="ml-auto text-xs text-white/40">{c.region}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-white/50" aria-hidden>
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m14 14 3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
