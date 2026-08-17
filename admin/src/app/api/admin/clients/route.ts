import { NextResponse } from "next/server";
import { requireModule, requireOwner } from "@/lib/auth";
import { db } from "@/lib/db";

import { STAGES } from "@/app/admin/(panel)/clients/stages";
const TEXT = ["name", "email", "phone", "site", "plan", "brief", "notes"] as const;
const MONEY = ["extra", "projectFee", "depositAmount"] as const;
const BOOL = ["hosting", "ai", "depositPaid", "subActive"] as const;

const bad = (m: string) => NextResponse.json({ error: m }, { status: 400 });
const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const money = (v: unknown) => { const n = Number(v); return Number.isFinite(n) ? Math.min(Math.max(0, Math.round(n * 100) / 100), 1e9) : 0; };
const int = (v: unknown) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };

/** Whitelisted, sanitized patch from a loose body. Only keys present in `b` are returned. */
function patch(b: Record<string, unknown>) {
  const d: Record<string, unknown> = {};
  for (const k of TEXT) if (k in b) d[k] = str(b[k], k === "brief" || k === "notes" ? 20000 : 500);
  for (const k of MONEY) if (k in b) d[k] = money(b[k]);
  for (const k of BOOL) if (k in b) d[k] = Boolean(b[k]);
  if ("stage" in b) {
    const s = str(b.stage, 40) as (typeof STAGES)[number];
    if (!STAGES.includes(s)) return null;
    d.stage = s;
  }
  return d;
}

export async function POST(req: Request) {
  let session;
  try { session = await requireModule("clients"); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const b: Record<string, unknown> = await req.json().catch(() => ({}));
  const { action } = b;
  const id = int(b.id), clientId = int(b.clientId);

  if (action === "create") {
    const d = patch(b);
    if (!d || !d.name) return bad("Name required");
    const c = await db.client.create({ data: d as { name: string } });
    return NextResponse.json({ ok: true, id: c.id });
  }
  if (action === "update") {
    if (!id) return bad("Bad id");
    const d = patch(b);
    if (!d) return bad("Bad stage");
    if ("name" in d && !d.name) return bad("Name required");
    if (d.stage) {
      const cur = await db.client.findUnique({ where: { id }, select: { stage: true } });
      if (!cur) return bad("Not found");
      if (cur.stage !== d.stage) { d.stageAt = new Date(); if (d.stage === "launched") d.launchedAt = new Date(); }
    }
    const { count } = await db.client.updateMany({ where: { id }, data: d });
    return count ? NextResponse.json({ ok: true }) : bad("Not found");
  }
  if (action === "delete") {
    try { await requireOwner(); } catch { return NextResponse.json({ error: "Owner only" }, { status: 403 }); }
    if (!id) return bad("Bad id");
    await db.client.deleteMany({ where: { id } }); // relations cascade (DB FK)
    return NextResponse.json({ ok: true });
  }
  if (action === "milestone.add") {
    const title = str(b.title, 200);
    if (!clientId || !title) return bad("Title required");
    await db.milestone.create({ data: { clientId, title, due: str(b.due, 40) } });
    return NextResponse.json({ ok: true });
  }
  if (action === "milestone.toggle") {
    if (!id) return bad("Bad id");
    const m = await db.milestone.findUnique({ where: { id }, select: { done: true } });
    if (!m) return bad("Not found");
    await db.milestone.update({ where: { id }, data: { done: !m.done } });
    return NextResponse.json({ ok: true });
  }
  if (action === "milestone.delete") {
    if (!id) return bad("Bad id");
    await db.milestone.deleteMany({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  if (action === "message.add") {
    const body = str(b.body, 20000);
    if (!clientId || !body) return bad("Message required");
    await db.clientMessage.create({ data: { clientId, body, sender: "team", author: session.name || session.email, readByTeam: true } });
    return NextResponse.json({ ok: true });
  }
  if (action === "deployment.add") {
    const summary = str(b.summary, 500);
    if (!clientId || !summary) return bad("Summary required");
    await db.deployment.create({ data: { clientId, summary, url: str(b.url, 1000) } });
    return NextResponse.json({ ok: true });
  }
  if (action === "deployment.delete") {
    if (!id) return bad("Bad id");
    await db.deployment.deleteMany({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  return bad("Bad action");
}
