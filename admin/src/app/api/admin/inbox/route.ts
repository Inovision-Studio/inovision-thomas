import { NextResponse } from "next/server";
import { requireModule } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try { await requireModule("inbox"); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const { action, id } = await req.json().catch(() => ({}));
  const mid = Number(id);
  if (!Number.isInteger(mid)) return NextResponse.json({ error: "Bad id" }, { status: 400 });
  if (action === "read") await db.message.update({ where: { id: mid }, data: { readAt: new Date() } });
  else if (action === "unread") await db.message.update({ where: { id: mid }, data: { readAt: null } });
  else if (action === "delete") await db.message.delete({ where: { id: mid } });
  else return NextResponse.json({ error: "Bad action" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
