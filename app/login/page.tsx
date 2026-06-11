import { Metadata } from "next";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <section className="aurora min-h-[70vh]">
      <div className="mx-auto max-w-md px-4 py-24 sm:px-6">
        <h1 className="text-center text-3xl font-bold tracking-tight">
          Sign in to <span className="text-gradient">Layova</span>
        </h1>
        <p className="mt-3 text-center text-sm text-white/55">
          Enter your email to access your eSIMs, usage and orders.
        </p>
        <form action={loginAction} className="glass mt-8 space-y-4 rounded-2xl p-6">
          <label className="block text-sm">
            <span className="text-white/70">Email address</span>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-white placeholder-white/35 outline-none focus:border-white/35"
            />
          </label>
          {error && (
            <p className="text-xs text-red-400">Please enter a valid email address.</p>
          )}
          <button className="btn-primary w-full rounded-xl px-5 py-3 text-sm font-semibold">
            Continue
          </button>
          <p className="text-center text-xs text-white/40">
            Demo authentication — magic-link verification ships with the
            production backend.
          </p>
        </form>
      </div>
    </section>
  );
}
