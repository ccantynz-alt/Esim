"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import {
  getOrder,
  getEsim,
  updateOrder,
  updateEsim,
  updateLeadStatus,
  LeadStatus,
  logEvent,
} from "@/lib/db";
import { getProvider } from "@/lib/provider";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== "admin") throw new Error("Admin access required");
  return session;
}

/**
 * Refund an order. With Stripe live this issues a real refund; in preview
 * mode it just updates state. A refunded new-eSIM order also deactivates
 * the eSIM at the provider.
 */
export async function refundOrderAction(formData: FormData) {
  await requireAdmin();
  const order = getOrder(String(formData.get("orderId") ?? ""));
  if (!order || order.status !== "paid") return;

  if (isStripeConfigured() && order.stripeSessionId) {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
    if (typeof session.payment_intent === "string") {
      await stripe.refunds.create({ payment_intent: session.payment_intent });
    }
  }

  updateOrder(order.id, { status: "refunded" });
  logEvent("warn", "order.refunded", `Order ${order.id.slice(0, 8)} refunded (${order.email}, $${order.amountUsd})`);

  if (order.kind === "new" && order.esimId) {
    const esim = getEsim(order.esimId);
    if (esim && !esim.deactivated) {
      await getProvider().deactivate(esim.iccid);
      updateEsim(esim.id, { deactivated: true });
      logEvent("warn", "esim.deactivated", `eSIM ${esim.iccid} deactivated after refund`);
    }
  }
  revalidatePath("/admin");
}

export async function deactivateEsimAction(formData: FormData) {
  await requireAdmin();
  const esim = getEsim(String(formData.get("esimId") ?? ""));
  if (!esim || esim.deactivated) return;
  await getProvider().deactivate(esim.iccid);
  updateEsim(esim.id, { deactivated: true });
  logEvent("warn", "esim.deactivated", `eSIM ${esim.iccid} deactivated by admin`);
  revalidatePath("/admin");
}

export async function updateLeadStatusAction(formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status") ?? "") as LeadStatus;
  if (!["new", "contacted", "won", "lost"].includes(status)) return;
  updateLeadStatus(String(formData.get("leadId") ?? ""), status);
  revalidatePath("/admin/partners");
}

export async function resendQrAction(formData: FormData) {
  await requireAdmin();
  const esim = getEsim(String(formData.get("esimId") ?? ""));
  if (!esim) return;
  // TODO at launch: actually email the QR via Resend/Postmark.
  logEvent("info", "esim.qr_resent", `QR code re-sent to ${esim.email} for ${esim.iccid}`);
  revalidatePath("/admin");
}
