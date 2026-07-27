import type { Metadata } from "next";
import Link from "next/link";
import {
  cloudflareSignOutPath,
  getCloudflareUser,
} from "@/app/cloudflare-auth";
import { Editor } from "@/app/uredjivanje/editor";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Uređivanje sajta | Engleski Online",
  robots: { index: false, follow: false },
};

const OWNER_EMAIL = "zeljko.d.djokic@gmail.com";

export default async function EditingPage() {
  const user = await getCloudflareUser();
  if (!user || user.email.toLowerCase() !== OWNER_EMAIL) {
    return (
      <main className="editor-gate">
        <p className="eyebrow">Zaštićena stranica</p>
        <h1>Pristup uredničkom panelu nije odobren.</h1>
        <p>
          Prijavite se Cloudflare Access nalogom
          {" "}zeljko.d.djokic@gmail.com.
        </p>
        {user ? <p>Trenutno ste prijavljeni kao {user.email}.</p> : null}
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
