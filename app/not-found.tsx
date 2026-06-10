import Link from "next/link";
import { CountrySearch } from "@/components/CountrySearch";

export default function NotFound() {
  return (
    <section className="aurora min-h-[70vh]">
      <div className="mx-auto max-w-2xl px-4 py-28 text-center sm:px-6">
        <p className="text-7xl">🧭</p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">
          Off the map
        </h1>
        <p className="mt-3 text-white/60">
          This page doesn&apos;t exist — but your destination probably does.
        </p>
        <div className="mx-auto mt-8 max-w-md">
          <CountrySearch />
        </div>
        <Link href="/" className="mt-8 inline-block text-sm font-medium text-aurora-400">
          ← Back to home
        </Link>
      </div>
    </section>
  );
}
