import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DetailPage } from "@/components/catalog-pages";
import { getSiteContent } from "@/lib/site-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const program = content.programs.find((item) => item.slug === slug);
  return program
    ? { title: `${program.title} | ${content.labels.brandName}`, description: program.summary }
    : {};
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "priprema-ispita") redirect("/ispiti");

  const content = await getSiteContent();
  const program = content.programs.find((item) => item.slug === slug);
  if (!program) notFound();

  return (
    <DetailPage
      content={content}
      eyebrow={program.eyebrow}
      title={program.headline}
      intro={program.intro}
      price={{ label: content.labels.coursePriceLabel, value: program.price }}
      backHref="/kursevi"
      backLabel={content.labels.courseBackLabel}
      sections={[
        { title: content.labels.courseAudienceTitle, items: program.audience },
        { title: content.labels.courseOutcomesTitle, items: program.outcomes },
        { title: content.labels.courseFormatTitle, items: program.format },
      ]}
    />
  );
}
