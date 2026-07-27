import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/catalog-pages";
import { getSiteContent } from "@/lib/site-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = (await getSiteContent()).services.find((item) => item.slug === slug);
  return service ? { title: `${service.title} | Engleski Online`, description: service.summary } : {};
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const content = await getSiteContent();
  const service = content.services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <DetailPage
      content={content}
      eyebrow="Stručne jezičke usluge"
      title={service.headline}
      intro={service.intro}
      price={{ label: "Početna cena", value: `${service.price} ${service.unit}` }}
      backHref="/usluge"
      backLabel="Sve usluge"
      sections={[
        { title: "Usluga obuhvata", items: service.includes },
        { title: "Kako izgleda saradnja", items: service.process },
      ]}
    />
  );
}
