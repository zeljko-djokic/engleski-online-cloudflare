import { headers } from "next/headers";

export type CloudflareUser = {
  displayName: string;
  email: string;
};

const ACCESS_EMAIL_HEADER = "cf-access-authenticated-user-email";

export async function getCloudflareUser(): Promise<CloudflareUser | null> {
  const requestHeaders = await headers();
  const email = requestHeaders.get(ACCESS_EMAIL_HEADER)?.trim();
  if (!email) return null;

  return {
    displayName: email,
    email,
  };
}

export function cloudflareSignOutPath(): string {
  return "/cdn-cgi/access/logout";
}
