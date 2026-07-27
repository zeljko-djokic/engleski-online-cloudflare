import { NextResponse } from "next/server";
import { createTestimonialSubmission } from "@/lib/testimonials";

const MAX_BODY_BYTES = 8_000;

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string"
    ? value.trim().replace(/\u0000/gu, "").slice(0, maxLength)
    : "";
}

async function createSubmitterHash(request: Request): Promise<string> {
  const address =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const bytes = new TextEncoder().encode(`${address}:${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Poruka je prevelika." },
      { status: 413 },
    );
  }

  let value: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("invalid");
    }
    value = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "Podaci nisu ispravni." },
      { status: 400 },
    );
  }

  if (cleanText(value.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = cleanText(value.name, 80);
  const context = cleanText(value.context, 120);
  const quote = cleanText(value.quote, 1_200);
  const consent = value.consent === true;

  if (name.length < 2) {
    return NextResponse.json(
      { error: "Unesite ime ili inicijale." },
      { status: 400 },
    );
  }
  if (quote.length < 20) {
    return NextResponse.json(
      { error: "Utisak treba da sadrži najmanje 20 znakova." },
      { status: 400 },
    );
  }
  if (!consent) {
    return NextResponse.json(
      { error: "Potrebna je saglasnost za objavljivanje." },
      { status: 400 },
    );
  }

  try {
    await createTestimonialSubmission({
      name,
      context,
      quote,
      submitterHash: await createSubmitterHash(request),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "rate-limit") {
      return NextResponse.json(
        { error: "Dostigli ste dnevni broj prijava. Pokušajte sutra." },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: "Slanje trenutno nije uspelo. Pokušajte ponovo." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
