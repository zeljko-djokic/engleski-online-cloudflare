import type { Metadata } from "next";
import { CatalogIndex } from "@/components/catalog-pages";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Online kursevi engleskog | Engleski Online",
  description: "Individualni programi opšteg, poslovnog i stručnog engleskog, kao i priprema međunarodnih ispita.",
};

export default async function CoursesPage() {
  const content = await getSiteContent();
  return (
    <CatalogIndex
      content={content}
      eyebrow={content.home.programsEyebrow}
      title={content.home.programsHeadline}
      intro={content.home.programsIntro}
      cards={content.programs.map((program) => ({
        href: `/kursevi/${program.slug}`,
        label: program.number,
        title: program.title,
        text: program.summary,
        meta: `${program.meta} · od ${program.price}`,
      }))}
    />
  );
}
