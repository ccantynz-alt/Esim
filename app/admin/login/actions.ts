"use server";

import { redirect } from "next/navigation";
import { setSession, verifyAdminPassword } from "@/lib/auth";
import { logEvent } from "@/lib/db";

export async function adminLoginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!verifyAdminPassword(password)) {
    logEvent("warn", "admin.login_failed", "Failed admin login attempt");
    redirect("/admin/login?error=1");
  }
  await setSession({ email: "admin@layova.travel", name: "Admin", role: "admin" });
  logEvent("info", "admin.login", "Admin signed in");
  redirect("/admin");
}
