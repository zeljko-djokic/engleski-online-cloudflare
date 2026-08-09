"use client";

import { useState } from "react";
import type {
  Exam,
  FaqItem,
  LanguageService,
  Program,
  SiteContent,
} from "@/lib/content-model";
import type { TestimonialRecord } from "@/lib/testimonials";

function Field({
  label,
  value,
  onChange,
  multiline = false,
  hint,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  hint?: string;
  type?: "text" | "email" | "tel" | "url";
  placeholder?: string;
}) {
  return (
    <label className="editor-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
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

function EditorArea({
  id,
  title,
  description,
  previewHref,
  children,
}: {
  id: string;
  title: string;
  description: string;
  previewHref: string;
  children: React.ReactNode;
}) {
  return (
    <section className="editor-area" id={id}>
      <header className="editor-area-heading">
        <div>
          <p className="editor-area-kicker">Deo javnog sajta</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <a href={previewHref} target="_blank" rel="noreferrer">
          Pogledajte na sajtu <span aria-hidden="true">↗</span>
        </a>
      </header>
      {children}
    </section>
  );
}

export function Editor({
  initialContent,
  initialTestimonials,
  userEmail,
  signOutPath,
}: {
  initialContent: SiteContent;
  initialTestimonials: TestimonialRecord[];
  userEmail: string;
  signOutPath: string;
}) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [testimonials, setTestimonials] =
    useState<TestimonialRecord[]>(initialTestimonials);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [reviewMessage, setReviewMessage] = useState("");

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

  const moderateTestimonial = async (
    id: number,
    action: "approve" | "reject" | "delete",
  ) => {
    setReviewingId(id);
    setReviewMessage("Čuvanje odluke...");
    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const result = (await response.json()) as {
        testimonials?: TestimonialRecord[];
        error?: string;
      };
      if (!response.ok || !result.testimonials) {
        throw new Error(result.error ?? "Promena nije uspela.");
      }
      setTestimonials(result.testimonials);
      setReviewMessage(
        action === "approve"
          ? "Utisak je odobren i objavljen."
          : action === "reject"
            ? "Utisak je povučen sa sajta."
            : "Utisak je trajno obrisan.",
      );
    } catch (error) {
      setReviewMessage(
        error instanceof Error ? error.message : "Promena nije uspela.",
      );
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <main className="editor-shell">
      <header className="editor-header">
        <div>
          <p className="eyebrow">Engleski Online</p>
          <h1>Uređivanje sajta</h1>
          <p>
            Izaberite isti deo koji vidite u glavnom meniju sajta, unesite
            izmene i sačuvajte ih kada završite.
          </p>
          <small>Prijavljeni ste kao {userEmail}.</small>
        </div>
        <div className="editor-header-actions">
          <a href="/" target="_blank" rel="noreferrer">Otvori sajt ↗</a>
          <a href={signOutPath}>Odjava</a>
        </div>
      </header>

      <section className="editor-map" aria-labelledby="editor-map-title">
        <div className="editor-map-heading">
          <div>
            <p className="editor-area-kicker">Mapa sadržaja</p>
            <h2 id="editor-map-title">Delovi su poređani kao na javnom sajtu</h2>
          </div>
          <p>
            „Priprema za međunarodne ispite” nalazi se unutar Online nastave,
            baš kao i na sajtu.
          </p>
        </div>
        <nav className="editor-jump editor-jump-primary" aria-label="Delovi javnog sajta">
          <a href="#pocetna-urednik">{content.labels.navigationHome}</a>
          <a href="#online-nastava-urednik">{content.labels.navigationCourses}</a>
          <a href="#usluge-urednik">{content.labels.navigationServices}</a>
          <a href="#cenovnik-urednik">{content.labels.navigationPricing}</a>
          <a href="#o-meni-urednik">{content.labels.navigationAbout}</a>
          <a href="#utisci-urednik">{content.labels.navigationTestimonials}</a>
          <a href="#kontakt-urednik">{content.labels.navigationContact}</a>
        </nav>
        <nav className="editor-jump editor-jump-secondary" aria-label="Opšta podešavanja sajta">
          <span>Podešavanja:</span>
          <a href="#zaglavlje-podnozje">Zaglavlje i podnožje</a>
          <a href="#seo-urednik">Deljenje i SEO</a>
          <a href="#google-kalendar">Google kalendar</a>
        </nav>
      </section>

      <div className="editor-content">
        <EditorArea
          id="pocetna-urednik"
          title={content.labels.navigationHome}
          description="Glavni uvod, traka poverenja, način rada i najčešća pitanja."
          previewHref="/"
        >
          <EditorSection title="Glavna naslovna sekcija" description="Prvi sadržaj koji posetilac vidi" open>
            <div className="editor-grid">
              <Field label="Gornji opis" value={content.hero.eyebrow} onChange={(value) => updateContent((draft) => { draft.hero.eyebrow = value; })} />
              <Field label="Naslov — prvi red" value={content.hero.headlineLine1} onChange={(value) => updateContent((draft) => { draft.hero.headlineLine1 = value; })} />
              <Field label="Naslov — drugi red" value={content.hero.headlineLine2} onChange={(value) => updateContent((draft) => { draft.hero.headlineLine2 = value; })} />
              <Field label="Uvodni tekst" value={content.hero.lede} multiline onChange={(value) => updateContent((draft) => { draft.hero.lede = value; })} />
              <Field label="Stručna titula" value={content.hero.credential} onChange={(value) => updateContent((draft) => { draft.hero.credential = value; })} />
              <Field label="Iskustvo" value={content.hero.experience} onChange={(value) => updateContent((draft) => { draft.hero.experience = value; })} />
            </div>
          </EditorSection>

          <EditorSection title="Traka poverenja i ukrasni rečnik" description="Podaci neposredno ispod naslovne sekcije">
            <div className="editor-grid">
              <Field label="Ime u traci poverenja" value={content.labels.trustName} onChange={(value) => updateContent((draft) => { draft.labels.trustName = value; })} />
              <Field label="Rečnik — vrsta reči" value={content.labels.dictionaryPartOfSpeech} onChange={(value) => updateContent((draft) => { draft.labels.dictionaryPartOfSpeech = value; })} />
              <Field label="Rečnik — reč" value={content.labels.dictionaryWord} onChange={(value) => updateContent((draft) => { draft.labels.dictionaryWord = value; })} />
              <Field label="Rečnik — izgovor" value={content.labels.dictionaryPronunciation} onChange={(value) => updateContent((draft) => { draft.labels.dictionaryPronunciation = value; })} />
            </div>
            <ListField label="Stavke u traci poverenja" value={content.labels.trustItems} onChange={(value) => updateContent((draft) => { draft.labels.trustItems = value; })} />
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

          <EditorSection title="Najčešća pitanja" description="Naslov sekcije i sva pitanja sa početne strane">
            <div className="editor-grid">
              <Field label="Nadnaslov" value={content.home.faqEyebrow} onChange={(value) => updateContent((draft) => { draft.home.faqEyebrow = value; })} />
              <Field label="Naslov" value={content.home.faqHeadline} onChange={(value) => updateContent((draft) => { draft.home.faqHeadline = value; })} />
            </div>
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
        </EditorArea>

        <EditorArea
          id="online-nastava-urednik"
          title={content.labels.navigationCourses}
          description="Opšti, poslovni i stručni engleski, uz pripremu za međunarodne ispite kao četvrtu celinu."
          previewHref="/kursevi"
        >
          <EditorSection title="Naslov i uvod Online nastave" description="Prikazuju se i na početnoj i na stranici Online nastava" open>
            <div className="editor-grid">
              <Field label="Nadnaslov" value={content.home.programsEyebrow} onChange={(value) => updateContent((draft) => { draft.home.programsEyebrow = value; })} />
              <Field label="Naslov" value={content.home.programsHeadline} multiline onChange={(value) => updateContent((draft) => { draft.home.programsHeadline = value; })} />
              <Field label="Uvod" value={content.home.programsIntro} multiline onChange={(value) => updateContent((draft) => { draft.home.programsIntro = value; })} />
            </div>
          </EditorSection>

          <EditorSection title="Oznake na stranicama kurseva" description="Naslovi lista i dugmadi koji se ponavljaju na svim kursevima">
            <div className="editor-grid">
              <Field label="Povratak na sve kurseve" value={content.labels.courseBackLabel} onChange={(value) => updateContent((draft) => { draft.labels.courseBackLabel = value; })} />
              <Field label="Oznaka cene" value={content.labels.coursePriceLabel} onChange={(value) => updateContent((draft) => { draft.labels.coursePriceLabel = value; })} />
              <Field label="Kome je namenjen" value={content.labels.courseAudienceTitle} onChange={(value) => updateContent((draft) => { draft.labels.courseAudienceTitle = value; })} />
              <Field label="Ishodi" value={content.labels.courseOutcomesTitle} onChange={(value) => updateContent((draft) => { draft.labels.courseOutcomesTitle = value; })} />
              <Field label="Format rada" value={content.labels.courseFormatTitle} onChange={(value) => updateContent((draft) => { draft.labels.courseFormatTitle = value; })} />
            </div>
          </EditorSection>

          <div className="editor-subarea-heading">
            <span>01–03</span>
            <div>
              <h3>Programi online nastave</h3>
              <p>Kartice i detaljni opisi opšteg, poslovnog i stručnog engleskog.</p>
            </div>
          </div>
          {content.programs.map((program, index) => (
            <EditorSection title={`${program.number} — ${program.title}`} description="Kartica i kompletna detaljna stranica" key={program.slug}>
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

          <div className="editor-subarea-heading" id="ispiti-urednik">
            <span>04</span>
            <div>
              <h3>Priprema za međunarodne ispite</h3>
              <p>Četvrta celina Online nastave: Cambridge C1/C2, IELTS, TOEFL i SAT.</p>
            </div>
            <a href="/ispiti" target="_blank" rel="noreferrer">Pogledajte stranicu ↗</a>
          </div>
          <EditorSection title="Naslov i uvod pripreme" description="Prikazuju se na početnoj, kartici 04 i stranici pripreme">
            <div className="editor-grid">
              <Field label="Nadnaslov" value={content.home.examsEyebrow} onChange={(value) => updateContent((draft) => { draft.home.examsEyebrow = value; })} />
              <Field label="Naslov" value={content.home.examsHeadline} multiline onChange={(value) => updateContent((draft) => { draft.home.examsHeadline = value; })} />
              <Field label="Uvod" value={content.home.examsIntro} multiline onChange={(value) => updateContent((draft) => { draft.home.examsIntro = value; })} />
              <Field label="Link ka svim pripremama" value={content.labels.examsAllCta} onChange={(value) => updateContent((draft) => { draft.labels.examsAllCta = value; })} />
            </div>
          </EditorSection>
          <EditorSection title="Oznake na stranicama pripreme">
            <div className="editor-grid">
              <Field label="Povratak na sve pripreme" value={content.labels.examBackLabel} onChange={(value) => updateContent((draft) => { draft.labels.examBackLabel = value; })} />
              <Field label="Oznaka cene" value={content.labels.examPriceLabel} onChange={(value) => updateContent((draft) => { draft.labels.examPriceLabel = value; })} />
              <Field label="Oblasti rada" value={content.labels.examFocusTitle} onChange={(value) => updateContent((draft) => { draft.labels.examFocusTitle = value; })} />
              <Field label="Format pripreme" value={content.labels.examFormatTitle} onChange={(value) => updateContent((draft) => { draft.labels.examFormatTitle = value; })} />
            </div>
          </EditorSection>
          {content.exams.map((exam, index) => (
            <EditorSection title={`Priprema: ${exam.title}`} description="Kartica i detaljna stranica pripreme" key={exam.slug}>
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
        </EditorArea>

        <EditorArea
          id="usluge-urednik"
          title={content.labels.navigationServices}
          description="Pisano prevođenje, lektura i korektura, kao i usmeno prevođenje."
          previewHref="/usluge"
        >
          <EditorSection title="Naslov i uvod Jezičkih usluga" description="Prikazuju se i na početnoj i na stranici usluga" open>
            <div className="editor-grid">
              <Field label="Nadnaslov" value={content.home.servicesEyebrow} onChange={(value) => updateContent((draft) => { draft.home.servicesEyebrow = value; })} />
              <Field label="Naslov" value={content.home.servicesHeadline} multiline onChange={(value) => updateContent((draft) => { draft.home.servicesHeadline = value; })} />
              <Field label="Uvod" value={content.home.servicesIntro} multiline onChange={(value) => updateContent((draft) => { draft.home.servicesIntro = value; })} />
              <Field label="Napomena ispod usluga" value={content.labels.serviceNote} multiline onChange={(value) => updateContent((draft) => { draft.labels.serviceNote = value; })} />
            </div>
          </EditorSection>
          <EditorSection title="Oznake na stranicama usluga">
            <div className="editor-grid">
              <Field label="Nadnaslov" value={content.labels.serviceEyebrow} onChange={(value) => updateContent((draft) => { draft.labels.serviceEyebrow = value; })} />
              <Field label="Povratak na sve usluge" value={content.labels.serviceBackLabel} onChange={(value) => updateContent((draft) => { draft.labels.serviceBackLabel = value; })} />
              <Field label="Oznaka cene" value={content.labels.servicePriceLabel} onChange={(value) => updateContent((draft) => { draft.labels.servicePriceLabel = value; })} />
              <Field label="Usluga obuhvata" value={content.labels.serviceIncludesTitle} onChange={(value) => updateContent((draft) => { draft.labels.serviceIncludesTitle = value; })} />
              <Field label="Tok saradnje" value={content.labels.serviceProcessTitle} onChange={(value) => updateContent((draft) => { draft.labels.serviceProcessTitle = value; })} />
            </div>
          </EditorSection>
          {content.services.map((service, index) => (
            <EditorSection title={`${service.number} — ${service.title}`} description="Kartica i detaljna stranica usluge" key={service.slug}>
              <div className="editor-grid">
                <Field label="Naziv" value={service.title} onChange={(value) => setService(index, { ...service, title: value })} />
                <Field label="Broj" value={service.number} onChange={(value) => setService(index, { ...service, number: value })} />
                <Field label="Kratak opis" value={service.summary} multiline onChange={(value) => setService(index, { ...service, summary: value })} />
                <Field label="Cena" value={service.price} onChange={(value) => setService(index, { ...service, price: value })} />
                <Field label="Jedinica obračuna" value={service.unit} onChange={(value) => setService(index, { ...service, unit: value })} />
                <Field label="Glavni naslov" value={service.headline} multiline onChange={(value) => setService(index, { ...service, headline: value })} />
                <Field label="Uvod" value={service.intro} multiline onChange={(value) => setService(index, { ...service, intro: value })} />
                <Field label="Tekst u plavom polju" value={service.asideText} multiline onChange={(value) => setService(index, { ...service, asideText: value })} />
              </div>
              <ListField label="Šta usluga obuhvata" value={service.includes} onChange={(value) => setService(index, { ...service, includes: value })} />
              <ListField label="Tok saradnje" value={service.process} onChange={(value) => setService(index, { ...service, process: value })} />
            </EditorSection>
          ))}
        </EditorArea>

        <EditorArea
          id="cenovnik-urednik"
          title={content.labels.navigationPricing}
          description="Cene časova, popusti, paketi i način obračuna jezičkih usluga."
          previewHref="/cenovnik"
        >
          <EditorSection title="Naslov i uvod Cenovnika" open>
            <div className="editor-grid">
              <Field label="Nadnaslov" value={content.home.pricingEyebrow} onChange={(value) => updateContent((draft) => { draft.home.pricingEyebrow = value; })} />
              <Field label="Naslov" value={content.home.pricingHeadline} multiline onChange={(value) => updateContent((draft) => { draft.home.pricingHeadline = value; })} />
              <Field label="Uvod" value={content.home.pricingIntro} multiline onChange={(value) => updateContent((draft) => { draft.home.pricingIntro = value; })} />
            </div>
          </EditorSection>
          <EditorSection title="Cene i popusti" description="Glavne vrednosti koje se prikazuju na početnoj i u Cenovniku" open>
            <div className="editor-grid">
              <Field label="Naziv opšteg kursa" value={content.pricing.generalLessonLabel} onChange={(value) => updateContent((draft) => { draft.pricing.generalLessonLabel = value; })} />
              <Field label="Cena opšteg kursa" value={content.pricing.generalLessonPrice} onChange={(value) => updateContent((draft) => { draft.pricing.generalLessonPrice = value; })} />
              <Field label="Naziv specijalizovanog kursa" value={content.pricing.specializedLessonLabel} onChange={(value) => updateContent((draft) => { draft.pricing.specializedLessonLabel = value; })} />
              <Field label="Cena specijalizovanog kursa" value={content.pricing.specializedLessonPrice} onChange={(value) => updateContent((draft) => { draft.pricing.specializedLessonPrice = value; })} />
              <Field label="Trajanje časa" value={content.pricing.duration} onChange={(value) => updateContent((draft) => { draft.pricing.duration = value; })} />
              <Field label="Popust za paket" value={content.pricing.packageDiscount} onChange={(value) => updateContent((draft) => { draft.pricing.packageDiscount = value; })} />
              <Field label="Opis paketa" value={content.pricing.packageDescription} multiline onChange={(value) => updateContent((draft) => { draft.pricing.packageDescription = value; })} />
              <Field label="Popust za grupe" value={content.pricing.groupDiscount} onChange={(value) => updateContent((draft) => { draft.pricing.groupDiscount = value; })} />
              <Field label="Opis grupa" value={content.pricing.groupDescription} multiline onChange={(value) => updateContent((draft) => { draft.pricing.groupDescription = value; })} />
              <Field label="Opis obračuna usluga" value={content.pricing.languageServiceDescription} multiline onChange={(value) => updateContent((draft) => { draft.pricing.languageServiceDescription = value; })} />
            </div>
            <ListField label="Šta je uključeno u nastavu" value={content.pricing.lessonBenefits} onChange={(value) => updateContent((draft) => { draft.pricing.lessonBenefits = value; })} />
          </EditorSection>
          <EditorSection title="Naslovi kartica i dugmeta">
            <div className="editor-grid">
              <Field label="Individualna nastava" value={content.labels.pricingIndividualLabel} onChange={(value) => updateContent((draft) => { draft.labels.pricingIndividualLabel = value; })} />
              <Field label="Paket" value={content.labels.pricingPackageLabel} onChange={(value) => updateContent((draft) => { draft.labels.pricingPackageLabel = value; })} />
              <Field label="Male grupe" value={content.labels.pricingGroupsLabel} onChange={(value) => updateContent((draft) => { draft.labels.pricingGroupsLabel = value; })} />
              <Field label="Jezičke usluge" value={content.labels.pricingServicesLabel} onChange={(value) => updateContent((draft) => { draft.labels.pricingServicesLabel = value; })} />
              <Field label="Dugme ka Kontaktu" value={content.labels.pricingCta} onChange={(value) => updateContent((draft) => { draft.labels.pricingCta = value; })} />
            </div>
          </EditorSection>
        </EditorArea>

        <EditorArea
          id="o-meni-urednik"
          title={content.labels.navigationAbout}
          description="Biografija, obrazovanje, stručne oblasti i LinkedIn profil."
          previewHref="/#o-meni"
        >
          <EditorSection title="Sadržaj sekcije O meni" open>
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
          <EditorSection title="Oznake i LinkedIn">
            <div className="editor-grid">
              <Field label="Inicijali" value={content.labels.aboutMark} onChange={(value) => updateContent((draft) => { draft.labels.aboutMark = value; })} />
              <Field label="Moto" value={content.labels.aboutMotto} onChange={(value) => updateContent((draft) => { draft.labels.aboutMotto = value; })} />
              <Field label="Oznaka — obrazovanje" value={content.labels.aboutEducationLabel} onChange={(value) => updateContent((draft) => { draft.labels.aboutEducationLabel = value; })} />
              <Field label="Oznaka — ispiti" value={content.labels.aboutExamsLabel} onChange={(value) => updateContent((draft) => { draft.labels.aboutExamsLabel = value; })} />
              <Field label="Oznaka — stručne oblasti" value={content.labels.aboutSpecialismsLabel} onChange={(value) => updateContent((draft) => { draft.labels.aboutSpecialismsLabel = value; })} />
              <Field label="Oznaka — prevođenje" value={content.labels.aboutTranslationLabel} onChange={(value) => updateContent((draft) => { draft.labels.aboutTranslationLabel = value; })} />
              <Field label="Tekst LinkedIn dugmeta" value={content.labels.linkedinCta} onChange={(value) => updateContent((draft) => { draft.labels.linkedinCta = value; })} />
              <Field label="LinkedIn link" value={content.global.linkedinUrl} type="url" onChange={(value) => updateContent((draft) => { draft.global.linkedinUrl = value; })} />
            </div>
          </EditorSection>
        </EditorArea>

        <EditorArea
          id="utisci-urednik"
          title={content.labels.navigationTestimonials}
          description="Tekst formulara i odobravanje utisaka polaznika i klijenata."
          previewHref="/#utisci"
        >
          <EditorSection title="Tekst sekcije i formulara" open>
            <div className="editor-grid">
              <Field label="Nadnaslov" value={content.testimonials.eyebrow} onChange={(value) => updateContent((draft) => { draft.testimonials.eyebrow = value; })} />
              <Field label="Naslov" value={content.testimonials.headline} multiline onChange={(value) => updateContent((draft) => { draft.testimonials.headline = value; })} />
              <Field label="Uvod" value={content.testimonials.intro} multiline onChange={(value) => updateContent((draft) => { draft.testimonials.intro = value; })} />
              <Field label="Poruka kada još nema utisaka" value={content.testimonials.emptyMessage} multiline onChange={(value) => updateContent((draft) => { draft.testimonials.emptyMessage = value; })} />
              <Field label="Naslov formulara" value={content.testimonials.formTitle} onChange={(value) => updateContent((draft) => { draft.testimonials.formTitle = value; })} />
              <Field label="Uvod formulara" value={content.testimonials.formIntro} multiline onChange={(value) => updateContent((draft) => { draft.testimonials.formIntro = value; })} />
              <Field label="Polje za ime" value={content.testimonials.nameLabel} onChange={(value) => updateContent((draft) => { draft.testimonials.nameLabel = value; })} />
              <Field label="Polje za kurs ili uslugu" value={content.testimonials.contextLabel} onChange={(value) => updateContent((draft) => { draft.testimonials.contextLabel = value; })} />
              <Field label="Polje za utisak" value={content.testimonials.quoteLabel} onChange={(value) => updateContent((draft) => { draft.testimonials.quoteLabel = value; })} />
              <Field label="Tekst saglasnosti" value={content.testimonials.consentLabel} multiline onChange={(value) => updateContent((draft) => { draft.testimonials.consentLabel = value; })} />
              <Field label="Tekst dugmeta" value={content.testimonials.submitLabel} onChange={(value) => updateContent((draft) => { draft.testimonials.submitLabel = value; })} />
              <Field label="Poruka nakon slanja" value={content.testimonials.successMessage} multiline onChange={(value) => updateContent((draft) => { draft.testimonials.successMessage = value; })} />
            </div>
          </EditorSection>

          <div className="editor-testimonial-review">
            <div className="editor-review-heading">
              <div>
                <p className="editor-area-kicker">Moderacija</p>
                <h3>Pristigli utisci</h3>
              </div>
              <p>Na sajtu se prikazuju samo odobreni utisci.</p>
            </div>
            {reviewMessage && <p className="editor-review-message" role="status">{reviewMessage}</p>}
            {testimonials.length > 0 ? testimonials.map((testimonial) => (
              <article className="editor-testimonial-card" key={testimonial.id}>
                <div>
                  <p className={`editor-testimonial-status ${testimonial.status}`}>
                    {testimonial.status === "pending" ? "Čeka odobrenje" : testimonial.status === "approved" ? "Objavljen" : "Odbijen"}
                  </p>
                  <blockquote>“{testimonial.quote}”</blockquote>
                  <p><strong>{testimonial.name}</strong>{testimonial.context && ` · ${testimonial.context}`}</p>
                  <small>Poslato: {testimonial.createdAt.slice(0, 10)}</small>
                </div>
                <div className="editor-testimonial-actions">
                  {testimonial.status !== "approved" && (
                    <button type="button" onClick={() => moderateTestimonial(testimonial.id, "approve")} disabled={reviewingId === testimonial.id}>Odobri i objavi</button>
                  )}
                  {testimonial.status !== "rejected" && (
                    <button type="button" onClick={() => moderateTestimonial(testimonial.id, "reject")} disabled={reviewingId === testimonial.id}>
                      {testimonial.status === "approved" ? "Povuci sa sajta" : "Odbij"}
                    </button>
                  )}
                  <button className="danger" type="button" onClick={() => moderateTestimonial(testimonial.id, "delete")} disabled={reviewingId === testimonial.id}>Obriši</button>
                </div>
              </article>
            )) : <p className="editor-review-empty">Još nema utisaka poslatih preko sajta.</p>}
          </div>
        </EditorArea>

        <EditorArea
          id="kontakt-urednik"
          title={content.labels.navigationContact}
          description="Zakazivanje, Google kalendar i svi kontakt kanali u dnu svake stranice."
          previewHref="/#kontakt"
        >
          <EditorSection title="Google kalendar za zakazivanje" description="Ovde se ubacuje link koji otvara izbor termina" open>
            <div className={`editor-calendar-status ${content.global.calendarUrl ? "is-ready" : "is-empty"}`} id="google-kalendar">
              <div>
                <strong>{content.global.calendarUrl ? "Google kalendar je povezan" : "Google kalendar još nije povezan"}</strong>
                <span>{content.global.calendarUrl ? "Posetioci vide dugme za izbor termina." : "Dok je polje prazno, na sajtu se prikazuje rezervisano mesto."}</span>
              </div>
              {content.global.calendarUrl && <a href={content.global.calendarUrl} target="_blank" rel="noreferrer">Proverite link ↗</a>}
            </div>
            <div className="editor-grid">
              <Field
                label="Link za Google Calendar zakazivanje"
                value={content.global.calendarUrl}
                type="url"
                placeholder="https://calendar.app.google/..."
                onChange={(value) => updateContent((draft) => { draft.global.calendarUrl = value; })}
                hint="Nalepite javni link za stranicu za zakazivanje. Kada ga sačuvate, placeholder se automatski zamenjuje dugmetom."
              />
              <Field label="Tekst dugmeta" value={content.global.calendarLabel} onChange={(value) => updateContent((draft) => { draft.global.calendarLabel = value; })} />
              <Field label="Naziv servisa" value={content.labels.calendarProviderLabel} onChange={(value) => updateContent((draft) => { draft.labels.calendarProviderLabel = value; })} />
              <Field label="Tekst dok link nije dodat" value={content.contact.calendarPlaceholder} onChange={(value) => updateContent((draft) => { draft.contact.calendarPlaceholder = value; })} />
              <Field label="Nadnaslov zakazivanja" value={content.contact.eyebrow} onChange={(value) => updateContent((draft) => { draft.contact.eyebrow = value; })} />
              <Field label="Naslov zakazivanja" value={content.contact.headline} multiline onChange={(value) => updateContent((draft) => { draft.contact.headline = value; })} />
              <Field label="Uvod zakazivanja" value={content.contact.intro} multiline onChange={(value) => updateContent((draft) => { draft.contact.intro = value; })} />
            </div>
          </EditorSection>

          <EditorSection title="Kontakt podaci" description="Desna kolona Kontakt i linkovi na svim stranicama" open>
            <div className="editor-grid">
              <Field label="Naslov iznad kontakata" value={content.contact.contactsTitle} onChange={(value) => updateContent((draft) => { draft.contact.contactsTitle = value; })} />
              <Field label="E-mail" value={content.global.email} type="email" onChange={(value) => updateContent((draft) => { draft.global.email = value; })} />
              <Field label="Naslov mejla sa sajta" value={content.labels.contactMailSubject} onChange={(value) => updateContent((draft) => { draft.labels.contactMailSubject = value; })} />
              <Field label="Mejl — oznaka" value={content.contact.emailLabel} onChange={(value) => updateContent((draft) => { draft.contact.emailLabel = value; })} />
              <Field label="Telefon — prikaz" value={content.global.phoneDisplay} type="tel" onChange={(value) => updateContent((draft) => { draft.global.phoneDisplay = value; })} />
              <Field label="Telefon — link" value={content.global.phoneLink} type="tel" onChange={(value) => updateContent((draft) => { draft.global.phoneLink = value; })} hint="Bez razmaka, npr. +381631234567" />
              <Field label="Telefon — oznaka" value={content.contact.phoneLabel} onChange={(value) => updateContent((draft) => { draft.contact.phoneLabel = value; })} />
              <Field label="WhatsApp link" value={content.global.whatsappUrl} type="url" onChange={(value) => updateContent((draft) => { draft.global.whatsappUrl = value; })} />
              <Field label="WhatsApp — oznaka" value={content.contact.whatsappLabel} onChange={(value) => updateContent((draft) => { draft.contact.whatsappLabel = value; })} />
              <Field label="Viber Business link" value={content.global.viberUrl} type="url" onChange={(value) => updateContent((draft) => { draft.global.viberUrl = value; })} hint="Zvanični format: https://viber.me/broj?draft=Vaša%20poruka" />
              <Field label="Viber — oznaka" value={content.contact.viberLabel} onChange={(value) => updateContent((draft) => { draft.contact.viberLabel = value; })} />
            </div>
          </EditorSection>
        </EditorArea>

        <section className="editor-area editor-settings-area" id="zaglavlje-podnozje">
          <header className="editor-area-heading">
            <div>
              <p className="editor-area-kicker">Opšta podešavanja</p>
              <h2>Zaglavlje, ribbon i podnožje</h2>
              <p>Tekstovi koji se pojavljuju na svim stranicama sajta.</p>
            </div>
          </header>
          <EditorSection title="Glavni ribbon" description="Isti redosled kao u javnom meniju" open>
            <div className="editor-grid">
              <Field label="Naziv sajta" value={content.labels.brandName} onChange={(value) => updateContent((draft) => { draft.labels.brandName = value; })} />
              <Field label="Početna" value={content.labels.navigationHome} onChange={(value) => updateContent((draft) => { draft.labels.navigationHome = value; })} />
              <Field label="Online nastava" value={content.labels.navigationCourses} onChange={(value) => updateContent((draft) => { draft.labels.navigationCourses = value; })} />
              <Field label="Jezičke usluge" value={content.labels.navigationServices} onChange={(value) => updateContent((draft) => { draft.labels.navigationServices = value; })} />
              <Field label="Cenovnik" value={content.labels.navigationPricing} onChange={(value) => updateContent((draft) => { draft.labels.navigationPricing = value; })} />
              <Field label="O meni" value={content.labels.navigationAbout} onChange={(value) => updateContent((draft) => { draft.labels.navigationAbout = value; })} />
              <Field label="Utisci" value={content.labels.navigationTestimonials} onChange={(value) => updateContent((draft) => { draft.labels.navigationTestimonials = value; })} />
              <Field label="Kontakt" value={content.labels.navigationContact} onChange={(value) => updateContent((draft) => { draft.labels.navigationContact = value; })} />
              <Field label="Glavno dugme" value={content.labels.headerCta} onChange={(value) => updateContent((draft) => { draft.labels.headerCta = value; })} />
              <Field label="Naziv mobilnog menija" value={content.labels.mobileMenu} onChange={(value) => updateContent((draft) => { draft.labels.mobileMenu = value; })} />
            </div>
          </EditorSection>
          <EditorSection title="Podnožje i mobilna kontakt traka">
            <div className="editor-grid">
              <Field label="Podnožje — opis" value={content.labels.footerTagline} multiline onChange={(value) => updateContent((draft) => { draft.labels.footerTagline = value; })} />
              <Field label="Podnožje — politika privatnosti" value={content.labels.privacyPolicyLabel} onChange={(value) => updateContent((draft) => { draft.labels.privacyPolicyLabel = value; })} />
              <Field label="Podnožje — autorski tekst" value={content.labels.footerCopyright} onChange={(value) => updateContent((draft) => { draft.labels.footerCopyright = value; })} />
              <Field label="Mobilna traka — WhatsApp" value={content.labels.mobileCtaWhatsApp} onChange={(value) => updateContent((draft) => { draft.labels.mobileCtaWhatsApp = value; })} />
              <Field label="Mobilna traka — Viber" value={content.labels.mobileCtaViber} onChange={(value) => updateContent((draft) => { draft.labels.mobileCtaViber = value; })} />
              <Field label="Mobilna traka — upit" value={content.labels.mobileCtaBooking} onChange={(value) => updateContent((draft) => { draft.labels.mobileCtaBooking = value; })} />
            </div>
          </EditorSection>
          <EditorSection title="Zajedničke oznake kartica i detaljnih strana" description="Tekstovi koji važe za kurseve, pripreme i usluge">
            <div className="editor-grid">
              <Field label="Kartica — detaljan opis" value={content.labels.catalogDetailCta} onChange={(value) => updateContent((draft) => { draft.labels.catalogDetailCta = value; })} />
              <Field label="Detaljna strana — glavno dugme" value={content.labels.detailPrimaryCta} onChange={(value) => updateContent((draft) => { draft.labels.detailPrimaryCta = value; })} />
              <Field label="Detaljna strana — bočna napomena" value={content.labels.detailAsideText} multiline onChange={(value) => updateContent((draft) => { draft.labels.detailAsideText = value; })} />
              <Field label="Detaljna strana — dugme za upit" value={content.labels.detailInquiryCta} onChange={(value) => updateContent((draft) => { draft.labels.detailInquiryCta = value; })} />
              <Field label="Link za preskakanje navigacije" value={content.labels.skipLink} onChange={(value) => updateContent((draft) => { draft.labels.skipLink = value; })} />
            </div>
          </EditorSection>
        </section>

        <section className="editor-area editor-settings-area" id="seo-urednik">
          <header className="editor-area-heading">
            <div>
              <p className="editor-area-kicker">Opšta podešavanja</p>
              <h2>Deljenje linka i SEO</h2>
              <p>Naslov i opis za Google, Viber, WhatsApp i društvene mreže.</p>
            </div>
          </header>
          <EditorSection title="Naslovi i opisi za pretragu i deljenje" open>
            <div className="editor-grid">
              <Field label="Naslov stranice" value={content.seo.pageTitle} onChange={(value) => updateContent((draft) => { draft.seo.pageTitle = value; })} />
              <Field label="Opis za pretraživače" value={content.seo.metaDescription} multiline onChange={(value) => updateContent((draft) => { draft.seo.metaDescription = value; })} />
              <Field label="Naslov deljenog linka" value={content.seo.shareTitle} onChange={(value) => updateContent((draft) => { draft.seo.shareTitle = value; })} />
              <Field label="Opis deljenog linka" value={content.seo.shareDescription} multiline onChange={(value) => updateContent((draft) => { draft.seo.shareDescription = value; })} />
              <Field label="Opis slike za deljenje" value={content.seo.shareImageAlt} multiline onChange={(value) => updateContent((draft) => { draft.seo.shareImageAlt = value; })} />
            </div>
          </EditorSection>
        </section>
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
