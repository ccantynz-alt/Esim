import { NextResponse } from "next/server";
import { storeStats } from "@/lib/db";
import { getProvider, isRealProvider } from "@/lib/provider";
import { isStripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * Machine-readable system health — point an uptime monitor
 * (BetterStack/UptimeRobot/Checkly) at this endpoint.
 */
export async function GET() {
  const provider = await getProvider().health();
  const stats = storeStats();
  const ok = provider.ok;
  return NextResponse.json(
    {
      ok,
      time: new Date().toISOString(),
      provider: { ...provider, real: isRealProvider() },
      stripe: { configured: isStripeConfigured() },
      store: {
        orders: stats.orders,
        esims: stats.esims,
        customers: stats.customers,
        errorEvents: stats.eventCounts.errors,
      },
    },
    { status: ok ? 200 : 503 },
  );
}
