"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";

export type ProjectRow = { id: number; name: string; status: string; updates: number; createdAt: string };
export type Update = { id: number; projectId: number; authorName: string; body: string; kind: string; createdAt: string };
export type Selected = { id: number; name: string; status: string; updates: Update[] };

const STATUSES = ["Active", "Paused", "Done"] as const;
const KINDS = ["update", "blocker", "milestone"] as const;
const STATUS_PILL: Record<string, string> = {
  Active: "bg-green-500/15 text-green-400",
  Paused: "bg-amber-500/15 text-amber-300",
  Done: "bg-white/10 text-white/60",
};
const KIND_LABEL: Record<string, string> = { update: "text-white/60", blocker: "text-amber-300", milestone: "text-green-400" };
const secondary = "rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5";

export default function ProjectsClient({ projects, selected }: { projects: ProjectRow[]; selected: Selected | null }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<string>("Active");
  const [body, setBody] = useState("");
  const [kind, setKind] = useState<string>("update");
  const [busy, setBusy] = useState(false);
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();

  async function post(payload: Record<string, unknown>) {
    setBusy(true);
    const r = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setBusy(false);
    if (!r.ok) { toast((await r.json().catch(() => ({}))).error || "Something went wrong", "error"); return null; }
    router.refresh();
    return r.json();
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await post({ action: "create", name, status });
    if (!res) return;
    setName("");
    toast("Project created");
    router.push(`/admin/projects?id=${res.id}`);
  }
  async function del(p: ProjectRow) {
    if (!(await confirm({ title: `Delete "${p.name}"?`, body: `Its ${p.updates} update${p.updates === 1 ? "" : "s"} will be deleted too. This cannot be undone.`, confirmLabel: "Delete", danger: true }))) return;
    if (await post({ action: "delete", id: p.id })) { toast("Deleted"); if (selected?.id === p.id) router.push("/admin/projects"); }
  }
  async function addUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !body.trim()) return;
    if (await post({ action: "update.add", projectId: selected.id, body, kind })) { setBody(""); toast("Update added"); }
  }
  async function delUpdate(u: Update) {
    if (!(await confirm({ title: "Delete this update?", body: "This cannot be undone.", confirmLabel: "Delete", danger: true }))) return;
    if (await post({ action: "update.delete", id: u.id })) toast("Deleted");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <Card>
        <form onSubmit={create} className="mb-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <input className={inputClass} placeholder="New project name" value={name} onChange={(e) => setName(e.target.value)} maxLength={200} />
          <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button type="submit" disabled={busy || !name.trim()} className="btn-accent text-sm disabled:opacity-50">New project</button>
        </form>
        {projects.length === 0 ? (
          <p className="py-8 text-center text-white/40">No projects yet. Add one above to start tracking updates, blockers and milestones.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/50"><tr className="text-left"><th className="py-2 pr-3 font-normal">Project</th><th className="py-2 pr-3 font-normal">Status</th><th className="py-2 pr-3 font-normal">Updates</th><th className="py-2 pr-3 font-normal">Created</th><th className="py-2 pr-3" /></tr></thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className={`border-t border-white/10 ${selected?.id === p.id ? "bg-white/5" : ""}`}>
                    <td className="py-2 pr-3"><Link href={`/admin/projects?id=${p.id}`} className="font-medium hover:text-[var(--accent)]">{p.name}</Link></td>
                    <td className="py-2 pr-3">
                      <span className={`mr-2 rounded-full px-2 py-0.5 text-xs ${STATUS_PILL[p.status] ?? "bg-white/10 text-white/60"}`}>{p.status}</span>
                      <select aria-label="Change status" className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white/80" value={p.status} onChange={(e) => post({ action: "update", id: p.id, status: e.target.value }).then((r) => r && toast("Status updated"))}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="py-2 pr-3 text-white/70">{p.updates}</td>
                    <td className="py-2 pr-3 whitespace-nowrap text-white/60">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 pr-3 text-right"><button onClick={() => del(p)} className="text-xs text-red-300 hover:underline">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Card>
        {selected ? (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl">{selected.name}</h2>
              <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_PILL[selected.status] ?? "bg-white/10 text-white/60"}`}>{selected.status}</span>
            </div>
            <form onSubmit={addUpdate} className="mb-5 grid gap-2">
              <textarea className={inputClass} rows={3} placeholder="What happened?" value={body} onChange={(e) => setBody(e.target.value)} maxLength={5000} />
              <div className="flex flex-wrap items-center gap-2">
                <select className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" value={kind} onChange={(e) => setKind(e.target.value)}>
                  {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
                <button type="submit" disabled={busy || !body.trim()} className="btn-accent text-sm disabled:opacity-50">Add update</button>
              </div>
            </form>
            {selected.updates.length === 0 ? (
              <p className="py-8 text-center text-white/40">No updates yet. Log progress, blockers and milestones above.</p>
            ) : (
              <ol className="relative ml-2 border-l border-white/10">
                {selected.updates.map((u) => (
                  <li key={u.id} className="mb-5 ml-4">
                    <span className="absolute -left-[5px] mt-1.5 h-2 w-2 rounded-full bg-[var(--accent)]" />
                    <div className="flex flex-wrap items-baseline gap-2 text-xs">
                      <span className={`font-semibold uppercase tracking-wider ${KIND_LABEL[u.kind] ?? "text-white/60"}`}>{u.kind}</span>
                      <span className="text-white/40">{u.authorName || "—"} · {new Date(u.createdAt).toLocaleString()}</span>
                      <button onClick={() => delUpdate(u)} className="ml-auto text-red-300 hover:underline">Delete</button>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-white/85">{u.body}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        ) : (
          <p className="py-16 text-center text-white/40">Select a project to see its timeline</p>
        )}
      </Card>
    </div>
  );
}
