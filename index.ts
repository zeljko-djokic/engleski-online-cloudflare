import Link from "next/link";
import type { SiteContent } from "@/lib/content-model";

export function Arrow() {
  return (
    <span className="arrow" aria-hidden="true">
      →
    </span>
  );
}

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#sadrzaj">
        Pređite na glavni sadržaj
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="wordmark" href="/" aria-label="Engleski Online — početna">
            Engleski Online
          </Link>
          <nav className="desktop-nav" aria-label="Glavna navigacija">
            <Link href="/">Početna</Link>
            <Link href="/kursevi">Kursevi</Link>
            <Link href="/ispiti">Ispiti</Link>
            <Link href="/usluge">Jezičke usluge</Link>
            <Link href="/#o-meni">O meni</Link>
            <Link href="/#kontakt">Kontakt</Link>
          </nav>
          <Link className="header-cta" href="/#kontakt">
            Zakažite razgovor
          </Link>
          <details className="mobile-menu">
            <summary aria-label="Otvorite navigaciju">Meni</summary>
            <nav aria-label="Mobilna navigacija">
              <Link href="/kursevi">Kursevi</Link>
              <Link href="/ispiti">Ispiti</Link>
              <Link href="/usluge">Jezičke usluge</Link>
              <Link href="/#o-meni">O meni</Link>
              <Link href="/#kontakt">Kontakt</Link>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}

export function ContactSection({ content }: { content: SiteContent }) {
  const { global, contact } = content;
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
              <span>Google Calendar</span>
              <strong>{contact.calendarPlaceholder}</strong>
            </div>
          )}
        </div>
        <div className="contact-actions">
          <a
            className="contact-primary"
            href={`mailto:${global.email}?subject=Upit%20sa%20sajta%20Engleski%20Online`}
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

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <Link className="wordmark" href="/">
          Engleski Online
        </Link>
        <p>Individualna nastava i stručne jezičke usluge.</p>
        <p>© 2026 Željko Đokić</p>
      </div>
    </footer>
  );
}
