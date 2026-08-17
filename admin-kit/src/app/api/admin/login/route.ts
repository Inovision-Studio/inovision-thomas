import { NextResponse } from "next/server";
import { verifyOwnerPassword, createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
// ponytail: per-instance memory — resets on cold start; DB-backed counter if brute force ever matters more
const attempts = new Map<string, { count: number; resetAt: number }>();

function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) return false;
  return rec.count >= MAX_ATTEMPTS;
}

function recordFailure(ip: string) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    rec.count++;
  }
  if (attempts.size > 1000) {
    for (const [k, v] of attempts) if (now > v.resetAt) attempts.delete(k);
  }
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (tooManyAttempts(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429, headers: { "Retry-After": "900" } },
    );
  }

  const { mode, password, name, pin } = await req.json().catch(() => ({}));

  if (mode === "staff") {
    if (!name || !pin) return NextResponse.json({ error: "Name and PIN required" }, { status: 400 });
    const staff = await db.staffMember.findFirst({ where: { name, active: true } });
    if (!staff || !bcrypt.compareSync(String(pin), staff.pinHash)) {
      recordFailure(ip);
      return NextResponse.json({ error: "Invalid name or PIN" }, { status: 401 });
    }
    await createSession({ role: "staff", staffId: staff.id, name: staff.name });
    return NextResponse.json({ ok: true, role: "staff" });
  }

  // owner
  if (!password || !(await verifyOwnerPassword(password))) {
    recordFailure(ip);
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  await createSession({ role: "owner" });
  return NextResponse.json({ ok: true, role: "owner" });
}
