import { NextResponse } from "next/server";
import {
  authenticateEditorPassword,
  createEditorSessionToken,
  EDITOR_COOKIE_NAME,
  EDITOR_SESSION_SECONDS,
} from "@/app/cloudflare-auth";

const MAX_LOGIN_BYTES = 2_000;

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin && origin !== requestUrl.origin) {
    return NextResponse.json({ error: "Zahtev nije dozvoljen." }, { status: 403 });
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_LOGIN_BYTES) {
    return NextResponse.json({ error: "Zahtev je prevelik." }, { status: 413 });
  }

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Neispravan zahtev." }, { status: 400 });
  }

  const password =
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as { password?: unknown }).password === "string"
      ? (value as { password: string }).password
      : "";

  const authentication = await authenticateEditorPassword(password);
  if (authentication === "not-configured") {
    return NextResponse.json(
      { error: "Urednička lozinka još nije podešena u Cloudflare-u." },
      { status: 503 },
    );
  }
  if (authentication !== "ok") {
    return NextResponse.json(
      { error: "Lozinka nije ispravna." },
      { status: 401 },
    );
  }

  const token = await createEditorSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Prijava trenutno nije dostupna." },
      { status: 503 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(EDITOR_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: EDITOR_SESSION_SECONDS,
  });
  return response;
}
