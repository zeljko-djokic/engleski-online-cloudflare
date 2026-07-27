import { defaultContent, type SiteContent } from "@/lib/content-model";

type ContentRow = {
  content: string;
};

async function getD1() {
  const { env } = await import("cloudflare:workers");
  if (!env.DB) throw new Error("D1 binding DB is unavailable.");
  return env.DB;
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

    return mergeWithDefaults(defaultContent, JSON.parse(row.content));
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
  return mergeWithDefaults(defaultContent, value);
}
