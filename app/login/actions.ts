"use server";

import { redirect } from "next/navigation";
import { setSession } from "@/lib/auth";
import { upsertUser } from "@/lib/db";

/**
 * Passwordless demo sign-in: any email creates/loads an account.
 * Replace with real magic-link or OAuth before launch.
 */
export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    redirect("/login?error=1");
  }
  const user = upsertUser(email);
  await setSession({ email: user.email, name: user.name, role: "customer" });
  redirect("/dashboard");
}
