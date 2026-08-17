import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const s = await getSession();
  if (!s || s.role !== "staff" || !s.staffId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json().catch(() => ({}));
  const kind = b.kind === "out" ? "out" : "in";
  const lat = b.lat == null ? null : Number(b.lat);
  const lng = b.lng == null ? null : Number(b.lng);
  await db.staffPunch.create({ data: { staffId: s.staffId, kind, lat, lng } });
  return NextResponse.json({ ok: true });
}
