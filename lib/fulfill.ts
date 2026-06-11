import {
  OrderRec,
  EsimRec,
  createEsim,
  getEsim,
  updateEsim,
  updateOrder,
  logEvent,
} from "./db";
import { getProvider } from "./provider";
import { getPlanById } from "./plans";

/**
 * Order fulfillment — the one path shared by simulated checkout (preview
 * mode) and the Stripe webhook (live mode). Provisions a new eSIM or
 * applies a top-up via the provider adapter.
 */
export async function fulfillOrder(order: OrderRec): Promise<EsimRec | null> {
  const provider = getProvider();
  const found = getPlanById(order.planId);
  if (!found) {
    updateOrder(order.id, { status: "failed" });
    logEvent("error", "fulfill.failed", `Order ${order.id.slice(0, 8)}: unknown plan ${order.planId}`);
    return null;
  }

  try {
    if (order.kind === "topup") {
      const esim = order.esimId ? getEsim(order.esimId) : undefined;
      if (!esim || esim.dataGb === "unlimited") {
        throw new Error(`top-up target eSIM ${order.esimId} not found or not top-uppable`);
      }
      const gb = found.plan.dataGb === "unlimited" ? 0 : found.plan.dataGb;
      await provider.topUp(esim.iccid, gb);
      updateEsim(esim.id, { topUpGb: esim.topUpGb + gb });
      updateOrder(order.id, { status: "paid" });
      logEvent("info", "esim.topup", `+${gb} GB on ${esim.iccid} (${order.email})`);
      return getEsim(esim.id) ?? null;
    }

    const provisioned = await provider.provision({
      planId: order.planId,
      countryCode: order.countryCode,
      email: order.email,
    });
    const esim = createEsim({
      email: order.email,
      countryCode: order.countryCode,
      planId: order.planId,
      planLabel: found.plan.label,
      dataGb: found.plan.dataGb,
      days: found.plan.days,
      iccid: provisioned.iccid,
      activationCode: provisioned.activationCode,
    });
    updateOrder(order.id, { status: "paid", esimId: esim.id });
    // TODO at launch: email the QR code to order.email (Resend/Postmark).
    return esim;
  } catch (err) {
    updateOrder(order.id, { status: "failed" });
    logEvent(
      "error",
      "fulfill.failed",
      `Order ${order.id.slice(0, 8)}: ${err instanceof Error ? err.message : "unknown error"}`,
    );
    return null;
  }
}
