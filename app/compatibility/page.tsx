import { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/home/sections";

export const metadata: Metadata = {
  title: "eSIM compatible devices — full list for iPhone, Samsung, Pixel & more",
  description:
    "Check if your phone supports eSIM. Complete compatibility list: iPhone XS and later, Samsung Galaxy S20 and later, Google Pixel 3 and later, plus the *#06# EID test.",
  alternates: { canonical: "/compatibility" },
};

const deviceGroups = [
  {
    brand: "Apple iPhone",
    note: "iPhone XS (2018) and every model since.",
    devices: [
      "iPhone XS / XS Max / XR",
      "iPhone 11 / 12 / 13 / 14 / 15 / 16 / 17 series",
      "iPhone SE (2020, 2022)",
      "iPhone Air",
    ],
  },
  {
    brand: "Samsung Galaxy",
    note: "Galaxy S20 (2020) and later flagships, plus recent Z and A series.",
    devices: [
      "Galaxy S20 → S25 series",
      "Galaxy Note 20 / Note 20 Ultra",
      "Galaxy Z Flip & Z Fold (all)",
      "Galaxy A54 / A55 and newer A-series (region dependent)",
    ],
  },
  {
    brand: "Google Pixel",
    note: "Pixel 3 (2018) and every model since.",
    devices: ["Pixel 3 / 3a → Pixel 10 series", "Pixel Fold"],
  },
  {
    brand: "Other brands",
    note: "Many recent models from these makers support eSIM — check settings for “Add eSIM”.",
    devices: [
      "Huawei P40 and later (non-Lite)",
      "Oppo Find X3 Pro and later",
      "Sony Xperia 10 III and later",
      "Motorola Razr (2019) and later, Edge series",
      "Fairphone 4 / 5",
      "Xiaomi 12T Pro and later (region dependent)",
    ],
  },
];

const faqs = [
  {
    q: "How do I check if my phone has eSIM?",
    a: "Dial *#06#. If an EID number appears, your phone supports eSIM. On iPhone you can also check Settings → Cellular → Add eSIM; on Android, Settings → Network → SIMs.",
  },
  {
    q: "Does my phone need to be unlocked?",
    a: "Yes. A carrier-locked phone can't use another provider's eSIM. Phones bought outright are unlocked; phones on installment plans may not be — ask your carrier.",
  },
  {
    q: "My phone isn't on the list — can I still use eSIM?",
    a: "The list covers common models, not every one. The *#06# EID test is definitive: if you see an EID, you're compatible.",
  },
  {
    q: "Do tablets and laptops work?",
    a: "Many do — iPads from 2019 onward, Surface Pro X and later, and many Windows laptops with cellular options support eSIM and work with our data plans.",
  },
];

export default function CompatibilityPage() {
  return (
    <>
      <section className="aurora border-b border-white/10">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Is your phone <span className="text-gradient">eSIM ready?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/65">
            The 10-second test: dial <strong className="text-white">*#06#</strong>.
            See an EID number? You&apos;re ready to go.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {deviceGroups.map((g) => (
            <div key={g.brand} className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold">{g.brand}</h2>
              <p className="mt-1 text-sm text-white/50">{g.note}</p>
              <ul className="mt-4 space-y-2 text-sm text-white/65">
                {g.devices.map((d) => (
                  <li key={d}>✓ {d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-white/45">
          Device support can vary by region and carrier model. When in doubt,
          trust the *#06# EID test.
        </p>
      </section>

      <Faq items={faqs} title="Compatibility questions" />
      <FinalCta />
    </>
  );
}
