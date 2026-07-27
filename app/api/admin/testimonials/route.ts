import { NextResponse } from "next/server";
import { getCloudflareUser, OWNER_EMAIL } from "@/app/cloudflare-auth";
import {
  getAllTestimonials,
  reviewTestimonial,
} from "@/lib/testimonials";

async function authorize() {
  const user = await getCloudflareUser();
  return user?.email.toLowerCase() === OWNER_EMAIL ? user : null;
}

export async function GET() {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Nemate pristup." }, { status: 403 });
  }
  return NextResponse.json({ testimonials: await getAllTestimonials() });
}

export async function POST(request: Request) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Nemate pristup." }, { status: 403 });
  }

  let value: Record<string, unknown>;
  try {
    const parsed = (await request.json()) as unknown;
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

  const id = Number(value.id);
  const action = value.action;
  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    (action !== "approve" && action !== "reject" && action !== "delete")
  ) {
    return NextResponse.json(
      { error: "Zahtev nije ispravan." },
      { status: 400 },
    );
  }

  await reviewTestimonial(id, action);
  return NextResponse.json({ testimonials: await getAllTestimonials() });
}
