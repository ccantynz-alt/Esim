import { Metadata } from "next";
import { adminLoginAction } from "./actions";
import { isAuthHardened } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <section className="aurora min-h-[70vh]">
      <div className="mx-auto max-w-md px-4 py-24 sm:px-6">
        <h1 className="text-center text-3xl font-bold tracking-tight">Admin access</h1>
        <form action={adminLoginAction} className="glass mt-8 space-y-4 rounded-2xl p-6">
          <label className="block text-sm">
            <span className="text-white/70">Admin password</span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-white outline-none focus:border-white/35"
            />
          </label>
          {error && <p className="text-xs text-red-400">Wrong password.</p>}
          <button className="btn-primary w-full rounded-xl px-5 py-3 text-sm font-semibold">
            Sign in
          </button>
          {!isAuthHardened() && (
            <p className="text-center text-xs text-amber-300/80">
              Dev default password: <code className="font-mono">layova-admin</code>.
              Set ADMIN_PASSWORD and AUTH_SECRET env vars to harden.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
