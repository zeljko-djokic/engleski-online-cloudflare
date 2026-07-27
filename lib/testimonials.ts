export type TestimonialStatus = "pending" | "approved" | "rejected";

export type TestimonialRecord = {
  id: number;
  name: string;
  context: string;
  quote: string;
  status: TestimonialStatus;
  createdAt: string;
  reviewedAt: string | null;
};

type TestimonialRow = {
  id: number;
  name: string;
  context: string;
  quote: string;
  status: TestimonialStatus;
  created_at: string;
  reviewed_at: string | null;
};

type CountRow = {
  total: number;
};

async function getD1() {
  const { env } = await import("cloudflare:workers");
  if (!env.DB) throw new Error("D1 binding DB is unavailable.");
  return env.DB;
}

async function ensureTestimonialsTable(): Promise<void> {
  const db = await getD1();
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        context TEXT NOT NULL DEFAULT '',
        quote TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending'
          CHECK (status IN ('pending', 'approved', 'rejected')),
        created_at TEXT NOT NULL,
        reviewed_at TEXT,
        submitter_hash TEXT NOT NULL DEFAULT ''
      )`,
    )
    .run();
  await db
    .prepare(
      `CREATE INDEX IF NOT EXISTS testimonials_status_created_idx
       ON testimonials (status, created_at DESC)`,
    )
    .run();
}

function mapRow(row: TestimonialRow): TestimonialRecord {
  return {
    id: row.id,
    name: row.name,
    context: row.context,
    quote: row.quote,
    status: row.status,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
  };
}

export async function getApprovedTestimonials(): Promise<TestimonialRecord[]> {
  try {
    const db = await getD1();
    const result = await db
      .prepare(
        `SELECT id, name, context, quote, status, created_at, reviewed_at
         FROM testimonials
         WHERE status = 'approved'
         ORDER BY COALESCE(reviewed_at, created_at) DESC`,
      )
      .all<TestimonialRow>();
    return (result.results ?? []).map(mapRow);
  } catch {
    return [];
  }
}

export async function getAllTestimonials(): Promise<TestimonialRecord[]> {
  await ensureTestimonialsTable();
  const db = await getD1();
  const result = await db
    .prepare(
      `SELECT id, name, context, quote, status, created_at, reviewed_at
       FROM testimonials
       ORDER BY
         CASE status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
         created_at DESC`,
    )
    .all<TestimonialRow>();
  return (result.results ?? []).map(mapRow);
}

export async function createTestimonialSubmission(input: {
  name: string;
  context: string;
  quote: string;
  submitterHash: string;
}): Promise<void> {
  await ensureTestimonialsTable();
  const db = await getD1();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const count = await db
    .prepare(
      `SELECT COUNT(*) AS total
       FROM testimonials
       WHERE submitter_hash = ? AND created_at >= ?`,
    )
    .bind(input.submitterHash, since)
    .first<CountRow>();

  if ((count?.total ?? 0) >= 3) {
    throw new Error("rate-limit");
  }

  await db
    .prepare(
      `INSERT INTO testimonials
        (name, context, quote, status, created_at, reviewed_at, submitter_hash)
       VALUES (?, ?, ?, 'pending', ?, NULL, ?)`,
    )
    .bind(
      input.name,
      input.context,
      input.quote,
      new Date().toISOString(),
      input.submitterHash,
    )
    .run();
}

export async function reviewTestimonial(
  id: number,
  action: "approve" | "reject" | "delete",
): Promise<void> {
  await ensureTestimonialsTable();
  const db = await getD1();

  if (action === "delete") {
    await db.prepare("DELETE FROM testimonials WHERE id = ?").bind(id).run();
    return;
  }

  const status = action === "approve" ? "approved" : "rejected";
  await db
    .prepare(
      `UPDATE testimonials
       SET status = ?, reviewed_at = ?
       WHERE id = ?`,
    )
    .bind(status, new Date().toISOString(), id)
    .run();
}
