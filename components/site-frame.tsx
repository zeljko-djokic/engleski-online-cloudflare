import Link from "next/link";
import type { SiteContent } from "@/lib/content-model";
import { ViberLink } from "@/components/viber-link";

export function Arrow() {
  return (
    <span className="arrow" aria-hidden="true">
      →
    </span>
  );
}

export function ExamBadge({
  slug,
  label,
  title,
}: {
  slug: string;
  label: string;
  title: string;
}) {
  const family = slug.startsWith("c1-") || slug.startsWith("c2-")
    ? "cambridge"
    : slug.startsWith("ielts")
      ? "ielts"
      : slug.startsWith("toefl")
        ? "toefl"
        : "sat";
  const monogram = family === "cambridge"
    ? title.startsWith("C2") ? "C2" : "C1"
    : family.toUpperCase();

  return (
    <span className={`exam-badge exam-badge-${family}`} aria-label={`${title} priprema`}>
      <strong aria-hidden="true">{monogram}</strong>
      <span>{family === "cambridge" ? "Cambridge English" : label}</span>
    </span>
  );
}

export function SiteHeader({ content }: { content: SiteContent }) {
  const { labels } = content;
  return (
    <>
      <a className="skip-link" href="#sadrzaj">
        {labels.skipLink}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="wordmark" href="/">
            {labels.brandName}
          </Link>
          <nav className="desktop-nav" aria-label="Glavna navigacija">
            <Link href="/">{labels.navigationHome}</Link>
            <Link href="/kursevi">{labels.navigationCourses}</Link>
            <Link href="/ispiti">{labels.navigationExams}</Link>
            <Link href="/usluge">{labels.navigationServices}</Link>
            <Link href="/#o-meni">{labels.navigationAbout}</Link>
            <Link href="/#utisci">{labels.navigationTestimonials}</Link>
            <Link href="/#kontakt">{labels.navigationContact}</Link>
          </nav>
          <Link className="header-cta" href="/#kontakt">
            {labels.headerCta}
          </Link>
          <details className="mobile-menu">
            <summary>{labels.mobileMenu}</summary>
            <nav aria-label="Mobilna navigacija">
              <Link href="/kursevi">{labels.navigationCourses}</Link>
              <Link href="/ispiti">{labels.navigationExams}</Link>
              <Link href="/usluge">{labels.navigationServices}</Link>
              <Link href="/#o-meni">{labels.navigationAbout}</Link>
              <Link href="/#utisci">{labels.navigationTestimonials}</Link>
              <Link href="/#kontakt">{labels.navigationContact}</Link>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}

export function ContactSection({ content }: { content: SiteContent }) {
  const { global, contact, labels } = content;
  return (
    <section className="contact-section" id="kontakt">
      <div className="shell contact-layout">
        <div>
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2>{contact.headline}</h2>
          <p>{contact.intro}</p>
          {global.calendarUrl ? (
            <a
              className="calendar-button"
              href={global.calendarUrl}
              target="_blank"
              rel="noreferrer"
            >
              {global.calendarLabel} <Arrow />
            </a>
          ) : (
            <div className="calendar-placeholder">
              <span>{labels.calendarProviderLabel}</span>
              <strong>{contact.calendarPlaceholder}</strong>
            </div>
          )}
        </div>
        <div className="contact-actions">
          <a
            className="contact-primary"
            href={`mailto:${global.email}?subject=${encodeURIComponent(labels.contactMailSubject)}`}
          >
            <span>{contact.emailLabel}</span>
            <strong>{global.email}</strong>
            <Arrow />
          </a>
          <a href={global.whatsappUrl} target="_blank" rel="noreferrer">
            <span>{contact.whatsappLabel}</span>
            <strong>{global.phoneDisplay}</strong>
            <Arrow />
          </a>
          <ViberLink href={global.viberUrl}>
            <span>{contact.viberLabel}</span>
            <strong>{global.phoneDisplay}</strong>
            <Arrow />
          </ViberLink>
          <a href={`tel:${global.phoneLink}`}>
            <span>{contact.phoneLabel}</span>
            <strong>{global.phoneDisplay}</strong>
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter({ content }: { content: SiteContent }) {
  const { global, labels } = content;
  const bookingUrl = global.calendarUrl || "/#kontakt";
  const bookingIsExternal = Boolean(global.calendarUrl);

  return (
    <>
      <footer className="site-footer">
        <div className="shell">
          <Link className="wordmark" href="/">
            {labels.brandName}
          </Link>
          <p>{labels.footerTagline}</p>
          <p>{labels.footerCopyright}</p>
        </div>
      </footer>
      <nav className="mobile-sticky-cta" aria-label="Brzi kontakt">
        <a href={global.whatsappUrl} target="_blank" rel="noreferrer">
          <span aria-hidden="true">◉</span>
          {labels.mobileCtaWhatsApp}
        </a>
        <ViberLink href={global.viberUrl}>
          <span aria-hidden="true">◇</span>
          {labels.mobileCtaViber}
        </ViberLink>
        <a
          className="mobile-sticky-primary"
          href={bookingUrl}
          target={bookingIsExternal ? "_blank" : undefined}
          rel={bookingIsExternal ? "noreferrer" : undefined}
        >
          {labels.mobileCtaBooking}
          <Arrow />
        </a>
      </nav>
    </>
  );
}
