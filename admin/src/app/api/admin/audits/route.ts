import { NextResponse } from "next/server";
import { requireModule } from "@/lib/auth";
import { db } from "@/lib/db";

const STATUSES = ["in_progress", "delivered", "won", "lost"] as const;
const LEVELS = ["low", "medium", "high"] as const;
const bad = (error: string) => NextResponse.json({ error }, { status: 400 });
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);
const oneOf = <T extends string>(v: unknown, list: readonly T[]) => (list.includes(v as T) ? (v as T) : undefined);

export async function POST(req: Request) {
  try { await requireModule("audits"); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const b = await req.json().catch(() => ({}));
  const id = Number(b.id);

  if (b.action === "create") {
    const company = str(b.company, 200);
    if (!company) return bad("Company required");
    const a = await db.audit.create({ data: { company, contact: str(b.contact, 200) ?? "", email: str(b.email, 200) ?? "" } });
    return NextResponse.json({ ok: true, id: a.id });
  }
  if (!Number.isInteger(id)) return bad("Bad id");

  if (b.action === "update") {
    const data = { company: str(b.company, 200), contact: str(b.contact, 200), email: str(b.email, 200), status: oneOf(b.status, STATUSES), summary: str(b.summary, 20000) };
    if (data.company === "") return bad("Company required");
    if (b.status !== undefined && !data.status) return bad("Bad status");
    await db.audit.update({ where: { id }, data });
  } else if (b.action === "delete") {
    await db.audit.delete({ where: { id } });
  } else if (b.action === "item.add") {
    const finding = str(b.finding, 2000);
    if (!finding) return bad("Finding required");
    await db.auditItem.create({ data: { auditId: id, finding, area: str(b.area, 200) ?? "", recommendation: str(b.recommendation, 2000) ?? "", impact: oneOf(b.impact, LEVELS) ?? "medium", effort: oneOf(b.effort, LEVELS) ?? "medium" } });
  } else if (b.action === "item.update") {
    const data = { area: str(b.area, 200), finding: str(b.finding, 2000), recommendation: str(b.recommendation, 2000), impact: oneOf(b.impact, LEVELS), effort: oneOf(b.effort, LEVELS), done: typeof b.done === "boolean" ? b.done : undefined };
    if (data.finding === "") return bad("Finding required");
    if ((b.impact !== undefined && !data.impact) || (b.effort !== undefined && !data.effort)) return bad("Bad level");
    await db.auditItem.update({ where: { id }, data });
  } else if (b.action === "item.delete") {
    await db.auditItem.delete({ where: { id } });
  } else return bad("Bad action");
  return NextResponse.json({ ok: true });
}
