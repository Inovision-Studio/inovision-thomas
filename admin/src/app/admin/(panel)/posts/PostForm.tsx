"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import ImagePicker from "@/components/admin/ImagePicker";
import { slugify } from "@/lib/slug";

export type PostData = { id?: number; title: string; slug: string; subtitle: string; body: string; template: string; images: string[]; published: boolean };
const TEMPLATES = ["editorial", "feature", "note"];

export default function PostForm({ post, siteUrl }: { post: PostData; siteUrl: string }) {
  const [p, setP] = useState<PostData>(post);
  const [slugTouched, setSlugTouched] = useState(Boolean(post.slug));
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const set = <K extends keyof PostData>(k: K, v: PostData[K]) => setP((s) => ({ ...s, [k]: v }));

  async function save() {
    setSaving(true);
    const action = p.id ? "update" : "create";
    const r = await fetch("/api/admin/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...p }) });
    const d = await r.json().catch(() => ({}));
    setSaving(false);
    if (!r.ok) return toast(d.error || "Something went wrong", "error");
    toast("Saved");
    if (action === "create") router.push(`/admin/posts/${d.id}`);
    else router.refresh();
  }
  async function del() {
    if (!p.id || !(await confirm({ title: `Delete “${p.title}”?`, body: "This cannot be undone.", confirmLabel: "Delete", danger: true }))) return;
    const r = await fetch("/api/admin/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id: p.id }) });
    if (!r.ok) return toast("Something went wrong", "error");
    toast("Deleted");
    router.push("/admin/posts");
  }

  const previewHref = siteUrl && p.slug ? `${siteUrl.replace(/\/$/, "")}/blog/${p.slug}` : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <Card className="space-y-4">
        <label className="block text-sm">
          <span className="text-white/80">Title</span>
          <input className={`${inputClass} mt-1`} value={p.title} onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} placeholder="Post title" />
        </label>
        <label className="block text-sm">
          <span className="text-white/80">Slug</span>
          <input className={`${inputClass} mt-1 font-mono`} value={p.slug} onChange={(e) => { setSlugTouched(e.target.value !== ""); set("slug", e.target.value); }} placeholder="my-post" pattern="[a-z0-9-]+" />
        </label>
        <label className="block text-sm">
          <span className="text-white/80">Subtitle</span>
          <input className={`${inputClass} mt-1`} value={p.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Optional deck / standfirst" />
        </label>
        <div className="text-sm">
          <div className="mb-1 text-white/80">Body</div>
          <MarkdownEditor value={p.body} onChange={(v) => set("body", v)} name="body" />
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="space-y-4">
          <label className="block text-sm">
            <span className="text-white/80">Template</span>
            <select className={`${inputClass} mt-1`} value={p.template} onChange={(e) => set("template", e.target.value)}>
              {TEMPLATES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.published} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
            <span>Published</span>
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={save} disabled={saving} className="btn-accent text-sm disabled:opacity-50">{saving ? "Saving…" : p.id ? "Save" : "Create post"}</button>
            {previewHref && <a href={previewHref} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5">Preview ↗</a>}
            {p.id && <button onClick={del} className="rounded-full border border-red-500/40 px-4 py-1.5 text-sm text-red-300 hover:bg-red-500/10">Delete</button>}
          </div>
        </Card>

        <Card>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-white/80">Cover &amp; gallery</span>
            <button type="button" onClick={() => set("images", [...p.images, ""])} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5">Add image</button>
          </div>
          {p.images.length === 0 ? (
            <p className="py-8 text-center text-white/40">No images. The first image is used as the cover.</p>
          ) : (
            <div className="space-y-4">
              {p.images.map((ref, i) => (
                <div key={i} className="rounded-lg border border-white/10 p-3">
                  <ImagePicker value={ref} label={i === 0 ? "Cover" : `Image ${i + 1}`} onChange={(r) => set("images", p.images.map((x, j) => (j === i ? r : x)))} />
                  <button type="button" onClick={() => set("images", p.images.filter((_, j) => j !== i))} className="mt-2 text-xs text-red-300 hover:text-red-200">Remove</button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
