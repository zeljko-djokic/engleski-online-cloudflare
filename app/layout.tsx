import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Online časovi engleskog jezika | Željko Đokić",
  description:
    "Individualni online časovi engleskog, priprema za CAE, IELTS, TOEFL i SAT, kao i EN–SR prevođenje, lektura i redaktura.",
  keywords: [
    "online časovi engleskog",
    "individualni časovi engleskog",
    "CAE priprema",
    "IELTS priprema",
    "prevod engleski srpski",
    "Željko Đokić",
  ],
  openGraph: {
    title: "Engleski Online — Željko Đokić",
    description:
      "Individualni online časovi i stručne jezičke usluge prilagođene vašem cilju.",
    locale: "sr_RS",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body>{children}</body>
    </html>
  );
}
