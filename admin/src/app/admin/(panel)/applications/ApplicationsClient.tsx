"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";

export type App = {
  id: number; role: string; name: string; email: string; phone: string; message: string;
  workAuth: string; veteran: string; disability: string; resumeName: string; resumeRef: string;
  createdAt: string; readAt: string | null;
};

export default function ApplicationsClient({ apps, tab }: { apps: App[]; tab: "all" | "unread" }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();
  const open = apps.find((a) => a.id === openId) ?? null;

  async function act(action: "read" | "unread" | "delete", id: number) {
    if (action === "delete" && !(await confirm({ title: "Delete this application?", body: "This cannot be undone.", confirmLabel: "Delete", danger: true }))) return;
    const r = await fetch("/api/admin/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, id }) });
    if (!r.ok) return toast("Something went wrong", "error");
    if (action === "delete") { setOpenId(null); toast("Deleted"); }
    router.refresh();
  }
  function show(a: App) {
    setOpenId(a.id);
    if (!a.readAt) void act("read", a.id);
  }
  const tabs = (["all", "unread"] as const).map((t) => (
    <Link key={t} href={t === "all" ? "/admin/applications" : "/admin/applications?tab=unread"} className={`rounded-full px-3 py-1 text-sm ${tab === t ? "bg-[var(--accent)] text-black" : "text-white/60 hover:bg-white/5"}`}>{t === "all" ? "All" : "Unread"}</Link>
  ));
  const extras = open ? ([["Work authorization", open.workAuth], ["Veteran status", open.veteran], ["Disability", open.disability]] as const).filter(([, v]) => v) : [];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <Card>
        <div className="mb-3 flex gap-2">{tabs}</div>
        {apps.length === 0 ? (
          <p className="py-8 text-center text-white/40">No applications{tab === "unread" ? " unread" : ""}. The public site's careers form POSTs to <code>/api/apply</code>.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {apps.map((a) => (
              <li key={a.id}>
                <button onClick={() => show(a)} className={`flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-white/5 ${openId === a.id ? "bg-white/5" : ""}`}>
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${a.readAt ? "bg-transparent" : "bg-[var(--accent)]"}`} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2 text-sm"><span className={a.readAt ? "text-white/80" : "font-semibold"}>{a.name}</span><span className="truncate text-white/40">{a.email}</span></span>
                    <span className="block truncate text-sm text-white/60">{a.role}{a.phone ? ` · ${a.phone}` : ""}</span>
                  </span>
                  <span className="shrink-0 text-xs text-white/40">{new Date(a.createdAt).toLocaleDateString()}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card>
        {open ? (
          <div>
            <div className="flex flex-wrap items-start gap-2">
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-2xl">{open.role}</h2>
                <p className="text-sm text-white/60">{open.name} · <a href={`mailto:${open.email}`} className="text-[var(--accent)]">{open.email}</a>{open.phone ? <> · <a href={`tel:${open.phone}`} className="text-[var(--accent)]">{open.phone}</a></> : null} · {new Date(open.createdAt).toLocaleString()}</p>
              </div>
              <a href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(`your ${open.role} application`)}`} className="btn-accent text-sm">Reply</a>
            </div>
            {open.message ? <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-white/85">{open.message}</p> : <p className="mt-5 text-sm text-white/40">No cover message.</p>}
            {(extras.length > 0 || open.resumeRef) && (
              <dl className="mt-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                {extras.map(([k, v]) => (
                  <div key={k}><dt className="text-white/50">{k}</dt><dd className="text-white/85">{v}</dd></div>
                ))}
                {open.resumeRef ? (
                  <div><dt className="text-white/50">Resume</dt><dd><a href={`/api/img/${encodeURIComponent(open.resumeRef)}`} target="_blank" rel="noopener" className="text-[var(--accent)] underline-offset-2 hover:underline">{open.resumeName || "Download"}</a></dd></div>
                ) : null}
              </dl>
            )}
            <div className="mt-6 flex gap-2 text-sm">
              <button onClick={() => act(open.readAt ? "unread" : "read", open.id)} className="rounded-full border border-white/20 px-4 py-1.5 text-white/80 hover:bg-white/5">Mark {open.readAt ? "unread" : "read"}</button>
              <button onClick={() => act("delete", open.id)} className="rounded-full border border-red-500/40 px-4 py-1.5 text-red-300 hover:bg-red-500/10">Delete</button>
            </div>
          </div>
        ) : (
          <p className="py-16 text-center text-white/40">Select an application</p>
        )}
      </Card>
    </div>
  );
}
