import { NextResponse } from "next/server";
import { requireModule } from "@/lib/auth";
import { db } from "@/lib/db";

const NAME_MAX = 120;
const HTML_MAX = 2_000_000; // ~2MB — Postgres text is fine, but keep the request bounded

export async function POST(req: Request) {
  try { await requireModule("mockups"); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const { action, id, name, html } = await req.json().catch(() => ({}));
  const cleanName = typeof name === "string" ? name.trim().slice(0, NAME_MAX) : "";
  const cleanHtml = typeof html === "string" ? html : "";
  if (cleanHtml.length > HTML_MAX) return NextResponse.json({ error: "HTML too large" }, { status: 400 });

  if (action === "create") {
    if (!cleanName) return NextResponse.json({ error: "Name required" }, { status: 400 });
    const m = await db.mockup.create({ data: { name: cleanName, html: cleanHtml, messages: [] } });
    return NextResponse.json({ ok: true, id: m.id });
  }
  const mid = Number(id);
  if (!Number.isInteger(mid)) return NextResponse.json({ error: "Bad id" }, { status: 400 });
  if (action === "update") {
    if (!cleanName) return NextResponse.json({ error: "Name required" }, { status: 400 });
    await db.mockup.update({ where: { id: mid }, data: { name: cleanName, html: cleanHtml } });
  } else if (action === "delete") await db.mockup.delete({ where: { id: mid } });
  else return NextResponse.json({ error: "Bad action" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
