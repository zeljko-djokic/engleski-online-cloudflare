import type { Metadata } from "next";
import { CatalogIndex } from "@/components/catalog-pages";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Priprema za međunarodne ispite | Engleski Online",
  description:
    "Individualna online priprema za Cambridge C1 Advanced i C2 Proficiency, IELTS, TOEFL i SAT English.",
  alternates: {
    canonical: "/ispiti",
  },
};

export default async function ExamsPage() {
  const content = await getSiteContent();
  return (
    <CatalogIndex
      content={content}
      eyebrow={content.home.examsEyebrow}
      title={content.home.examsHeadline}
      intro={content.home.examsIntro}
      cards={content.exams.map((exam) => ({
        href: `/ispiti/${exam.slug}`,
        label: exam.label,
        title: exam.title,
        text: exam.summary,
        badgeSlug: exam.slug,
      }))}
    />
  );
}
