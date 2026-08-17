"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";
import { STAGES, STAGE_PILL, money } from "../stages";

export type ClientData = {
  id: number; name: string; email: string; phone: string; site: string; plan: string; hosting: boolean; ai: boolean; extra: number;
  projectFee: number; depositAmount: number; depositPaid: boolean; stage: string; stageAt: string | null; brief: string; notes: string;
  launchedAt: string | null; subActive: boolean; createdAt: string;
};
type Milestone = { id: number; title: string; due: string; done: boolean };
type Msg = { id: number; sender: string; author: string; body: string; createdAt: string };
type Deploy = { id: number; summary: string; url: string; ts: string };
type Agreement = { id: number; tosVersion: string; privacyVersion: string; agreedTos: boolean; agreedPrivacy: boolean; agreedArbitration: boolean; fullName: string; ip: string; createdAt: string };
type Invoice = { id: number; period: string; description: string; amount: number; status: string; createdAt: string; paidAt: string | null };

const SECONDARY = "rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5";
const TOGGLES = [["hosting", "Hosting"], ["ai", "AI add-on"], ["depositPaid", "Deposit paid"], ["subActive", "Subscription active"]] as const;
const fmt = (iso: string) => new Date(iso).toLocaleString();

export default function ClientDetailClient({ client, milestones, messages, deployments, agreements, invoices, isOwner }: {
  client: ClientData; milestones: Milestone[]; messages: Msg[]; deployments: Deploy[]; agreements: Agreement[]; invoices: Invoice[]; isOwner: boolean;
}) {
  const [f, setF] = useState({ name: client.name, email: client.email, phone: client.phone, site: client.site, plan: client.plan, stage: client.stage, extra: String(client.extra), projectFee: String(client.projectFee), depositAmount: String(client.depositAmount), brief: client.brief, notes: client.notes });
  const [ms, setMs] = useState({ title: "", due: "" });
  const [dep, setDep] = useState({ summary: "", url: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();

  async function post(body: Record<string, unknown>, okText?: string) {
    setBusy(true);
    const r = await fetch("/api/admin/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(false);
    if (!r.ok) { const e = await r.json().catch(() => ({})); toast(e.error || "Something went wrong", "error"); return false; }
    if (okText) toast(okText);
    router.refresh();
    return true;
  }
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) return toast("Name is required", "error");
    await post({ action: "update", id: client.id, ...f }, "Saved");
  }
  async function del() {
    if (!(await confirm({ title: `Delete ${client.name}?`, body: "Invoices, milestones, messages, deployments and agreements for this client are deleted too. This cannot be undone.", confirmLabel: "Delete client", danger: true }))) return;
    if (await post({ action: "delete", id: client.id }, "Client deleted")) router.push("/admin/clients");
  }
  async function addMilestone(e: React.FormEvent) {
    e.preventDefault();
    if (await post({ action: "milestone.add", clientId: client.id, ...ms }, "Milestone added")) setMs({ title: "", due: "" });
  }
  async function delMilestone(m: Milestone) {
    if (!(await confirm({ title: "Delete milestone?", body: m.title, confirmLabel: "Delete", danger: true }))) return;
    await post({ action: "milestone.delete", id: m.id }, "Milestone deleted");
  }
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (await post({ action: "message.add", clientId: client.id, body: msg }, "Message posted")) setMsg("");
  }
  async function addDeploy(e: React.FormEvent) {
    e.preventDefault();
    if (await post({ action: "deployment.add", clientId: client.id, ...dep }, "Deployment logged")) setDep({ summary: "", url: "" });
  }
  async function delDeploy(d: Deploy) {
    if (!(await confirm({ title: "Delete deployment?", body: d.summary, confirmLabel: "Delete", danger: true }))) return;
    await post({ action: "deployment.delete", id: d.id }, "Deployment deleted");
  }

  const done = milestones.filter((m) => m.done).length;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      {/* Left: details */}
      <div className="grid content-start gap-4">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl">Details</h2>
            <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${STAGE_PILL[client.stage] ?? "bg-white/10 text-white/80"}`}>{client.stage}</span>
          </div>
          <form onSubmit={save} className="grid gap-2">
            <label className="text-xs text-white/50">Name<input value={f.name} onChange={set("name")} required className={inputClass} /></label>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-white/50">Email<input type="email" value={f.email} onChange={set("email")} className={inputClass} /></label>
              <label className="text-xs text-white/50">Phone<input value={f.phone} onChange={set("phone")} className={inputClass} /></label>
            </div>
            <label className="text-xs text-white/50">Site<input value={f.site} onChange={set("site")} placeholder="https://…" className={inputClass} /></label>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-white/50">Plan<input value={f.plan} onChange={set("plan")} className={inputClass} /></label>
              <label className="text-xs text-white/50">Stage
                <select value={f.stage} onChange={set("stage")} className={`${inputClass} capitalize`}>
                  {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <label className="text-xs text-white/50">Project fee $<input type="number" min="0" step="0.01" value={f.projectFee} onChange={set("projectFee")} className={inputClass} /></label>
              <label className="text-xs text-white/50">Deposit $<input type="number" min="0" step="0.01" value={f.depositAmount} onChange={set("depositAmount")} className={inputClass} /></label>
              <label className="text-xs text-white/50">Extra $/mo<input type="number" min="0" step="0.01" value={f.extra} onChange={set("extra")} className={inputClass} /></label>
            </div>
            <label className="text-xs text-white/50">Brief<textarea rows={4} value={f.brief} onChange={set("brief")} className={inputClass} /></label>
            <label className="text-xs text-white/50">Notes (internal)<textarea rows={4} value={f.notes} onChange={set("notes")} className={inputClass} /></label>
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
              <span>Stage since {client.stageAt ? fmt(client.stageAt) : "—"}</span>
              <span>· Launched {client.launchedAt ? new Date(client.launchedAt).toLocaleDateString() : "—"}</span>
            </div>
            <div className="flex gap-2">
              <button disabled={busy} className="btn-accent text-sm disabled:opacity-50">Save</button>
              {isOwner ? <button type="button" onClick={del} className="rounded-full border border-red-500/40 px-4 py-1.5 text-sm text-red-300 hover:bg-red-500/10">Delete client</button> : null}
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="mb-3 font-display text-xl">Flags</h2>
          <div className="grid grid-cols-2 gap-2">
            {TOGGLES.map(([k, label]) => (
              <button key={k} type="button" disabled={busy} onClick={() => post({ action: "update", id: client.id, [k]: !client[k] })}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${client[k] ? "border-[var(--accent)]/60 bg-[var(--accent)]/10 text-white" : "border-white/10 text-white/60 hover:bg-white/5"}`}>
                <span className={`mr-2 inline-block h-2 w-2 rounded-full ${client[k] ? "bg-[var(--accent)]" : "bg-white/20"}`} />{label}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl">Invoices</h2>
            <Link href={`/admin/invoices?client=${client.id}`} className="text-sm text-[var(--accent)]">Manage →</Link>
          </div>
          {invoices.length === 0 ? <p className="py-8 text-center text-white/40">No invoices yet. Create one from the Invoices module.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-white/50"><tr><th className="py-2 pr-3 font-normal">Period</th><th className="py-2 pr-3 font-normal">Description</th><th className="py-2 pr-3 font-normal text-right">Amount</th><th className="py-2 pr-3 font-normal">Status</th></tr></thead>
                <tbody>
                  {invoices.map((i) => (
                    <tr key={i.id} className="border-t border-white/10">
                      <td className="py-2 pr-3 whitespace-nowrap">{i.period || new Date(i.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 pr-3 text-white/70">{i.description || "—"}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{money(i.amount)}</td>
                      <td className="py-2 pr-3"><span className={i.status === "paid" ? "text-[var(--accent)]" : "text-amber-300"}>{i.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-3 font-display text-xl">Agreements</h2>
          {agreements.length === 0 ? <p className="py-8 text-center text-white/40">No agreements signed yet. The client portal records them on sign-up.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-white/50"><tr><th className="py-2 pr-3 font-normal">Signed</th><th className="py-2 pr-3 font-normal">Name</th><th className="py-2 pr-3 font-normal">ToS</th><th className="py-2 pr-3 font-normal">Privacy</th><th className="py-2 pr-3 font-normal">Arb.</th><th className="py-2 pr-3 font-normal">IP</th></tr></thead>
                <tbody>
                  {agreements.map((a) => (
                    <tr key={a.id} className="border-t border-white/10">
                      <td className="py-2 pr-3 whitespace-nowrap">{fmt(a.createdAt)}</td>
                      <td className="py-2 pr-3">{a.fullName || "—"}</td>
                      <td className="py-2 pr-3">{a.agreedTos ? `v${a.tosVersion}` : "✗"}</td>
                      <td className="py-2 pr-3">{a.agreedPrivacy ? `v${a.privacyVersion}` : "✗"}</td>
                      <td className="py-2 pr-3">{a.agreedArbitration ? "✓" : "✗"}</td>
                      <td className="py-2 pr-3 text-white/50">{a.ip || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Right: activity */}
      <div className="grid content-start gap-4">
        <Card>
          <h2 className="mb-3 font-display text-xl">Milestones <span className="text-sm text-white/40">{done}/{milestones.length} done</span></h2>
          {milestones.length === 0 ? <p className="py-8 text-center text-white/40">No milestones yet. Add the first step below — the client sees these in their portal.</p> : (
            <ul className="divide-y divide-white/10">
              {milestones.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-2">
                  <button type="button" disabled={busy} onClick={() => post({ action: "milestone.toggle", id: m.id })} aria-label={m.done ? "Mark not done" : "Mark done"}
                    className={`h-5 w-5 shrink-0 rounded border ${m.done ? "border-[var(--accent)] bg-[var(--accent)] text-black" : "border-white/30 hover:border-white/60"}`}>{m.done ? "✓" : ""}</button>
                  <span className={`min-w-0 flex-1 text-sm ${m.done ? "text-white/40 line-through" : ""}`}>{m.title}</span>
                  {m.due ? <span className="shrink-0 text-xs text-white/40">{m.due}</span> : null}
                  <button type="button" onClick={() => delMilestone(m)} className="shrink-0 text-xs text-white/40 hover:text-red-300">Delete</button>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={addMilestone} className="mt-3 flex flex-wrap gap-2">
            <input required value={ms.title} onChange={(e) => setMs({ ...ms, title: e.target.value })} placeholder="Milestone title" className={`${inputClass} flex-1 min-w-[10rem]`} />
            <input type="date" value={ms.due} onChange={(e) => setMs({ ...ms, due: e.target.value })} className={`${inputClass} w-auto`} />
            <button disabled={busy} className="btn-accent text-sm disabled:opacity-50">Add</button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-3 font-display text-xl">Messages</h2>
          {messages.length === 0 ? <p className="py-8 text-center text-white/40">No messages yet. Post below — the client sees it in their portal.</p> : (
            <ul className="grid max-h-[28rem] gap-2 overflow-y-auto pr-1">
              {messages.map((m) => (
                <li key={m.id} className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.sender === "team" ? "justify-self-end bg-[var(--accent)]/15" : "bg-white/5"}`}>
                  <div className="mb-0.5 text-xs text-white/40">{m.author || (m.sender === "team" ? "Team" : "Client")} · {fmt(m.createdAt)}</div>
                  <div className="whitespace-pre-wrap">{m.body}</div>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={send} className="mt-3 grid gap-2">
            <textarea required rows={2} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Write to the client…" className={inputClass} />
            <button disabled={busy} className="btn-accent justify-self-end text-sm disabled:opacity-50">Post as team</button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-3 font-display text-xl">Deployments</h2>
          {deployments.length === 0 ? <p className="py-8 text-center text-white/40">No deployments logged. Note each release so the client can see what shipped.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-white/50"><tr><th className="py-2 pr-3 font-normal">When</th><th className="py-2 pr-3 font-normal">Summary</th><th className="py-2 pr-3 font-normal">URL</th><th className="py-2 pr-3" /></tr></thead>
                <tbody>
                  {deployments.map((d) => (
                    <tr key={d.id} className="border-t border-white/10">
                      <td className="py-2 pr-3 whitespace-nowrap text-white/60">{fmt(d.ts)}</td>
                      <td className="py-2 pr-3">{d.summary}</td>
                      <td className="py-2 pr-3">{d.url ? <a href={d.url} target="_blank" rel="noreferrer" className="text-[var(--accent)] break-all">{d.url}</a> : "—"}</td>
                      <td className="py-2 text-right"><button type="button" onClick={() => delDeploy(d)} className="text-xs text-white/40 hover:text-red-300">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <form onSubmit={addDeploy} className="mt-3 flex flex-wrap gap-2">
            <input required value={dep.summary} onChange={(e) => setDep({ ...dep, summary: e.target.value })} placeholder="What shipped" className={`${inputClass} flex-1 min-w-[10rem]`} />
            <input value={dep.url} onChange={(e) => setDep({ ...dep, url: e.target.value })} placeholder="https://…" className={`${inputClass} flex-1 min-w-[10rem]`} />
            <button disabled={busy} className="btn-accent text-sm disabled:opacity-50">Log</button>
          </form>
        </Card>
        <div className="text-center"><Link href="/admin/clients" className={SECONDARY}>← All clients</Link></div>
      </div>
    </div>
  );
}
