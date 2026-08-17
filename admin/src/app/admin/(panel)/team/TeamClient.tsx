"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";
import ImagePicker from "@/components/admin/ImagePicker";

export type Member = { id: number; name: string; title: string; image: string; sort: number };

const src = (image: string) => (image.startsWith("/api/img/") ? image + "?w=400" : image);

export default function TeamClient({ members }: { members: Member[] }) {
  const [draft, setDraft] = useState({ name: "", title: "", image: "" });
  const [busy, setBusy] = useState(false);
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();

  async function post(body: Record<string, unknown>, okText?: string) {
    setBusy(true);
    const r = await fetch("/api/admin/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(false);
    if (!r.ok) return toast("Something went wrong", "error"), false;
    if (okText) toast(okText);
    router.refresh();
    return true;
  }
  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim()) return toast("Name is required", "error");
    if (await post({ action: "add", ...draft }, "Member added")) setDraft({ name: "", title: "", image: "" });
  }
  async function del(m: Member) {
    if (!(await confirm({ title: `Remove ${m.name}?`, body: "They will disappear from the public team page. This cannot be undone.", confirmLabel: "Remove", danger: true }))) return;
    void post({ action: "delete", id: m.id }, "Removed");
  }
  const update = (id: number, patch: Partial<Member>) => post({ action: "update", id, ...patch }, "Saved");

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div>
        {members.length === 0 ? (
          <Card><p className="py-8 text-center text-white/40">No team members yet. Add the first one with the form — they appear on the public team page in this order.</p></Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {members.map((m, i) => (
              <Card key={m.id} className="flex flex-col gap-3">
                <div className="aspect-square overflow-hidden rounded-lg border border-white/10 bg-black/40">
                  {m.image ? <img src={src(m.image)} alt={m.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-sm text-white/40">No photo</div>}
                </div>
                <ImagePicker value={m.image} onChange={(ref) => update(m.id, { image: ref })} label="Photo" />
                <input className={inputClass} defaultValue={m.name} placeholder="Name" aria-label="Name"
                  onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== m.name) update(m.id, { name: v }); }} />
                <input className={inputClass} defaultValue={m.title} placeholder="Title" aria-label="Title"
                  onBlur={(e) => { const v = e.target.value.trim(); if (v !== m.title) update(m.id, { title: v }); }} />
                <div className="flex items-center gap-2 text-sm">
                  <button disabled={busy || i === 0} onClick={() => post({ action: "move", id: m.id, dir: "up" })} className="rounded-full border border-white/20 px-3 py-1 text-white/80 hover:bg-white/5 disabled:opacity-30" aria-label="Move up">▲</button>
                  <button disabled={busy || i === members.length - 1} onClick={() => post({ action: "move", id: m.id, dir: "down" })} className="rounded-full border border-white/20 px-3 py-1 text-white/80 hover:bg-white/5 disabled:opacity-30" aria-label="Move down">▼</button>
                  <span className="text-xs text-white/40">#{i + 1}</span>
                  <button disabled={busy} onClick={() => del(m)} className="ml-auto rounded-full border border-red-500/40 px-4 py-1.5 text-red-300 hover:bg-red-500/10">Delete</button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Card className="self-start">
        <h2 className="mb-3 font-display text-2xl">Add member</h2>
        <form onSubmit={add} className="flex flex-col gap-3">
          <input className={inputClass} placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required maxLength={120} />
          <input className={inputClass} placeholder="Title (e.g. Creative Director)" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} maxLength={120} />
          <ImagePicker value={draft.image} onChange={(image) => setDraft({ ...draft, image })} label="Photo" />
          <button type="submit" disabled={busy} className="btn-accent text-sm">Add member</button>
        </form>
      </Card>
    </div>
  );
}
