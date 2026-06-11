import { site, absoluteUrl } from "@/lib/site";
import { Country } from "@/lib/countries";
import { Plan, formatData } from "@/lib/plans";

/** Renders a schema.org JSON-LD block. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/icon.svg"),
    email: site.supportEmail,
    sameAs: [`https://twitter.com/${site.twitter.replace("@", "")}`],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/destinations?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function countryProductLd(country: Country, plans: Plan[]) {
  const prices = plans.map((p) => p.priceUsd);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${country.name} eSIM data plan`,
    description: `Prepaid travel eSIM for ${country.name}. Plans from ${formatData(plans[0].dataGb)} with instant QR delivery and no roaming fees.`,
    brand: { "@type": "Brand", name: site.name },
    url: absoluteUrl(`/esim/${country.slug}`),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(...prices).toFixed(2),
      highPrice: Math.max(...prices).toFixed(2),
      offerCount: plans.length,
      availability: "https://schema.org/InStock",
    },
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
