"use client";

import { useState } from "react";

/** "Reserve for pickup" — name + phone, one product, no payment. Lands in Admin → Orders. */
export default function ReserveForm({ slug, name, phone }: { slug: string; name: string; phone: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: fd.get("customer"),
          phone: fd.get("phone"),
          note: fd.get("note"),
          items: [{ slug, qty: Number(fd.get("qty") || 1) }],
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || "Something went wrong — try again.");
        setState("idle");
        return;
      }
      setOrderId(data?.id ?? null);
      setState("done");
    } catch {
      setError("Connection problem — try again.");
      setState("idle");
    }
  }

  const field =
    "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-[color:var(--text)] outline-none ring-[color:var(--accent)] placeholder:text-[color:var(--muted)] focus:ring-2";

  if (state === "done") {
    return (
      <div className="mt-8 rounded-2xl border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 p-5">
        <p className="font-display text-2xl">Reserved{orderId ? ` — #${orderId}` : ""} ✓</p>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          We&apos;ve got <span className="text-[color:var(--text)]">{name}</span> on hold for you. Ask for it at the counter — pay when you pick up.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
      <p className="font-medium">Reserve for pickup</p>
      <p className="mt-1 text-sm text-[color:var(--muted)]">We&apos;ll hold it at the counter. Pay in store — no online payment.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_5rem]">
        <input name="customer" required maxLength={80} placeholder="Your name" aria-label="Your name" className={field} data-track="reserve:start" />
        <input name="phone" required type="tel" maxLength={30} placeholder="Phone" aria-label="Phone" className={field} />
        <input name="qty" type="number" min={1} max={10} defaultValue={1} aria-label="Quantity" className={field} />
      </div>
      <input name="note" maxLength={300} placeholder="Flavor / color / anything we should know (optional)" aria-label="Note" className={`${field} mt-3`} />
      {error ? <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p> : null}
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="submit" disabled={state === "sending"} className="btn-accent disabled:opacity-60">
          {state === "sending" ? "Reserving…" : "Reserve it"}
        </button>
        {phone ? (
          <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="btn-ghost">
            or call {phone}
          </a>
        ) : null}
      </div>
    </form>
  );
}
