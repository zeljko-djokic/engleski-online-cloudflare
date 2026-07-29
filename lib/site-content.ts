import { defaultContent, type SiteContent } from "@/lib/content-model";

type ContentRow = {
  content: string;
};

async function getD1() {
  const { env } = await import("cloudflare:workers");
  if (!env.DB) throw new Error("D1 binding DB is unavailable.");
  return env.DB;
}

function migrateLegacyContent(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;

  const source = structuredClone(value) as Record<string, unknown>;
  const version =
    typeof source.schemaVersion === "number" ? source.schemaVersion : 1;

  if (version < 2) {
    if (Array.isArray(source.services)) {
      source.services = source.services.map((item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return item;
        const service = { ...(item as Record<string, unknown>) };

        if (service.slug === "prevodjenje") {
          service.price = "16 €";
        }

        if (service.slug === "lektura-korektura-redaktura") {
          service.price = "8 €";
        }

        return service;
      });
    }

  }

  if (version < 3) {
    const defaultSat = defaultContent.exams.find((exam) => exam.slug === "sat");
    const savedExams = Array.isArray(source.exams) ? source.exams : [];
    const hasSat = savedExams.some(
      (item) =>
        item &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        (item as Record<string, unknown>).slug === "sat",
    );

    if (!hasSat && defaultSat) {
      source.exams = [...savedExams, structuredClone(defaultSat)];
    }

    source.schemaVersion = 3;
  }

  if (version < 4) {
    source.schemaVersion = 4;
  }

  if (version < 5) {
    source.schemaVersion = 5;
  }

  if (version < 6) {
    source.schemaVersion = 6;
  }

  if (version < 7) {
    if (
      source.global &&
      typeof source.global === "object" &&
      !Array.isArray(source.global)
    ) {
      source.global = {
        ...(source.global as Record<string, unknown>),
        viberUrl: defaultContent.global.viberUrl,
      };
    }

    source.schemaVersion = 7;
  }

  if (version < 8) {
    source.schemaVersion = 8;
  }

  if (version < 9) {
    if (
      source.global &&
      typeof source.global === "object" &&
      !Array.isArray(source.global)
    ) {
      source.global = {
        ...(source.global as Record<string, unknown>),
        viberUrl: defaultContent.global.viberUrl,
      };
    }

    source.schemaVersion = 9;
  }

  if (version < 10) {
    if (Array.isArray(source.programs)) {
      source.programs = source.programs.filter(
        (item) =>
          !(
            item &&
            typeof item === "object" &&
            !Array.isArray(item) &&
            (item as Record<string, unknown>).slug === "priprema-ispita"
          ),
      );
    }

    if (
      source.labels &&
      typeof source.labels === "object" &&
      !Array.isArray(source.labels)
    ) {
      source.labels = {
        ...(source.labels as Record<string, unknown>),
        navigationExams: defaultContent.labels.navigationExams,
        examsAllCta: defaultContent.labels.examsAllCta,
        examBackLabel: defaultContent.labels.examBackLabel,
      };
    }

    if (
      source.home &&
      typeof source.home === "object" &&
      !Array.isArray(source.home)
    ) {
      source.home = {
        ...(source.home as Record<string, unknown>),
        examsEyebrow: defaultContent.home.examsEyebrow,
      };
    }

    source.schemaVersion = 10;
  }

  if (version < 11) {
    source.seo = {
      ...(
        source.seo &&
        typeof source.seo === "object" &&
        !Array.isArray(source.seo)
          ? (source.seo as Record<string, unknown>)
          : {}
      ),
      ...structuredClone(defaultContent.seo),
    };

    source.labels = {
      ...(
        source.labels &&
        typeof source.labels === "object" &&
        !Array.isArray(source.labels)
          ? (source.labels as Record<string, unknown>)
          : {}
      ),
      navigationCourses: defaultContent.labels.navigationCourses,
      navigationExams: defaultContent.labels.navigationExams,
      headerCta: defaultContent.labels.headerCta,
      mobileCtaBooking: defaultContent.labels.mobileCtaBooking,
      examsAllCta: defaultContent.labels.examsAllCta,
      pricingCta: defaultContent.labels.pricingCta,
      detailPrimaryCta: defaultContent.labels.detailPrimaryCta,
      examBackLabel: defaultContent.labels.examBackLabel,
      footerTagline: defaultContent.labels.footerTagline,
      privacyPolicyLabel: defaultContent.labels.privacyPolicyLabel,
    };

    source.hero = {
      ...(
        source.hero &&
        typeof source.hero === "object" &&
        !Array.isArray(source.hero)
          ? (source.hero as Record<string, unknown>)
          : {}
      ),
      eyebrow: defaultContent.hero.eyebrow,
      primaryCta: defaultContent.hero.primaryCta,
    };

    source.home = {
      ...(
        source.home &&
        typeof source.home === "object" &&
        !Array.isArray(source.home)
          ? (source.home as Record<string, unknown>)
          : {}
      ),
      programsEyebrow: defaultContent.home.programsEyebrow,
      programsHeadline: defaultContent.home.programsHeadline,
      programsIntro: defaultContent.home.programsIntro,
      examsEyebrow: defaultContent.home.examsEyebrow,
      examsHeadline: defaultContent.home.examsHeadline,
      examsIntro: defaultContent.home.examsIntro,
    };

    source.about = {
      ...(
        source.about &&
        typeof source.about === "object" &&
        !Array.isArray(source.about)
          ? (source.about as Record<string, unknown>)
          : {}
      ),
      exams: defaultContent.about.exams,
    };

    source.contact = {
      ...(
        source.contact &&
        typeof source.contact === "object" &&
        !Array.isArray(source.contact)
          ? (source.contact as Record<string, unknown>)
          : {}
      ),
      headline: defaultContent.contact.headline,
      intro: defaultContent.contact.intro,
    };

    source.schemaVersion = 11;
  }

  if (version < 12) {
    source.global = {
      ...(
        source.global &&
        typeof source.global === "object" &&
        !Array.isArray(source.global)
          ? (source.global as Record<string, unknown>)
          : {}
      ),
      calendarLabel: defaultContent.global.calendarLabel,
    };

    source.labels = {
      ...(
        source.labels &&
        typeof source.labels === "object" &&
        !Array.isArray(source.labels)
          ? (source.labels as Record<string, unknown>)
          : {}
      ),
      navigationCoursePrograms:
        defaultContent.labels.navigationCoursePrograms,
      navigationPricing: defaultContent.labels.navigationPricing,
    };

    source.pricing = {
      ...(
        source.pricing &&
        typeof source.pricing === "object" &&
        !Array.isArray(source.pricing)
          ? (source.pricing as Record<string, unknown>)
          : {}
      ),
      languageServiceDescription:
        defaultContent.pricing.languageServiceDescription,
    };

    source.contact = {
      ...(
        source.contact &&
        typeof source.contact === "object" &&
        !Array.isArray(source.contact)
          ? (source.contact as Record<string, unknown>)
          : {}
      ),
      eyebrow: defaultContent.contact.eyebrow,
      headline: defaultContent.contact.headline,
      intro: defaultContent.contact.intro,
      contactsTitle: defaultContent.contact.contactsTitle,
      calendarPlaceholder: defaultContent.contact.calendarPlaceholder,
    };

    if (Array.isArray(source.services)) {
      source.services = source.services.map((item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return item;
        const service = item as Record<string, unknown>;
        const defaultService = defaultContent.services.find(
          (candidate) => candidate.slug === service.slug,
        );

        return defaultService
          ? { ...service, asideText: defaultService.asideText }
          : service;
      });
    }

    source.schemaVersion = 12;
  }

  if (version < 13) {
    source.home = {
      ...(
        source.home &&
        typeof source.home === "object" &&
        !Array.isArray(source.home)
          ? (source.home as Record<string, unknown>)
          : {}
      ),
      examsEyebrow: defaultContent.home.examsEyebrow,
    };

    source.schemaVersion = 13;
  }

  return source;
}

