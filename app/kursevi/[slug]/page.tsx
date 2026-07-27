import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/catalog-pages";
import { getSiteContent } from "@/lib/site-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = (await getSiteContent()).programs.find((item) => item.slug === slug);
  return program
    ? { title: `${program.title} | Engleski Online`, description: program.summary }
    : {};
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const content = await getSiteContent();
  const program = content.programs.find((item) => item.slug === slug);
  if (!program) notFound();

  return (
    <DetailPage
      content={content}
      eyebrow={program.eyebrow}
      title={program.headline}
      intro={program.intro}
      price={{ label: "Cena individualnog časa", value: `od ${program.price}` }}
      backHref="/kursevi"
      backLabel="Svi kursevi"
      sections={[
        { title: "Kome je program namenjen", items: program.audience },
        { title: "Šta ćete postići", items: program.outcomes },
        { title: "Kako izgleda rad", items: program.format },
      ]}
    />
  );
}
