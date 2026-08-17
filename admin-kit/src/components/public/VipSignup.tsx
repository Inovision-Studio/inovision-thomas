"use client";

import { useState } from "react";

export default function VipSignup() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/vip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || "Something went wrong — try again.");
        setState("idle");
        return;
      }
      setMessage(
        data?.already
          ? "You're already on the list — see you in the shop."
          : data?.coupon
            ? `You're in! Show code ${data.coupon} at the counter.`
            : "You're in! Watch your inbox for drops and deals.",
      );
      setState("done");
    } catch {
      setError("Connection problem — try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <p className="mt-6 rounded-xl border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 px-4 py-3 text-center font-semibold text-[color:var(--accent)]">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        name="email"
        type="email"
        required
        maxLength={120}
        placeholder="you@email.com"
        aria-label="Email address"
        className="min-w-0 flex-1 rounded-full border border-white/15 bg-black/40 px-5 py-3 text-[color:var(--text)] outline-none ring-[color:var(--accent)] placeholder:text-[color:var(--muted)] focus:ring-2"
      />
      <button type="submit" disabled={state === "sending"} className="btn-accent shrink-0 disabled:opacity-60">
        {state === "sending" ? "Joining…" : "Join the list"}
      </button>
      {error ? <p className="text-sm text-red-300 sm:hidden">{error}</p> : null}
    </form>
  );
}
