import { NextResponse } from "next/server";
import { requireModule } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try { await requireModule("applications"); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const { action, id } = await req.json().catch(() => ({}));
  const aid = Number(id);
  if (!Number.isInteger(aid)) return NextResponse.json({ error: "Bad id" }, { status: 400 });
  if (action === "read") await db.application.update({ where: { id: aid }, data: { readAt: new Date() } });
  else if (action === "unread") await db.application.update({ where: { id: aid }, data: { readAt: null } });
  else if (action === "delete") await db.application.delete({ where: { id: aid } });
  else return NextResponse.json({ error: "Bad action" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
