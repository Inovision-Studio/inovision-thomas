import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { track } from "@/lib/track";

// Public endpoint — cap per IP so it can't be used to stuff the list.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (recent.length > MAX_PER_WINDOW) {
    return NextResponse.json({ error: "Too many signups — try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().slice(0, 120).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }

  try {
    const existing = await db.vipMember.findFirst({ where: { email } });
    if (existing) return NextResponse.json({ ok: true, already: true });

    // Hand out a real coupon when one is available, so joining is worth something.
    const coupon = await db.coupon.findFirst({ orderBy: { id: "asc" } }).catch(() => null);
    await db.vipMember.create({ data: { email, couponWon: coupon?.code ?? null } });
    void track("vip", req);
    return NextResponse.json({ ok: true, coupon: coupon?.code ?? null, label: coupon?.label ?? null });
  } catch {
    return NextResponse.json({ error: "Couldn't sign you up — try again." }, { status: 500 });
  }
}
