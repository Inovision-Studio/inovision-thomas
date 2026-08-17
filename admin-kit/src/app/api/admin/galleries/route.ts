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

  if (b.action === "add") {
    const galleryId = Number(b.galleryId);
    const imageRef = String(b.imageRef ?? "").trim();
    if (!galleryId || !imageRef) return NextResponse.json({ error: "Missing image" }, { status: 400 });
    const last = await db.galleryImage.findFirst({ where: { galleryId }, orderBy: { sort: "desc" } });
    await db.galleryImage.create({ data: { galleryId, imageRef, sort: (last?.sort ?? -1) + 1 } });
  } else if (b.action === "remove") {
    await db.galleryImage.delete({ where: { id: Number(b.id) } });
  } else if (b.action === "reorder") {
    const ids: number[] = Array.isArray(b.ids) ? b.ids.map(Number) : [];
    await db.$transaction(ids.map((id, i) => db.galleryImage.update({ where: { id }, data: { sort: i } })));
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  revalidatePath("/admin/galleries");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
