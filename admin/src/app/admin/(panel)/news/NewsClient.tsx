"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";

export type NewsItem = { id: number; source: string; title: string; link: string; summary: string; image: string; publishedAt: string | null; fetchedAt: string };
type Feed = { source: string; url: string };

export default function NewsClient({ news, feeds }: { news: NewsItem[]; feeds: Feed[] }) {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();

  const needle = q.trim().toLowerCase();
  const shown = needle ? news.filter((n) => `${n.title} ${n.summary} ${n.source}`.toLowerCase().includes(needle)) : news;

  async function post(body: object) {
    const r = await fetch("/api/admin/news", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return r.ok ? r.json() : null;
  }
  async function refresh() {
    setBusy(true);
    const res = await post({ action: "refresh" });
    setBusy(false);
    if (!res) return toast("Refresh failed", "error");
    const c = res.counts as Record<string, { added: number; error?: string }>;
    const added = Object.values(c).reduce((s, x) => s + x.added, 0);
    const failed = Object.entries(c).filter(([, x]) => x.error).map(([k]) => k);
    toast(`${added} new item${added === 1 ? "" : "s"}${failed.length ? ` · failed: ${failed.join(", ")}` : ""}`, failed.length && !added ? "error" : "ok");
    router.refresh();
  }
  async function del(n: NewsItem) {
    if (!(await confirm({ title: "Delete this item?", body: n.title, confirmLabel: "Delete", danger: true }))) return;
    if (!(await post({ action: "delete", id: n.id }))) return toast("Something went wrong", "error");
    toast("Deleted");
    router.refresh();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
      <Card>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, summary, source…" className={`${inputClass} mb-3`} />
        {shown.length === 0 ? (
          <p className="py-8 text-center text-white/40">{news.length === 0 ? "No news yet. Hit “Refresh feeds” to pull the latest headlines." : "Nothing matches your search."}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-white/50">
                <tr><th className="py-2 pr-3">Source</th><th className="py-2 pr-3">Article</th><th className="py-2 pr-3">Date</th><th className="py-2 pr-3" /></tr>
              </thead>
              <tbody>
                {shown.map((n) => (
                  <tr key={n.id} className="border-t border-white/10 align-top">
                    <td className="py-2 pr-3 whitespace-nowrap"><span className="rounded-full border border-[var(--accent)]/40 px-2 py-0.5 text-xs text-[var(--accent)]">{n.source}</span></td>
                    <td className="py-2 pr-3 min-w-[16rem]">
                      <a href={n.link} target="_blank" rel="noopener" className="font-semibold hover:text-[var(--accent)]">{n.title}</a>
                      {n.summary && <p className="mt-0.5 line-clamp-2 text-white/60">{n.summary}</p>}
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap text-white/60">{n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : "—"}</td>
                    <td className="py-2 pr-3 text-right"><button onClick={() => del(n)} className="rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Card className="self-start">
        <button onClick={refresh} disabled={busy} className="btn-accent w-full text-sm disabled:opacity-50">{busy ? "Refreshing…" : "Refresh feeds"}</button>
        <p className="mt-2 text-xs text-white/50">Pulls the newest headlines, skips links already saved, keeps the 60 most recent.</p>
        <h3 className="mt-5 text-[11px] font-bold tracking-widest text-white/50">FEEDS</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {feeds.map((f) => (
            <li key={f.url} className="min-w-0"><div className="font-semibold">{f.source}</div><div className="truncate text-xs text-white/40">{f.url}</div></li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-white/40">Feeds are hardcoded in the API route for now — ask a developer to add or change one.</p>
      </Card>
    </div>
  );
}
