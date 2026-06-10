import { Plan, formatData, formatPrice } from "@/lib/plans";
import { BuyButton } from "@/components/BuyButton";

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`glass relative flex flex-col rounded-2xl p-6 ${
        plan.popular ? "border-aurora-400/60 ring-1 ring-aurora-400/40" : ""
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-aurora-500 px-3 py-0.5 text-xs font-semibold text-ink-950">
          Most popular
        </span>
      )}
      <div className="text-sm font-medium text-white/60">{plan.label}</div>
      <div className="mt-2 text-3xl font-bold">{formatData(plan.dataGb)}</div>
      <div className="mt-1 text-sm text-white/50">{plan.days} days validity</div>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-aurora-400">
          {formatPrice(plan.priceUsd)}
        </span>
        {typeof plan.dataGb === "number" && (
          <span className="text-xs text-white/40">
            {formatPrice(plan.priceUsd / plan.dataGb)}/GB
          </span>
        )}
      </div>
      <ul className="mt-5 flex-1 space-y-2 text-sm text-white/60">
        <li>✓ Instant QR delivery</li>
        <li>✓ 4G/5G where available</li>
        <li>✓ Hotspot / tethering included</li>
        <li>✓ Top-up anytime</li>
      </ul>
      <div className="mt-6">
        <BuyButton planId={plan.id} />
      </div>
    </div>
  );
}
