"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";

export type Msg = { id: number; name: string; email: string; subject: string; body: string; createdAt: string; readAt: string | null };

export default function InboxClient({ messages, tab }: { messages: Msg[]; tab: "all" | "unread" }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();
  const open = messages.find((m) => m.id === openId) ?? null;

  async function act(action: "read" | "unread" | "delete", id: number) {
    if (action === "delete" && !(await confirm({ title: "Delete this message?", body: "This cannot be undone.", confirmLabel: "Delete", danger: true }))) return;
    const r = await fetch("/api/admin/inbox", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, id }) });
    if (!r.ok) return toast("Something went wrong", "error");
    if (action === "delete") { setOpenId(null); toast("Deleted"); }
    router.refresh();
  }
  function show(m: Msg) {
    setOpenId(m.id);
    if (!m.readAt) void act("read", m.id);
  }
  const tabs = (["all", "unread"] as const).map((t) => (
    <Link key={t} href={t === "all" ? "/admin/inbox" : "/admin/inbox?tab=unread"} className={`rounded-full px-3 py-1 text-sm ${tab === t ? "bg-[var(--accent)] text-black" : "text-white/60 hover:bg-white/5"}`}>{t === "all" ? "All" : "Unread"}</Link>
  ));

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <Card>
        <div className="mb-3 flex gap-2">{tabs}</div>
        {messages.length === 0 ? (
          <p className="py-8 text-center text-white/40">No messages{tab === "unread" ? " unread" : ""}. The public site's contact form POSTs to <code>/api/contact</code>.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {messages.map((m) => (
              <li key={m.id}>
                <button onClick={() => show(m)} className={`flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-white/5 ${openId === m.id ? "bg-white/5" : ""}`}>
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${m.readAt ? "bg-transparent" : "bg-[var(--accent)]"}`} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2 text-sm"><span className={m.readAt ? "text-white/80" : "font-semibold"}>{m.name}</span><span className="truncate text-white/40">{m.email}</span></span>
                    <span className="block truncate text-sm text-white/60">{m.subject || m.body}</span>
                  </span>
                  <span className="shrink-0 text-xs text-white/40">{new Date(m.createdAt).toLocaleDateString()}</span>
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
                <h2 className="font-display text-2xl">{open.subject || "(no subject)"}</h2>
                <p className="text-sm text-white/60">{open.name} · <a href={`mailto:${open.email}`} className="text-[var(--accent)]">{open.email}</a> · {new Date(open.createdAt).toLocaleString()}</p>
              </div>
              <a href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject || "your message")}`} className="btn-accent text-sm">Reply</a>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-white/85">{open.body}</p>
            <div className="mt-6 flex gap-2 text-sm">
              <button onClick={() => act(open.readAt ? "unread" : "read", open.id)} className="rounded-full border border-white/20 px-4 py-1.5 text-white/80 hover:bg-white/5">Mark {open.readAt ? "unread" : "read"}</button>
              <button onClick={() => act("delete", open.id)} className="rounded-full border border-red-500/40 px-4 py-1.5 text-red-300 hover:bg-red-500/10">Delete</button>
            </div>
          </div>
        ) : (
          <p className="py-16 text-center text-white/40">Select a message</p>
        )}
      </Card>
    </div>
  );
}
