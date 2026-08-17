import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/auth";
import { db } from "@/lib/db";

// Library list for the image picker.
export async function GET() {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // fonts share this table (mime font/*) — the picker must only see images
  const imgs = await db.image.findMany({
    where: { mime: { startsWith: "image/" } },
    orderBy: { id: "desc" },
    select: { id: true, hash: true },
  });
  const items = imgs.map((i) => ({
    id: i.id,
    ref: i.hash ? `/api/img/${i.hash}` : `/api/image/${i.id}`,
  }));
  return NextResponse.json({ items });
}
