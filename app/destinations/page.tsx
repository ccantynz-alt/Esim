import { Metadata } from "next";
import { site } from "@/lib/site";
import { DestinationsExplorer } from "@/components/DestinationsExplorer";

export const metadata: Metadata = {
  title: `All destinations — eSIM data plans in ${site.countryCount}+ countries`,
  description: `Browse prepaid travel eSIM data plans for every destination ${site.name} covers — ${site.countryCount}+ countries across Europe, Asia, the Americas, Africa, Oceania, the Middle East and the Caribbean.`,
  alternates: { canonical: "/destinations" },
};

export default function DestinationsPage() {
  return (
    <>
      <section className="aurora border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Every destination, <span className="text-gradient">one tap away</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/65">
            Prepaid eSIM data in {site.countryCount}+ countries. Pick yours and
            be connected before your flight boards.
          </p>
        </div>
      </section>
      <DestinationsExplorer />
    </>
  );
}
