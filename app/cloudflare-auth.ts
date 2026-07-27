import { cookies, headers } from "next/headers";
import { env } from "cloudflare:workers";

export type CloudflareUser = {
  displayName: string;
  email: string;
};

export const OWNER_EMAIL = "zeljko.d.djokic@gmail.com";
export const EDITOR_COOKIE_NAME = "engleski_online_editor";
export const EDITOR_SESSION_SECONDS = 60 * 60 * 8;

const ACCESS_EMAIL_HEADER = "cf-access-authenticated-user-email";
const encoder = new TextEncoder();

type EditorEnvironment = {
  EDITOR_PASSWORD?: string;
};

async function getEditorPassword(): Promise<string | null> {
  const password = (env as unknown as EditorEnvironment).EDITOR_PASSWORD;
  return typeof password === "string" && password.length >= 12
    ? password
    : null;
}

function toBase64Url(value: ArrayBuffer): string {
  const bytes = new Uint8Array(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
}

function fromBase64Url(value: string): Uint8Array | null {
  try {
    const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

async function importSigningKey(password: string): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(`engleski-online-editor:${password}`),
  );
  return crypto.subtle.importKey(
    "raw",
    digest,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(value: string, password: string): Promise<string> {
  const key = await importSigningKey(password);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value),
  );
  return toBase64Url(signature);
}

async function verifySessionToken(token: string): Promise<boolean> {
  const password = await getEditorPassword();
  if (!password) return false;

  const [expiresAtRaw, signatureRaw, extra] = token.split(".");
  if (!expiresAtRaw || !signatureRaw || extra) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) return false;

  const signature = fromBase64Url(signatureRaw);
  if (!signature) return false;

  const key = await importSigningKey(password);
  return crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    encoder.encode(expiresAtRaw),
  );
}

async function equalPassword(candidate: string, expected: string): Promise<boolean> {
  const [candidateDigest, expectedDigest] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const left = new Uint8Array(candidateDigest);
  const right = new Uint8Array(expectedDigest);
  let difference = left.length ^ right.length;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

export async function getCloudflareUser(): Promise<CloudflareUser | null> {
  const requestHeaders = await headers();
  const email = requestHeaders.get(ACCESS_EMAIL_HEADER)?.trim();
  if (email?.toLowerCase() === OWNER_EMAIL) {
    return {
      displayName: email,
      email,
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(EDITOR_COOKIE_NAME)?.value;
  if (!token || !(await verifySessionToken(token))) return null;

  return { displayName: OWNER_EMAIL, email: OWNER_EMAIL };
}

export async function authenticateEditorPassword(
  candidate: string,
): Promise<"ok" | "invalid" | "not-configured"> {
  const password = await getEditorPassword();
  if (!password) return "not-configured";
  return (await equalPassword(candidate, password)) ? "ok" : "invalid";
}

export async function createEditorSessionToken(): Promise<string | null> {
  const password = await getEditorPassword();
  if (!password) return null;

  const expiresAt = String(Date.now() + EDITOR_SESSION_SECONDS * 1000);
  return `${expiresAt}.${await sign(expiresAt, password)}`;
}

export function cloudflareSignOutPath(): string {
  return "/api/admin/logout";
}
