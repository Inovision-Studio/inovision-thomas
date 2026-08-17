import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const KEEP_DAYS = 180;

/** Vercel Cron target (see vercel.json). Drops analytics rows older than KEEP_DAYS. */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cutoff = new Date(Date.now() - KEEP_DAYS * 24 * 60 * 60 * 1000);
  const { count } = await db.event.deleteMany({ where: { createdAt: { lt: cutoff } } });
  return NextResponse.json({ ok: true, deleted: count });
}
