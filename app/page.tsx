import Image from "next/image";
import Link from "next/link";
import { Arrow, ContactSection, SiteFooter, SiteHeader } from "@/components/site-frame";
import { getSiteContent } from "@/lib/site-content";

export default async function Home() {
  const content = await getSiteContent();
  const { global, hero, home, about, pricing } = content;

  return (
    <>
      <SiteHeader />
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
              <span>noun</span>
              <strong>language</strong>
              <em>/ˈlæŋɡwɪdʒ/</em>
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
            <span className="credential-mark" aria-hidden="true">ŽĐ</span>
            <p>
              <strong>Željko Đokić</strong>
              <span>{hero.credential}</span>
              <span>{hero.experience}</span>
            </p>
          </div>
          <div className="trust-items">
            <p><span>01</span> Individualni pristup</p>
            <p><span>02</span> Fleksibilni termini</p>
            <p><span>03</span> Materijali uključeni</p>
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
                    <span>od {program.price}</span>
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
                Pogledajte sve pripreme <Arrow />
              </Link>
            </div>
            <div className="exam-list">
              {content.exams.slice(0, 4).map((exam) => (
                <a href={`/ispiti/${exam.slug}`} key={exam.slug}>
                  <span>{exam.label}</span>
                  <h3>{exam.title}</h3>
                  <p>{exam.summary}</p>
                </a>
              ))}
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
            <p className="service-note">
              Konačna ponuda zavisi od obima, složenosti i roka. Dokumenti se
              pregledaju pre potvrde cene, a sadržaj se tretira poverljivo.
            </p>
          </div>
        </section>

        <section className="section about-section" id="o-meni">
          <div className="shell about-layout">
            <div className="about-mark" aria-hidden="true">
              <span>ŽĐ</span>
              <p>Jezik · preciznost · razumevanje</p>
            </div>
            <div className="about-copy">
              <p className="eyebrow">{about.eyebrow}</p>
              <h2>{about.headline}</h2>
              <p className="about-lede">{about.lede}</p>
              <p>{about.body}</p>
              <div className="about-facts">
                <p><strong>Obrazovanje</strong>{about.education}</p>
                <p><strong>Ispiti</strong>{about.exams}</p>
                <p><strong>Stručne oblasti</strong>{about.specialisms}</p>
                <p><strong>Prevođenje</strong>{about.translation}</p>
              </div>
              <a className="linkedin-link" href={global.linkedinUrl} target="_blank" rel="noreferrer">
                Pogledajte LinkedIn profil <span aria-hidden="true">↗</span>
              </a>
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
                <p>Individualna nastava</p>
                <h3><span>od</span> {pricing.lessonPrice}</h3>
                <ul>
                  <li>{pricing.duration}</li>
                  <li>Materijali uključeni</li>
                  <li>Procena nivoa i plan rada</li>
                  <li>Fiksni ili fleksibilni termini</li>
                </ul>
                <a href="#kontakt">Zakažite razgovor <Arrow /></a>
              </article>
              <article className="price-card">
                <p>Paket</p>
                <h3>{pricing.packageDiscount}</h3>
                <p>{pricing.packageDescription}</p>
              </article>
              <article className="price-card">
                <p>Male grupe</p>
                <h3>{pricing.groupDiscount}</h3>
                <p>{pricing.groupDescription}</p>
              </article>
              <article className="price-card">
                <p>Jezičke usluge</p>
                <h3>{pricing.languageServicePrice}</h3>
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
      <SiteFooter />
    </>
  );
}
