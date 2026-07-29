import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import "./globals.css";

const SITE_URL = "https://engleski-online.zeljko-d-djokic.workers.dev";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    metadataBase: new URL(SITE_URL),
    title: content.seo.pageTitle,
    description: content.seo.metaDescription,
    keywords: [
      "online časovi engleskog",
      "individualni časovi engleskog",
      "Cambridge English priprema",
      "IELTS priprema",
      "TOEFL priprema",
      "SAT English priprema",
      "prevod engleski srpski",
      "Željko Đokić",
    ],
    openGraph: {
      title: content.seo.shareTitle,
      description: content.seo.shareDescription,
      url: SITE_URL,
      siteName: content.labels.brandName,
      locale: "sr_RS",
      type: "website",
      images: [
        {
          url: "/og-engleski-online.png",
          width: 1200,
          height: 630,
          type: "image/png",
          alt: content.seo.shareImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo.shareTitle,
      description: content.seo.shareDescription,
      images: ["/og-engleski-online.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body>{children}</body>
    </html>
  );
}
