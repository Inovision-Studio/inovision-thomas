"use client";

import { useEffect, useState } from "react";

type Prize = { id: number; label: string; discount: string };
type Won = { code: string; label: string; discount: string; already?: boolean };

const STORAGE_KEY = "sb_spin_won";
const SPINS = 5; // full rotations before landing, so it reads as a real spin

export default function SpinToWin() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [won, setWon] = useState<Won | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/spin")
      .then((r) => r.json())
      .then((d) => setPrizes(d.prizes ?? []))
      .catch(() => {});
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setWon(JSON.parse(saved));
    } catch {
      // storage blocked — they can still spin, the server dedupes by email
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // nothing to give away → don't advertise a wheel
  if (prizes.length === 0) return null;

  const seg = 360 / prizes.length;

  async function spin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (spinning) return;
    const email = new FormData(e.currentTarget).get("email");
    setError("");
    setSpinning(true);
    try {
      const res = await fetch("/api/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok) {
        setError(d?.error || "Something went wrong — try again.");
        setSpinning(false);
        return;
      }
      // land the middle of the winning segment under the pointer at the top
      const target = SPINS * 360 - (d.index * seg + seg / 2);
      setAngle(target);
      setTimeout(() => {
        const result = { code: d.code, label: d.label, discount: d.discount, already: d.already };
        setWon(result);
        setSpinning(false);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        } catch {}
      }, 4200);
    } catch {
      setError("Connection problem — try again.");
      setSpinning(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        data-track="spin:open"
        className="fixed bottom-[76px] left-4 z-[88] flex items-center gap-2 rounded-full border border-[color:var(--accent)]/50 bg-[#0c100c] px-4 py-2.5 text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 lg:bottom-5"
      >
        <span aria-hidden="true">🎰</span>
        {won ? "Your prize" : "Spin to Win"}
      </button>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="spin-title"
          className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/85 p-5"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c100c] p-6 text-center">
            <h2 id="spin-title" className="font-display text-3xl leading-none">
              {won ? "Your prize" : "Spin to Win"}
            </h2>

            <div className="relative mx-auto mt-6 aspect-square w-full max-w-[260px]">
              {/* pointer */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-x-8 border-t-[14px] border-x-transparent border-t-[color:var(--accent)]"
              />
              <div
                className="h-full w-full rounded-full border-4 border-[color:var(--accent)]/60"
                style={{
                  transform: `rotate(${angle}deg)`,
                  transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.2, 1)" : "none",
                  background: `conic-gradient(${prizes
                    .map((_, i) => {
                      const c = i % 2 === 0 ? "var(--accent)" : "#141814";
                      return `${c} ${i * seg}deg ${(i + 1) * seg}deg`;
                    })
                    .join(", ")})`,
                }}
              >
                {prizes.map((p, i) => (
                  <span
                    key={p.id}
                    className="absolute left-1/2 top-1/2 origin-left text-[10px] font-bold uppercase tracking-wide"
                    style={{
                      // conic-gradient measures from 12 o'clock, but a CSS rotate on a
                      // left-origin element starts at 3 o'clock — without the -90 the
                      // labels sit a quarter turn away from their own segment.
                      transform: `rotate(${i * seg + seg / 2 - 90}deg) translateX(28px)`,
                      color: i % 2 === 0 ? "#04120a" : "#f4f6f4",
                      width: "88px",
                    }}
                  >
                    {p.discount || p.label}
                  </span>
                ))}
              </div>
            </div>

            {won ? (
              <div className="mt-6">
                <p className="font-display text-2xl text-[color:var(--accent)]">{won.discount || won.label}</p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  {won.already ? "You already claimed this one." : "Show this code at the counter:"}
                </p>
                <p className="mt-3 rounded-xl border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 px-4 py-3 font-display text-2xl tracking-widest text-[color:var(--accent)]">
                  {won.code}
                </p>
                <button type="button" onClick={() => setIsOpen(false)} className="btn-ghost mt-5 w-full text-sm">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={spin} className="mt-6 grid gap-3">
                <p className="text-sm text-[color:var(--muted)]">
                  One spin per person. Enter your email and we&apos;ll send the code too.
                </p>
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={120}
                  placeholder="you@email.com"
                  aria-label="Email address"
                  className="rounded-full border border-white/15 bg-black/40 px-4 py-2.5 text-center outline-none ring-[color:var(--accent)] focus:ring-2"
                />
                {error ? <p className="text-sm text-red-300">{error}</p> : null}
                <button type="submit" disabled={spinning} className="btn-accent disabled:opacity-60">
                  {spinning ? "Spinning…" : "Spin the wheel"}
                </button>
                <button type="button" onClick={() => setIsOpen(false)} className="text-sm text-[color:var(--muted)] hover:text-white">
                  No thanks
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
