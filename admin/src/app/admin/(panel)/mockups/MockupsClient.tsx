"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";

type Row = { id: number; name: string; updatedAt: string };
type Open = { id: number; name: string; html: string };

export default function MockupsClient({ list, open }: { list: Row[]; open: Open | null }) {
  const [newName, setNewName] = useState("");
  const [name, setName] = useState(open?.name ?? "");
  const [html, setHtml] = useState(open?.html ?? "");
  const [busy, setBusy] = useState(false);
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();

  // Re-sync editor when a different mockup is opened (server props change with ?id=)
  useEffect(() => { setName(open?.name ?? ""); setHtml(open?.html ?? ""); }, [open?.id, open?.name, open?.html]);

  async function post(body: Record<string, unknown>) {
    setBusy(true);
    const r = await fetch("/api/admin/mockups", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(false);
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { toast(j.error || "Something went wrong", "error"); return null; }
    return j as { ok: true; id?: number };
  }
  async function create() {
    if (!newName.trim()) return toast("Name required", "error");
    const j = await post({ action: "create", name: newName, html: "<!doctype html>\n<html>\n<body>\n  <h1>Hello</h1>\n</body>\n</html>\n" });
    if (!j) return;
    setNewName("");
    toast("Created");
    router.push(`/admin/mockups?id=${j.id}`);
    router.refresh();
  }
  async function save() {
    if (!open) return;
    if (!name.trim()) return toast("Name required", "error");
    if (await post({ action: "update", id: open.id, name, html })) { toast("Saved"); router.refresh(); }
  }
  async function del() {
    if (!open) return;
    if (!(await confirm({ title: `Delete "${open.name}"?`, body: "This cannot be undone.", confirmLabel: "Delete", danger: true }))) return;
    if (await post({ action: "delete", id: open.id })) { toast("Deleted"); router.push("/admin/mockups"); router.refresh(); }
  }
  function openTab() {
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    window.open(url, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
  const dirty = !!open && (name !== open.name || html !== open.html);

  return (
    <div className="grid gap-4">
      {/* TODO: AI generation (Claude/OpenAI) not wired yet — env keys ANTHROPIC_API_KEY / OPENAI_API_KEY reserved. Mockup.messages stays [] until then. */}
      <Card className="border-dashed border-[var(--accent)]/40">
        <div className="text-[11px] font-bold tracking-widest text-[var(--accent)]">TODO</div>
        <p className="mt-1 text-sm text-white/70">AI generation (Claude/OpenAI) not wired yet — env keys <code>ANTHROPIC_API_KEY</code> / <code>OPENAI_API_KEY</code> reserved. For now, paste or write HTML by hand below.</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
        <Card>
          <div className="mb-3 flex gap-2">
            <input className={inputClass} placeholder="New mockup name" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void create(); }} />
            <button onClick={create} disabled={busy} className="btn-accent shrink-0 text-sm">New</button>
          </div>
          {list.length === 0 ? (
            <p className="py-8 text-center text-white/40">No mockups yet. Type a name above and press New to start one.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-white/50"><tr><th className="py-2 pr-3 text-left font-normal">Name</th><th className="py-2 pr-3 text-left font-normal">Updated</th></tr></thead>
                <tbody>
                  {list.map((m) => (
                    <tr key={m.id} className={`border-t border-white/10 ${open?.id === m.id ? "bg-white/5" : "hover:bg-white/5"}`}>
                      <td className="py-2 pr-3"><Link href={`/admin/mockups?id=${m.id}`} className={`block truncate ${open?.id === m.id ? "font-semibold text-[var(--accent)]" : "text-white/85"}`}>{m.name}</Link></td>
                      <td className="py-2 pr-3 whitespace-nowrap text-white/50">{new Date(m.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          {open ? (
            <div className="grid gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <input className={`${inputClass} min-w-0 flex-1`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Mockup name" />
                <button onClick={save} disabled={busy || !dirty} className="btn-accent text-sm disabled:opacity-50">Save{dirty ? " *" : ""}</button>
                <button onClick={openTab} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5">Open in new tab</button>
                <button onClick={del} disabled={busy} className="rounded-full border border-red-500/40 px-4 py-1.5 text-sm text-red-300 hover:bg-red-500/10">Delete</button>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <textarea
                  className={`${inputClass} min-h-[50vh] resize-y font-mono text-xs`}
                  spellCheck={false}
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  placeholder="<!doctype html> ..."
                />
                <iframe title="Preview" sandbox="" srcDoc={html} className="min-h-[50vh] w-full rounded-lg border border-white/10 bg-white" />
              </div>
            </div>
          ) : (
            <p className="py-16 text-center text-white/40">Select a mockup on the left, or create a new one.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
