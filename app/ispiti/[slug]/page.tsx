import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/catalog-pages";
import { getSiteContent } from "@/lib/site-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exam = (await getSiteContent()).exams.find((item) => item.slug === slug);
  return exam ? { title: `${exam.title} priprema | Engleski Online`, description: exam.summary } : {};
}

export default async function ExamDetailPage({ params }: Props) {
  const { slug } = await params;
  const content = await getSiteContent();
  const exam = content.exams.find((item) => item.slug === slug);
  if (!exam) notFound();

  return (
    <DetailPage
      content={content}
      eyebrow={exam.label}
      title={exam.headline}
      intro={exam.intro}
      price={{ label: "Cena individualnog časa", value: `od ${content.pricing.lessonPrice}` }}
      backHref="/ispiti"
      backLabel="Sve pripreme"
      sections={[
        { title: "Na čemu radimo", items: exam.focus },
        { title: "Kako izgleda priprema", items: exam.format },
      ]}
    />
  );
}
