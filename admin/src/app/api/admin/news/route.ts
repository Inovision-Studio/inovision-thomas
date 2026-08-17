import { NextResponse } from "next/server";
import { requireModule } from "@/lib/auth";
import { db } from "@/lib/db";
import { FEEDS, MAX_ITEMS, parseFeed } from "./feeds";

async function refresh() {
  const counts: Record<string, { added: number; seen: number; error?: string }> = {};
  for (const f of FEEDS) {
    try {
      const r = await fetch(f.url, { signal: AbortSignal.timeout(10_000), headers: { "User-Agent": "InovisionAdmin/1.0" }, cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const items = parseFeed(await r.text());
      if (items.length === 0) throw new Error("no items in feed");
      let added = 0;
      for (const it of items) {
        const res = await db.news.createMany({ data: { source: f.source, ...it }, skipDuplicates: true });
        added += res.count;
      }
      counts[f.source] = { added, seen: items.length };
    } catch (e) {
      counts[f.source] = { added: 0, seen: 0, error: e instanceof Error ? e.message : "fetch failed" };
    }
  }
  // cap: keep the newest MAX_ITEMS by publishedAt (nulls last), delete the rest
  const keep = await db.news.findMany({ select: { id: true }, orderBy: [{ publishedAt: { sort: "desc", nulls: "last" } }, { id: "desc" }], take: MAX_ITEMS });
  const { count: pruned } = await db.news.deleteMany({ where: { id: { notIn: keep.map((k) => k.id) } } });
  return { counts, pruned };
}

export async function POST(req: Request) {
  try { await requireModule("news"); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const { action, id } = await req.json().catch(() => ({}));
  if (action === "refresh") return NextResponse.json({ ok: true, ...(await refresh()) });
  if (action === "delete") {
    const nid = Number(id);
    if (!Number.isInteger(nid)) return NextResponse.json({ error: "Bad id" }, { status: 400 });
    await db.news.delete({ where: { id: nid } });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Bad action" }, { status: 400 });
}
