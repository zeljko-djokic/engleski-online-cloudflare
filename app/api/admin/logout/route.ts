import { NextResponse } from "next/server";
import { EDITOR_COOKIE_NAME } from "@/app/cloudflare-auth";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/uredjivanje", request.url));
  response.cookies.set(EDITOR_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