function mergeWithDefaults<T>(defaults: T, value: unknown): T {
  if (Array.isArray(defaults)) {
    return (Array.isArray(value) ? value : defaults) as T;
  }

  if (defaults && typeof defaults === "object") {
    const source =
      value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
    const result: Record<string, unknown> = {};

    for (const [key, defaultValue] of Object.entries(
      defaults as Record<string, unknown>,
    )) {
      result[key] = mergeWithDefaults(defaultValue, source[key]);
    }

    return result as T;
  }

  return (typeof value === typeof defaults ? value : defaults) as T;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const db = await getD1();
    const row = await db
      .prepare("SELECT content FROM site_content WHERE id = ? LIMIT 1")
      .bind(1)
      .first<ContentRow>();
    if (!row) return defaultContent;

    return mergeWithDefaults(
      defaultContent,
      migrateLegacyContent(JSON.parse(row.content)),
    );
  } catch {
    return defaultContent;
  }
}

export async function saveSiteContent(
  content: SiteContent,
  updatedBy: string,
): Promise<void> {
  const normalized = mergeWithDefaults(defaultContent, content);
  const db = await getD1();
  await db
    .prepare(
      `INSERT INTO site_content (id, content, updated_at, updated_by)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         content = excluded.content,
         updated_at = excluded.updated_at,
         updated_by = excluded.updated_by`,
    )
    .bind(1, JSON.stringify(normalized), new Date().toISOString(), updatedBy)
    .run();
}

export function normalizeSiteContent(value: unknown): SiteContent {
  return mergeWithDefaults(defaultContent, migrateLegacyContent(value));
}
