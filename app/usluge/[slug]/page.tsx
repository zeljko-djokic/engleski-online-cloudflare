import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/catalog-pages";
import { getSiteContent } from "@/lib/site-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const service = content.services.find((item) => item.slug === slug);
  return service
    ? {
        title: `${service.title} | ${content.labels.brandName}`,
        description: service.summary,
        alternates: { canonical: `/usluge/${service.slug}` },
      }
    : {};
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const content = await getSiteContent();
  const service = content.services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <DetailPage
      content={content}
      eyebrow={content.labels.serviceEyebrow}
      title={service.headline}
      intro={service.intro}
      asideText={service.asideText}
      price={{ label: content.labels.servicePriceLabel, value: `${service.price} ${service.unit}` }}
      backHref="/usluge"
      backLabel={content.labels.serviceBackLabel}
      sections={[
        { title: content.labels.serviceIncludesTitle, items: service.includes },
        { title: content.labels.serviceProcessTitle, items: service.process },
      ]}
    />
  );
}
