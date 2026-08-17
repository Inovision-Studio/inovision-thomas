"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useToast } from "@/components/admin/Dialogs";

export type AuditRow = { id: number; company: string; contact: string; email: string; status: string; total: number; done: number; createdAt: string };

export const STATUS_PILL: Record<string, string> = {
  in_progress: "bg-white/10 text-white/70",
  delivered: "bg-[var(--accent)]/20 text-[var(--accent)]",
  won: "bg-emerald-500/20 text-emerald-300",
  lost: "bg-red-500/20 text-red-300",
};
export const StatusPill = ({ status }: { status: string }) => (
  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_PILL[status] ?? STATUS_PILL.in_progress}`}>{status.replace("_", " ")}</span>
);

export default function AuditsClient({ audits }: { audits: AuditRow[] }) {
  const [form, setForm] = useState({ company: "", contact: "", email: "" });
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const router = useRouter();

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company.trim()) return toast("Company is required", "error");
    setBusy(true);
    const r = await fetch("/api/admin/audits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", ...form }) });
    setBusy(false);
    if (!r.ok) return toast("Something went wrong", "error");
    const { id } = await r.json();
    toast("Audit created");
    router.push(`/admin/audits/${id}`);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <Card>
        {audits.length === 0 ? (
          <p className="py-8 text-center text-white/40">No audits yet. Create one on the right, then add findings and copy the report as Markdown for the client.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-white/50">
                <tr><th className="py-2 pr-3 font-normal">Company</th><th className="py-2 pr-3 font-normal">Contact</th><th className="py-2 pr-3 font-normal">Email</th><th className="py-2 pr-3 font-normal">Status</th><th className="py-2 pr-3 font-normal">Items</th><th className="py-2 pr-3 font-normal">Done</th><th className="py-2 pr-3 font-normal">Created</th></tr>
              </thead>
              <tbody>
                {audits.map((a) => (
                  <tr key={a.id} className="border-t border-white/10">
                    <td className="py-2 pr-3"><Link href={`/admin/audits/${a.id}`} className="font-semibold hover:text-[var(--accent)]">{a.company}</Link></td>
                    <td className="py-2 pr-3 text-white/80">{a.contact || "—"}</td>
                    <td className="py-2 pr-3 text-white/60">{a.email || "—"}</td>
                    <td className="py-2 pr-3"><StatusPill status={a.status} /></td>
                    <td className="py-2 pr-3">{a.total}</td>
                    <td className="py-2 pr-3 text-white/60">{a.done}/{a.total}</td>
                    <td className="py-2 pr-3 whitespace-nowrap text-white/60">{new Date(a.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Card>
        <h2 className="font-display text-2xl">New audit</h2>
        <form onSubmit={create} className="mt-3 grid gap-3">
          <input className={inputClass} placeholder="Company *" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
          <input className={inputClass} placeholder="Contact name" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          <input className={inputClass} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <button type="submit" disabled={busy} className="btn-accent text-sm">Create audit</button>
        </form>
      </Card>
    </div>
  );
}
