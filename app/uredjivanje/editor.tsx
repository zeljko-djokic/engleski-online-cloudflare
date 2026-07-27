"use client";

import { useState } from "react";
import type {
  Exam,
  FaqItem,
  LanguageService,
  Program,
  SiteContent,
} from "@/lib/content-model";

function Field({
  label,
  value,
  onChange,
  multiline = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  hint?: string;
}) {
  return (
    <label className="editor-field">
      <span>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function ListField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <div className="editor-list">
      <span>{label}</span>
      {value.map((item, index) => (
        <div key={index}>
          <textarea
            value={item}
            rows={2}
            onChange={(event) => {
              const next = [...value];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          <button type="button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>
            Ukloni
          </button>
        </div>
      ))}
      <button className="editor-add" type="button" onClick={() => onChange([...value, "Nova stavka"])}>
        + Dodaj stavku
      </button>
    </div>
  );
}

function EditorSection({
  title,
  description,
  children,
  open = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="editor-section" open={open}>
      <summary>
        <span>{title}</span>
        {description && <small>{description}</small>}
      </summary>
      <div className="editor-section-body">{children}</div>
    </details>
  );
}

export function Editor({
  initialContent,
  userEmail,
  signOutPath,
}: {
  initialContent: SiteContent;
  userEmail: string;
  signOutPath: string;
}) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  const markChanged = () => {
    setStatus("idle");
    setMessage("Imate nesačuvane izmene.");
  };

  const updateContent = (updater: (draft: SiteContent) => void) => {
    setContent((current) => {
      const next = structuredClone(current);
      updater(next);
      return next;
    });
    markChanged();
  };

  const save = async () => {
    setStatus("saving");
    setMessage("Čuvanje...");
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(content),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Čuvanje nije uspelo.");
      setContent(result.content);
      setStatus("saved");
      setMessage("Izmene su sačuvane i odmah objavljene.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Čuvanje nije uspelo.");
    }
  };

  const setProgram = (index: number, program: Program) =>
    updateContent((draft) => { draft.programs[index] = program; });
  const setExam = (index: number, exam: Exam) =>
    updateContent((draft) => { draft.exams[index] = exam; });
  const setService = (index: number, service: LanguageService) =>
    updateContent((draft) => { draft.services[index] = service; });
  const setFaq = (index: number, faq: FaqItem) =>
    updateContent((draft) => { draft.faq[index] = faq; });

  return (
    <main className="editor-shell">
      <header className="editor-header">
        <div>
          <p className="eyebrow">Engleski Online</p>
          <h1>Uređivanje sajta</h1>
          <p>Prijavljeni ste kao {userEmail}. Izmene postaju vidljive čim ih sačuvate.</p>
        </div>
        <div className="editor-header-actions">
          <a href="/" target="_blank" rel="noreferrer">Otvori sajt ↗</a>
          <a href={signOutPath}>Odjava</a>
        </div>
      </header>

      <nav className="editor-jump" aria-label="Prečice kroz urednik">
        <a href="#osnovno">Osnovno</a>
        <a href="#pocetna-urednik">Početna</a>
        <a href="#kursevi-urednik">Kursevi</a>
        <a href="#ispiti-urednik">Ispiti</a>
        <a href="#usluge-urednik">Usluge</a>
        <a href="#faq-urednik">FAQ</a>
      </nav>

      <div id="osnovno">
        <EditorSection title="Kontakt i Google kalendar" description="Mejl, telefon, društvene mreže i budući link za zakazivanje" open>
          <div className="editor-grid">
            <Field label="E-mail" value={content.global.email} onChange={(value) => updateContent((draft) => { draft.global.email = value; })} />
            <Field label="Telefon — prikaz" value={content.global.phoneDisplay} onChange={(value) => updateContent((draft) => { draft.global.phoneDisplay = value; })} />
            <Field label="Telefon — link" value={content.global.phoneLink} onChange={(value) => updateContent((draft) => { draft.global.phoneLink = value; })} hint="Bez razmaka, npr. +381631234567" />
            <Field label="WhatsApp link" value={content.global.whatsappUrl} onChange={(value) => updateContent((draft) => { draft.global.whatsappUrl = value; })} />
            <Field label="LinkedIn link" value={content.global.linkedinUrl} onChange={(value) => updateContent((draft) => { draft.global.linkedinUrl = value; })} />
            <Field label="Google Calendar link" value={content.global.calendarUrl} onChange={(value) => updateContent((draft) => { draft.global.calendarUrl = value; })} hint="Ostavite prazno dok link nije spreman." />
            <Field label="Tekst dugmeta kalendara" value={content.global.calendarLabel} onChange={(value) => updateContent((draft) => { draft.global.calendarLabel = value; })} />
            <Field label="Tekst rezervisanog mesta" value={content.contact.calendarPlaceholder} onChange={(value) => updateContent((draft) => { draft.contact.calendarPlaceholder = value; })} />
          </div>
        </EditorSection>
      </div>

      <div id="pocetna-urednik">
        <EditorSection title="Naslovna sekcija">
          <div className="editor-grid">
            <Field label="Nadnaslov" value={content.hero.eyebrow} onChange={(value) => updateContent((draft) => { draft.hero.eyebrow = value; })} />
            <Field label="Naslov — prvi red" value={content.hero.headlineLine1} onChange={(value) => updateContent((draft) => { draft.hero.headlineLine1 = value; })} />
            <Field label="Naslov — drugi red" value={content.hero.headlineLine2} onChange={(value) => updateContent((draft) => { draft.hero.headlineLine2 = value; })} />
            <Field label="Uvodni tekst" value={content.hero.lede} multiline onChange={(value) => updateContent((draft) => { draft.hero.lede = value; })} />
            <Field label="Glavno dugme" value={content.hero.primaryCta} onChange={(value) => updateContent((draft) => { draft.hero.primaryCta = value; })} />
            <Field label="Drugo dugme" value={content.hero.secondaryCta} onChange={(value) => updateContent((draft) => { draft.hero.secondaryCta = value; })} />
            <Field label="Stručna titula" value={content.hero.credential} onChange={(value) => updateContent((draft) => { draft.hero.credential = value; })} />
            <Field label="Iskustvo" value={content.hero.experience} onChange={(value) => updateContent((draft) => { draft.hero.experience = value; })} />
          </div>
        </EditorSection>

        <EditorSection title="Naslovi sekcija na početnoj">
          <div className="editor-grid">
            {([
              ["programsEyebrow", "Kursevi — nadnaslov"],
              ["programsHeadline", "Kursevi — naslov"],
              ["programsIntro", "Kursevi — uvod"],
              ["examsEyebrow", "Ispiti — nadnaslov"],
              ["examsHeadline", "Ispiti — naslov"],
              ["examsIntro", "Ispiti — uvod"],
              ["servicesEyebrow", "Usluge — nadnaslov"],
              ["servicesHeadline", "Usluge — naslov"],
              ["servicesIntro", "Usluge — uvod"],
              ["pricingEyebrow", "Cenovnik — nadnaslov"],
              ["pricingHeadline", "Cenovnik — naslov"],
              ["pricingIntro", "Cenovnik — uvod"],
              ["faqEyebrow", "FAQ — nadnaslov"],
              ["faqHeadline", "FAQ — naslov"],
            ] as const).map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={content.home[key]}
                multiline={key.toLowerCase().includes("intro")}
                onChange={(value) => updateContent((draft) => { draft.home[key] = value; })}
              />
            ))}
          </div>
        </EditorSection>

        <EditorSection title="Kako radimo">
          <div className="editor-grid">
            <Field label="Nadnaslov" value={content.home.processEyebrow} onChange={(value) => updateContent((draft) => { draft.home.processEyebrow = value; })} />
            <Field label="Naslov" value={content.home.processHeadline} onChange={(value) => updateContent((draft) => { draft.home.processHeadline = value; })} />
          </div>
          {content.home.process.map((step, index) => (
            <div className="editor-pair" key={index}>
              <Field label={`Korak ${index + 1} — naslov`} value={step.title} onChange={(value) => updateContent((draft) => { draft.home.process[index].title = value; })} />
              <Field label={`Korak ${index + 1} — opis`} value={step.text} multiline onChange={(value) => updateContent((draft) => { draft.home.process[index].text = value; })} />
            </div>
          ))}
        </EditorSection>

        <EditorSection title="O meni">
          <div className="editor-grid">
            <Field label="Nadnaslov" value={content.about.eyebrow} onChange={(value) => updateContent((draft) => { draft.about.eyebrow = value; })} />
            <Field label="Naslov" value={content.about.headline} onChange={(value) => updateContent((draft) => { draft.about.headline = value; })} />
            <Field label="Uvod" value={content.about.lede} multiline onChange={(value) => updateContent((draft) => { draft.about.lede = value; })} />
            <Field label="Biografija" value={content.about.body} multiline onChange={(value) => updateContent((draft) => { draft.about.body = value; })} />
            <Field label="Obrazovanje" value={content.about.education} multiline onChange={(value) => updateContent((draft) => { draft.about.education = value; })} />
            <Field label="Ispiti" value={content.about.exams} multiline onChange={(value) => updateContent((draft) => { draft.about.exams = value; })} />
            <Field label="Stručne oblasti" value={content.about.specialisms} multiline onChange={(value) => updateContent((draft) => { draft.about.specialisms = value; })} />
            <Field label="Prevođenje" value={content.about.translation} multiline onChange={(value) => updateContent((draft) => { draft.about.translation = value; })} />
          </div>
        </EditorSection>

        <EditorSection title="Cene i popusti">
          <div className="editor-grid">
            <Field label="Početna cena časa" value={content.pricing.lessonPrice} onChange={(value) => updateContent((draft) => { draft.pricing.lessonPrice = value; })} />
            <Field label="Trajanje časa" value={content.pricing.duration} onChange={(value) => updateContent((draft) => { draft.pricing.duration = value; })} />
            <Field label="Popust za paket" value={content.pricing.packageDiscount} onChange={(value) => updateContent((draft) => { draft.pricing.packageDiscount = value; })} />
            <Field label="Opis paketa" value={content.pricing.packageDescription} multiline onChange={(value) => updateContent((draft) => { draft.pricing.packageDescription = value; })} />
            <Field label="Popust za grupe" value={content.pricing.groupDiscount} onChange={(value) => updateContent((draft) => { draft.pricing.groupDiscount = value; })} />
            <Field label="Opis grupa" value={content.pricing.groupDescription} multiline onChange={(value) => updateContent((draft) => { draft.pricing.groupDescription = value; })} />
            <Field label="Početna cena usluga" value={content.pricing.languageServicePrice} onChange={(value) => updateContent((draft) => { draft.pricing.languageServicePrice = value; })} />
            <Field label="Opis obračuna usluga" value={content.pricing.languageServiceDescription} multiline onChange={(value) => updateContent((draft) => { draft.pricing.languageServiceDescription = value; })} />
          </div>
        </EditorSection>
      </div>

      <div id="kursevi-urednik">
        {content.programs.map((program, index) => (
          <EditorSection title={`Kurs: ${program.title}`} description="Kartica na početnoj i kompletna detaljna stranica" key={program.slug}>
            <div className="editor-grid">
              <Field label="Naziv" value={program.title} onChange={(value) => setProgram(index, { ...program, title: value })} />
              <Field label="Broj" value={program.number} onChange={(value) => setProgram(index, { ...program, number: value })} />
              <Field label="Kratak opis" value={program.summary} multiline onChange={(value) => setProgram(index, { ...program, summary: value })} />
              <Field label="Meta podatak" value={program.meta} onChange={(value) => setProgram(index, { ...program, meta: value })} />
              <Field label="Cena" value={program.price} onChange={(value) => setProgram(index, { ...program, price: value })} />
              <Field label="Nadnaslov detaljne stranice" value={program.eyebrow} onChange={(value) => setProgram(index, { ...program, eyebrow: value })} />
              <Field label="Glavni naslov" value={program.headline} multiline onChange={(value) => setProgram(index, { ...program, headline: value })} />
              <Field label="Uvod" value={program.intro} multiline onChange={(value) => setProgram(index, { ...program, intro: value })} />
            </div>
            <ListField label="Kome je namenjen" value={program.audience} onChange={(value) => setProgram(index, { ...program, audience: value })} />
            <ListField label="Ishodi" value={program.outcomes} onChange={(value) => setProgram(index, { ...program, outcomes: value })} />
            <ListField label="Format rada" value={program.format} onChange={(value) => setProgram(index, { ...program, format: value })} />
          </EditorSection>
        ))}
      </div>

      <div id="ispiti-urednik">
        {content.exams.map((exam, index) => (
          <EditorSection title={`Ispit: ${exam.title}`} description="Kartica i detaljna stranica pripreme" key={exam.slug}>
            <div className="editor-grid">
              <Field label="Oznaka" value={exam.label} onChange={(value) => setExam(index, { ...exam, label: value })} />
              <Field label="Naziv" value={exam.title} onChange={(value) => setExam(index, { ...exam, title: value })} />
              <Field label="Kratak opis" value={exam.summary} multiline onChange={(value) => setExam(index, { ...exam, summary: value })} />
              <Field label="Glavni naslov" value={exam.headline} multiline onChange={(value) => setExam(index, { ...exam, headline: value })} />
              <Field label="Uvod" value={exam.intro} multiline onChange={(value) => setExam(index, { ...exam, intro: value })} />
            </div>
            <ListField label="Oblasti rada" value={exam.focus} onChange={(value) => setExam(index, { ...exam, focus: value })} />
            <ListField label="Format pripreme" value={exam.format} onChange={(value) => setExam(index, { ...exam, format: value })} />
          </EditorSection>
        ))}
      </div>

      <div id="usluge-urednik">
        {content.services.map((service, index) => (
          <EditorSection title={`Usluga: ${service.title}`} description="Kartica i detaljna stranica usluge" key={service.slug}>
            <div className="editor-grid">
              <Field label="Naziv" value={service.title} onChange={(value) => setService(index, { ...service, title: value })} />
              <Field label="Broj" value={service.number} onChange={(value) => setService(index, { ...service, number: value })} />
              <Field label="Kratak opis" value={service.summary} multiline onChange={(value) => setService(index, { ...service, summary: value })} />
              <Field label="Cena" value={service.price} onChange={(value) => setService(index, { ...service, price: value })} />
              <Field label="Jedinica obračuna" value={service.unit} onChange={(value) => setService(index, { ...service, unit: value })} />
              <Field label="Glavni naslov" value={service.headline} multiline onChange={(value) => setService(index, { ...service, headline: value })} />
              <Field label="Uvod" value={service.intro} multiline onChange={(value) => setService(index, { ...service, intro: value })} />
            </div>
            <ListField label="Šta usluga obuhvata" value={service.includes} onChange={(value) => setService(index, { ...service, includes: value })} />
            <ListField label="Tok saradnje" value={service.process} onChange={(value) => setService(index, { ...service, process: value })} />
          </EditorSection>
        ))}
      </div>

      <div id="faq-urednik">
        <EditorSection title="Kontakt sekcija">
          <div className="editor-grid">
            <Field label="Nadnaslov" value={content.contact.eyebrow} onChange={(value) => updateContent((draft) => { draft.contact.eyebrow = value; })} />
            <Field label="Naslov" value={content.contact.headline} multiline onChange={(value) => updateContent((draft) => { draft.contact.headline = value; })} />
            <Field label="Uvod" value={content.contact.intro} multiline onChange={(value) => updateContent((draft) => { draft.contact.intro = value; })} />
            <Field label="Mejl — oznaka" value={content.contact.emailLabel} onChange={(value) => updateContent((draft) => { draft.contact.emailLabel = value; })} />
            <Field label="WhatsApp — oznaka" value={content.contact.whatsappLabel} onChange={(value) => updateContent((draft) => { draft.contact.whatsappLabel = value; })} />
            <Field label="Telefon — oznaka" value={content.contact.phoneLabel} onChange={(value) => updateContent((draft) => { draft.contact.phoneLabel = value; })} />
          </div>
        </EditorSection>
        <EditorSection title="Najčešća pitanja" description="Pitanja i odgovori na početnoj stranici">
          {content.faq.map((item, index) => (
            <div className="editor-faq" key={index}>
              <Field label={`Pitanje ${index + 1}`} value={item.question} onChange={(value) => setFaq(index, { ...item, question: value })} />
              <Field label="Odgovor" value={item.answer} multiline onChange={(value) => setFaq(index, { ...item, answer: value })} />
              <button type="button" onClick={() => updateContent((draft) => { draft.faq.splice(index, 1); })}>Ukloni pitanje</button>
            </div>
          ))}
          <button className="editor-add" type="button" onClick={() => updateContent((draft) => { draft.faq.push({ question: "Novo pitanje", answer: "Novi odgovor" }); })}>
            + Dodaj pitanje
          </button>
        </EditorSection>
      </div>

      <div className="editor-savebar">
        <p className={`editor-status ${status}`}>{message || "Izmene nisu napravljene."}</p>
        <button type="button" onClick={save} disabled={status === "saving"}>
          {status === "saving" ? "Čuvanje..." : "Sačuvaj i objavi"}
        </button>
      </div>
    </main>
  );
}
