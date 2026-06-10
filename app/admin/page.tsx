import { adminStats, demoOrders } from "@/lib/demo-data";
import { getCountryByCode } from "@/lib/countries";
import { formatPrice } from "@/lib/plans";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";

export default function AdminOverviewPage() {
  const stats = [
    { label: "Revenue (30d)", value: `$${adminStats.revenue30dUsd.toLocaleString()}` },
    { label: "Orders (30d)", value: adminStats.orders30d.toLocaleString() },
    { label: "Active eSIMs", value: adminStats.activeEsims.toLocaleString() },
    { label: "Conversion rate", value: `${adminStats.conversionRate}%` },
  ];
  const maxOrders = adminStats.topCountries[0].orders;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wide text-white/40">{s.label}</div>
            <div className="mt-2 text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="font-semibold">Top destinations (30d)</h2>
          <div className="mt-5 space-y-4">
            {adminStats.topCountries.map((t) => {
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
          <table className="mt-4 w-full text-left text-sm">
            <tbody className="divide-y divide-white/5">
              {demoOrders.slice(0, 6).map((o) => {
                const country = getCountryByCode(o.countryCode);
                return (
                  <tr key={o.id}>
                    <td className="px-6 py-3 font-mono text-xs text-white/55">{o.id}</td>
                    <td className="px-3 py-3">
                      {country?.flag} {o.planLabel}
                    </td>
                    <td className="px-3 py-3 text-white/60">{o.customer}</td>
                    <td className="px-3 py-3">{formatPrice(o.amountUsd)}</td>
                    <td className="px-6 py-3 text-right">
                      <OrderStatusBadge status={o.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
