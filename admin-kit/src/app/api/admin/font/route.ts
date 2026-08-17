import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireOwner } from "@/lib/auth";
import { db } from "@/lib/db";

const MAX_BYTES = 2 * 1024 * 1024;

/** Sniff the container by magic bytes — the extension in the filename lies. */
function detect(buf: Buffer): { ext: "woff2" | "ttf" | "otf"; mime: string } | null {
  const head = buf.subarray(0, 4);
  if (head.toString("ascii") === "wOF2") return { ext: "woff2", mime: "font/woff2" };
  if (head.toString("ascii") === "OTTO") return { ext: "otf", mime: "font/otf" };
  if (head[0] === 0 && head[1] === 1 && head[2] === 0 && head[3] === 0) return { ext: "ttf", mime: "font/ttf" };
  return null; // wOFF (v1) intentionally excluded — keep the served set to what every browser handles well
}

export async function POST(req: NextRequest) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Font files must be under 2 MB." }, { status: 413 });

  const buf = Buffer.from(await file.arrayBuffer());
  const kind = detect(buf);
  if (!kind) return NextResponse.json({ error: "That isn't a .woff2, .ttf or .otf font file." }, { status: 400 });

  const hash = `f_${randomUUID().replace(/-/g, "")}.${kind.ext}`;
  await db.image.create({ data: { hash, mime: kind.mime, bytes: buf } });
  const name = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").slice(0, 60) || "Custom font";
  return NextResponse.json({ ok: true, hash, name });
}
