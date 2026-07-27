import {
  Arrow,
  ContactSection,
  ExamBadge,
  SiteFooter,
  SiteHeader,
} from "@/components/site-frame";
import type { SiteContent } from "@/lib/content-model";

type CatalogCard = {
  href: string;
  label: string;
  title: string;
  text: string;
  meta?: string;
  badgeSlug?: string;
};

export function CatalogIndex({
  content,
  eyebrow,
  title,
  intro,
  cards,
}: {
  content: SiteContent;
  eyebrow: string;
  title: string;
  intro: string;
  cards: CatalogCard[];
}) {
  return (
    <>
      <SiteHeader content={content} />
      <main id="sadrzaj">
        <section className="catalog-hero shell">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
        </section>
        <section className="catalog-section">
          <div className="shell catalog-grid">
            {cards.map((card, index) => (
              <a className="catalog-card" href={card.href} key={card.href}>
                {card.badgeSlug ? (
                  <ExamBadge
                    slug={card.badgeSlug}
                    label={card.label}
                    title={card.title}
                  />
                ) : (
                  <span>{card.label || String(index + 1).padStart(2, "0")}</span>
                )}
                <h2>{card.title}</h2>
                <p>{card.text}</p>
                {card.meta && <strong>{card.meta}</strong>}
                <div>{content.labels.catalogDetailCta} <Arrow /></div>
              </a>
            ))}
          </div>
        </section>
        <ContactSection content={content} />
      </main>
      <SiteFooter content={content} />
    </>
  );
}

export function DetailPage({
  content,
  eyebrow,
  title,
  intro,
  sections,
  price,
  asideText,
  backHref,
  backLabel,
}: {
  content: SiteContent;
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; items: string[] }>;
  price?: { label: string; value: string };
  asideText?: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <>
      <SiteHeader content={content} />
      <main id="sadrzaj">
        <section className="detail-hero shell">
          <a className="back-link" href={backHref}>← {backLabel}</a>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="detail-lede">{intro}</p>
          <a className="button button-primary" href="#kontakt">
            {content.labels.detailPrimaryCta} <Arrow />
          </a>
        </section>
        <section className="detail-body">
          <div className="shell detail-layout">
            <div className="detail-sections">
              {sections.map((section, index) => (
                <article key={section.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h2>{section.title}</h2>
                    <ul>
                      {section.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
            <aside className="detail-aside">
              {price && (
                <div>
                  <span>{price.label}</span>
                  <strong>{price.value}</strong>
                </div>
              )}
              <p>{asideText ?? content.labels.detailAsideText}</p>
              <a href="#kontakt">{content.labels.detailInquiryCta} <Arrow /></a>
            </aside>
          </div>
        </section>
        <ContactSection content={content} />
      </main>
      <SiteFooter content={content} />
    </>
  );
}
