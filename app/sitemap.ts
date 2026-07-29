import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/site-content";

const SITE_URL = "https://engleski-online.zeljko-d-djokic.workers.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const lastModified = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/kursevi`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ispiti`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/usluge`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/politika-privatnosti`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [
    ...staticPages,
    ...content.programs.map((program) => ({
      url: `${SITE_URL}/kursevi/${program.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...content.exams.map((exam) => ({
      url: `${SITE_URL}/ispiti/${exam.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...content.services.map((service) => ({
      url: `${SITE_URL}/usluge/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
