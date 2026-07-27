export type Program = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  meta: string;
  price: string;
  eyebrow: string;
  headline: string;
  intro: string;
  audience: string[];
  outcomes: string[];
  format: string[];
};

export type Exam = {
  slug: string;
  label: string;
  title: string;
  summary: string;
  headline: string;
  intro: string;
  focus: string[];
  format: string[];
};

export type LanguageService = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  price: string;
  unit: string;
  headline: string;
  intro: string;
  includes: string[];
  process: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type TestimonialSectionContent = {
  eyebrow: string;
  headline: string;
  intro: string;
  emptyMessage: string;
  formTitle: string;
  formIntro: string;
  nameLabel: string;
  contextLabel: string;
  quoteLabel: string;
  consentLabel: string;
  submitLabel: string;
  successMessage: string;
};

export type SiteContent = {
  schemaVersion: number;
  seo: {
    pageTitle: string;
    metaDescription: string;
    shareTitle: string;
    shareDescription: string;
    shareImageAlt: string;
  };
  global: {
    email: string;
    phoneDisplay: string;
    phoneLink: string;
    whatsappUrl: string;
    viberUrl: string;
    linkedinUrl: string;
    calendarUrl: string;
    calendarLabel: string;
  };
  labels: {
    brandName: string;
    skipLink: string;
    navigationHome: string;
    navigationCourses: string;
    navigationExams: string;
    navigationServices: string;
    navigationAbout: string;
    navigationTestimonials: string;
    navigationContact: string;
    headerCta: string;
    mobileMenu: string;
    mobileCtaWhatsApp: string;
    mobileCtaViber: string;
    mobileCtaBooking: string;
    dictionaryPartOfSpeech: string;
    dictionaryWord: string;
    dictionaryPronunciation: string;
    trustName: string;
    trustItems: string[];
    examsAllCta: string;
    serviceNote: string;
    aboutMark: string;
    aboutMotto: string;
    aboutEducationLabel: string;
    aboutExamsLabel: string;
    aboutSpecialismsLabel: string;
    aboutTranslationLabel: string;
    linkedinCta: string;
    pricingIndividualLabel: string;
    pricingPackageLabel: string;
    pricingGroupsLabel: string;
    pricingServicesLabel: string;
    pricingCta: string;
    catalogDetailCta: string;
    detailPrimaryCta: string;
    detailAsideText: string;
    detailInquiryCta: string;
    courseBackLabel: string;
    coursePriceLabel: string;
    courseAudienceTitle: string;
    courseOutcomesTitle: string;
    courseFormatTitle: string;
    serviceEyebrow: string;
    serviceBackLabel: string;
    servicePriceLabel: string;
    serviceIncludesTitle: string;
    serviceProcessTitle: string;
    examBackLabel: string;
    examPriceLabel: string;
    examFocusTitle: string;
    examFormatTitle: string;
    calendarProviderLabel: string;
    footerTagline: string;
    footerCopyright: string;
    contactMailSubject: string;
  };
  hero: {
    eyebrow: string;
    headlineLine1: string;
    headlineLine2: string;
    lede: string;
    primaryCta: string;
    secondaryCta: string;
    credential: string;
    experience: string;
  };
  home: {
    programsEyebrow: string;
    programsHeadline: string;
    programsIntro: string;
    examsEyebrow: string;
    examsHeadline: string;
    examsIntro: string;
    processEyebrow: string;
    processHeadline: string;
    process: Array<{ title: string; text: string }>;
    servicesEyebrow: string;
    servicesHeadline: string;
    servicesIntro: string;
    pricingEyebrow: string;
    pricingHeadline: string;
    pricingIntro: string;
    faqEyebrow: string;
    faqHeadline: string;
  };
  about: {
    eyebrow: string;
    headline: string;
    lede: string;
    body: string;
    education: string;
    exams: string;
    specialisms: string;
    translation: string;
  };
  programs: Program[];
  exams: Exam[];
  services: LanguageService[];
  pricing: {
    generalLessonLabel: string;
    generalLessonPrice: string;
    specializedLessonLabel: string;
    specializedLessonPrice: string;
    lessonBenefits: string[];
    packageDiscount: string;
    packageDescription: string;
    groupDiscount: string;
    groupDescription: string;
    languageServiceDescription: string;
    duration: string;
  };
  testimonials: TestimonialSectionContent;
  faq: FaqItem[];
  contact: {
    eyebrow: string;
    headline: string;
    intro: string;
    emailLabel: string;
    whatsappLabel: string;
    viberLabel: string;
    phoneLabel: string;
    calendarPlaceholder: string;
  };
};

