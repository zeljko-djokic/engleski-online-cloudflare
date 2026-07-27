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
