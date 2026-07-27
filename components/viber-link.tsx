"use client";

import type { ReactNode } from "react";

function getViberLinkParts(href: string) {
  try {
    const url = new URL(href);
    const message = url.searchParams.get("text")?.trim() || "";

    // Viber does not reliably support the text parameter on personal-chat
    // links. Keep it only as the editable message source and launch the clean
    // contact link so the app opens without waiting for an async clipboard call.
    url.searchParams.delete("text");

    return {
      message,
      launchHref: url.toString(),
    };
  } catch {
    return {
      message: "",
      launchHref: href,
    };
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
  const { launchHref, message } = getViberLinkParts(href);

  function handleClick() {
    if (!message) return;

    // Run synchronously inside the user's click. The anchor's normal action
    // then opens Viber immediately, preserving the browser's user activation.
    try {
      copyWithTextarea(message);
    } catch {
      void navigator.clipboard?.writeText(message).catch(() => undefined);
    }
  }

  return (
    <a
      href={launchHref}
      onClick={handleClick}
      title="Pripremljena poruka će biti kopirana — nalepite je u Viber razgovor."
    >
      {children}
    </a>
  );
}
