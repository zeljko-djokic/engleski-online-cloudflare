import type { MetadataRoute } from "next";

const SITE_URL = "https://engleski-online.zeljko-d-djokic.workers.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/uredjivanje", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
