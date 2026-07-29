import type { Metadata } from "next";
import { CatalogIndex } from "@/components/catalog-pages";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Prevođenje, lektura i redaktura | Engleski Online",
  description: "EN–SR prevođenje, lektura, korektura, redaktura i usmeno prevođenje.",
  alternates: {
    canonical: "/usluge",
  },
};

export default async function ServicesPage() {
  const content = await getSiteContent();
  return (
    <CatalogIndex
      content={content}
      eyebrow={content.home.servicesEyebrow}
      title={content.home.servicesHeadline}
      intro={content.home.servicesIntro}
      cards={content.services.map((service) => ({
        href: `/usluge/${service.slug}`,
        label: service.number,
        title: service.title,
        text: service.summary,
        meta: `${service.price} ${service.unit}`,
      }))}
    />
  );
}
