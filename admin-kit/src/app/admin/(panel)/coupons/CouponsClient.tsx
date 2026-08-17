"use client";
import { useConfirm, useToast } from "@/components/admin/Dialogs";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";

type Coupon = {
  id: number;
  code: string;
  label: string;
  kind: string;
  discount: string;
  active: boolean;
  usedCount: number;
};

const empty: Coupon = { id: 0, code: "", label: "", kind: "slot", discount: "", active: true, usedCount: 0 };

export default function CouponsClient({ coupons }: { coupons: Coupon[] }) {
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();
  const [form, setForm] = useState<Coupon>(empty);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function set<K extends keyof Coupon>(key: K, value: Coupon[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setBusy(true);
    setErr("");
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", ...form, id: form.id || undefined }),
    });
    setBusy(false);
    if (!res.ok) {
      setErr((await res.json().catch(() => ({}))).error || "Save failed");
      return;
    }
    setForm(empty);
    router.refresh();
  }

  async function del(id: number) {
    if (!(await confirm({ title: "Delete this coupon?", confirmLabel: "Delete", danger: true }))) return;
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    if (form.id === id) setForm(empty);
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-white/50">
              <tr>
                <th className="py-2 pr-3">Code</th>
                <th className="py-2 pr-3">Label</th>
                <th className="py-2 pr-3">Kind</th>
                <th className="py-2 pr-3">Discount</th>
                <th className="py-2 pr-3">Used</th>
                <th className="py-2 pr-3">Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-t border-white/10">
                  <td className="py-2 pr-3 font-mono">{c.code}</td>
                  <td className="py-2 pr-3">{c.label}</td>
                  <td className="py-2 pr-3">{c.kind}</td>
                  <td className="py-2 pr-3">{c.discount}</td>
                  <td className="py-2 pr-3">{c.usedCount}</td>
                  <td className="py-2 pr-3">{c.active ? "Yes" : "No"}</td>
                  <td className="py-2 text-right">
                    <button onClick={() => setForm(c)} className="text-[var(--accent)] hover:underline">
                      Edit
                    </button>
                    <button onClick={() => del(c.id)} className="ml-3 text-red-400 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-white/40">
                    No coupons yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-display text-xl">{form.id ? "Edit coupon" : "New coupon"}</h2>
        <div className="flex flex-col gap-3">
          <input className={inputClass} placeholder="Code" value={form.code} onChange={(e) => set("code", e.target.value)} />
          <input className={inputClass} placeholder="Label" value={form.label} onChange={(e) => set("label", e.target.value)} />
          <select className={inputClass} value={form.kind} onChange={(e) => set("kind", e.target.value)}>
            <option value="slot">slot</option>
            <option value="manual">manual</option>
          </select>
          <input className={inputClass} placeholder="Discount / prize" value={form.discount} onChange={(e) => set("discount", e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
            Active
          </label>
          <label className="text-sm text-white/60">
            Used count
            <input
              type="number"
              className={`${inputClass} mt-1`}
              value={form.usedCount}
              onChange={(e) => set("usedCount", Number(e.target.value))}
            />
          </label>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <div className="flex gap-2">
            <button onClick={save} disabled={busy} className="btn-accent text-sm">
              {busy ? "Saving…" : form.id ? "Update" : "Create"}
            </button>
            {form.id > 0 && (
              <button onClick={() => setForm(empty)} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5">
                Cancel
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
