import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/catalog-pages";
import { getSiteContent } from "@/lib/site-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const exam = content.exams.find((item) => item.slug === slug);
  return exam ? { title: `${exam.title} priprema | ${content.labels.brandName}`, description: exam.summary } : {};
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
      price={{
        label: content.labels.examPriceLabel,
        value: content.pricing.specializedLessonPrice,
      }}
      backHref="/ispiti"
      backLabel={content.labels.examBackLabel}
      sections={[
        { title: content.labels.examFocusTitle, items: exam.focus },
        { title: content.labels.examFormatTitle, items: exam.format },
      ]}
    />
  );
}
