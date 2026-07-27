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
          <p>Prijavljeni ste kao {userEmail}. Izmene postaju vidljive čim ih sačuvate.</p>
        </div>
        <div className="editor-header-actions">
          <a href="/" target="_blank" rel="noreferrer">Otvori sajt ↗</a>
          <a href={signOutPath}>Odjava</a>
        </div>
      </header>

      <nav className="editor-jump" aria-label="Prečice kroz urednik">
        <a href="#osnovno">Osnovno</a>
        <a href="#tekstovi-urednik">Zajednički tekstovi</a>
        <a href="#pocetna-urednik">Početna</a>
        <a href="#kursevi-urednik">Kursevi</a>
        <a href="#ispiti-urednik">Ispiti</a>
        <a href="#usluge-urednik">Usluge</a>
        <a href="#utisci-urednik">Utisci</a>
        <a href="#faq-urednik">FAQ</a>
      </nav>

      <div id="osnovno">
        <EditorSection title="Kontakt i Google kalendar" description="Mejl, telefon, društvene mreže i budući link za zakazivanje" open>
          <div className="editor-grid">
            <Field label="E-mail" value={content.global.email} onChange={(value) => updateContent((draft) => { draft.global.email = value; })} />
            <Field label="Telefon — prikaz" value={content.global.phoneDisplay} onChange={(value) => updateContent((draft) => { draft.global.phoneDisplay = value; })} />
            <Field label="Telefon — link" value={content.global.phoneLink} onChange={(value) => updateContent((draft) => { draft.global.phoneLink = value; })} hint="Bez razmaka, npr. +381631234567" />
            <Field label="WhatsApp link" value={content.global.whatsappUrl} onChange={(value) => updateContent((draft) => { draft.global.whatsappUrl = value; })} />
            <Field label="Viber link" value={content.global.viberUrl} onChange={(value) => updateContent((draft) => { draft.global.viberUrl = value; })} hint="Format: viber://chat?number=%2B381...&text=Vaša%20poruka" />
            <Field label="LinkedIn link" value={content.global.linkedinUrl} onChange={(value) => updateContent((draft) => { draft.global.linkedinUrl = value; })} />
            <Field label="Google Calendar link" value={content.global.calendarUrl} onChange={(value) => updateContent((draft) => { draft.global.calendarUrl = value; })} hint="Ostavite prazno dok link nije spreman." />
            <Field label="Tekst dugmeta kalendara" value={content.global.calendarLabel} onChange={(value) => updateContent((draft) => { draft.global.calendarLabel = value; })} />
            <Field label="Tekst rezervisanog mesta" value={content.contact.calendarPlaceholder} onChange={(value) => updateContent((draft) => { draft.contact.calendarPlaceholder = value; })} />
          </div>
        </EditorSection>
        <EditorSection
          title="Prikaz linka na Viberu i WhatsAppu"
          description="Naslov i opis koji se prikazuju kada podelite adresu sajta"
        >
          <div className="editor-grid">
            <Field label="Naslov stranice" value={content.seo.pageTitle} onChange={(value) => updateContent((draft) => { draft.seo.pageTitle = value; })} />
            <Field label="Opis za pretraživače" value={content.seo.metaDescription} multiline onChange={(value) => updateContent((draft) => { draft.seo.metaDescription = value; })} />
            <Field label="Naslov deljenog linka" value={content.seo.shareTitle} onChange={(value) => updateContent((draft) => { draft.seo.shareTitle = value; })} />
            <Field label="Opis deljenog linka" value={content.seo.shareDescription} multiline onChange={(value) => updateContent((draft) => { draft.seo.shareDescription = value; })} />
            <Field label="Opis slike za deljenje" value={content.seo.shareImageAlt} multiline onChange={(value) => updateContent((draft) => { draft.seo.shareImageAlt = value; })} />
          </div>
        </EditorSection>
      </div>

      <div id="tekstovi-urednik">
        <EditorSection
          title="Naziv, navigacija i podnožje"
          description="Tekstovi koji se pojavljuju na svim stranicama"
        >
          <div className="editor-grid">
            <Field label="Naziv sajta" value={content.labels.brandName} onChange={(value) => updateContent((draft) => { draft.labels.brandName = value; })} />
            <Field label="Link za preskakanje navigacije" value={content.labels.skipLink} onChange={(value) => updateContent((draft) => { draft.labels.skipLink = value; })} />
            <Field label="Navigacija — početna" value={content.labels.navigationHome} onChange={(value) => updateContent((draft) => { draft.labels.navigationHome = value; })} />
            <Field label="Navigacija — kursevi" value={content.labels.navigationCourses} onChange={(value) => updateContent((draft) => { draft.labels.navigationCourses = value; })} />
            <Field label="Navigacija — ispiti" value={content.labels.navigationExams} onChange={(value) => updateContent((draft) => { draft.labels.navigationExams = value; })} />
            <Field label="Navigacija — usluge" value={content.labels.navigationServices} onChange={(value) => updateContent((draft) => { draft.labels.navigationServices = value; })} />
            <Field label="Navigacija — o meni" value={content.labels.navigationAbout} onChange={(value) => updateContent((draft) => { draft.labels.navigationAbout = value; })} />
            <Field label="Navigacija — utisci" value={content.labels.navigationTestimonials} onChange={(value) => updateContent((draft) => { draft.labels.navigationTestimonials = value; })} />
            <Field label="Navigacija — kontakt" value={content.labels.navigationContact} onChange={(value) => updateContent((draft) => { draft.labels.navigationContact = value; })} />
            <Field label="Dugme u zaglavlju" value={content.labels.headerCta} onChange={(value) => updateContent((draft) => { draft.labels.headerCta = value; })} />
            <Field label="Mobilna traka — WhatsApp" value={content.labels.mobileCtaWhatsApp} onChange={(value) => updateContent((draft) => { draft.labels.mobileCtaWhatsApp = value; })} />
            <Field label="Mobilna traka — Viber" value={content.labels.mobileCtaViber} onChange={(value) => updateContent((draft) => { draft.labels.mobileCtaViber = value; })} />
            <Field label="Mobilna traka — zakazivanje" value={content.labels.mobileCtaBooking} onChange={(value) => updateContent((draft) => { draft.labels.mobileCtaBooking = value; })} />
            <Field label="Mobilni meni" value={content.labels.mobileMenu} onChange={(value) => updateContent((draft) => { draft.labels.mobileMenu = value; })} />
            <Field label="Rečnik — vrsta reči" value={content.labels.dictionaryPartOfSpeech} onChange={(value) => updateContent((draft) => { draft.labels.dictionaryPartOfSpeech = value; })} />
            <Field label="Rečnik — reč" value={content.labels.dictionaryWord} onChange={(value) => updateContent((draft) => { draft.labels.dictionaryWord = value; })} />
            <Field label="Rečnik — izgovor" value={content.labels.dictionaryPronunciation} onChange={(value) => updateContent((draft) => { draft.labels.dictionaryPronunciation = value; })} />
            <Field label="Podnožje — opis" value={content.labels.footerTagline} onChange={(value) => updateContent((draft) => { draft.labels.footerTagline = value; })} />
            <Field label="Podnožje — autorski tekst" value={content.labels.footerCopyright} onChange={(value) => updateContent((draft) => { draft.labels.footerCopyright = value; })} />
            <Field label="Naslov mejla sa sajta" value={content.labels.contactMailSubject} onChange={(value) => updateContent((draft) => { draft.labels.contactMailSubject = value; })} />
            <Field label="Naziv kalendara" value={content.labels.calendarProviderLabel} onChange={(value) => updateContent((draft) => { draft.labels.calendarProviderLabel = value; })} />
          </div>
        </EditorSection>

        <EditorSection
          title="Kraći tekstovi na početnoj"
          description="Oznake, pozivi na akciju i napomene koje ranije nisu mogle da se menjaju"
        >
          <div className="editor-grid">
            <Field label="Ime u traci poverenja" value={content.labels.trustName} onChange={(value) => updateContent((draft) => { draft.labels.trustName = value; })} />
            <Field label="Dugme ka svim pripremama" value={content.labels.examsAllCta} onChange={(value) => updateContent((draft) => { draft.labels.examsAllCta = value; })} />
            <Field label="Napomena ispod jezičkih usluga" value={content.labels.serviceNote} multiline onChange={(value) => updateContent((draft) => { draft.labels.serviceNote = value; })} />
            <Field label="Inicijali u sekciji O meni" value={content.labels.aboutMark} onChange={(value) => updateContent((draft) => { draft.labels.aboutMark = value; })} />
            <Field label="Moto u sekciji O meni" value={content.labels.aboutMotto} onChange={(value) => updateContent((draft) => { draft.labels.aboutMotto = value; })} />
            <Field label="O meni — obrazovanje" value={content.labels.aboutEducationLabel} onChange={(value) => updateContent((draft) => { draft.labels.aboutEducationLabel = value; })} />
            <Field label="O meni — ispiti" value={content.labels.aboutExamsLabel} onChange={(value) => updateContent((draft) => { draft.labels.aboutExamsLabel = value; })} />
            <Field label="O meni — stručne oblasti" value={content.labels.aboutSpecialismsLabel} onChange={(value) => updateContent((draft) => { draft.labels.aboutSpecialismsLabel = value; })} />
            <Field label="O meni — prevođenje" value={content.labels.aboutTranslationLabel} onChange={(value) => updateContent((draft) => { draft.labels.aboutTranslationLabel = value; })} />
            <Field label="LinkedIn dugme" value={content.labels.linkedinCta} onChange={(value) => updateContent((draft) => { draft.labels.linkedinCta = value; })} />
            <Field label="Cenovnik — individualna nastava" value={content.labels.pricingIndividualLabel} onChange={(value) => updateContent((draft) => { draft.labels.pricingIndividualLabel = value; })} />
            <Field label="Cenovnik — paket" value={content.labels.pricingPackageLabel} onChange={(value) => updateContent((draft) => { draft.labels.pricingPackageLabel = value; })} />
            <Field label="Cenovnik — grupe" value={content.labels.pricingGroupsLabel} onChange={(value) => updateContent((draft) => { draft.labels.pricingGroupsLabel = value; })} />
            <Field label="Cenovnik — jezičke usluge" value={content.labels.pricingServicesLabel} onChange={(value) => updateContent((draft) => { draft.labels.pricingServicesLabel = value; })} />
            <Field label="Dugme u cenovniku" value={content.labels.pricingCta} onChange={(value) => updateContent((draft) => { draft.labels.pricingCta = value; })} />
          </div>
          <ListField label="Stavke u traci poverenja" value={content.labels.trustItems} onChange={(value) => updateContent((draft) => { draft.labels.trustItems = value; })} />
        </EditorSection>

        <EditorSection
          title="Kartice i detaljne stranice"
          description="Oznake i dugmad na stranicama kurseva, ispita i usluga"
        >
          <div className="editor-grid">
            <Field label="Kartica — detaljan opis" value={content.labels.catalogDetailCta} onChange={(value) => updateContent((draft) => { draft.labels.catalogDetailCta = value; })} />
            <Field label="Detaljna stranica — glavno dugme" value={content.labels.detailPrimaryCta} onChange={(value) => updateContent((draft) => { draft.labels.detailPrimaryCta = value; })} />
            <Field label="Detaljna stranica — bočna napomena" value={content.labels.detailAsideText} multiline onChange={(value) => updateContent((draft) => { draft.labels.detailAsideText = value; })} />
            <Field label="Detaljna stranica — pošaljite upit" value={content.labels.detailInquiryCta} onChange={(value) => updateContent((draft) => { draft.labels.detailInquiryCta = value; })} />
            <Field label="Kursevi — povratak" value={content.labels.courseBackLabel} onChange={(value) => updateContent((draft) => { draft.labels.courseBackLabel = value; })} />
            <Field label="Kursevi — oznaka cene" value={content.labels.coursePriceLabel} onChange={(value) => updateContent((draft) => { draft.labels.coursePriceLabel = value; })} />
            <Field label="Kursevi — kome je namenjen" value={content.labels.courseAudienceTitle} onChange={(value) => updateContent((draft) => { draft.labels.courseAudienceTitle = value; })} />
            <Field label="Kursevi — ishodi" value={content.labels.courseOutcomesTitle} onChange={(value) => updateContent((draft) => { draft.labels.courseOutcomesTitle = value; })} />
            <Field label="Kursevi — format rada" value={content.labels.courseFormatTitle} onChange={(value) => updateContent((draft) => { draft.labels.courseFormatTitle = value; })} />
            <Field label="Usluge — nadnaslov" value={content.labels.serviceEyebrow} onChange={(value) => updateContent((draft) => { draft.labels.serviceEyebrow = value; })} />
            <Field label="Usluge — povratak" value={content.labels.serviceBackLabel} onChange={(value) => updateContent((draft) => { draft.labels.serviceBackLabel = value; })} />
            <Field label="Usluge — oznaka cene" value={content.labels.servicePriceLabel} onChange={(value) => updateContent((draft) => { draft.labels.servicePriceLabel = value; })} />
            <Field label="Usluge — sadržaj" value={content.labels.serviceIncludesTitle} onChange={(value) => updateContent((draft) => { draft.labels.serviceIncludesTitle = value; })} />
            <Field label="Usluge — tok saradnje" value={content.labels.serviceProcessTitle} onChange={(value) => updateContent((draft) => { draft.labels.serviceProcessTitle = value; })} />
            <Field label="Ispiti — povratak" value={content.labels.examBackLabel} onChange={(value) => updateContent((draft) => { draft.labels.examBackLabel = value; })} />
            <Field label="Ispiti — oznaka cene" value={content.labels.examPriceLabel} onChange={(value) => updateContent((draft) => { draft.labels.examPriceLabel = value; })} />
            <Field label="Ispiti — oblasti rada" value={content.labels.examFocusTitle} onChange={(value) => updateContent((draft) => { draft.labels.examFocusTitle = value; })} />
            <Field label="Ispiti — format pripreme" value={content.labels.examFormatTitle} onChange={(value) => updateContent((draft) => { draft.labels.examFormatTitle = value; })} />
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
            <Field label="Naziv opšteg kursa u cenovniku" value={content.pricing.generalLessonLabel} onChange={(value) => updateContent((draft) => { draft.pricing.generalLessonLabel = value; })} />
            <Field label="Cena opšteg kursa" value={content.pricing.generalLessonPrice} onChange={(value) => updateContent((draft) => { draft.pricing.generalLessonPrice = value; })} />
            <Field label="Naziv specijalizovanog kursa u cenovniku" value={content.pricing.specializedLessonLabel} onChange={(value) => updateContent((draft) => { draft.pricing.specializedLessonLabel = value; })} />
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

      <div id="utisci-urednik">
        <EditorSection
          title="Utisci polaznika i klijenata"
          description="Tekst sekcije i odobravanje utisaka poslatih preko sajta"
          open
        >
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

          <div className="editor-testimonial-review">
            <div className="editor-review-heading">
              <h3>Pristigli utisci</h3>
              <p>
                Na sajtu se prikazuju samo odobreni utisci. Odbijeni ostaju u
                evidenciji dok ih ne obrišete.
              </p>
            </div>
            {reviewMessage && (
              <p className="editor-review-message" role="status">
                {reviewMessage}
              </p>
            )}
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <article className="editor-testimonial-card" key={testimonial.id}>
                  <div>
                    <p className={`editor-testimonial-status ${testimonial.status}`}>
                      {testimonial.status === "pending"
                        ? "Čeka odobrenje"
                        : testimonial.status === "approved"
                          ? "Objavljen"
                          : "Odbijen"}
                    </p>
                    <blockquote>“{testimonial.quote}”</blockquote>
                    <p>
                      <strong>{testimonial.name}</strong>
                      {testimonial.context && ` · ${testimonial.context}`}
                    </p>
                    <small>Poslato: {testimonial.createdAt.slice(0, 10)}</small>
                  </div>
                  <div className="editor-testimonial-actions">
                    {testimonial.status !== "approved" && (
                      <button
                        type="button"
                        onClick={() => moderateTestimonial(testimonial.id, "approve")}
                        disabled={reviewingId === testimonial.id}
                      >
                        Odobri i objavi
                      </button>
                    )}
                    {testimonial.status !== "rejected" && (
                      <button
                        type="button"
                        onClick={() => moderateTestimonial(testimonial.id, "reject")}
                        disabled={reviewingId === testimonial.id}
                      >
                        {testimonial.status === "approved" ? "Povuci sa sajta" : "Odbij"}
                      </button>
                    )}
                    <button
                      className="danger"
                      type="button"
                      onClick={() => moderateTestimonial(testimonial.id, "delete")}
                      disabled={reviewingId === testimonial.id}
                    >
                      Obriši
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="editor-review-empty">
                Još nema utisaka poslatih preko sajta.
              </p>
            )}
          </div>
        </EditorSection>
      </div>

      <div id="faq-urednik">
        <EditorSection title="Kontakt sekcija">
          <div className="editor-grid">
            <Field label="Nadnaslov" value={content.contact.eyebrow} onChange={(value) => updateContent((draft) => { draft.contact.eyebrow = value; })} />
            <Field label="Naslov" value={content.contact.headline} multiline onChange={(value) => updateContent((draft) => { draft.contact.headline = value; })} />
            <Field label="Uvod" value={content.contact.intro} multiline onChange={(value) => updateContent((draft) => { draft.contact.intro = value; })} />
            <Field label="Mejl — oznaka" value={content.contact.emailLabel} onChange={(value) => updateContent((draft) => { draft.contact.emailLabel = value; })} />
            <Field label="WhatsApp — oznaka" value={content.contact.whatsappLabel} onChange={(value) => updateContent((draft) => { draft.contact.whatsappLabel = value; })} />
            <Field label="Viber — oznaka" value={content.contact.viberLabel} onChange={(value) => updateContent((draft) => { draft.contact.viberLabel = value; })} />
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
