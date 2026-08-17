"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";

type Entry = { id: number; ts: string; kind: string; category: string; amount: number; note: string };
const usd = (n: number) => `$${n.toFixed(2)}`;
const today = () => new Date().toISOString().slice(0, 10);

export default function LedgerClient({ month, entries, categories }: { month: string; entries: Entry[]; categories: string[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const toast = useToast();
  const [form, setForm] = useState({ kind: "expense", date: today(), category: "", amount: "", note: "" });
  const [busy, setBusy] = useState(false);

  async function post(body: object) {
    const r = await fetch("/api/admin/ledger", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { toast(d.error || "Something went wrong", "error"); return false; }
    return true;
  }
  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await post({ action: "add", ...form, amount: Number(form.amount) });
    setBusy(false);
    if (ok) { setForm({ ...form, amount: "", note: "" }); toast("Added"); router.refresh(); }
  }
  async function del(id: number) {
    if (!(await confirm({ title: "Delete this entry?", confirmLabel: "Delete", danger: true }))) return;
    if (await post({ action: "delete", id })) { toast("Deleted"); router.refresh(); }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label className="text-sm text-white/70">Month <input type="month" value={month} onChange={(e) => router.push(`/admin/ledger?month=${e.target.value}`)} className={`${inputClass} ml-2 w-auto`} /></label>
          <a href={`/api/admin/ledger?export=csv&month=${month}`} className="ml-auto rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5">Export CSV</a>
        </div>
        <div className="overflow-x-auto">
          {entries.length === 0 ? (
            <p className="py-8 text-center text-white/40">No entries for {month}. Add income and expenses on the right.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-white/50"><tr><th className="py-2 pr-3 text-left">Date</th><th className="py-2 pr-3 text-left">Kind</th><th className="py-2 pr-3 text-left">Category</th><th className="py-2 pr-3 text-left">Note</th><th className="py-2 pr-3 text-right">Amount</th><th /></tr></thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-t border-white/10">
                    <td className="py-2 pr-3 whitespace-nowrap">{new Date(e.ts).toLocaleDateString()}</td>
                    <td className="py-2 pr-3"><span className={`rounded-full px-2 py-0.5 text-xs ${e.kind === "income" ? "bg-green-500/15 text-green-300" : "bg-red-500/15 text-red-300"}`}>{e.kind}</span></td>
                    <td className="py-2 pr-3">{e.category || <span className="text-white/35">—</span>}</td>
                    <td className="py-2 pr-3 max-w-[16rem] truncate text-white/70">{e.note}</td>
                    <td className={`py-2 pr-3 text-right tabular-nums ${e.kind === "income" ? "text-green-300" : "text-red-300"}`}>{e.kind === "income" ? "+" : "−"}{usd(e.amount)}</td>
                    <td className="py-2 text-right"><button onClick={() => del(e.id)} className="text-xs text-white/40 hover:text-red-300">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
      <Card>
        <h2 className="mb-3 font-display text-xl">Add entry</h2>
        <form onSubmit={add} className="grid gap-3 sm:grid-cols-2">
          <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className={inputClass}><option value="expense">Expense</option><option value="income">Income</option></select>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} required />
          <input list="ledger-cats" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} maxLength={60} />
          <datalist id="ledger-cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          <input type="number" step="0.01" min="0" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputClass} required />
          <input placeholder="Note (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={`${inputClass} sm:col-span-2`} maxLength={300} />
          <div className="sm:col-span-2"><button disabled={busy} className="btn-accent text-sm">{busy ? "Adding…" : "Add"}</button></div>
        </form>
      </Card>
    </div>
  );
}
