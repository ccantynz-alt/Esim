import { listEsims, esimStatus, esimDaysLeft, totalDataGb } from "@/lib/db";
import { getProvider } from "@/lib/provider";
import { getCountryByCode } from "@/lib/countries";
import { formatData } from "@/lib/plans";
import { deactivateEsimAction, resendQrAction } from "../actions";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  active: "bg-aurora-500/15 text-aurora-400",
  ready: "bg-sky-glow/15 text-sky-glow",
  expired: "bg-white/10 text-white/40",
  deactivated: "bg-red-400/15 text-red-300",
};

export default async function AdminEsimsPage() {
  const esims = listEsims();
  const provider = getProvider();
  const usage = await Promise.all(esims.map((e) => provider.getUsage(e)));

  if (esims.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-white/60">
        No eSIMs provisioned yet.
      </div>
    );
  }

  return (
    <div className="glass overflow-x-auto rounded-2xl">
      <table className="w-full min-w-[52rem] text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
          <tr>
            <th className="px-5 py-3.5">ICCID</th>
            <th className="px-5 py-3.5">Customer</th>
            <th className="px-5 py-3.5">Plan</th>
            <th className="px-5 py-3.5">Usage</th>
            <th className="px-5 py-3.5">Validity</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {esims.map((esim, i) => {
            const country = getCountryByCode(esim.countryCode);
            const status = esimStatus(esim);
            const total = totalDataGb(esim);
            return (
              <tr key={esim.id}>
                <td className="px-5 py-4 font-mono text-xs text-white/60">
                  {esim.iccid}
                </td>
                <td className="px-5 py-4 text-white/70">{esim.email}</td>
                <td className="px-5 py-4">
                  {country?.flag} {country?.name} · {esim.planLabel}
                  {esim.topUpGb > 0 && (
                    <span className="ml-1 text-xs text-aurora-400">
                      +{esim.topUpGb} GB
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-white/60">
                  {usage[i].usedGb.toFixed(1)} / {formatData(total)}
                </td>
                <td className="px-5 py-4 text-white/60">
                  {status === "ready"
                    ? `${esim.days}d (not activated)`
                    : `${esimDaysLeft(esim)}d left`}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[status]}`}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <form action={resendQrAction}>
                      <input type="hidden" name="esimId" value={esim.id} />
                      <button className="glass glass-hover rounded-lg px-3 py-1.5 text-xs">
                        Resend QR
                      </button>
                    </form>
                    {!esim.deactivated && (
                      <form action={deactivateEsimAction}>
                        <input type="hidden" name="esimId" value={esim.id} />
                        <button className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-400/10">
                          Deactivate
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
