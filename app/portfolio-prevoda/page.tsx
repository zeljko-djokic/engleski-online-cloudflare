import type { Metadata } from "next";
import { ContactSection, SiteFooter, SiteHeader } from "@/components/site-frame";
import { getSiteContent } from "@/lib/site-content";
import { PortfolioBrowser } from "./portfolio-browser";

export const metadata: Metadata = {
  title: "Portfolio prevoda | Željko Đokić",
  description: "Odabrani primeri i pregled prevodilačkih projekata iz medicine, farmacije, obrazovanja, poslovanja i vazduhoplovstva.",
  alternates: { canonical: "/portfolio-prevoda" },
};

export default async function PortfolioPage() {
  const content = await getSiteContent();
  return (
    <>
      <SiteHeader content={content} />
      <main id="sadrzaj">
        <PortfolioBrowser entries={content.portfolio} />
        <ContactSection content={content} />
      </main>
      <SiteFooter content={content} />
    </>
  );
}
