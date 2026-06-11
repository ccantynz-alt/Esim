"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Starts checkout for a plan. Talks to /api/checkout, which returns either
 * a Stripe Checkout URL (keys configured) or a simulated success URL
 * (preview mode), and redirects the browser there.
 */
export function BuyButton({ planId, label = "Buy now" }: { planId: string; label?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }
      if (data.url.startsWith("/")) {
        router.push(data.url);
      } else {
        window.location.assign(data.url);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={buy}
        disabled={loading}
        className="btn-primary w-full rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-60"
      >
        {loading ? "Preparing checkout…" : label}
      </button>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
