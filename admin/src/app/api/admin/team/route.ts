import { NextResponse } from "next/server";
import { requireModule } from "@/lib/auth";
import { db } from "@/lib/db";

const bad = (error: string) => NextResponse.json({ error }, { status: 400 });
const str = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);
const MAX_MEMBERS = 200;

export async function POST(req: Request) {
  try { await requireModule("team"); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const b = await req.json().catch(() => ({}));
  const id = Number(b.id);
  const name = str(b.name), title = str(b.title), image = str(b.image, 500);

  if (b.action === "add") {
    if (!name) return bad("Name required");
    if ((await db.teamMember.count()) >= MAX_MEMBERS) return bad("Too many members");
    const last = await db.teamMember.findFirst({ orderBy: { sort: "desc" }, select: { sort: true } });
    const m = await db.teamMember.create({ data: { name, title: title ?? "", image: image ?? "", sort: (last?.sort ?? -1) + 1 } });
    return NextResponse.json({ ok: true, id: m.id });
  }
  if (!Number.isInteger(id)) return bad("Bad id");
  if (b.action === "update") {
    if (name === "") return bad("Name required");
    const data = { ...(name !== undefined && { name }), ...(title !== undefined && { title }), ...(image !== undefined && { image }) };
    if (!Object.keys(data).length) return bad("Nothing to update");
    await db.teamMember.update({ where: { id }, data });
  } else if (b.action === "delete") {
    await db.teamMember.delete({ where: { id } });
  } else if (b.action === "move") {
    if (b.dir !== "up" && b.dir !== "down") return bad("Bad dir");
    const all = await db.teamMember.findMany({ orderBy: [{ sort: "asc" }, { id: "asc" }], select: { id: true } });
    const i = all.findIndex((m) => m.id === id);
    const j = b.dir === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= all.length) return bad("Cannot move");
    const order = all.map((m) => m.id);
    [order[i], order[j]] = [order[j], order[i]];
    // Renumber the whole list so ties (all sort=0 after seed) can't make a swap a no-op.
    await db.$transaction(order.map((mid, sort) => db.teamMember.update({ where: { id: mid }, data: { sort } })));
  } else return bad("Bad action");
  return NextResponse.json({ ok: true });
}
