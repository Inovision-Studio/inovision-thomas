"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useToast } from "@/components/admin/Dialogs";
import { STAGES, STAGE_PILL, money } from "./stages";

export type Row = { id: number; name: string; email: string; phone: string; plan: string; stage: string; projectFee: number; depositPaid: boolean; createdAt: string };

const EMPTY = { name: "", email: "", phone: "", site: "", plan: "", projectFee: "", depositAmount: "", notes: "" };

export default function ClientsClient({ clients, stage }: { clients: Row[]; stage: string }) {
  const [q, setQ] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const needle = q.trim().toLowerCase();
  const rows = needle ? clients.filter((c) => [c.name, c.email, c.phone, c.plan].some((v) => v.toLowerCase().includes(needle))) : clients;

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast("Name is required", "error");
    setBusy(true);
    const r = await fetch("/api/admin/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", ...form }) });
    setBusy(false);
    if (!r.ok) return toast("Could not create client", "error");
    const { id } = await r.json();
    toast("Client created");
    setForm(EMPTY);
    router.push(`/admin/clients/${id}`);
  }
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <Card>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {["", ...STAGES].map((s) => (
              <Link key={s} href={s ? `/admin/clients?stage=${s}` : "/admin/clients"} className={`rounded-full px-3 py-1 text-sm capitalize ${stage === s ? "bg-[var(--accent)] text-black" : "text-white/60 hover:bg-white/5"}`}>{s || "All"}</Link>
            ))}
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone, plan…" className={`${inputClass} ml-auto lg:max-w-xs`} />
        </div>
        {rows.length === 0 ? (
          <p className="py-8 text-center text-white/40">{clients.length === 0 ? "No clients yet. Add one with the form." : "No clients match that search or stage."}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-white/50">
                <tr><th className="py-2 pr-3 font-normal">Name</th><th className="py-2 pr-3 font-normal">Contact</th><th className="py-2 pr-3 font-normal">Plan</th><th className="py-2 pr-3 font-normal">Stage</th><th className="py-2 pr-3 font-normal text-right">Fee</th><th className="py-2 pr-3 font-normal">Deposit</th><th className="py-2 pr-3 font-normal">Created</th></tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className="border-t border-white/10">
                    <td className="py-2 pr-3"><Link href={`/admin/clients/${c.id}`} className="font-semibold hover:text-[var(--accent)]">{c.name}</Link></td>
                    <td className="py-2 pr-3 text-white/70"><div>{c.email || "—"}</div>{c.phone ? <div className="text-xs text-white/40">{c.phone}</div> : null}</td>
                    <td className="py-2 pr-3 text-white/70">{c.plan || "—"}</td>
                    <td className="py-2 pr-3"><span className={`rounded-full px-2 py-0.5 text-xs capitalize ${STAGE_PILL[c.stage] ?? "bg-white/10 text-white/80"}`}>{c.stage}</span></td>
                    <td className="py-2 pr-3 text-right tabular-nums">{money(c.projectFee)}</td>
                    <td className="py-2 pr-3">{c.depositPaid ? <span className="text-[var(--accent)]">Paid</span> : <span className="text-white/40">Unpaid</span>}</td>
                    <td className="py-2 pr-3 whitespace-nowrap text-white/50">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Card>
        <h2 className="mb-3 font-display text-xl">New client</h2>
        <form onSubmit={create} className="grid gap-2">
          <input required value={form.name} onChange={set("name")} placeholder="Name *" className={inputClass} />
          <input type="email" value={form.email} onChange={set("email")} placeholder="Email" className={inputClass} />
          <input value={form.phone} onChange={set("phone")} placeholder="Phone" className={inputClass} />
          <input value={form.site} onChange={set("site")} placeholder="Site (https://…)" className={inputClass} />
          <input value={form.plan} onChange={set("plan")} placeholder="Plan" className={inputClass} />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" min="0" step="0.01" value={form.projectFee} onChange={set("projectFee")} placeholder="Project fee $" className={inputClass} />
            <input type="number" min="0" step="0.01" value={form.depositAmount} onChange={set("depositAmount")} placeholder="Deposit $" className={inputClass} />
          </div>
          <textarea value={form.notes} onChange={set("notes")} placeholder="Notes" rows={3} className={inputClass} />
          <button disabled={busy} className="btn-accent text-sm disabled:opacity-50">{busy ? "Creating…" : "Create client"}</button>
        </form>
      </Card>
    </div>
  );
}
