import { listUsers, listOrders, listEsims } from "@/lib/db";
import { formatPrice } from "@/lib/plans";

export const dynamic = "force-dynamic";

export default function AdminCustomersPage() {
  const users = listUsers();

  if (users.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-white/60">
        No customers yet.
      </div>
    );
  }

  const rows = users
    .map((u) => {
      const orders = listOrders(u.email);
      return {
        ...u,
        orders: orders.length,
        esims: listEsims(u.email).length,
        totalUsd: orders
          .filter((o) => o.status === "paid")
          .reduce((sum, o) => sum + o.amountUsd, 0),
      };
    })
    .sort((a, b) => b.totalUsd - a.totalUsd);

  return (
    <div className="glass overflow-x-auto rounded-2xl">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
          <tr>
            <th className="px-5 py-3.5">Customer</th>
            <th className="px-5 py-3.5">Email</th>
            <th className="px-5 py-3.5">Since</th>
            <th className="px-5 py-3.5">Orders</th>
            <th className="px-5 py-3.5">eSIMs</th>
            <th className="px-5 py-3.5">Lifetime value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((c) => (
            <tr key={c.id}>
              <td className="px-5 py-4 font-medium">{c.name}</td>
              <td className="px-5 py-4 text-white/60">{c.email}</td>
              <td className="px-5 py-4 text-white/60">{c.createdAt.slice(0, 10)}</td>
              <td className="px-5 py-4">{c.orders}</td>
              <td className="px-5 py-4">{c.esims}</td>
              <td className="px-5 py-4">{formatPrice(c.totalUsd)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
