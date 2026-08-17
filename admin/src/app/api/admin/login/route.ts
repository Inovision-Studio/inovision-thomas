import { NextResponse } from "next/server";
import { verifyAdmin, createSession } from "@/lib/auth";

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

  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  const session = await verifyAdmin(String(email), String(password));
  if (!session) {
    recordFailure(ip);
    return NextResponse.json({ error: "Wrong email or password" }, { status: 401 });
  }
  await createSession(session);
  return NextResponse.json({ ok: true, role: session.role });
}
