"use client";

import { useMemo, useState } from "react";
import type { PortfolioEntry } from "@/lib/content-model";
import { filterPortfolioEntries } from "@/lib/portfolio-search";

type Language = "sr" | "en";

const categoryEnglish: Record<string, string> = {
  "Medicinska sredstva": "Medical devices",
  "Laboratorija": "Laboratory and diagnostics",
  "Medicina i istraživanje": "Medicine and research",
  "Farmacija": "Pharmaceutical content",
  "Obrazovanje": "Education",
  "Vazduhoplovstvo": "Aviation",
  "Poslovna dokumentacija": "Business documentation",
  "Lična dokumenta": "Personal documents",
  "Naučni tekstovi": "Scientific texts",
  "Marketing": "Marketing",
  "Drugo": "Other",
};

const copy = {
  sr: {
    kicker: "STRUČNO PREVOĐENJE · ENGLISH / SRPSKI",
    title: "Portfolio prevoda",
    lead: "Medicinska, farmaceutska, obrazovna, poslovna i druga stručna dokumentacija — pregled projekata i odabrani primeri prevoda.",
    intro: "Željko Đokić · master filolog engleskog jezika i književnosti",
    pdf: "Preuzmite portfolio na srpskom",
    otherPdf: "English PDF",
    samplesKicker: "IZDVOJENI RADOVI",
    samplesTitle: "Primeri prevoda",
    samplesIntro: "Odlomci su skraćeni i jezički prilagođeni za predstavljanje; lični podaci privatnih klijenata su izostavljeni.",
    catalogKicker: "PREGLED PROJEKATA",
    catalogTitle: "Dokumenti i oblasti",
    catalogIntro: "Pretražite radove evidentirane u prevodilačkoj arhivi, uključujući prevode, revizije i korekture.",
    search: "Pretraga", placeholder: "Naziv dokumenta, klijent ili oblast", category: "Oblast", all: "Sve oblasti",
    results: "Broj rezultata", show: "Prikaži još", noResults: "Nema rezultata za izabrane kriterijume.",
    sourceName: "Naziv dokumenta", privateClient: "Privatni klijent",
    status: { "Prevod u arhivi": "Prevod", "Korektura": "Korektura", "Revizija": "Revizija" } as Record<string, string>,
    samples: [
      { title: "Medicinsko sredstvo", meta: "Dentapharm · engleski → srpski", text: "Torakalni kateteri su sterilne PVC drenažne cevi sa atraumatskim vrhom i zatvorenim terminalnim konektorom radi lakšeg pozicioniranja." },
      { title: "Laboratorijsko uputstvo", meta: "BeoLab · engleski → srpski", text: "Kako uzeti uzorak iz daha za dvosatni ili trosatni test za detektovanje prekomernog razmnožavanja bakterija u tankom crevu." },
      { title: "Inkluzivno obrazovanje", meta: "Društvo defektologa · engleski → srpski", text: "Добро развијене вештине адаптивног понашања су неопходне за независно функционисање." },
    ],
  },
  en: {
    kicker: "SPECIALIST TRANSLATION · ENGLISH / SERBIAN",
    title: "Translation portfolio",
    lead: "Medical, pharmaceutical, educational, business and other specialist documents — selected translations and a detailed project catalogue.",
    intro: "Željko Đokić · MA in English Language and Literature",
    pdf: "Download the English portfolio",
    otherPdf: "PDF na srpskom",
    samplesKicker: "SELECTED WORK",
    samplesTitle: "Translation samples",
    samplesIntro: "Excerpts have been shortened and edited for presentation; private clients’ personal details have been omitted.",
    catalogKicker: "PROJECT CATALOGUE",
    catalogTitle: "Documents and fields",
    catalogIntro: "Search translation, revision and proofreading work recorded in the translation archive.",
    search: "Search", placeholder: "Document title, client or field", category: "Field", all: "All fields",
    results: "Results", show: "Show more", noResults: "No entries match the selected filters.",
    sourceName: "Document title", privateClient: "Private client",
    status: { "Prevod u arhivi": "Translation", "Korektura": "Proofreading", "Revizija": "Revision" } as Record<string, string>,
    samples: [
      { title: "Laboratory instructions", meta: "BeoLab · Serbian → English", text: "Close the test tube tightly and deliver it together with the rest of the urine in a bottle to the laboratory." },
      { title: "Medical conference presentation", meta: "Private client · Serbian → English", text: "The aim of our work was to determine the frequency of use of non-invasive ventilation and percutaneous gastrostomy and their impact on survival in patients with ALS." },
      { title: "Educational technology", meta: "OŠ Boško Buha · Serbian → English", text: "The use of interactive touch whiteboards would improve the quality of the teaching process for students at our school." },
    ],
  },
};

