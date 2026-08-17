import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/auth";
import { db } from "@/lib/db";

const bad = (error: string) => NextResponse.json({ error }, { status: 400 });
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const money = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null;
};

export async function POST(req: Request) {
  try { await requireOwner(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const b = await req.json().catch(() => ({}));
  const id = Number(b.id);

  if (b.action === "create") {
    const clientId = Number(b.clientId);
    const amount = money(b.amount);
    if (!Number.isInteger(clientId)) return bad("Bad client");
    if (amount === null) return bad("Bad amount");
    if (!(await db.client.findUnique({ where: { id: clientId }, select: { id: true } }))) return bad("Unknown client");
    const inv = await db.invoice.create({
      data: {
        clientId,
        amount,
        period: str(b.period, 40),
        description: str(b.description, 500),
        recipient: str(b.recipient, 200),
        payUrl: str(b.payUrl, 1000),
      },
    });
    return NextResponse.json({ ok: true, id: inv.id });
  }

  if (!Number.isInteger(id)) return bad("Bad id");
  if (b.action === "setStatus") {
    if (b.status !== "paid" && b.status !== "unpaid") return bad("Bad status");
    await db.invoice.update({ where: { id }, data: { status: b.status, paidAt: b.status === "paid" ? new Date() : null } });
  } else if (b.action === "update") {
    const amount = money(b.amount);
    if (amount === null) return bad("Bad amount");
    await db.invoice.update({ where: { id }, data: { amount, description: str(b.description, 500), payUrl: str(b.payUrl, 1000) } });
  } else if (b.action === "delete") {
    await db.invoice.delete({ where: { id } });
  } else return bad("Bad action");
  return NextResponse.json({ ok: true });
}
