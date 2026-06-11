"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TopUpOption {
  planId: string;
  label: string;
}

/**
 * Recharge an existing eSIM: pick a data pack, pay (Stripe or preview
 * mode), and the data lands on the same eSIM — no new QR code.
 */
export function TopUpMenu({
  esimId,
  options,
}: {
  esimId: string;
  options: TopUpOption[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function topUp(planId: string) {
    setLoading(planId);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, topupEsimId: esimId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Top-up failed");
      if (data.url.startsWith("/")) {
        router.push(data.url);
        router.refresh();
      } else {
        window.location.assign(data.url);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(null);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold"
      >
        Top up data {open ? "▴" : "▾"}
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-56 overflow-hidden rounded-xl border border-white/15 bg-ink-800/95 shadow-2xl backdrop-blur-xl">
          {options.map((o) => (
            <button
              key={o.planId}
              onClick={() => topUp(o.planId)}
              disabled={loading !== null}
              className="block w-full px-4 py-3 text-left text-sm transition hover:bg-white/10 disabled:opacity-50"
            >
              {loading === o.planId ? "Processing…" : o.label}
            </button>
          ))}
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
