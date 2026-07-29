import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Arrow,
  ContactSection,
  ExamBadge,
  SiteFooter,
  SiteHeader,
} from "@/components/site-frame";
import { TestimonialForm } from "@/app/testimonial-form";
import type { SiteContent } from "@/lib/content-model";
import { getSiteContent } from "@/lib/site-content";
import { getApprovedTestimonials } from "@/lib/testimonials";

const SITE_URL = "https://engleski-online.zeljko-d-djokic.workers.dev";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

function extractEuroPrice(value: string): string | undefined {
  return value.replace(",", ".").match(/\d+(?:\.\d+)?/)?.[0];
}

function buildStructuredData(content: SiteContent) {
  const personId = `${SITE_URL}/#zeljko-djokic`;
  const organizationId = `${SITE_URL}/#organization`;
  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: content.labels.brandName,
      description: content.seo.metaDescription,
      inLanguage: "sr-Latn",
      publisher: { "@id": organizationId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: "Željko Đokić",
      url: SITE_URL,
      email: content.global.email,
      telephone: content.global.phoneLink,
      jobTitle: "Master filolog anglista i nastavnik engleskog jezika",
      sameAs: [content.global.linkedinUrl],
      knowsLanguage: ["sr", "en"],
    },
    {
      "@type": "EducationalOrganization",
      "@id": organizationId,
      name: content.labels.brandName,
      url: SITE_URL,
      email: content.global.email,
      telephone: content.global.phoneLink,
      founder: { "@id": personId },
      areaServed: "Online",
    },
  ];

  content.programs.forEach((program) => {
    const price = extractEuroPrice(program.price);
    graph.push({
      "@type": "Course",
      "@id": `${SITE_URL}/kursevi/${program.slug}#course`,
      name: program.title,
      description: program.summary,
      url: `${SITE_URL}/kursevi/${program.slug}`,
      inLanguage: "sr-Latn",
      provider: { "@id": organizationId },
      ...(price
        ? {
            offers: {
              "@type": "Offer",
              price,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
            },
          }
        : {}),
    });
  });

  const examPreparationPrice = extractEuroPrice(
    content.pricing.specializedLessonPrice,
  );
  content.exams.forEach((exam) => {
    graph.push({
      "@type": "Course",
      "@id": `${SITE_URL}/ispiti/${exam.slug}#course`,
      name: `Priprema za ${exam.title}`,
      description: exam.summary,
      url: `${SITE_URL}/ispiti/${exam.slug}`,
      inLanguage: "sr-Latn",
      provider: { "@id": organizationId },
      ...(examPreparationPrice
        ? {
            offers: {
              "@type": "Offer",
              price: examPreparationPrice,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
            },
          }
        : {}),
    });
  });

  content.services.forEach((service) => {
    const price = extractEuroPrice(service.price);
    graph.push({
      "@type": "Service",
      "@id": `${SITE_URL}/usluge/${service.slug}#service`,
      name: service.title,
      description: service.summary,
      url: `${SITE_URL}/usluge/${service.slug}`,
      serviceType: service.title,
      areaServed: "Online",
      provider: { "@id": organizationId },
      ...(price
        ? {
            offers: {
              "@type": "Offer",
              price,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
            },
          }
        : {}),
    });
  });

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export default async function Home() {
  const [content, testimonials] = await Promise.all([
    getSiteContent(),
    getApprovedTestimonials(),
  ]);
  const { global, hero, home, about, pricing, labels } = content;
  const translationService = content.services.find(
    (service) => service.slug === "prevodjenje",
  );
  const proofreadingService = content.services.find(
    (service) => service.slug === "lektura-korektura-redaktura",
  );
  const structuredData = buildStructuredData(content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</gu, "\\u003c"),
        }}
      />
      <SiteHeader content={content} />
      <main id="sadrzaj">
        <section className="hero shell" id="pocetna">
          <div className="hero-copy">
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1>
              {hero.headlineLine1}
              <br />
              {hero.headlineLine2}
              <span className="accent-dot">.</span>
            </h1>
            <p className="hero-lede">{hero.lede}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#kontakt">
                {hero.primaryCta} <Arrow />
              </a>
              <a className="text-link" href="#programi">
                {hero.secondaryCta} <Arrow />
              </a>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="paper-note">
              <span>{labels.dictionaryPartOfSpeech}</span>
              <strong>{labels.dictionaryWord}</strong>
              <em>{labels.dictionaryPronunciation}</em>
            </div>
            <Image
              src="/hero-editorial.webp"
              alt=""
              width={1000}
              height={1250}
              priority
              sizes="(max-width: 960px) 86vw, 44vw"
            />
          </div>
        </section>

        <section className="trust-strip shell" aria-label="Profesionalne informacije">
          <div className="credential">
            <span className="credential-mark" aria-hidden="true">{labels.aboutMark}</span>
            <p>
              <strong>{labels.trustName}</strong>
              <span>{hero.credential}</span>
              <span>{hero.experience}</span>
            </p>
          </div>
          <div className="trust-items">
            {labels.trustItems.map((item, index) => (
              <p key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span> {item}
              </p>
            ))}
          </div>
        </section>

        <section className="section section-programs" id="programi">
          <div className="shell">
            <div className="section-heading">
              <p className="eyebrow">{home.programsEyebrow}</p>
              <h2>{home.programsHeadline}</h2>
              <p>{home.programsIntro}</p>
            </div>
            <div className="program-grid">
              {content.programs.map((program) => (
                <a className="program-card card-link" href={`/kursevi/${program.slug}`} key={program.slug}>
                  <div className="card-topline">
                    <span>{program.number}</span>
                    <span>{program.price}</span>
                  </div>
                  <h3>{program.title}</h3>
                  <p>{program.summary}</p>
                  <div className="card-meta">{program.meta} <Arrow /></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section exam-section" id="ispiti">
          <div className="shell exam-layout">
            <div className="exam-intro">
              <p className="eyebrow">{home.examsEyebrow}</p>
              <h2>{home.examsHeadline}</h2>
              <p>{home.examsIntro}</p>
              <Link className="text-link" href="/ispiti">
                {labels.examsAllCta} <Arrow />
              </Link>
            </div>
            <div className="exam-list">
              <article>
                <ExamBadge
                  slug="c1-advanced-cae"
                  label="Cambridge"
                  title="C1 Advanced i C2 Proficiency"
                />
                <h3>Cambridge English</h3>
                <p>C1 Advanced (CAE) i C2 Proficiency (CPE)</p>
              </article>
              <article>
                <ExamBadge
                  slug="ielts"
                  label="Academic English"
                  title="IELTS i TOEFL"
                />
                <h3>IELTS i TOEFL</h3>
                <p>Priprema prema ciljnom rezultatu i roku do polaganja.</p>
              </article>
              <article>
                <ExamBadge
                  slug="sat"
                  label="College admission"
                  title="SAT English"
                />
                <h3>SAT English</h3>
                <p>Reading and Writing deo digitalnog SAT ispita.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="process-section">
          <div className="shell">
            <div className="section-heading compact-heading">
              <p className="eyebrow">{home.processEyebrow}</p>
              <h2>{home.processHeadline}</h2>
            </div>
            <ol className="process-grid">
              {home.process.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section services-section" id="usluge">
          <div className="shell">
            <div className="section-heading services-heading">
              <p className="eyebrow">{home.servicesEyebrow}</p>
              <h2>{home.servicesHeadline}</h2>
              <p>{home.servicesIntro}</p>
            </div>
            <div className="service-stack">
              {content.services.map((service) => (
                <a className="service-row card-link" href={`/usluge/${service.slug}`} key={service.slug}>
                  <span className="service-number">{service.number}</span>
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.summary}</p>
                  </div>
                  <p className="service-price">{service.price}<span>{service.unit}</span></p>
                </a>
              ))}
            </div>
            <p className="service-note">{labels.serviceNote}</p>
          </div>
        </section>

        <section className="section about-section" id="o-meni">
          <div className="shell about-layout">
            <div className="about-mark" aria-hidden="true">
              <span>{labels.aboutMark}</span>
              <p>{labels.aboutMotto}</p>
            </div>
            <div className="about-copy">
              <p className="eyebrow">{about.eyebrow}</p>
              <h2>{about.headline}</h2>
              <p className="about-lede">{about.lede}</p>
              <p>{about.body}</p>
              <div className="about-facts">
                <p><strong>{labels.aboutEducationLabel}</strong>{about.education}</p>
                <p><strong>{labels.aboutExamsLabel}</strong>{about.exams}</p>
                <p><strong>{labels.aboutSpecialismsLabel}</strong>{about.specialisms}</p>
                <p><strong>{labels.aboutTranslationLabel}</strong>{about.translation}</p>
              </div>
              <a className="linkedin-link" href={global.linkedinUrl} target="_blank" rel="noreferrer">
                {labels.linkedinCta} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="section testimonials-section" id="utisci">
          <div className="shell">
            <div className="testimonials-heading">
              <p className="eyebrow">{content.testimonials.eyebrow}</p>
              <h2>{content.testimonials.headline}</h2>
              <p>{content.testimonials.intro}</p>
            </div>
            <div className="testimonials-layout">
              <div className="testimonial-list" aria-live="polite">
                {testimonials.length > 0 ? (
                  testimonials.map((testimonial) => (
                    <figure className="testimonial-card" key={testimonial.id}>
                      <blockquote>“{testimonial.quote}”</blockquote>
                      <figcaption>
                        <strong>{testimonial.name}</strong>
                        {testimonial.context && (
                          <span>{testimonial.context}</span>
                        )}
                      </figcaption>
                    </figure>
                  ))
                ) : (
                  <p className="testimonials-empty">
                    {content.testimonials.emptyMessage}
                  </p>
                )}
              </div>
              <TestimonialForm content={content.testimonials} />
            </div>
          </div>
        </section>

        <section className="section pricing-section" id="cenovnik">
          <div className="shell">
            <div className="section-heading pricing-heading">
              <p className="eyebrow">{home.pricingEyebrow}</p>
              <h2>{home.pricingHeadline}</h2>
              <p>{home.pricingIntro}</p>
            </div>
            <div className="price-grid">
              <article className="price-card featured-price">
                <p>{labels.pricingIndividualLabel}</p>
                <div className="price-pairs">
                  <div>
                    <span>{pricing.generalLessonLabel}</span>
                    <strong>{pricing.generalLessonPrice}</strong>
                  </div>
                  <div>
                    <span>{pricing.specializedLessonLabel}</span>
                    <strong>{pricing.specializedLessonPrice}</strong>
                  </div>
                </div>
                <ul>
                  <li>{pricing.duration}</li>
                  {pricing.lessonBenefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                <a href="#kontakt">{labels.pricingCta} <Arrow /></a>
              </article>
              <article className="price-card">
                <p>{labels.pricingPackageLabel}</p>
                <h3>{pricing.packageDiscount}</h3>
                <p>{pricing.packageDescription}</p>
              </article>
              <article className="price-card">
                <p>{labels.pricingGroupsLabel}</p>
                <h3>{pricing.groupDiscount}</h3>
                <p>{pricing.groupDescription}</p>
              </article>
              <article className="price-card featured-price">
                <p>{labels.pricingServicesLabel}</p>
                <div className="price-pairs service-summary-prices">
                  {translationService && (
                    <div>
                      <span>{translationService.title}</span>
                      <strong>{translationService.price}</strong>
                    </div>
                  )}
                  {proofreadingService && (
                    <div>
                      <span>{proofreadingService.title}</span>
                      <strong>{proofreadingService.price}</strong>
                    </div>
                  )}
                </div>
                <p>{pricing.languageServiceDescription}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section faq-section">
          <div className="shell faq-layout">
            <div>
              <p className="eyebrow">{home.faqEyebrow}</p>
              <h2>{home.faqHeadline}</h2>
            </div>
            <div className="faq-list">
              {content.faq.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <ContactSection content={content} />
      </main>
      <SiteFooter content={content} />
    </>
  );
}
