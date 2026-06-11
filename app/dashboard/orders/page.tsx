import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listOrders } from "@/lib/db";
import { getCountryByCode } from "@/lib/countries";
import { formatPrice } from "@/lib/plans";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const orders = listOrders(session.email);

  if (orders.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-white/60">
        No orders yet.
      </div>
    );
  }

  return (
    <div className="glass overflow-x-auto rounded-2xl">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
          <tr>
            <th className="px-5 py-3.5">Order</th>
            <th className="px-5 py-3.5">Date</th>
            <th className="px-5 py-3.5">Item</th>
            <th className="px-5 py-3.5">Amount</th>
            <th className="px-5 py-3.5">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {orders.map((o) => {
            const country = getCountryByCode(o.countryCode);
            return (
              <tr key={o.id}>
                <td className="px-5 py-4 font-mono text-xs text-white/60">
                  {o.id.slice(0, 8)}
                </td>
                <td className="px-5 py-4 text-white/60">
                  {o.createdAt.slice(0, 10)}
                </td>
                <td className="px-5 py-4">
                  {country?.flag} {country?.name} ·{" "}
                  {o.kind === "topup" ? "Top-up" : o.planLabel}
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
