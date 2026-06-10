import { demoOrders } from "@/lib/demo-data";
import { formatPrice } from "@/lib/plans";

export default function AdminCustomersPage() {
  const customers = new Map<
    string,
    { name: string; email: string; orders: number; totalUsd: number }
  >();
  for (const o of demoOrders) {
    const c = customers.get(o.email) ?? {
      name: o.customer,
      email: o.email,
      orders: 0,
      totalUsd: 0,
    };
    c.orders += 1;
    if (o.status === "paid") c.totalUsd += o.amountUsd;
    customers.set(o.email, c);
  }

  return (
    <div className="glass overflow-x-auto rounded-2xl">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
          <tr>
            <th className="px-5 py-3.5">Customer</th>
            <th className="px-5 py-3.5">Email</th>
            <th className="px-5 py-3.5">Orders</th>
            <th className="px-5 py-3.5">Lifetime value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {[...customers.values()]
            .sort((a, b) => b.totalUsd - a.totalUsd)
            .map((c) => (
              <tr key={c.email}>
                <td className="px-5 py-4 font-medium">{c.name}</td>
                <td className="px-5 py-4 text-white/60">{c.email}</td>
                <td className="px-5 py-4">{c.orders}</td>
                <td className="px-5 py-4">{formatPrice(c.totalUsd)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
