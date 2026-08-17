"use client";

import { useState } from "react";

const field =
  "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-[color:var(--text)] outline-none ring-[color:var(--accent)] placeholder:text-[color:var(--muted)] focus:ring-2";

export default function ApplyForm({ positions = [] }: { positions?: string[] }) {
  const options = [...positions, "Any"];
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setState("sending");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd)),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || "Something went wrong — try again.");
        setState("idle");
        return;
      }
      setState("sent");
    } catch {
      setError("Connection problem — try again.");
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div className="card mt-6 p-6 text-center">
        <p className="font-display text-2xl">Application received</p>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Thanks! We&apos;ll reach out if you&apos;re a fit for the crew.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-sm text-[color:var(--muted)]">Name *</span>
          <input name="name" required maxLength={80} className={field} placeholder="Your name" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-[color:var(--muted)]">Position</span>
          <select name="position" className={field} defaultValue="Any">
            {options.map((p) => (
              <option key={p} value={p} className="bg-[#0c100c]">
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-[color:var(--muted)]">Email</span>
          <input name="email" type="email" maxLength={120} className={field} placeholder="you@email.com" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-[color:var(--muted)]">Phone</span>
          <input name="phone" type="tel" maxLength={30} className={field} placeholder="(586) 000-0000" />
        </label>
      </div>
      <label className="grid gap-1">
        <span className="text-sm text-[color:var(--muted)]">Tell us about yourself</span>
        <textarea name="message" rows={4} maxLength={1000} className={field} placeholder="Availability, experience, anything else…" />
      </label>

      <p className="text-xs text-[color:var(--muted)]">Add an email or phone so we can reach you.</p>
      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>
      ) : null}

      <button type="submit" disabled={state === "sending"} className="btn-accent mt-1 w-full sm:w-auto">
        {state === "sending" ? "Sending…" : "Submit application"}
      </button>
    </form>
  );
}
