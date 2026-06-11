import { listEvents, storeStats, EventLevel } from "@/lib/db";
import { getProvider, isRealProvider } from "@/lib/provider";
import { isStripeConfigured } from "@/lib/stripe";
import { isAuthHardened } from "@/lib/auth";

export const dynamic = "force-dynamic";

const levelStyles: Record<EventLevel, string> = {
  info: "bg-white/10 text-white/60",
  warn: "bg-amber-400/15 text-amber-300",
  error: "bg-red-400/15 text-red-300",
};

export default async function AdminMonitoringPage() {
  const stats = storeStats();
  const providerHealth = await getProvider().health();
  const events = listEvents(100);

  const checks = [
    {
      name: "eSIM provider",
      ok: providerHealth.ok,
      warn: !isRealProvider(),
      detail: `${providerHealth.name} · ${providerHealth.latencyMs}ms — ${providerHealth.detail}`,
    },
    {
      name: "Stripe payments",
      ok: true,
      warn: !isStripeConfigured(),
      detail: isStripeConfigured()
        ? "Keys configured — checkout charges real cards"
        : "Preview mode: checkout simulates payment. Intentional until launch.",
    },
    {
      name: "Auth hardening",
      ok: true,
      warn: !isAuthHardened(),
      detail: isAuthHardened()
        ? "AUTH_SECRET and ADMIN_PASSWORD are set"
        : "Using dev defaults — set AUTH_SECRET and ADMIN_PASSWORD env vars",
    },
    {
      name: "Data store",
      ok: true,
      warn: true,
      detail: `${stats.orders} orders · ${stats.esims} eSIMs · ${stats.customers} customers. File/in-memory store — move to Postgres before launch (lib/db.ts).`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {checks.map((c) => (
          <div
            key={c.name}
            className={`glass rounded-2xl p-5 ${!c.ok ? "border-red-400/40" : ""}`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{c.name}</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  !c.ok
                    ? "bg-red-400/15 text-red-300"
                    : c.warn
                      ? "bg-amber-400/15 text-amber-300"
                      : "bg-aurora-500/15 text-aurora-400"
                }`}
              >
                {!c.ok ? "down" : c.warn ? "attention" : "healthy"}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{c.detail}</p>
          </div>
        ))}
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="font-semibold">Event log</h2>
          <span className="text-xs text-white/40">
            last {events.length} events · also at <code className="font-mono">/api/health</code>
          </span>
        </div>
        {events.length === 0 ? (
          <p className="px-6 py-5 text-sm text-white/45">
            No events yet — they appear as orders, eSIMs and admin actions flow
            through the system.
          </p>
        ) : (
          <table className="mt-4 w-full text-left text-sm">
            <tbody className="divide-y divide-white/5">
              {events.map((e) => (
                <tr key={e.id}>
                  <td className="whitespace-nowrap px-6 py-2.5 font-mono text-xs text-white/40">
                    {e.ts.slice(0, 19).replace("T", " ")}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs ${levelStyles[e.level]}`}>
                      {e.level}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs text-white/55">
                    {e.type}
                  </td>
                  <td className="px-6 py-2.5 text-white/70">{e.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
