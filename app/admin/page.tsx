import Link from "next/link";
import { storeStats, listOrders, listEvents } from "@/lib/db";
import { getCountryByCode } from "@/lib/countries";
import { formatPrice } from "@/lib/plans";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { isStripeConfigured } from "@/lib/stripe";
import { getProvider, isRealProvider } from "@/lib/provider";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = storeStats();
  const orders = listOrders().slice(0, 6);
  const recentErrors = listEvents(200).filter((e) => e.level === "error").slice(0, 3);
  const provider = getProvider();

  const cards = [
    { label: "Revenue", value: `$${stats.revenueUsd.toFixed(2)}` },
    { label: "Paid orders", value: String(stats.paidOrders) },
    { label: "Active eSIMs", value: String(stats.activeEsims) },
    { label: "Customers", value: String(stats.customers) },
  ];
  const maxOrders = stats.topCountries[0]?.orders ?? 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 text-xs">
        <span
          className={`rounded-full px-3 py-1.5 ${
            isStripeConfigured()
              ? "bg-aurora-500/15 text-aurora-400"
              : "bg-amber-400/10 text-amber-300"
          }`}
        >
          Stripe: {isStripeConfigured() ? "configured" : "preview mode (not live — by design)"}
        </span>
        <span
          className={`rounded-full px-3 py-1.5 ${
            isRealProvider()
              ? "bg-aurora-500/15 text-aurora-400"
              : "bg-amber-400/10 text-amber-300"
          }`}
        >
          Provider: {provider.name}
        </span>
        {stats.eventCounts.errors > 0 && (
          <Link
            href="/admin/monitoring"
            className="rounded-full bg-red-400/15 px-3 py-1.5 text-red-300"
          >
            ⚠ {stats.eventCounts.errors} error event{stats.eventCounts.errors === 1 ? "" : "s"} — view monitoring
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wide text-white/40">{s.label}</div>
            <div className="mt-2 text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {recentErrors.length > 0 && (
        <div className="glass rounded-2xl border-red-400/30 p-5">
          <h2 className="text-sm font-semibold text-red-300">Recent errors</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/65">
            {recentErrors.map((e) => (
              <li key={e.id}>
                <span className="font-mono text-xs text-white/40">{e.ts.slice(0, 19).replace("T", " ")}</span>{" "}
                {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="font-semibold">Top destinations</h2>
          {stats.topCountries.length === 0 && (
            <p className="mt-4 text-sm text-white/45">No paid orders yet.</p>
          )}
          <div className="mt-5 space-y-4">
            {stats.topCountries.map((t) => {
              const country = getCountryByCode(t.code);
              return (
                <div key={t.code}>
                  <div className="flex justify-between text-sm">
                    <span>
                      {country?.flag} {country?.name}
                    </span>
                    <span className="text-white/50">{t.orders} orders</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-glow to-aurora-400"
                      style={{ width: `${(t.orders / maxOrders) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass overflow-hidden rounded-2xl lg:col-span-3">
          <h2 className="px-6 pt-6 font-semibold">Latest orders</h2>
          {orders.length === 0 ? (
            <p className="px-6 py-4 text-sm text-white/45">No orders yet.</p>
          ) : (
            <table className="mt-4 w-full text-left text-sm">
              <tbody className="divide-y divide-white/5">
                {orders.map((o) => {
                  const country = getCountryByCode(o.countryCode);
                  return (
                    <tr key={o.id}>
                      <td className="px-6 py-3 font-mono text-xs text-white/55">
                        {o.id.slice(0, 8)}
                      </td>
                      <td className="px-3 py-3">
                        {country?.flag} {o.kind === "topup" ? "Top-up" : o.planLabel}
                      </td>
                      <td className="px-3 py-3 text-white/60">{o.email}</td>
                      <td className="px-3 py-3">{formatPrice(o.amountUsd)}</td>
                      <td className="px-6 py-3 text-right">
                        <OrderStatusBadge status={o.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
