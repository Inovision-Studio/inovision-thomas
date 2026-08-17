import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { track } from "@/lib/track";

const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

/** Prizes are public so the wheel can render its segments before anyone spins. */
export async function GET() {
  const coupons = await db.coupon
    .findMany({ where: { active: true, kind: "slot" }, orderBy: { id: "asc" } })
    .catch(() => []);
  return NextResponse.json({
    prizes: coupons.map((c) => ({ id: c.id, label: c.label, discount: c.discount })),
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (recent.length > MAX_PER_WINDOW) {
    return NextResponse.json({ error: "You've had your spins for today — come back tomorrow!" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().slice(0, 120).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email to claim your prize." }, { status: 400 });
  }

  const coupons = await db.coupon
    .findMany({ where: { active: true, kind: "slot" }, orderBy: { id: "asc" } })
    .catch(() => []);
  if (coupons.length === 0) {
    return NextResponse.json({ error: "No prizes are set up yet." }, { status: 503 });
  }

  // One prize per email — a second spin returns the same result rather than
  // letting anyone reroll until they like the outcome.
  const existing = await db.vipMember.findFirst({ where: { email } }).catch(() => null);
  if (existing?.couponWon) {
    const won = coupons.find((c) => c.code === existing.couponWon) ?? coupons[0];
    return NextResponse.json({
      ok: true,
      already: true,
      index: coupons.findIndex((c) => c.id === won.id),
      code: won.code,
      label: won.label,
      discount: won.discount,
    });
  }

  // The server picks, not the browser — otherwise the prize is trivially forged.
  const won = coupons[Math.floor(Math.random() * coupons.length)];

  try {
    if (existing) {
      await db.vipMember.update({ where: { id: existing.id }, data: { couponWon: won.code } });
    } else {
      await db.vipMember.create({ data: { email, couponWon: won.code } });
    }
    await db.coupon.update({ where: { id: won.id }, data: { usedCount: { increment: 1 } } });
    void track("spin", req, { label: `prize:${won.code.toLowerCase()}` });
  } catch {
    return NextResponse.json({ error: "Couldn't save your prize — try again." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    index: coupons.findIndex((c) => c.id === won.id),
    code: won.code,
    label: won.label,
    discount: won.discount,
  });
}
