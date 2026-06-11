"use client";

import { useMemo, useState } from "react";
import { countries } from "@/lib/countries";
import { plansForCountry, formatPrice, formatData } from "@/lib/plans";
import { BULK_TIERS, bulkDiscount } from "@/lib/bulk";

const SEGMENTS = [
  "Travel agency",
  "Tour operator",
  "School / sports trip",
  "Cruise retailer",
  "Corporate / SME",
  "Event organizer",
  "Other",
];

/**
 * Interactive bulk quote: destination + plan + headcount → live discounted
 * price, submitted as a B2B lead into the admin pipeline.
 */
export function BulkQuoteBuilder() {
  const [countryCode, setCountryCode] = useState("FJ");
  const [planId, setPlanId] = useState("");
  const [quantity, setQuantity] = useState(20);
  const [form, setForm] = useState({ company: "", contactName: "", email: "", segment: SEGMENTS[0] });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const country = useMemo(
    () => countries.find((c) => c.code === countryCode) ?? countries[0],
    [countryCode],
  );
  const plans = useMemo(() => plansForCountry(country), [country]);
  const plan = plans.find((p) => p.id === planId) ?? plans[2] ?? plans[0];

  const discount = bulkDiscount(quantity);
  const unitPrice = plan.priceUsd * (1 - discount);
  const total = unitPrice * quantity;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/partner-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          estMonthlyTravelers: quantity,
          details: `Quote request: ${quantity}× ${country.name} ${plan.label} (${formatData(plan.dataGb)}/${plan.days}d) — ${formatPrice(unitPrice)} each (${Math.round(discount * 100)}% volume discount), total ${formatPrice(total)}.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <div className="text-3xl">🤝</div>
        <h3 className="mt-3 text-xl font-bold">Quote request received</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
          We&apos;ll come back to {form.email} within one business day with your
          formal quote for {quantity}× {country.name} eSIMs.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass rounded-2xl p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="text-white/70">Destination</span>
          <select
            value={countryCode}
            onChange={(e) => {
              setCountryCode(e.target.value);
              setPlanId("");
            }}
            className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-ink-800 px-3 text-white outline-none focus:border-white/35"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-white/70">Plan per traveler</span>
          <select
            value={plan.id}
            onChange={(e) => setPlanId(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-ink-800 px-3 text-white outline-none focus:border-white/35"
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} — {formatData(p.dataGb)} / {p.days}d — {formatPrice(p.priceUsd)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-white/70">Travelers</span>
          <input
            type="number"
            min={1}
            max={10000}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-white outline-none focus:border-white/35"
          />
        </label>
      </div>

      <div className="mt-6 rounded-xl bg-white/5 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-sm text-white/60">
            {quantity}× {country.flag} {country.name} {plan.label}
            {discount > 0 && (
              <span className="ml-2 rounded-full bg-aurora-500/15 px-2.5 py-0.5 text-xs text-aurora-400">
                {Math.round(discount * 100)}% volume discount
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-aurora-400">
            {formatPrice(total)}
            <span className="ml-2 text-sm font-normal text-white/45">
              ({formatPrice(unitPrice)}/traveler)
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs text-white/40">
          {BULK_TIERS.map((t) => t.label).join(" · ")}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input
          required
          placeholder="Company / organization"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="h-12 rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder-white/35 outline-none focus:border-white/35"
        />
        <input
          required
          placeholder="Contact name"
          value={form.contactName}
          onChange={(e) => setForm({ ...form, contactName: e.target.value })}
          className="h-12 rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder-white/35 outline-none focus:border-white/35"
        />
        <input
          required
          type="email"
          placeholder="Work email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="h-12 rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder-white/35 outline-none focus:border-white/35"
        />
        <select
          value={form.segment}
          onChange={(e) => setForm({ ...form, segment: e.target.value })}
          className="h-12 rounded-xl border border-white/15 bg-ink-800 px-3 text-sm text-white outline-none focus:border-white/35"
        >
          {SEGMENTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      <button
        disabled={state === "sending"}
        className="btn-primary mt-6 w-full rounded-xl px-5 py-3.5 text-sm font-semibold disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Request formal quote"}
      </button>
      <p className="mt-3 text-center text-xs text-white/40">
        No commitment — we reply within one business day.
      </p>
    </form>
  );
}
