"use client";

import { useState } from "react";
import type { TestimonialSectionContent } from "@/lib/content-model";

type FormStatus = "idle" | "sending" | "success" | "error";

export function TestimonialForm({
  content,
}: {
  content: TestimonialSectionContent;
}) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");
    setMessage("Slanje...");

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          context: formData.get("context"),
          quote: formData.get("quote"),
          website: formData.get("website"),
          consent: formData.get("consent") === "yes",
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(result.error ?? "Slanje nije uspelo.");
      }

      form.reset();
      setStatus("success");
      setMessage(content.successMessage);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Slanje nije uspelo.",
      );
    }
  }

  return (
    <form className="testimonial-form" onSubmit={submit}>
      <div className="testimonial-form-heading">
        <h3>{content.formTitle}</h3>
        <p>{content.formIntro}</p>
      </div>
      <label>
        <span>{content.nameLabel}</span>
        <input
          name="name"
          maxLength={80}
          minLength={2}
          autoComplete="name"
          required
        />
      </label>
      <label>
        <span>{content.contextLabel}</span>
        <input name="context" maxLength={120} />
      </label>
      <label>
        <span>{content.quoteLabel}</span>
        <textarea name="quote" minLength={20} maxLength={1200} rows={6} required />
      </label>
      <label className="testimonial-honeypot" aria-hidden="true">
        <span>Veb-sajt</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="testimonial-consent">
        <input name="consent" type="checkbox" value="yes" required />
        <span>
          {content.consentLabel}{" "}
          <a href="/politika-privatnosti">Pročitajte Politiku privatnosti.</a>
        </span>
      </label>
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Slanje..." : content.submitLabel}
      </button>
      <p
        className={`testimonial-form-status ${status}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  );
}
