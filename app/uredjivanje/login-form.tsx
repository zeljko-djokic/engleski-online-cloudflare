"use client";

import { useState, type FormEvent } from "react";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("Prijavljivanje...");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Prijava nije uspela.");
      window.location.reload();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Prijava nije uspela.",
      );
    }
  };

  return (
    <form className="editor-login" onSubmit={submit}>
      <label htmlFor="editor-password">Urednička lozinka</label>
      <div>
        <input
          id="editor-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          minLength={12}
          required
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Prijavljivanje..." : "Prijavite se"}
        </button>
      </div>
      {message ? (
        <p className={status === "error" ? "editor-login-error" : undefined}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
