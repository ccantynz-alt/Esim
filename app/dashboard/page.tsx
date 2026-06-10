import Link from "next/link";
import { demoEsims, CustomerEsim } from "@/lib/demo-data";
import { getCountryByCode } from "@/lib/countries";
import { formatData } from "@/lib/plans";

const statusStyles: Record<CustomerEsim["status"], string> = {
  active: "bg-aurora-500/15 text-aurora-400",
  ready: "bg-sky-glow/15 text-sky-glow",
  expired: "bg-white/10 text-white/40",
};

export default function DashboardPage() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {demoEsims.map((esim) => (
        <EsimCard key={esim.id} esim={esim} />
      ))}
      <Link
        href="/destinations"
        className="glass glass-hover flex min-h-44 flex-col items-center justify-center rounded-2xl border-dashed text-white/50 transition hover:text-white"
      >
        <span className="text-3xl">＋</span>
        <span className="mt-2 text-sm font-medium">Get a new eSIM</span>
      </Link>
    </div>
  );
}

function EsimCard({ esim }: { esim: CustomerEsim }) {
  const country = getCountryByCode(esim.countryCode);
  const total = esim.dataGb === "unlimited" ? null : esim.dataGb;
  const pct = total ? Math.min(100, Math.round((esim.usedGb / total) * 100)) : 0;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{country?.flag}</span>
          <div>
            <div className="font-semibold">
              {country?.name} — {esim.planLabel}
            </div>
            <div className="mt-0.5 font-mono text-xs text-white/40">
              ICCID {esim.iccid}
            </div>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[esim.status]}`}
        >
          {esim.status}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-sm">
          <span className="text-white/55">
            {esim.usedGb.toFixed(1)} GB of {formatData(esim.dataGb)} used
          </span>
          <span className="text-white/55">
            {esim.status === "expired" ? "Expired" : `${esim.daysLeft} days left`}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full ${
              esim.status === "expired"
                ? "bg-white/25"
                : "bg-gradient-to-r from-violet-glow to-aurora-400"
            }`}
            style={{ width: `${esim.status === "expired" ? 100 : pct}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        {esim.status !== "expired" && (
          <button className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold">
            Top up data
          </button>
        )}
        <button className="glass glass-hover rounded-xl px-4 py-2 text-sm">
          {esim.status === "ready" ? "View QR code" : "Details"}
        </button>
        {esim.status === "expired" && country && (
          <Link
            href={`/esim/${country.slug}`}
            className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Buy again
          </Link>
        )}
      </div>
    </div>
  );
}
