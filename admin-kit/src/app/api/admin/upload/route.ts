import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/auth";
import { storeImage } from "@/lib/storeImage";

export async function POST(req: NextRequest) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });

  const stored = await storeImage(Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ ok: true, ...stored });
}
