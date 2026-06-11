"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession, clearSession } from "@/lib/auth";
import { getEsim, updateEsim, logEvent } from "@/lib/db";

/** Simulates landing at the destination: starts the validity clock. */
export async function activateEsimAction(formData: FormData) {
  const session = await getSession();
  const esim = getEsim(String(formData.get("esimId") ?? ""));
  if (!session || !esim || esim.email !== session.email || esim.activatedAt) {
    return;
  }
  updateEsim(esim.id, { activatedAt: new Date().toISOString() });
  logEvent("info", "esim.activated", `eSIM ${esim.iccid} activated by ${session.email}`);
  revalidatePath("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
