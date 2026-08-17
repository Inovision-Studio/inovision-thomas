import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try { await requireOwner(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const b = await req.json().catch(() => ({}));
  if (b.action === "add") {
    const kind = b.kind === "income" ? "income" : b.kind === "expense" ? "expense" : null;
    const amount = Math.round(Number(b.amount) * 100) / 100;
    const ts = new Date(String(b.date || ""));
    if (!kind || !Number.isFinite(amount) || amount <= 0 || amount > 1e9 || Number.isNaN(ts.getTime())) return NextResponse.json({ error: "Kind, valid date and a positive amount are required." }, { status: 400 });
    const row = await db.ledger.create({ data: { kind, amount, ts, category: String(b.category ?? "").trim().slice(0, 60), note: String(b.note ?? "").trim().slice(0, 300) } });
    return NextResponse.json({ ok: true, id: row.id });
  }
  if (b.action === "delete") {
    const id = Number(b.id);
    if (!Number.isInteger(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });
    await db.ledger.deleteMany({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Bad action" }, { status: 400 });
}

// CSV export: /api/admin/ledger?export=csv&month=YYYY-MM
export async function GET(req: Request) {
  try { await requireOwner(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const u = new URL(req.url);
  if (u.searchParams.get("export") !== "csv") return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const m = u.searchParams.get("month") || "";
  const where = /^\d{4}-\d{2}$/.test(m) ? (() => { const [y, mo] = m.split("-").map(Number); return { ts: { gte: new Date(y, mo - 1, 1), lt: new Date(y, mo, 1) } }; })() : {};
  const rows = await db.ledger.findMany({ where, orderBy: { ts: "asc" } });
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const csv = ["date,kind,category,amount,note", ...rows.map((r) => [r.ts.toISOString().slice(0, 10), r.kind, esc(r.category), r.amount.toFixed(2), esc(r.note)].join(","))].join("\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="ledger-${m || "all"}.csv"` } });
}
