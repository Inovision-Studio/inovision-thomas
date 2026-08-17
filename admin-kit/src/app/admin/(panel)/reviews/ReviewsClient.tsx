"use client";
import { useConfirm, useToast } from "@/components/admin/Dialogs";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";

type Review = { id: number; name: string; stars: number; text: string; sort: number };

const empty: Review = { id: 0, name: "", stars: 5, text: "", sort: 0 };

export default function ReviewsClient({ reviews }: { reviews: Review[] }) {
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();
  const [form, setForm] = useState<Review>(empty);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function set<K extends keyof Review>(key: K, value: Review[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setBusy(true);
    setErr("");
    const res = await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", ...form, id: form.id || undefined }),
    });
    setBusy(false);
    if (!res.ok) {
      setErr((await res.json().catch(() => ({}))).error || "Save failed");
      return;
    }
    setForm(empty);
    router.refresh();
  }

  async function del(id: number) {
    if (!(await confirm({ title: "Delete this review?", confirmLabel: "Delete", danger: true }))) return;
    await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    if (form.id === id) setForm(empty);
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-3">
        {reviews.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-display text-lg">{r.name}</div>
                <div className="text-[var(--accent)]">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
                <p className="mt-1 text-sm text-white/70">{r.text}</p>
              </div>
              <div className="shrink-0 text-right text-sm">
                <button onClick={() => setForm(r)} className="text-[var(--accent)] hover:underline">
                  Edit
                </button>
                <button onClick={() => del(r.id)} className="ml-3 text-red-400 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          </Card>
        ))}
        {reviews.length === 0 && <Card><p className="text-white/40">No reviews yet.</p></Card>}
      </div>

      <Card>
        <h2 className="mb-4 font-display text-xl">{form.id ? "Edit review" : "New review"}</h2>
        <div className="flex flex-col gap-3">
          <input className={inputClass} placeholder="Name" value={form.name} onChange={(e) => set("name", e.target.value)} />
          <label className="text-sm text-white/60">
            Stars
            <select className={`${inputClass} mt-1`} value={form.stars} onChange={(e) => set("stars", Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <textarea className={`${inputClass} min-h-24`} placeholder="Review text" value={form.text} onChange={(e) => set("text", e.target.value)} />
          <label className="text-sm text-white/60">
            Sort
            <input type="number" className={`${inputClass} mt-1`} value={form.sort} onChange={(e) => set("sort", Number(e.target.value))} />
          </label>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <div className="flex gap-2">
            <button onClick={save} disabled={busy} className="btn-accent text-sm">
              {busy ? "Saving…" : form.id ? "Update" : "Add review"}
            </button>
            {form.id > 0 && (
              <button onClick={() => setForm(empty)} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5">
                Cancel
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
