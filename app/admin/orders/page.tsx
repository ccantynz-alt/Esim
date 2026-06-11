import { demoOrders } from "@/lib/demo-data";
import { getCountryByCode } from "@/lib/countries";
import { formatPrice } from "@/lib/plans";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";

export default function AdminOrdersPage() {
  return (
    <div className="glass overflow-x-auto rounded-2xl">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
          <tr>
            <th className="px-5 py-3.5">Order</th>
            <th className="px-5 py-3.5">Date</th>
            <th className="px-5 py-3.5">Customer</th>
            <th className="px-5 py-3.5">Plan</th>
            <th className="px-5 py-3.5">Amount</th>
            <th className="px-5 py-3.5">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {demoOrders.map((o) => {
            const country = getCountryByCode(o.countryCode);
            return (
              <tr key={o.id}>
                <td className="px-5 py-4 font-mono text-xs text-white/60">{o.id}</td>
                <td className="px-5 py-4 text-white/60">{o.date}</td>
                <td className="px-5 py-4">
                  <div>{o.customer}</div>
                  <div className="text-xs text-white/40">{o.email}</div>
                </td>
                <td className="px-5 py-4">
                  {country?.flag} {country?.name} · {o.planLabel}
                </td>
                <td className="px-5 py-4">{formatPrice(o.amountUsd)}</td>
                <td className="px-5 py-4">
                  <OrderStatusBadge status={o.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
