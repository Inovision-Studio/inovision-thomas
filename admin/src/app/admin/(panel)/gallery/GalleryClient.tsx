"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";
import ImagePicker from "@/components/admin/ImagePicker";

export type Item = { id: number; url: string; title: string; category: string; sort: number };

const thumb = (url: string) => (url.startsWith("/api/img/") ? `${url}?w=600` : url);
const secondary = "rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5";

export default function GalleryClient({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState("");
  const [add, setAdd] = useState({ url: "", title: "", category: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [edit, setEdit] = useState({ title: "", category: "" });
  const [busy, setBusy] = useState(false);
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();

  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))].sort();
  const shown = filter ? items.filter((i) => i.category === filter) : items;

  async function post(body: Record<string, unknown>) {
    setBusy(true);
    const r = await fetch("/api/admin/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(false);
    if (!r.ok) { toast("Something went wrong", "error"); return false; }
    router.refresh();
    return true;
  }
  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!add.url) return toast("Pick or upload an image first", "error");
    if (await post({ action: "add", ...add })) { setAdd({ url: "", title: "", category: "" }); toast("Added to gallery"); }
  }
  async function onSave(id: number) {
    if (await post({ action: "update", id, ...edit })) { setEditId(null); toast("Saved"); }
  }
  async function onDelete(it: Item) {
    if (!(await confirm({ title: "Remove this image from the gallery?", body: it.title || "It stays in the image library — only the gallery entry is removed.", confirmLabel: "Remove", danger: true }))) return;
    if (await post({ action: "delete", id: it.id })) toast("Removed");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)]">
      <Card className="self-start">
        <h2 className="mb-3 font-display text-xl">Add image</h2>
        <form onSubmit={onAdd} className="grid gap-3">
          <ImagePicker value={add.url} onChange={(url) => setAdd((a) => ({ ...a, url }))} />
          <label className="text-sm text-white/80">Title
            <input className={`${inputClass} mt-1`} value={add.title} onChange={(e) => setAdd((a) => ({ ...a, title: e.target.value }))} placeholder="Client or project name" maxLength={200} />
          </label>
          <label className="text-sm text-white/80">Category
            <input list="gallery-categories" className={`${inputClass} mt-1`} value={add.category} onChange={(e) => setAdd((a) => ({ ...a, category: e.target.value }))} placeholder="e.g. Branding" maxLength={200} />
          </label>
          <datalist id="gallery-categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          <button type="submit" disabled={busy} className="btn-accent text-sm">Add to gallery</button>
        </form>
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap gap-2">
          {["", ...categories].map((c) => (
            <button key={c} type="button" onClick={() => setFilter(c)} className={`rounded-full px-3 py-1 text-sm ${filter === c ? "bg-[var(--accent)] text-black" : "text-white/60 hover:bg-white/5"}`}>
              {c || "All"}
            </button>
          ))}
        </div>
        {shown.length === 0 ? (
          <p className="py-8 text-center text-white/40">{filter ? `Nothing in "${filter}" yet.` : "No gallery images yet. Upload one on the left — it appears on the public work page immediately."}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {shown.map((it, idx) => (
              <div key={it.id} className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
                <img src={thumb(it.url)} alt={it.title} loading="lazy" className="aspect-square w-full object-cover" />
                <div className="p-3">
                  {editId === it.id ? (
                    <div className="grid gap-2">
                      <input className={inputClass} value={edit.title} onChange={(e) => setEdit((s) => ({ ...s, title: e.target.value }))} placeholder="Title" maxLength={200} autoFocus />
                      <input list="gallery-categories" className={inputClass} value={edit.category} onChange={(e) => setEdit((s) => ({ ...s, category: e.target.value }))} placeholder="Category" maxLength={200} />
                      <div className="flex gap-2">
                        <button type="button" disabled={busy} onClick={() => onSave(it.id)} className="btn-accent text-sm">Save</button>
                        <button type="button" onClick={() => setEditId(null)} className={secondary}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="truncate text-sm font-semibold" title={it.title}>{it.title || <span className="text-white/40">Untitled</span>}</div>
                      <div className="truncate text-xs text-white/50">{it.category || "—"}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-1 text-sm">
                        <button type="button" disabled={busy || !!filter || idx === 0} title={filter ? "Clear the filter to reorder" : "Move up"} onClick={() => post({ action: "move", id: it.id, dir: "up" })} className="rounded-full border border-white/20 px-2.5 py-1 text-white/80 hover:bg-white/5 disabled:opacity-30">▲</button>
                        <button type="button" disabled={busy || !!filter || idx === shown.length - 1} title={filter ? "Clear the filter to reorder" : "Move down"} onClick={() => post({ action: "move", id: it.id, dir: "down" })} className="rounded-full border border-white/20 px-2.5 py-1 text-white/80 hover:bg-white/5 disabled:opacity-30">▼</button>
                        <button type="button" onClick={() => { setEditId(it.id); setEdit({ title: it.title, category: it.category }); }} className="rounded-full border border-white/20 px-3 py-1 text-white/80 hover:bg-white/5">Edit</button>
                        <button type="button" onClick={() => onDelete(it)} className="rounded-full border border-red-500/40 px-3 py-1 text-red-300 hover:bg-red-500/10">Delete</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
