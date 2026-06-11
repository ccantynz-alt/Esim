import Link from "next/link";
import QRCode from "qrcode";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  listEsims,
  esimStatus,
  esimDaysLeft,
  totalDataGb,
  EsimRec,
  EsimStatus,
} from "@/lib/db";
import { getProvider } from "@/lib/provider";
import { getCountryByCode } from "@/lib/countries";
import { plansForCountry, formatData, formatPrice } from "@/lib/plans";
import { TopUpMenu } from "@/components/TopUpMenu";
import { activateEsimAction } from "./actions";

export const dynamic = "force-dynamic";

const statusStyles: Record<EsimStatus, string> = {
  active: "bg-aurora-500/15 text-aurora-400",
  ready: "bg-sky-glow/15 text-sky-glow",
  expired: "bg-white/10 text-white/40",
  deactivated: "bg-red-400/15 text-red-300",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const esims = listEsims(session.email);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {esims.map((esim) => (
        <EsimCard key={esim.id} esim={esim} />
      ))}
      {esims.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center text-white/60 lg:col-span-2">
          No eSIMs yet — your next trip starts here.
        </div>
      )}
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

async function EsimCard({ esim }: { esim: EsimRec }) {
  const country = getCountryByCode(esim.countryCode);
  const status = esimStatus(esim);
  const daysLeft = esimDaysLeft(esim);
  const total = totalDataGb(esim);
  const { usedGb } = await getProvider().getUsage(esim);
  const pct =
    total === "unlimited" ? 0 : Math.min(100, Math.round((usedGb / total) * 100));

  const topUpOptions =
    country && esim.dataGb !== "unlimited"
      ? plansForCountry(country)
          .filter((p) => typeof p.dataGb === "number" && p.dataGb >= 3 && p.dataGb <= 10)
          .map((p) => ({
            planId: p.id,
            label: `+${formatData(p.dataGb)} · ${formatPrice(p.priceUsd)}`,
          }))
      : [];

  const qrDataUrl =
    status === "ready"
      ? await QRCode.toDataURL(esim.activationCode, { width: 160, margin: 1 })
      : null;

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
          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-sm">
          <span className="text-white/55">
            {usedGb.toFixed(1)} GB of {formatData(total)} used
            {esim.topUpGb > 0 && (
              <span className="ml-1 text-aurora-400">(+{esim.topUpGb} GB topped up)</span>
            )}
          </span>
          <span className="text-white/55">
            {status === "expired"
              ? "Expired"
              : status === "ready"
                ? `${esim.days} days once activated`
                : `${daysLeft} days left`}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full ${
              status === "expired" || status === "deactivated"
                ? "bg-white/25"
                : "bg-gradient-to-r from-violet-glow to-aurora-400"
            }`}
            style={{ width: `${status === "expired" ? 100 : pct}%` }}
          />
        </div>
      </div>

      {qrDataUrl && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-aurora-400">
            Show install QR code
          </summary>
          <div className="mt-3 rounded-xl bg-white/5 p-4 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="eSIM activation QR code"
              width={140}
              height={140}
              className="mx-auto rounded-lg bg-white p-1.5"
            />
            <p className="mt-2 font-mono text-[10px] text-white/40">
              {esim.activationCode}
            </p>
          </div>
        </details>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {status === "active" && topUpOptions.length > 0 && (
          <TopUpMenu esimId={esim.id} options={topUpOptions} />
        )}
        {status === "ready" && (
          <form action={activateEsimAction}>
            <input type="hidden" name="esimId" value={esim.id} />
            <button className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold">
              Activate now (simulate landing)
            </button>
          </form>
        )}
        {(status === "expired" || status === "deactivated") && country && (
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
