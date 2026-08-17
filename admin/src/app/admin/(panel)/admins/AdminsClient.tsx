"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";

export type AdminRow = { id: number; email: string; name: string; role: string; permissions: string[]; disabled: boolean; createdBy: string; createdAt: string };
type Grantable = { key: string; label: string }[];

const secondary = "rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5";
const danger = "rounded-full border border-red-500/40 px-4 py-1.5 text-sm text-red-300 hover:bg-red-500/10";
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
function generatePassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

function RolePill({ role }: { role: string }) {
  return role === "owner"
    ? <span className="rounded-full bg-[var(--accent)]/20 px-2 py-0.5 text-xs font-semibold text-[var(--accent)]">owner</span>
    : <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs text-white/70">staff</span>;
}

function PermChecks({ grantable, value, onChange }: { grantable: Grantable; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 text-sm sm:grid-cols-3">
      {grantable.map((m) => (
        <label key={m.key} className="flex items-center gap-2 text-white/80">
          <input type="checkbox" className="accent-[var(--accent)]" checked={value.includes(m.key)} onChange={(e) => onChange(e.target.checked ? [...value, m.key] : value.filter((k) => k !== m.key))} />
          {m.label}
        </label>
      ))}
    </div>
  );
}

export default function AdminsClient({ admins, me, grantable }: { admins: AdminRow[]; me: number; grantable: Grantable }) {
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [edit, setEdit] = useState<{ name: string; role: string; permissions: string[]; password: string }>({ name: "", role: "staff", permissions: [], password: "" });
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff", permissions: [] as string[] });
  const editing = admins.find((a) => a.id === editId) ?? null;

  async function call(payload: Record<string, unknown>, okText: string) {
    setBusy(true);
    const r = await fetch("/api/admin/admins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setBusy(false);
    if (!r.ok) { toast((await r.json().catch(() => ({}))).error || "Something went wrong", "error"); return false; }
    toast(okText);
    router.refresh();
    return true;
  }
  function startEdit(a: AdminRow) {
    setEditId(a.id);
    setEdit({ name: a.name, role: a.role, permissions: a.permissions, password: "" });
  }
  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (await call({ action: "create", ...form }, `Added ${form.email}`)) setForm({ name: "", email: "", password: "", role: "staff", permissions: [] });
  }
  async function remove(a: AdminRow) {
    if (!(await confirm({ title: `Delete ${a.email}?`, body: "They will lose access immediately. This cannot be undone.", confirmLabel: "Delete", danger: true }))) return;
    if (await call({ action: "delete", id: a.id }, "Deleted") && editId === a.id) setEditId(null);
  }
  async function toggleDisabled(a: AdminRow) {
    if (!a.disabled && !(await confirm({ title: `Disable ${a.email}?`, body: "They will be signed out and unable to log in until re-enabled.", confirmLabel: "Disable", danger: true }))) return;
    await call({ action: "update", id: a.id, disabled: !a.disabled }, a.disabled ? "Enabled" : "Disabled");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <Card>
        {admins.length === 0 ? (
          <p className="py-8 text-center text-white/40">No admin accounts yet. Add one with the form to invite a teammate.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-white/50">
                <tr><th className="py-2 pr-3 font-medium">Name</th><th className="py-2 pr-3 font-medium">Email</th><th className="py-2 pr-3 font-medium">Role</th><th className="py-2 pr-3 font-medium">Permissions</th><th className="py-2 pr-3 font-medium">Created</th><th className="py-2 pr-3" /></tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id} className={`border-t border-white/10 ${a.disabled ? "opacity-50" : ""} ${editId === a.id ? "bg-white/5" : ""}`}>
                    <td className="py-2 pr-3 whitespace-nowrap">{a.name || <span className="text-white/40">—</span>}{a.id === me ? <span className="ml-1 text-xs text-white/40">(you)</span> : null}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{a.email}</td>
                    <td className="py-2 pr-3"><RolePill role={a.role} />{a.disabled ? <span className="ml-1 rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-300">disabled</span> : null}</td>
                    <td className="py-2 pr-3">
                      {a.role === "owner" ? <span className="text-xs text-white/40">all modules</span> : a.permissions.length === 0 ? <span className="text-xs text-white/40">none</span> : (
                        <div className="flex max-w-xs flex-wrap gap-1">{a.permissions.map((p) => <span key={p} className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] text-white/80">{grantable.find((g) => g.key === p)?.label ?? p}</span>)}</div>
                      )}
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap text-white/60">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 pr-3">
                      <div className="flex gap-1.5 whitespace-nowrap">
                        <button disabled={busy} onClick={() => startEdit(a)} className={secondary}>Edit</button>
                        <button disabled={busy || a.id === me} onClick={() => toggleDisabled(a)} className={`${secondary} disabled:opacity-40`}>{a.disabled ? "Enable" : "Disable"}</button>
                        <button disabled={busy || a.id === me} onClick={() => remove(a)} className={`${danger} disabled:opacity-40`}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid gap-4 self-start">
        {editing ? (
          <Card>
            <div className="mb-3 flex items-start justify-between gap-2">
              <div><h2 className="font-display text-2xl">Edit admin</h2><p className="text-sm text-white/60">{editing.email}</p></div>
              <button onClick={() => setEditId(null)} className={secondary}>Close</button>
            </div>
            <div className="grid gap-3">
              <label className="text-sm"><span className="mb-1 block text-white/60">Name</span><input className={inputClass} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
              <label className="text-sm"><span className="mb-1 block text-white/60">Role</span>
                <select className={inputClass} value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })} disabled={editing.id === me}><option value="staff">Staff</option><option value="owner">Owner</option></select>
              </label>
              {edit.role === "staff" ? <div><div className="mb-1 text-sm text-white/60">Permissions</div><PermChecks grantable={grantable} value={edit.permissions} onChange={(permissions) => setEdit({ ...edit, permissions })} /></div> : <p className="text-xs text-white/50">Owners can access every module.</p>}
              <button disabled={busy} onClick={() => call({ action: "update", id: editing.id, name: edit.name, role: edit.role, permissions: edit.permissions }, "Saved")} className="btn-accent text-sm">Save changes</button>
            </div>
            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="mb-1 text-sm text-white/60">Reset password</div>
              <div className="flex gap-2">
                <input className={inputClass} placeholder="New password (8+ chars)" value={edit.password} onChange={(e) => setEdit({ ...edit, password: e.target.value })} />
                <button type="button" onClick={() => setEdit({ ...edit, password: generatePassword() })} className={secondary}>Generate</button>
              </div>
              <button disabled={busy || edit.password.length < 8} onClick={async () => { if (await call({ action: "resetPassword", id: editing.id, password: edit.password }, "Password reset — share it with them securely")) setEdit({ ...edit, password: "" }); }} className={`${secondary} mt-2 disabled:opacity-40`}>Set new password</button>
            </div>
          </Card>
        ) : null}

        <Card>
          <h2 className="mb-3 font-display text-2xl">Invite / add admin</h2>
          <form onSubmit={create} className="grid gap-3">
            <label className="text-sm"><span className="mb-1 block text-white/60">Name</span><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label className="text-sm"><span className="mb-1 block text-white/60">Email</span><input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
            <label className="text-sm"><span className="mb-1 block text-white/60">Temporary password</span>
              <div className="flex gap-2">
                <input className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={8} required />
                <button type="button" onClick={() => setForm({ ...form, password: generatePassword() })} className={secondary}>Generate</button>
              </div>
            </label>
            <label className="text-sm"><span className="mb-1 block text-white/60">Role</span>
              <select className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="staff">Staff</option><option value="owner">Owner</option></select>
            </label>
            {form.role === "staff" ? <div><div className="mb-1 text-sm text-white/60">Permissions</div><PermChecks grantable={grantable} value={form.permissions} onChange={(permissions) => setForm({ ...form, permissions })} /></div> : null}
            <button disabled={busy} className="btn-accent text-sm">Add admin</button>
            <p className="text-xs text-white/40">Share the temporary password with them directly; they can be given a new one here any time.</p>
          </form>
        </Card>
      </div>
    </div>
  );
}
