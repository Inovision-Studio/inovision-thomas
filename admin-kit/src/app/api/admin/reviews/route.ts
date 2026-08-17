import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json().catch(() => ({}));
  if (b.action === "delete") {
    await db.review.delete({ where: { id: Number(b.id) } });
  } else {
    const stars = Math.min(5, Math.max(1, Number(b.stars) || 5));
    const data = {
      name: String(b.name ?? "").trim(),
      stars,
      text: String(b.text ?? ""),
      sort: Number(b.sort) || 0,
    };
    if (!data.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (b.id) await db.review.update({ where: { id: Number(b.id) }, data });
    else await db.review.create({ data });
  }
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
