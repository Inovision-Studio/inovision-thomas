import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { track } from "@/lib/track";

const MAX_POSITION = 60;
const MAX = { name: 80, email: 120, phone: 30, message: 1000 };

// Public unauthenticated endpoint — cap submissions per IP so it can't be used
// to flood the owner's inbox. In-memory is fine: a restart only resets counters.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many applications — try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const phone = clean(body.phone, MAX.phone);
  const message = clean(body.message, MAX.message);
  // roles are owner-configurable, so accept any short string rather than a fixed list
  const position = clean(body.position, MAX_POSITION) || "Any";

  if (name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!email && !phone) {
    return NextResponse.json({ error: "Add an email or phone so we can reach you." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }

  try {
    await db.jobApplication.create({ data: { name, email, phone, position, message } });
    void track("careers", req, { label: `role:${position.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "any"}` });
  } catch {
    return NextResponse.json({ error: "Couldn't save that — try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
