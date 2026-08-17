"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";

export type Inv = {
  id: number; clientId: number; clientName: string; period: string; description: string; recipient: string;
  amount: number; status: string; payUrl: string; createdAt: string; paidAt: string | null;
};
export type ClientOpt = { id: number; name: string; email: string };

const usd = (n: number) => `$${n.toFixed(2)}`;
const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString() : "—");
const secondary = "rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5";
const thisPeriod = () => new Date().toISOString().slice(0, 7);

export default function InvoicesClient({ invoices, clients, status, clientFilter }: { invoices: Inv[]; clients: ClientOpt[]; status: "all" | "unpaid" | "paid"; clientFilter: number | null }) {
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [edit, setEdit] = useState({ amount: "", description: "", payUrl: "" });
  const [form, setForm] = useState({ clientId: clients[0]?.id ?? 0, period: thisPeriod(), description: "", recipient: clients[0]?.email ?? "", amount: "", payUrl: "" });

  async function post(body: Record<string, unknown>) {
    setBusy(true);
    const r = await fetch("/api/admin/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(false);
    if (!r.ok) { toast((await r.json().catch(() => ({}))).error || "Something went wrong", "error"); return false; }
    router.refresh();
    return true;
  }
  async function create() {
    if (!form.clientId) return toast("Pick a client", "error");
    if (!(Number(form.amount) >= 0) || form.amount === "") return toast("Enter an amount", "error");
    if (await post({ action: "create", ...form })) { toast("Invoice created"); setForm((f) => ({ ...f, description: "", amount: "", payUrl: "" })); }
  }
  async function setStatus(inv: Inv) {
    const next = inv.status === "paid" ? "unpaid" : "paid";
    if (await post({ action: "setStatus", id: inv.id, status: next })) toast(next === "paid" ? "Marked paid" : "Marked unpaid");
  }
  async function del(inv: Inv) {
    if (!(await confirm({ title: `Delete invoice #${inv.id}?`, body: `${inv.clientName} · ${usd(inv.amount)}. This cannot be undone.`, confirmLabel: "Delete", danger: true }))) return;
    if (await post({ action: "delete", id: inv.id })) toast("Deleted");
  }
  function startEdit(inv: Inv) { setEditId(inv.id); setEdit({ amount: String(inv.amount), description: inv.description, payUrl: inv.payUrl }); }
  async function saveEdit() {
    if (await post({ action: "update", id: editId, ...edit })) { toast("Saved"); setEditId(null); }
  }
  function pickClient(id: number) {
    const c = clients.find((x) => x.id === id);
    setForm((f) => ({ ...f, clientId: id, recipient: c?.email ?? f.recipient }));
  }

  const q = (s: string) => `/admin/invoices?${new URLSearchParams({ ...(s !== "all" ? { status: s } : {}), ...(clientFilter ? { client: String(clientFilter) } : {}) })}`;
  const tabs = (["all", "unpaid", "paid"] as const).map((t) => (
    <Link key={t} href={q(t)} className={`rounded-full px-3 py-1 text-sm capitalize ${status === t ? "bg-[var(--accent)] text-black" : "text-white/60 hover:bg-white/5"}`}>{t}</Link>
  ));
  const filterName = clientFilter ? clients.find((c) => c.id === clientFilter)?.name ?? `#${clientFilter}` : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
      <Card>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {tabs}
          {filterName && <span className="ml-auto text-xs text-white/50">Client: {filterName} · <Link href={q(status)} className="text-[var(--accent)]">clear</Link></span>}
        </div>
        {invoices.length === 0 ? (
          <p className="py-8 text-center text-white/40">No {status === "all" ? "" : status + " "}invoices{filterName ? ` for ${filterName}` : ""}. Create one with the form on the right.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-white/50">
                <tr><th className="py-2 pr-3">#</th><th className="py-2 pr-3">Client</th><th className="py-2 pr-3">Period</th><th className="py-2 pr-3">Description</th><th className="py-2 pr-3">Amount</th><th className="py-2 pr-3">Status</th><th className="py-2 pr-3">Created</th><th className="py-2 pr-3">Paid</th><th className="py-2 pr-3">Pay link</th><th className="py-2 pr-3"></th></tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-t border-white/10 align-top">
                    <td className="py-2 pr-3 text-white/50">{inv.id}</td>
                    <td className="py-2 pr-3"><Link href={`/admin/clients/${inv.clientId}`} className="text-[var(--accent)] hover:underline">{inv.clientName}</Link></td>
                    <td className="py-2 pr-3 whitespace-nowrap">{inv.period || "—"}</td>
                    {editId === inv.id ? (
                      <>
                        <td className="py-2 pr-3 min-w-[180px]"><input className={inputClass} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></td>
                        <td className="py-2 pr-3 min-w-[100px]"><input className={inputClass} type="number" min={0} step="0.01" value={edit.amount} onChange={(e) => setEdit({ ...edit, amount: e.target.value })} /></td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 pr-3 max-w-[260px] truncate" title={inv.description}>{inv.description || "—"}</td>
                        <td className="py-2 pr-3 whitespace-nowrap">{usd(inv.amount)}</td>
                      </>
                    )}
                    <td className="py-2 pr-3"><span className={`rounded-full px-2 py-0.5 text-xs ${inv.status === "paid" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>{inv.status}</span></td>
                    <td className="py-2 pr-3 whitespace-nowrap text-white/60">{day(inv.createdAt)}</td>
                    <td className="py-2 pr-3 whitespace-nowrap text-white/60">{day(inv.paidAt)}</td>
                    <td className="py-2 pr-3">
                      {editId === inv.id ? <input className={inputClass} placeholder="https://" value={edit.payUrl} onChange={(e) => setEdit({ ...edit, payUrl: e.target.value })} /> : inv.payUrl ? <a href={inv.payUrl} target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:underline">open</a> : <span className="text-white/30">—</span>}
                    </td>
                    <td className="py-2 pr-3">
                      <div className="flex flex-wrap gap-1.5 whitespace-nowrap">
                        {editId === inv.id ? (
                          <>
                            <button disabled={busy} onClick={saveEdit} className="btn-accent text-sm">Save</button>
                            <button onClick={() => setEditId(null)} className={secondary}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button disabled={busy} onClick={() => setStatus(inv)} className={secondary}>{inv.status === "paid" ? "Mark unpaid" : "Mark paid"}</button>
                            <button onClick={() => startEdit(inv)} className={secondary}>Edit</button>
                            <button disabled={busy} onClick={() => del(inv)} className="rounded-full border border-red-500/40 px-4 py-1.5 text-sm text-red-300 hover:bg-red-500/10">Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="h-fit">
        <h2 className="font-display text-xl">New invoice</h2>
        {clients.length === 0 ? (
          <p className="py-8 text-center text-white/40">No clients yet. Add one under <Link href="/admin/clients" className="text-[var(--accent)]">Clients</Link> first.</p>
        ) : (
          <div className="mt-3 grid gap-3 text-sm">
            <label className="grid gap-1"><span className="text-white/60">Client</span>
              <select className={inputClass} value={form.clientId} onChange={(e) => pickClient(Number(e.target.value))}>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label className="grid gap-1"><span className="text-white/60">Period</span><input className={inputClass} placeholder="2026-08" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} /></label>
            <label className="grid gap-1"><span className="text-white/60">Description</span><input className={inputClass} placeholder="Monthly hosting + care plan" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <label className="grid gap-1"><span className="text-white/60">Recipient email</span><input className={inputClass} type="email" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} /></label>
            <label className="grid gap-1"><span className="text-white/60">Amount (USD)</span><input className={inputClass} type="number" min={0} step="0.01" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></label>
            <label className="grid gap-1"><span className="text-white/60">Pay URL (optional)</span><input className={inputClass} placeholder="https://buy.stripe.com/..." value={form.payUrl} onChange={(e) => setForm({ ...form, payUrl: e.target.value })} /></label>
            <p className="text-xs text-white/40">Until Stripe is wired, paste a Stripe payment link here — the client sees it as the pay button.</p>
            <button disabled={busy} onClick={create} className="btn-accent text-sm">Create invoice</button>
          </div>
        )}
      </Card>
    </div>
  );
}
