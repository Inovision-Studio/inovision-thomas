import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public: the website's contact form posts here → Admin → Inbox.
const WINDOW_MS = 10 * 60 * 1000, MAX = 5;
const hits = new Map<string, number[]>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now); hits.set(ip, recent);
  if (recent.length > MAX) return NextResponse.json({ error: "Too many messages — try again later." }, { status: 429 });
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const name = String(b.name ?? "").trim().slice(0, 120), email = String(b.email ?? "").trim().slice(0, 200);
  const subject = String(b.subject ?? "").trim().slice(0, 200), body = String(b.body ?? b.message ?? "").trim().slice(0, 5000);
  if (b.website) return NextResponse.json({ ok: true }); // honeypot
  if (name.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || body.length < 5) return NextResponse.json({ error: "Name, a valid email and a message are required." }, { status: 400 });
  await db.message.create({ data: { name, email, subject, body, ip, userAgent: (req.headers.get("user-agent") || "").slice(0, 300) } });
  return NextResponse.json({ ok: true }, { status: 201, headers: { "Access-Control-Allow-Origin": "*" } });
}
export async function OPTIONS() {
  return new NextResponse(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
}
