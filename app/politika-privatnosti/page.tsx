import type { Metadata } from "next";
import {
  ContactSection,
  SiteFooter,
  SiteHeader,
} from "@/components/site-frame";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Politika privatnosti | Engleski Online",
  description:
    "Informacije o obradi podataka poslatih putem obrasca za utiske na sajtu Engleski Online.",
  alternates: {
    canonical: "/politika-privatnosti",
  },
};

export default async function PrivacyPolicyPage() {
  const content = await getSiteContent();

  return (
    <>
      <SiteHeader content={content} />
      <main id="sadrzaj">
        <section className="catalog-hero shell privacy-hero">
          <p className="eyebrow">Privatnost i transparentnost</p>
          <h1>Politika privatnosti</h1>
          <p>
            Ova politika objašnjava kako se obrađuju podaci koje dobrovoljno
            pošaljete putem obrasca za utiske.
          </p>
        </section>
        <section className="privacy-section">
          <div className="shell privacy-content">
            <article>
              <h2>Koji podaci se prikupljaju</h2>
              <p>
                Obrazac čuva ime ili inicijale, opcionu oznaku kursa ili usluge
                i tekst utiska. Radi zaštite od zloupotrebe formira se i
                nečitljiv tehnički heš na osnovu podataka o vezi i pregledaču.
                Taj heš se ne objavljuje.
              </p>
            </article>
            <article>
              <h2>Svrha i objavljivanje</h2>
              <p>
                Podaci se koriste isključivo za pregled, administriranje i
                moguće objavljivanje utiska na ovom sajtu. Utisak se ne
                objavljuje automatski, već tek nakon provere i samo uz izričitu
                saglasnost poslatu putem obrasca.
              </p>
            </article>
            <article>
              <h2>Čuvanje i vaša prava</h2>
              <p>
                Podaci se ne prodaju niti koriste za oglašavanje. Možete
                zatražiti ispravku, povlačenje saglasnosti ili brisanje svog
                utiska slanjem poruke na{" "}
                <a href={`mailto:${content.global.email}`}>
                  {content.global.email}
                </a>
                .
              </p>
            </article>
          </div>
        </section>
        <ContactSection content={content} />
      </main>
      <SiteFooter content={content} />
    </>
  );
}
