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
  try {
    if (b.action === "delete") {
      await db.coupon.delete({ where: { id: Number(b.id) } });
    } else {
      const data = {
        code: String(b.code ?? "").trim(),
        label: String(b.label ?? ""),
        kind: b.kind === "manual" ? "manual" : "slot",
        discount: String(b.discount ?? ""),
        active: !!b.active,
        usedCount: Number(b.usedCount) || 0,
      };
      if (!data.code) return NextResponse.json({ error: "Code is required" }, { status: 400 });
      if (b.id) await db.coupon.update({ where: { id: Number(b.id) }, data });
      else await db.coupon.create({ data });
    }
  } catch (e) {
    const msg = e instanceof Error && e.message.includes("Unique") ? "Code already exists" : "Save failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  revalidatePath("/admin/coupons");
  return NextResponse.json({ ok: true });
}
