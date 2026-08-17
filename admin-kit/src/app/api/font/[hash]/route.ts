import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CUSTOM_HASH } from "@/lib/fonts";

/** Serves an uploaded font file. Immutable: the hash is the identity. */
export async function GET(_req: Request, { params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  if (!CUSTOM_HASH.test(hash)) return new NextResponse("Not found", { status: 404 });
  const row = await db.image.findUnique({ where: { hash } }).catch(() => null);
  if (!row || !row.mime.startsWith("font/")) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(row.bytes), {
    headers: {
      "Content-Type": row.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
