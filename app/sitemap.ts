import { MetadataRoute } from "next";
import { countries } from "@/lib/countries";
import { corridors } from "@/lib/corridors";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/destinations"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/how-it-works"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/compatibility"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/help"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/llm-info"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/business"), changeFrequency: "monthly", priority: 0.8 },
  ];

  const corridorPages: MetadataRoute.Sitemap = corridors.map((c) => ({
    url: absoluteUrl(`/esim/${c.slug}`),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const countryPages: MetadataRoute.Sitemap = countries.map((c) => ({
    url: absoluteUrl(`/esim/${c.slug}`),
    changeFrequency: "weekly",
    priority: c.popular ? 0.9 : 0.8,
  }));

  return [...staticPages, ...corridorPages, ...countryPages];
}
