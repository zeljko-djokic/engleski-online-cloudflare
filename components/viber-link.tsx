"use client";

import type { MouseEvent, ReactNode } from "react";

function getPrefilledMessage(href: string) {
  try {
    return new URL(href).searchParams.get("text")?.trim() || "";
  } catch {
    return "";
  }
}

function copyWithTextarea(message: string) {
  const textarea = document.createElement("textarea");
  textarea.value = message;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function ViberLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const message = getPrefilledMessage(href);
    if (!message) return;

    event.preventDefault();

    try {
      await navigator.clipboard.writeText(message);
    } catch {
      copyWithTextarea(message);
    }

    window.location.href = href;
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      title="Pripremljena poruka će biti kopirana — nalepite je u Viber razgovor."
    >
      {children}
    </a>
  );
}