export function PortfolioBrowser({ entries }: { entries: PortfolioEntry[] }) {
  const [language, setLanguage] = useState<Language>("sr");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [visible, setVisible] = useState(12);
  const t = copy[language];

  const categories = useMemo(
    () => Array.from(new Set(entries.map((item) => item.category).filter(Boolean))).sort((a, b) => a.localeCompare(b, "sr")),
    [entries],
  );
  const filtered = useMemo(
    () => filterPortfolioEntries(entries, query, category, categoryEnglish),
    [entries, query, category],
  );

  return (
    <div lang={language === "sr" ? "sr-Latn" : "en"}>
      <section className="portfolio-hero shell">
        <div className="portfolio-hero-copy">
          <p className="eyebrow">{t.kicker}</p>
          <h1>{t.title}<span className="accent-dot">.</span></h1>
          <p className="portfolio-lede">{t.lead}</p>
          <p className="portfolio-author">{t.intro}</p>
          <div className="portfolio-actions">
            <a className="button button-primary" href={language === "sr" ? "/portfolio/portfolio-prevoda-sr.pdf" : "/portfolio/translation-portfolio-en.pdf"} download>
              {t.pdf} <span aria-hidden="true">↓</span>
            </a>
            <a className="portfolio-secondary" href={language === "sr" ? "/portfolio/translation-portfolio-en.pdf" : "/portfolio/portfolio-prevoda-sr.pdf"} download>{t.otherPdf} ↓</a>
          </div>
        </div>
        <aside className="portfolio-hero-aside" aria-label={t.catalogTitle}>
          <span>EN → SR</span><span>SR → EN</span>
          <strong>{entries.length}</strong>
          <p>{language === "sr" ? "zapisa o dokumentima i projektima" : "document and project entries"}</p>
        </aside>
        <div className="portfolio-language" aria-label={language === "sr" ? "Jezik portfolija" : "Portfolio language"}>
          <button type="button" aria-pressed={language === "sr"} onClick={() => setLanguage("sr")}>Srpski</button>
          <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>English</button>
        </div>
      </section>

      <section className="portfolio-samples">
        <div className="shell">
          <div className="portfolio-section-heading">
            <p className="eyebrow">{t.samplesKicker}</p><h2>{t.samplesTitle}</h2><p>{t.samplesIntro}</p>
          </div>
          <div className="portfolio-sample-grid">
            {t.samples.map((sample, index) => (
              <figure className="portfolio-sample" key={sample.title}>
                <span className="portfolio-sample-number">{String(index + 1).padStart(2, "0")}</span>
                <figcaption><strong>{sample.title}</strong><span>{sample.meta}</span></figcaption>
                <blockquote>{sample.text}</blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="portfolio-catalog shell" id="projekti">
        <div className="portfolio-section-heading">
          <p className="eyebrow">{t.catalogKicker}</p><h2>{t.catalogTitle}</h2><p>{t.catalogIntro}</p>
        </div>
        <div className="portfolio-filters">
          <label>{t.search}<input type="search" value={query} placeholder={t.placeholder} onChange={(event) => { setQuery(event.target.value); setVisible(12); }} /></label>
          <label>{t.category}<select value={category} onChange={(event) => { setCategory(event.target.value); setVisible(12); }}>
            <option value="">{t.all}</option>
            {categories.map((item) => <option key={item} value={item}>{language === "en" ? categoryEnglish[item] || item : item}</option>)}
          </select></label>
        </div>
        <p className="portfolio-results" aria-live="polite">{t.results}: <strong>{filtered.length}</strong></p>
        {filtered.length === 0 ? <p>{t.noResults}</p> : (
          <ul className="portfolio-records">
            {filtered.slice(0, visible).map((entry) => {
              const primary = language === "sr" ? entry.title || entry.name : entry.name || entry.title;
              const secondary = language === "sr" && entry.title && entry.name !== entry.title ? entry.name : "";
              const client = entry.client === "Privatni klijent" ? t.privateClient : entry.client;
              const field = language === "en" ? categoryEnglish[entry.category] || entry.category : entry.category;
              return (
                <li className="portfolio-record" key={entry.id}>
                  <div><p className="portfolio-record-category">{field}</p><h3>{primary}</h3>{secondary && <p className="portfolio-record-original"><span>{t.sourceName}:</span> {secondary}</p>}</div>
                  <p className="portfolio-record-meta"><span>{client}</span>{entry.year && <span>{entry.year}</span>}<span>{t.status[entry.status] || entry.status}</span></p>
                </li>
              );
            })}
          </ul>
        )}
        {visible < filtered.length && <button className="portfolio-more" type="button" onClick={() => setVisible((count) => count + 12)}>{t.show} <span aria-hidden="true">↓</span></button>}
      </section>
    </div>
  );
}
