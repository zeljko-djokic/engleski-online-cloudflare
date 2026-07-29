import type { Metadata } from "next";
import {
  Arrow,
  ContactSection,
  SiteFooter,
  SiteHeader,
} from "@/components/site-frame";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Cenovnik i način obračuna | Engleski Online",
  description:
    "Cene online nastave, pripreme za međunarodne ispite, prevođenja, lekture i usmenog prevođenja, uz jasan način obračuna.",
  alternates: {
    canonical: "/cenovnik",
  },
};

export default async function PricingPage() {
  const content = await getSiteContent();
  const { pricing, labels } = content;
  const translation = content.services.find(
    (service) => service.slug === "prevodjenje",
  );
  const proofreading = content.services.find(
    (service) => service.slug === "lektura-korektura-redaktura",
  );
  const interpreting = content.services.find(
    (service) => service.slug === "usmeno-prevodjenje",
  );

  return (
    <>
      <SiteHeader content={content} />
      <main id="sadrzaj">
        <section className="catalog-hero shell pricing-page-hero">
          <p className="eyebrow">Cenovnik</p>
          <h1>Cenovnik i način obračuna</h1>
          <p>
            Jasne početne cene i objašnjenje načina obračuna. Za dokumente i
            događaje konačnu ponudu dobijate nakon pregleda materijala i dogovora
            o roku i zahtevima.
          </p>
        </section>

        <section className="pricing-page-section">
          <div className="shell pricing-page-list">
            <article id="online-nastava">
              <div className="pricing-page-number">01</div>
              <div className="pricing-page-copy">
                <p className="eyebrow">Online nastava engleskog jezika</p>
                <h2>Individualni časovi i paketi</h2>
                <div className="pricing-page-values">
                  <p>
                    <span>{pricing.generalLessonLabel}</span>
                    <strong>{pricing.generalLessonPrice}</strong>
                  </p>
                  <p>
                    <span>{pricing.specializedLessonLabel}</span>
                    <strong>{pricing.specializedLessonPrice}</strong>
                  </p>
                </div>
                <p>
                  Cena je po individualnom času od {pricing.duration}.
                  Materijali, procena nivoa i plan rada uključeni su u cenu.
                </p>
                <ul>
                  <li>
                    Paket od 12 unapred uplaćenih časova:{" "}
                    {pricing.packageDiscount}
                  </li>
                  <li>
                    Male grupe od 2 do 6 polaznika: {pricing.groupDiscount} po
                    osobi
                  </li>
                </ul>
                <a className="pricing-contact-link" href="#kontakt">
                  {labels.pricingCta} <Arrow />
                </a>
              </div>
            </article>

            <article id="priprema-za-ispite">
              <div className="pricing-page-number">02</div>
              <div className="pricing-page-copy">
                <p className="eyebrow">Priprema za međunarodne ispite</p>
                <h2>Cambridge, IELTS, TOEFL i SAT</h2>
                <div className="pricing-page-values">
                  <p>
                    <span>Cena individualnog časa</span>
                    <strong>{pricing.specializedLessonPrice}</strong>
                  </p>
                  <p>
                    <span>Trajanje</span>
                    <strong>{pricing.duration}</strong>
                  </p>
                </div>
                <p>
                  Cena obuhvata dijagnostiku, individualni plan, materijale,
                  domaće zadatke, korekcije pisanja i rad na probnim zadacima.
                </p>
                <a className="pricing-contact-link" href="#kontakt">
                  {labels.pricingCta} <Arrow />
                </a>
              </div>
            </article>

            <article id="pisano-prevodjenje">
              <div className="pricing-page-number">03</div>
              <div className="pricing-page-copy">
                <p className="eyebrow">Pisano prevođenje</p>
                <h2>{translation?.title || "Prevođenje EN ↔ SR"}</h2>
                <div className="pricing-page-values">
                  <p>
                    <span>Cena</span>
                    <strong>
                      {translation?.price || "16 €"}{" "}
                      <small>{translation?.unit || "/ 250 reči"}</small>
                    </strong>
                  </p>
                </div>
                <p>{pricing.languageServiceDescription}</p>
                <p>
                  Konačna cena i rok potvrđuju se nakon pregleda dokumenta,
                  stručnosti sadržaja i traženog roka.
                </p>
                <a className="pricing-contact-link" href="#kontakt">
                  {labels.pricingCta} <Arrow />
                </a>
              </div>
            </article>

            <article id="lektura">
              <div className="pricing-page-number">04</div>
              <div className="pricing-page-copy">
                <p className="eyebrow">Lektura, korektura i redaktura</p>
                <h2>Jezička i stilska obrada teksta</h2>
                <div className="pricing-page-values">
                  <p>
                    <span>Početna cena</span>
                    <strong>
                      {proofreading?.price || "8 €"}{" "}
                      <small>{proofreading?.unit || "/ 250 reči"}</small>
                    </strong>
                  </p>
                </div>
                <p>
                  Obračun se vrši po 250 reči. Konačna ponuda zavisi od stanja
                  teksta i dogovorenog nivoa intervencije — od završne korekture
                  do detaljne stilske i strukturne redakture.
                </p>
                <a className="pricing-contact-link" href="#kontakt">
                  {labels.pricingCta} <Arrow />
                </a>
              </div>
            </article>

            <article id="usmeno-prevodjenje">
              <div className="pricing-page-number">05</div>
              <div className="pricing-page-copy">
                <p className="eyebrow">Usmeno prevođenje</p>
                <h2>Konsekutivno i simultano prevođenje</h2>
                <div className="pricing-page-values">
                  <p>
                    <span>Početna cena</span>
                    <strong>
                      {interpreting?.price || "60 €"}{" "}
                      <small>{interpreting?.unit || "/ sat"}</small>
                    </strong>
                  </p>
                </div>
                <ul>
                  <li>
                    Za simultano prevođenje duže od 60–90 minuta angažuje se tim
                    od dva prevodioca, sa smenama na 15–30 minuta.
                  </li>
                  <li>
                    Agendu, prezentacije, govore i glosare potrebno je dostaviti
                    3–5 dana unapred.
                  </li>
                  <li>
                    Jasan zvuk, profesionalna oprema i direktan pregled
                    govornika neophodni su za kvalitetan prevod; za onlajn
                    događaje potrebna je i stabilna veza.
                  </li>
                </ul>
                <p>
                  Konačna ponuda zavisi od trajanja, formata, teme, potrebnog
                  broja prevodilaca, opreme i mesta održavanja.
                </p>
                <a className="pricing-contact-link" href="#kontakt">
                  {labels.pricingCta} <Arrow />
                </a>
              </div>
            </article>
          </div>
        </section>

        <ContactSection content={content} />
      </main>
      <SiteFooter content={content} />
    </>
  );
}
