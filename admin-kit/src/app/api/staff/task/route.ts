import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const s = await getSession();
  if (!s || s.role !== "staff") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json().catch(() => ({}));
  const done = !!b.done;
  await db.staffTask.update({
    where: { id: Number(b.id) },
    data: { done, doneBy: done ? s.name ?? "Staff" : null, doneAt: done ? new Date() : null },
  });
  return NextResponse.json({ ok: true });
}
