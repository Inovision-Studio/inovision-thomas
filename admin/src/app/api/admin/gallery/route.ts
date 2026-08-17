import { NextResponse } from "next/server";
import { requireModule } from "@/lib/auth";
import { db } from "@/lib/db";

const MAX_LEN = 200;
const clean = (v: unknown) => String(v ?? "").trim().slice(0, MAX_LEN);
const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function POST(req: Request) {
  try { await requireModule("gallery"); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const b = await req.json().catch(() => ({}));
  const { action } = b;

  if (action === "add") {
    const url = clean(b.url);
    if (!url || !(url.startsWith("/api/img/") || url.startsWith("/api/image/") || /^https?:\/\//.test(url))) return bad("Bad url");
    const max = await db.galleryItem.aggregate({ _max: { sort: true } });
    const item = await db.galleryItem.create({ data: { url, title: clean(b.title), category: clean(b.category), sort: (max._max.sort ?? -1) + 1 } });
    return NextResponse.json({ ok: true, id: item.id });
  }

  const id = Number(b.id);
  if (!Number.isInteger(id)) return bad("Bad id");

  if (action === "update") {
    await db.galleryItem.update({ where: { id }, data: { title: clean(b.title), category: clean(b.category) } });
  } else if (action === "delete") {
    await db.galleryItem.delete({ where: { id } });
  } else if (action === "move") {
    if (b.dir !== "up" && b.dir !== "down") return bad("Bad dir");
    const all = await db.galleryItem.findMany({ orderBy: [{ sort: "asc" }, { id: "asc" }], select: { id: true, sort: true } });
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) return bad("Bad id");
    const j = b.dir === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= all.length) return NextResponse.json({ ok: true }); // already at the edge
    const a = all[i], n = all[j];
    if (a.sort !== n.sort) {
      await db.$transaction([
        db.galleryItem.update({ where: { id: a.id }, data: { sort: n.sort } }),
        db.galleryItem.update({ where: { id: n.id }, data: { sort: a.sort } }),
      ]);
    } else {
      // Equal sorts (legacy default 0) — a swap is a no-op, so renumber the whole list with the swap applied.
      const order = all.map((x) => x.id);
      [order[i], order[j]] = [order[j], order[i]];
      await db.$transaction(order.map((oid, k) => db.galleryItem.update({ where: { id: oid }, data: { sort: k } })));
    }
  } else return bad("Bad action");
  return NextResponse.json({ ok: true });
}
