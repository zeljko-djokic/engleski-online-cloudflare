import type { Metadata } from "next";
import Link from "next/link";
import {
  cloudflareSignOutPath,
  getCloudflareUser,
} from "@/app/cloudflare-auth";
import { Editor } from "@/app/uredjivanje/editor";
import { LoginForm } from "@/app/uredjivanje/login-form";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Uređivanje sajta | Engleski Online",
  robots: { index: false, follow: false },
};

export default async function EditingPage() {
  const user = await getCloudflareUser();
  if (!user) {
    return (
      <main className="editor-gate">
        <p className="eyebrow">Zaštićena stranica</p>
        <h1>Prijavite se u urednički panel.</h1>
        <p>
          Ovde možete menjati cene, tekstove, kontakt podatke, FAQ i link
          za Google kalendar.
        </p>
        <LoginForm />
        <Link href="/">Vratite se na sajt</Link>
      </main>
    );
  }

  return (
    <Editor
      initialContent={await getSiteContent()}
      userEmail={user.email}
      signOutPath={cloudflareSignOutPath()}
    />
  );
}
