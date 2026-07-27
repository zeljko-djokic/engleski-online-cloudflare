import { NextResponse } from "next/server";
import { getCloudflareUser } from "@/app/cloudflare-auth";
import { getSiteContent, normalizeSiteContent, saveSiteContent } from "@/lib/site-content";

const OWNER_EMAIL = "zeljko.d.djokic@gmail.com";
const MAX_CONTENT_BYTES = 250_000;

async function authorize() {
  const user = await getCloudflareUser();
  return user?.email.toLowerCase() === OWNER_EMAIL ? user : null;
}

export async function GET() {
  const user = await authorize();
  if (!user) return NextResponse.json({ error: "Nemate pristup." }, { status: 403 });
  return NextResponse.json(await getSiteContent());
}

export async function POST(request: Request) {
  const user = await authorize();
  if (!user) return NextResponse.json({ error: "Nemate pristup." }, { status: 403 });

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_CONTENT_BYTES) {
    return NextResponse.json({ error: "Sadržaj je prevelik." }, { status: 413 });
  }

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Neispravan sadržaj." }, { status: 400 });
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return NextResponse.json({ error: "Neispravan sadržaj." }, { status: 400 });
  }

  const content = normalizeSiteContent(value);
  await saveSiteContent(content, user.email);
  return NextResponse.json({ ok: true, content });
}
