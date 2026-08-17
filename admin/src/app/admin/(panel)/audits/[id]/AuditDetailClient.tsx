"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";
import { StatusPill } from "../AuditsClient";

export type Audit = { id: number; company: string; contact: string; email: string; status: string; summary: string; createdAt: string };
export type Item = { id: number; area: string; finding: string; recommendation: string; impact: string; effort: string; done: boolean };

const STATUSES = ["in_progress", "delivered", "won", "lost"];
const LEVELS = ["low", "medium", "high"];
const LEVEL_CLASS: Record<string, string> = { high: "text-red-300", medium: "text-[var(--accent)]", low: "text-white/60" };
const cell = "min-w-[8rem] rounded bg-transparent px-1 py-0.5 outline-none focus:bg-black/40 focus:ring-1 ring-[var(--accent)]";
const select = "rounded bg-black/40 border border-white/10 px-1 py-0.5 text-sm outline-none focus:ring-1 ring-[var(--accent)]";

export function buildMarkdown(a: Audit, items: Item[]) {
  const who = [a.contact, a.email && `<${a.email}>`].filter(Boolean).join(" ");
  const lines = [`# Website Audit — ${a.company}`, "", `Prepared${who ? ` for ${who}` : ""} by Inovision Studios · ${new Date(a.createdAt).toLocaleDateString()}`, ""];
  if (a.summary.trim()) lines.push("## Summary", "", a.summary.trim(), "");
  lines.push("## Findings", "");
  if (items.length === 0) lines.push("_No findings recorded._", "");
  for (const level of ["high", "medium", "low"]) {
    const group = items.filter((i) => i.impact === level);
    if (!group.length) continue;
    lines.push(`### ${level[0].toUpperCase() + level.slice(1)} impact`, "");
    for (const i of group) {
      lines.push(`- ${i.done ? "[x]" : "[ ]"} **${i.area ? `${i.area}: ` : ""}${i.finding}** _(effort: ${i.effort})_`);
      if (i.recommendation.trim()) lines.push(`  - Recommendation: ${i.recommendation.trim()}`);
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd() + "\n";
}

export default function AuditDetailClient({ audit, items }: { audit: Audit; items: Item[] }) {
  const [form, setForm] = useState({ company: audit.company, contact: audit.contact, email: audit.email, status: audit.status, summary: audit.summary });
  const [newItem, setNewItem] = useState({ area: "", finding: "", recommendation: "", impact: "medium", effort: "medium" });
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();

  async function post(body: Record<string, unknown>) {
    const r = await fetch("/api/admin/audits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) { toast((await r.json().catch(() => ({}))).error || "Something went wrong", "error"); return false; }
    router.refresh();
    return true;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company.trim()) return toast("Company is required", "error");
    if (await post({ action: "update", id: audit.id, ...form })) toast("Saved");
  }
  async function remove() {
    if (!(await confirm({ title: `Delete audit for ${audit.company}?`, body: "All findings will be removed. This cannot be undone.", confirmLabel: "Delete", danger: true }))) return;
    if (await post({ action: "delete", id: audit.id })) { toast("Audit deleted"); router.push("/admin/audits"); }
  }
  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.finding.trim()) return toast("Finding is required", "error");
    if (await post({ action: "item.add", id: audit.id, ...newItem })) { setNewItem({ ...newItem, area: "", finding: "", recommendation: "" }); toast("Finding added"); }
  }
  async function removeItem(i: Item) {
    if (!(await confirm({ title: "Delete this finding?", body: i.finding, confirmLabel: "Delete", danger: true }))) return;
    if (await post({ action: "item.delete", id: i.id })) toast("Finding deleted");
  }
  const patch = (i: Item, data: Partial<Item>) => post({ action: "item.update", id: i.id, ...data });
  const blurSave = (i: Item, field: "area" | "finding" | "recommendation") => (e: React.FocusEvent<HTMLInputElement>) => {
    const v = e.target.value.trim();
    if (v === i[field]) return;
    if (field === "finding" && !v) { e.target.value = i.finding; return toast("Finding is required", "error"); }
    void patch(i, { [field]: v });
  };
  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(buildMarkdown({ ...audit, ...form }, items));
      toast("Report copied as Markdown");
    } catch { toast("Clipboard blocked — allow clipboard access and try again", "error"); }
  }

  const done = items.filter((i) => i.done).length;
  return (
    <div className="grid gap-4">
      <Card>
        <form onSubmit={save} className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input className={inputClass} placeholder="Company *" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            <input className={inputClass} placeholder="Contact name" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            <input className={inputClass} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>
          <textarea className={`${inputClass} min-h-[7rem]`} placeholder="Summary for the client — what you looked at, the headline verdict, next steps." value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" className="btn-accent text-sm">Save</button>
            <button type="button" onClick={copyMarkdown} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5">Copy as Markdown</button>
            <button type="button" onClick={remove} className="rounded-full border border-red-500/40 px-4 py-1.5 text-sm text-red-300 hover:bg-red-500/10">Delete audit</button>
            <span className="ml-auto flex items-center gap-2 text-sm text-white/60"><StatusPill status={audit.status} /> {done}/{items.length} done</span>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="font-display text-2xl">Findings</h2>
        {items.length === 0 ? (
          <p className="py-8 text-center text-white/40">No findings yet. Add the first one below — area (e.g. "Speed", "SEO"), what you found, and what you recommend.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-white/50">
                <tr><th className="py-2 pr-3 font-normal">Done</th><th className="py-2 pr-3 font-normal">Area</th><th className="py-2 pr-3 font-normal">Finding</th><th className="py-2 pr-3 font-normal">Recommendation</th><th className="py-2 pr-3 font-normal">Impact</th><th className="py-2 pr-3 font-normal">Effort</th><th className="py-2 pr-3 font-normal"></th></tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id} className={`border-t border-white/10 ${i.done ? "text-white/40" : ""}`}>
                    <td className="py-2 pr-3"><input type="checkbox" checked={i.done} onChange={(e) => patch(i, { done: e.target.checked })} className="h-4 w-4 accent-[var(--accent)]" aria-label="Done" /></td>
                    <td className="py-2 pr-3"><input key={i.area} className={cell} defaultValue={i.area} onBlur={blurSave(i, "area")} placeholder="Area" /></td>
                    <td className="py-2 pr-3"><input key={i.finding} className={`${cell} min-w-[14rem] w-full`} defaultValue={i.finding} onBlur={blurSave(i, "finding")} /></td>
                    <td className="py-2 pr-3"><input key={i.recommendation} className={`${cell} min-w-[14rem] w-full`} defaultValue={i.recommendation} onBlur={blurSave(i, "recommendation")} placeholder="Recommendation" /></td>
                    <td className="py-2 pr-3"><select className={`${select} ${LEVEL_CLASS[i.impact]}`} value={i.impact} onChange={(e) => patch(i, { impact: e.target.value })}>{LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}</select></td>
                    <td className="py-2 pr-3"><select className={select} value={i.effort} onChange={(e) => patch(i, { effort: e.target.value })}>{LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}</select></td>
                    <td className="py-2 pr-3 text-right"><button onClick={() => removeItem(i)} className="text-xs text-red-300 hover:underline">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <form onSubmit={addItem} className="mt-4 grid gap-2 border-t border-white/10 pt-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)_auto_auto_auto]">
          <input className={inputClass} placeholder="Area" value={newItem.area} onChange={(e) => setNewItem({ ...newItem, area: e.target.value })} />
          <input className={inputClass} placeholder="Finding *" value={newItem.finding} onChange={(e) => setNewItem({ ...newItem, finding: e.target.value })} required />
          <input className={inputClass} placeholder="Recommendation" value={newItem.recommendation} onChange={(e) => setNewItem({ ...newItem, recommendation: e.target.value })} />
          <select className={inputClass} value={newItem.impact} onChange={(e) => setNewItem({ ...newItem, impact: e.target.value })} aria-label="Impact">{LEVELS.map((l) => <option key={l} value={l}>impact: {l}</option>)}</select>
          <select className={inputClass} value={newItem.effort} onChange={(e) => setNewItem({ ...newItem, effort: e.target.value })} aria-label="Effort">{LEVELS.map((l) => <option key={l} value={l}>effort: {l}</option>)}</select>
          <button type="submit" className="btn-accent text-sm">Add</button>
        </form>
      </Card>
    </div>
  );
}
