import type { ReactNode } from "react";

const DEFAULT_MESSAGE =
  "Zdravo Željko, javljam se u vezi sa uslugama sa sajta.";

function getViberBusinessHref(href: string) {
  const value = href.trim();
  const normalizedValue = /^viber\.me\//i.test(value)
    ? `https://${value}`
    : value;

  try {
    const url = new URL(normalizedValue);

    if (url.protocol === "https:" && url.hostname === "viber.me") {
      if (!url.searchParams.get("draft")) {
        url.searchParams.set(
          "draft",
          url.searchParams.get("text")?.trim() || DEFAULT_MESSAGE,
        );
        url.searchParams.delete("text");
      }

      return url.toString();
    }

    if (url.protocol === "viber:") {
      const number = (url.searchParams.get("number") || "").replace(/\D/g, "");
      const message =
        url.searchParams.get("draft")?.trim() ||
        url.searchParams.get("text")?.trim() ||
        DEFAULT_MESSAGE;

      if (number) {
        const businessUrl = new URL(`https://viber.me/${number}`);
        businessUrl.searchParams.set("draft", message);
        return businessUrl.toString();
      }
    }
  } catch {
    return normalizedValue;
  }

  return normalizedValue;
}

export function ViberLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={getViberBusinessHref(href)}
      title="Otvorite razgovor sa Engleski Online na Viberu."
    >
      {children}
    </a>
  );
}