export const defaultContent: SiteContent = {
  schemaVersion: 9,
  seo: {
    pageTitle: "Online časovi engleskog jezika | Željko Đokić",
    metaDescription:
      "Individualni online časovi engleskog, priprema međunarodnih ispita, prevođenje, lektura i korektura — Željko Đokić, master filolog anglista.",
    shareTitle: "Engleski Online — Željko Đokić",
    shareDescription:
      "Individualni online časovi, priprema međunarodnih ispita i stručne jezičke usluge prilagođene vašem cilju.",
    shareImageAlt:
      "Engleski Online — individualna nastava, međunarodni ispiti i jezičke usluge Željka Đokića",
  },
  global: {
    email: "zeljko.d.djokic@gmail.com",
    phoneDisplay: "+381 63 73 94 618",
    phoneLink: "+381637394618",
    whatsappUrl:
      "https://wa.me/381637394618?text=Zdravo%20%C5%BDeljko%2C%20javljam%20se%20u%20vezi%20sa%20uslugama%20sa%20sajta.",
    viberUrl:
      "https://viber.me/381637394618?draft=Zdravo%20%C5%BDeljko%2C%20javljam%20se%20u%20vezi%20sa%20uslugama%20sa%20sajta.",
    linkedinUrl: "https://www.linkedin.com/in/%C5%BEeljko-%C4%91oki%C4%87/",
    calendarUrl: "",
    calendarLabel: "Zakažite termin preko Google kalendara",
  },
  labels: {
    brandName: "Engleski Online",
    skipLink: "Pređite na glavni sadržaj",
    navigationHome: "Početna",
    navigationCourses: "Kursevi",
    navigationExams: "Ispiti",
    navigationServices: "Jezičke usluge",
    navigationAbout: "O meni",
    navigationTestimonials: "Utisci",
    navigationContact: "Kontakt",
    headerCta: "Zakažite razgovor",
    mobileMenu: "Meni",
    mobileCtaWhatsApp: "WhatsApp",
    mobileCtaViber: "Viber",
    mobileCtaBooking: "Zakažite razgovor",
    dictionaryPartOfSpeech: "noun",
    dictionaryWord: "language",
    dictionaryPronunciation: "/ˈlæŋɡwɪdʒ/",
    trustName: "Željko Đokić",
    trustItems: [
      "Individualni pristup",
      "Fleksibilni termini",
      "Materijali uključeni",
    ],
    examsAllCta: "Pogledajte sve pripreme",
    serviceNote:
      "Konačna ponuda zavisi od obima, složenosti i roka. Dokumenti se pregledaju pre potvrde cene, a sadržaj se tretira poverljivo.",
    aboutMark: "ŽĐ",
    aboutMotto: "Jezik · preciznost · razumevanje",
    aboutEducationLabel: "Obrazovanje",
    aboutExamsLabel: "Ispiti",
    aboutSpecialismsLabel: "Stručne oblasti",
    aboutTranslationLabel: "Prevođenje",
    linkedinCta: "Pogledajte LinkedIn profil",
    pricingIndividualLabel: "Individualna nastava",
    pricingPackageLabel: "Paket",
    pricingGroupsLabel: "Male grupe",
    pricingServicesLabel: "Jezičke usluge",
    pricingCta: "Zakažite razgovor",
    catalogDetailCta: "Detaljan opis",
    detailPrimaryCta: "Zakažite uvodni razgovor",
    detailAsideText:
      "Program i dinamika rada prilagođavaju se vašem početnom nivou, cilju i vremenu koje imate na raspolaganju.",
    detailInquiryCta: "Pošaljite upit",
    courseBackLabel: "Svi kursevi",
    coursePriceLabel: "Cena individualnog časa",
    courseAudienceTitle: "Kome je program namenjen",
    courseOutcomesTitle: "Šta ćete postići",
    courseFormatTitle: "Kako izgleda rad",
    serviceEyebrow: "Stručne jezičke usluge",
    serviceBackLabel: "Sve usluge",
    servicePriceLabel: "Cena",
    serviceIncludesTitle: "Usluga obuhvata",
    serviceProcessTitle: "Kako izgleda saradnja",
    examBackLabel: "Sve pripreme",
    examPriceLabel: "Cena individualnog časa",
    examFocusTitle: "Na čemu radimo",
    examFormatTitle: "Kako izgleda priprema",
    calendarProviderLabel: "Google Calendar",
    footerTagline: "Individualna nastava i stručne jezičke usluge.",
    footerCopyright: "© 2026 Željko Đokić",
    contactMailSubject: "Upit sa sajta Engleski Online",
  },
  hero: {
    eyebrow: "Individualna nastava · Prevođenje · Lektura",
    headlineLine1: "Engleski koji",
    headlineLine2: "radi za vas",
    lede:
      "Individualni online časovi i stručne jezičke usluge, prilagođeni vašem cilju, nivou i rasporedu.",
    primaryCta: "Zakažite uvodni razgovor",
    secondaryCta: "Pogledajte programe",
    credential: "master filolog anglista",
    experience: "13+ godina iskustva",
  },
  home: {
    programsEyebrow: "Programi nastave",
    programsHeadline: "Jasan plan. Praktičan rad. Merljiv napredak.",
    programsIntro:
      "Svaki program počinje procenom nivoa i razgovorom o vašem cilju. Nastava se zatim oblikuje oko onoga što vam je zaista potrebno.",
    examsEyebrow: "Međunarodni ispiti",
    examsHeadline:
      "Priprema koja vas uči kako da polažete — ne samo šta da učite.",
    examsIntro:
      "Dijagnostički test, individualni plan, rad po ispitnim celinama, probni zadaci i konkretna povratna informacija posle svakog koraka.",
    processEyebrow: "Kako radimo",
    processHeadline: "Od prvog razgovora do vidljivog napretka.",
    process: [
      {
        title: "Procena i cilj",
        text: "Upoznajemo vaš nivo, potrebe, rok i način na koji najlakše učite.",
      },
      {
        title: "Plan po meri",
        text: "Biramo dinamiku, materijale i prioritete koji vode do konkretnog cilja.",
      },
      {
        title: "Rad i povratna informacija",
        text: "Svaki čas ima svrhu, praktičnu primenu i jasne smernice za dalji rad.",
      },
    ],
    servicesEyebrow: "Jezičke usluge",
    servicesHeadline:
      "Preciznost koja čuva smisao, ton i stručnost vašeg teksta.",
    servicesIntro:
      "Rad sa dokumentima na srpskom i engleskom jeziku, uz dogovor o nameni, roku i željenom nivou intervencije.",
    pricingEyebrow: "Cenovnik",
    pricingHeadline: "Jasne početne cene, bez skrivenih stavki.",
    pricingIntro:
      "Pre početka dobijate preporuku programa ili tačnu ponudu za dokument. Paketi i male grupe donose dodatnu uštedu.",
    faqEyebrow: "Najčešća pitanja",
    faqHeadline: "Sve što je važno pre prvog časa.",
  },
  about: {
    eyebrow: "O meni",
    headline:
      "Znanje jezika je važno. Jednako je važno znati kako ga preneti.",
    lede:
      "Ja sam Željko Đokić, master filolog anglista, nastavnik engleskog jezika i EN–SR prevodilac sa više od 13 godina iskustva u obrazovanju i jezičkim uslugama.",
    body:
      "Radio sam sa učenicima, odraslim polaznicima i profesionalcima u osnovnom, srednjem, korporativnom i individualnom obrazovanju. Posebnu pažnju posvećujem prilagođavanju nastave, jasnom objašnjenju i povratnoj informaciji koja polazniku pokazuje sledeći korak.",
    education:
      "Master akademske studije engleskog jezika i književnosti",
    exams: "C1 Advanced (CAE), IELTS, TOEFL i SAT",
    specialisms: "Poslovni, medicinski i farmaceutski engleski",
    translation:
      "Medicinska, farmaceutska, akademska i stručna dokumentacija",
  },
  programs: [
    {
      slug: "opsti-engleski",
      number: "01",
      title: "Opšti engleski",
      summary:
        "Od sigurnije svakodnevne komunikacije do naprednog, preciznog izražavanja — program prati vaš nivo i tempo.",
      meta: "A1–C2 · 60 min",
      price: "15 €",
      eyebrow: "Individualni program · A1–C2",
      headline: "Engleski za svakodnevni život, putovanja i lični napredak.",
      intro:
        "Program opšteg engleskog razvija govor, slušanje, čitanje i pisanje u ravnoteži, uz gramatiku i vokabular koji se odmah koriste u smislenom kontekstu.",
      audience: [
        "Početnici koji žele sigurnu i jasnu osnovu",
        "Polaznici koji žele da pređu na viši CEFR nivo",
        "Odrasli kojima je potreban engleski za putovanja i svakodnevnu komunikaciju",
        "Polaznici koji žele da obnove i sistematizuju ranije znanje",
      ],
      outcomes: [
        "Veća sigurnost i spontanost u govoru",
        "Preciznija upotreba gramatike i širi aktivni vokabular",
        "Bolje razumevanje govornog i pisanog engleskog",
        "Jasan plan napredovanja do sledećeg nivoa",
      ],
      format: [
        "Individualni online čas od 60 minuta",
        "Procena nivoa pre početka",
        "Udžbenik i dodatni digitalni materijali",
        "Fiksni ili fleksibilni termini",
      ],
    },
    {
      slug: "poslovni-engleski",
      number: "02",
      title: "Poslovni engleski",
      summary:
        "Sastanci, prezentacije, poslovna korespondencija i vokabular koji odmah primenjujete u svom poslu.",
      meta: "Individualni program · 60 min",
      price: "17 €",
      eyebrow: "Engleski za profesionalno okruženje",
      headline: "Komunicirajte jasno, sigurno i profesionalno.",
      intro:
        "Program se oblikuje oko stvarnih poslovnih situacija: sastanaka, prezentacija, pregovora, telefonskih i video-razgovora, mejlova i stručne dokumentacije.",
      audience: [
        "Profesionalci koji svakodnevno sarađuju sa inostranstvom",
        "Kandidati koji se pripremaju za razgovor za posao",
        "Timovi i pojedinci kojima je potrebna preciznija poslovna komunikacija",
        "Polaznici koji žele da unaprede formalni stil pisanja i govora",
      ],
      outcomes: [
        "Sigurnije učešće na sastancima i video-pozivima",
        "Jasni, profesionalni mejlovi i izveštaji",
        "Bolje prezentovanje ideja i argumentovanje",
        "Vokabular prilagođen vašoj industriji i radnom mestu",
      ],
      format: [
        "Individualni online čas od 60 minuta",
        "Analiza profesionalnih potreba",
        "Autentični poslovni materijali i simulacije",
        "Fleksibilna dinamika prema vašem rasporedu",
      ],
    },
    {
      slug: "strucni-engleski",
      number: "03",
      title: "Stručni engleski",
      summary:
        "Jezik medicine, farmacije, IT-ja, prava i drugih stručnih oblasti, uz materijale prilagođene profesiji.",
      meta: "Stručna terminologija · 60 min",
      price: "17 €",
      eyebrow: "Engleski za struku i akademsko okruženje",
      headline: "Predstavite svoju stručnost precizno i bez jezičke barijere.",
      intro:
        "Stručni kurs povezuje jezičke veštine sa terminologijom, dokumentima i komunikacionim situacijama karakterističnim za vašu oblast.",
      audience: [
        "Zdravstveni i farmaceutski radnici",
        "IT stručnjaci, inženjeri i tehnički profesionalci",
        "Pravnici i stručnjaci koji rade sa međunarodnom dokumentacijom",
        "Studenti i istraživači kojima je potreban akademski engleski",
      ],
      outcomes: [
        "Precizna i dosledna upotreba stručne terminologije",
        "Bolje razumevanje stručnih tekstova, prezentacija i dokumentacije",
        "Sigurnija komunikacija sa kolegama i klijentima",
        "Jasnije akademsko i profesionalno pisanje",
      ],
      format: [
        "Individualni online čas od 60 minuta",
        "Program zasnovan na vašoj stručnoj oblasti",
        "Udžbenici, članci, studije slučaja i autentična dokumentacija",
        "Mogućnost rada sa sopstvenim materijalima",
      ],
    },
    {
      slug: "priprema-ispita",
      number: "04",
      title: "Priprema ispita",
      summary:
        "Strategija, veštine, probni zadaci i precizne povratne informacije za međunarodno priznate ispite.",
      meta: "CAE · CPE · IELTS · TOEFL · SAT",
      price: "17 €",
      eyebrow: "Međunarodni ispiti",
      headline: "Priprema zasnovana na cilju, roku i stvarnom formatu ispita.",
      intro:
        "Priprema objedinjuje razvoj jezika, razumevanje kriterijuma ocenjivanja, strategije za svaki tip zadatka i redovan rad u uslovima sličnim ispitnim.",
      audience: [
        "Kandidati za Cambridge C1 Advanced i C2 Proficiency",
        "Kandidati kojima je potreban IELTS ili TOEFL za studije i rad",
        "Učenici koji se pripremaju za SAT English",
        "Polaznici sa konkretnim rokom i ciljnim rezultatom",
      ],
      outcomes: [
        "Jasno razumevanje strukture i kriterijuma ispita",
        "Efikasnije upravljanje vremenom",
        "Precizna povratna informacija za govor i pisanje",
        "Redovno praćenje napretka kroz probne zadatke",
      ],
      format: [
        "Individualni online čas od 60 minuta",
        "Početna dijagnostika i plan do ispita",
        "Zvanični i pažljivo odabrani pripremni materijali",
        "Probni testovi i analiza rezultata",
      ],
    },
  ],
  exams: [
    {
      slug: "c1-advanced-cae",
      label: "Cambridge",
      title: "C1 Advanced (CAE)",
      summary:
        "Četiri ispitne celine, strategija i detaljna korekcija pisanih radova.",
      headline: "Sistematična priprema za visok nivo akademskog i profesionalnog engleskog.",
      intro:
        "Rad obuhvata Reading and Use of English, Writing, Listening i Speaking, uz kriterijume ocenjivanja i redovne simulacije ispitnih zadataka.",
      focus: [
        "Napredna gramatika, kolokacije i preciznost u Use of English",
        "Eseji, izveštaji, predlozi, recenzije i druga ispitna pisanja",
        "Strategije za slušanje i čitanje pod vremenskim ograničenjem",
        "Razvoj tečnosti, interakcije i argumentovanja u Speaking delu",
      ],
      format: [
        "Dijagnostički test i individualni plan",
        "Detaljno ocenjivanje pisanih radova prema Cambridge kriterijumima",
        "Probni testovi i praćenje rezultata",
        "Cena: 17 € za 60 minuta",
      ],
    },
    {
      slug: "c2-proficiency-cpe",
      label: "Cambridge",
      title: "C2 Proficiency (CPE)",
      summary:
        "Priprema za najviši Cambridge nivo uz zahtevne tekstove i naprednu jezičku preciznost.",
      headline: "Ovladavanje nijansama jezika na nivou C2.",
      intro:
        "Priprema je namenjena kandidatima sa veoma visokim nivoom koji žele da usavrše preciznost, stil, argumentaciju i razumevanje složenih tekstova.",
      focus: [
        "Napredna leksika, idiomatika i gramatička preciznost",
        "Složeno akademsko i profesionalno pisanje",
        "Analiza tona, registra i implicitnog značenja",
        "Tečna, spontana i precizna usmena komunikacija",
      ],
      format: [
        "Individualni plan prema datumu ispita",
        "Rad sa zahtevnim autentičnim i ispitnim materijalima",
        "Detaljna korekcija i povratna informacija",
        "Cena: 17 € za 60 minuta",
      ],
    },
    {
      slug: "ielts",
      label: "Academic & General",
      title: "IELTS",
      summary:
        "Rad prema ciljnom bandu, uz razvoj preciznosti, vremena i sigurnosti.",
      headline: "Priprema usmerena na vaš ciljni IELTS rezultat.",
      intro:
        "Program se prilagođava Academic ili General Training verziji, trenutnom nivou, ciljnom bandu i roku koji imate do polaganja.",
      focus: [
        "Writing Task 1 i Task 2 uz detaljnu analizu kriterijuma",
        "Speaking simulacije i razvoj spontanosti",
        "Strategije za Reading i Listening",
        "Akademski vokabular, kohezija i preciznost",
      ],
      format: [
        "Početna procena i realna procena potrebnog vremena",
        "Redovni zadaci ocenjeni prema IELTS descriptorima",
        "Probni delovi ispita i analiza slabijih oblasti",
        "Cena: 17 € za 60 minuta",
      ],
    },
    {
      slug: "toefl",
      label: "Academic English",
      title: "TOEFL",
      summary:
        "Integrisani zadaci, akademske veštine i priprema za digitalni format.",
      headline: "Akademski engleski i strategija za TOEFL iBT.",
      intro:
        "Priprema razvija razumevanje akademskih tekstova i predavanja, beleženje, povezivanje izvora i jasno izražavanje u integrisanim zadacima.",
      focus: [
        "Reading i Listening strategije",
        "Integrated i Independent Writing",
        "Speaking zadaci uz rad na strukturi i vremenu",
        "Akademski vokabular i beleženje ključnih informacija",
      ],
      format: [
        "Individualni plan prema ciljnom broju bodova",
        "Rad u digitalnom formatu",
        "Simulacije i analiza učinka",
        "Cena: 17 € za 60 minuta",
      ],
    },
    {
      slug: "sat",
      label: "College admission",
      title: "SAT English",
      summary:
        "Čitanje, pisanje, jezička logika i sistematičan rad na tipovima pitanja.",
      headline: "Precizna priprema za Reading and Writing deo digitalnog SAT-a.",
      intro:
        "Program povezuje razumevanje teksta, gramatičku preciznost, logiku argumenta i strategije za efikasno rešavanje digitalnih pitanja.",
      focus: [
        "Information and Ideas",
        "Craft and Structure",
        "Expression of Ideas",
        "Standard English Conventions",
      ],
      format: [
        "Početna dijagnostika po domenima",
        "Plan vežbanja prema slabijim oblastima",
        "Digitalni zadaci i rad na vremenu",
        "Cena: 17 € za 60 minuta",
      ],
    },
  ],
  services: [
    {
      slug: "prevodjenje",
      number: "01",
      title: "Prevođenje EN ↔ SR",
      summary:
        "Poslovni, medicinski, farmaceutski, akademski, tehnički i promotivni sadržaji — sa lekturom i tehničkom obradom.",
      price: "16 €",
      unit: "/ 250 reči",
      headline: "Prevod koji zvuči prirodno i čuva stručni smisao izvornika.",
      intro:
        "Pisano prevođenje sa srpskog na engleski i sa engleskog na srpski, uz terminološku doslednost, jezičku reviziju i tehničku obradu dokumenta.",
      includes: [
        "Poslovna korespondencija, CV i propratna pisma",
        "Medicinska i farmaceutska dokumentacija",
        "Akademski, pravni, IT i tehnički tekstovi",
        "Veb-sadržaji, brošure i uputstva",
      ],
      process: [
        "Pregled dokumenta i potvrda roka i cene",
        "Prevođenje i terminološka provera",
        "Lektura, korektura i tehnička obrada",
        "Isporuka u dogovorenom formatu",
      ],
    },
    {
      slug: "lektura-korektura-redaktura",
      number: "02",
      title: "Lektura, korektura i redaktura",
      summary:
        "Od uklanjanja pravopisnih i slovnih grešaka do dublje stilske i strukturne dorade teksta, uvek uz saglasnost autora.",
      price: "8 €",
      unit: "/ 250 reči",
      headline: "Jasan, dosledan i profesionalno oblikovan tekst.",
      intro:
        "Nivo intervencije dogovara se prema stanju dokumenta i njegovoj nameni — od završne korekture do dublje stilske i strukturne redakture.",
      includes: [
        "Lektura gramatike, pravopisa i interpunkcije",
        "Korektura slovnih, tehničkih i tipografskih grešaka",
        "Stilska i strukturna redaktura uz saglasnost autora",
        "Rad na srpskim i engleskim tekstovima",
      ],
      process: [
        "Pregled uzorka ili celog dokumenta",
        "Dogovor o nivou intervencije",
        "Rad sa jasno obeleženim izmenama",
        "Završna provera i isporuka",
      ],
    },
    {
      slug: "usmeno-prevodjenje",
      number: "03",
      title: "Usmeno prevođenje",
      summary:
        "Konsekutivno i simultano prevođenje za razgovore, sastanke, obuke i stručne događaje.",
      price: "60 €",
      unit: "/ sat",
      headline: "Pouzdana jezička podrška u razgovoru i profesionalnom susretu.",
      intro:
        "Konsekutivno i simultano prevođenje prilagođeno temi, učesnicima i formatu događaja, uz prethodnu terminološku pripremu.",
      includes: [
        "Poslovni razgovori i sastanci",
        "Stručne obuke i prezentacije",
        "Medicinski i farmaceutski kontekst",
        "Online i dogovoreni događaji uživo",
      ],
      process: [
        "Dogovor o temi, formatu i trajanju",
        "Dostavljanje materijala za pripremu",
        "Terminološka priprema",
        "Prevođenje u dogovoreno vreme",
      ],
    },
  ],
  pricing: {
    generalLessonLabel: "Opšti kurs",
    generalLessonPrice: "15 €",
    specializedLessonLabel: "Specijalizovani kurs",
    specializedLessonPrice: "17 €",
    lessonBenefits: [
      "Materijali uključeni",
      "Procena nivoa i plan rada",
      "Fiksni ili fleksibilni termini",
    ],
    packageDiscount: "−10%",
    packageDescription:
      "Za paket od 12 unapred uplaćenih individualnih časova.",
    groupDiscount: "−10–50%",
    groupDescription:
      "Za male grupe od 2 do 6 polaznika; popust se obračunava po osobi.",
    languageServiceDescription:
      "Prema 250 reči, uz ponudu pre početka rada.",
    duration: "60 minuta",
  },
  testimonials: {
    eyebrow: "Utisci polaznika i klijenata",
    headline: "Vaše iskustvo može pomoći sledećem polazniku.",
    intro:
      "Utisci se objavljuju isključivo uz saglasnost autora i tek nakon provere.",
    emptyMessage:
      "Ako ste pohađali časove ili koristili jezičke usluge, možete prvi podeliti svoje iskustvo.",
    formTitle: "Podelite svoje iskustvo",
    formIntro:
      "Napišite kratak i iskren utisak. Biće objavljen tek nakon odobrenja.",
    nameLabel: "Ime ili inicijali",
    contextLabel: "Kurs ili usluga (opciono)",
    quoteLabel: "Vaš utisak",
    consentLabel:
      "Saglasan/na sam da moj utisak i navedeno ime budu javno objavljeni.",
    submitLabel: "Pošaljite utisak",
    successMessage: "Hvala! Vaš utisak je poslat i čeka odobrenje.",
  },
  faq: [
    {
      question: "Kako izgleda procena nivoa?",
      answer:
        "Kombinujemo kraći pisani zadatak i razgovor. Na osnovu rezultata dobijate procenu nivoa i preporuku programa i materijala.",
    },
    {
      question: "Gde se održavaju online časovi?",
      answer:
        "Časovi se održavaju preko Google Meet-a, Zoom-a, Skype-a ili druge platforme koju zajednički dogovorimo.",
    },
    {
      question: "Da li su mogući fleksibilni termini?",
      answer:
        "Da. Možete izabrati stalni nedeljni termin ili se dogovarati iz nedelje u nedelju, u skladu sa raspoloživim terminima.",
    },
    {
      question: "Da li dobijam materijale za rad?",
      answer:
        "Da. Materijali sa časa, dodatne vežbe i preporuke za samostalni rad uključeni su u cenu nastave.",
    },
  ],
  contact: {
    eyebrow: "Kontakt",
    headline: "Recite mi gde želite da stignete sa svojim engleskim.",
    intro:
      "Odgovoriću vam sa predlogom programa, mogućim terminima i svim informacijama potrebnim za početak.",
    emailLabel: "Pošaljite mejl",
    whatsappLabel: "WhatsApp",
    viberLabel: "Viber",
    phoneLabel: "Telefon",
    calendarPlaceholder: "Google Calendar link biće dostupan ovde",
  },
};
