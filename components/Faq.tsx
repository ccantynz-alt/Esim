import { JsonLd, faqLd } from "@/components/JsonLd";

export interface FaqItem {
  q: string;
  a: string;
}

/** Accessible accordion FAQ with FAQPage structured data baked in. */
export function Faq({ items, title = "Frequently asked questions" }: { items: FaqItem[]; title?: string }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <JsonLd data={faqLd(items)} />
      <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <div className="mt-10 space-y-3">
        {items.map((item) => (
          <details key={item.q} className="glass group rounded-2xl px-6 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {item.q}
              <span className="text-white/40 transition group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-white/65">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
