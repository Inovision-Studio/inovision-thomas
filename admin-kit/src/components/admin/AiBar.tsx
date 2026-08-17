"use client";

import { useState } from "react";
import { useConfirm, useToast } from "./Dialogs";
import { inputClass } from "./ui";

export type AiPatch = Partial<{ title: string; slug: string; excerpt: string; body: string; tags: string[]; image: string }>;

type Snapshot = { title: string; slug: string; excerpt: string; body: string; tags: string[]; image: string };

const TONES = ["casual", "hype", "informative", "professional"] as const;
const STYLES = [
  ["product", "Product shot"],
  ["lifestyle", "Shop lifestyle"],
  ["abstract", "Abstract smoke"],
] as const;

/**
 * AI actions for the post editor. Results are applied to the form fields via
 * onApply (never saved on their own); "Undo" restores the last snapshot.
 */
export default function AiBar({
  current,
  onApply,
}: {
  current: Snapshot;
  onApply: (patch: AiPatch) => void;
}) {
  const toast = useToast();
  const confirm = useConfirm();
  const [busy, setBusy] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("casual");
  const [style, setStyle] = useState<(typeof STYLES)[number][0]>("abstract");
  const [prev, setPrev] = useState<Snapshot | null>(null);

  async function run(label: string, url: string, payload: Record<string, unknown>) {
    if (busy) return;
    setBusy(label);
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast(data?.error || "AI request failed.", "error");
        return null;
      }
      return data as Record<string, unknown>;
    } catch {
      toast("Connection problem — try again.", "error");
      return null;
    } finally {
      setBusy(null);
    }
  }

  async function text(action: string, extra: Record<string, unknown> = {}) {
    const data = await run(action, "/api/admin/ai/blog", {
      action,
      topic,
      title: current.title,
      body: current.body,
      tone,
      ...extra,
    });
    if (!data) return;
    setPrev(current);
    onApply(data as AiPatch);
    toast("Applied — review before saving. Undo is available.");
  }

  async function image() {
    if (!current.title.trim()) {
      toast("Give the post a title first — it drives the image.", "error");
      return;
    }
    const ok = await confirm({
      title: current.image ? "Generate a new cover image?" : "Generate a cover image?",
      body: "Uses Gemini image generation — roughly 4¢ per image. It's saved to your image library either way.",
      confirmLabel: "Generate",
    });
    if (!ok) return;
    const data = await run("image", "/api/admin/ai/image", { title: current.title, excerpt: current.excerpt, style });
    if (!data?.ref) return;
    setPrev(current);
    onApply({ image: String(data.ref) });
    toast("Cover image ready — it's set on the post (save to keep it).");
  }

  function undo() {
    if (!prev) return;
    onApply(prev);
    setPrev(null);
    toast("Reverted the last AI change.");
  }

  const B = ({ id, children, onClick, accent = false }: { id: string; children: React.ReactNode; onClick: () => void; accent?: boolean }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={!!busy}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
        accent ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] hover:bg-[var(--accent)]/25" : "border-white/15 text-white/80 hover:border-white/30 hover:bg-white/5"
      }`}
    >
      {busy === id ? <span className="inline-block animate-pulse">…thinking</span> : children}
    </button>
  );

  return (
    <div className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold tracking-widest text-black">AI</span>
        <span className="text-xs text-white/60">Draft, polish or illustrate this post. Nothing is saved until you click Save.</span>
        {prev ? (
          <button type="button" onClick={undo} className="ml-auto rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:bg-white/5">
            ↶ Undo last AI change
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic — e.g. new glass drop this week, how to pick a disposable, kratom 101"
          className={`${inputClass} text-sm`}
        />
        <B id="draft" onClick={() => text("draft")} accent>
          ✦ Draft from topic
        </B>
        <B id="outline" onClick={() => text("outline")}>
          Outline
        </B>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <B id="improve" onClick={() => text("improve")}>Improve</B>
        <B id="expand" onClick={() => text("expand")}>Expand</B>
        <B id="shorten" onClick={() => text("shorten")}>Shorten</B>
        <span className="mx-1 h-4 w-px bg-white/15" />
        <select value={tone} onChange={(e) => setTone(e.target.value as (typeof TONES)[number])} className="rounded-full border border-white/15 bg-black/40 px-2 py-1 text-xs capitalize">
          {TONES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <B id="rewrite" onClick={() => text("rewrite")}>Rewrite in tone</B>
        <span className="mx-1 h-4 w-px bg-white/15" />
        <B id="headline" onClick={() => text("headline")}>Headline + tags</B>
        <B id="seo" onClick={() => text("seo")}>SEO excerpt</B>
        <span className="mx-1 h-4 w-px bg-white/15" />
        <select value={style} onChange={(e) => setStyle(e.target.value as (typeof STYLES)[number][0])} className="rounded-full border border-white/15 bg-black/40 px-2 py-1 text-xs">
          {STYLES.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <B id="image" onClick={image} accent>
          🖼 {current.image ? "Regenerate cover" : "Generate cover"}
        </B>
      </div>
    </div>
  );
}
