import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public: the website's careers form posts here → Admin → Applications.
const WINDOW_MS = 10 * 60 * 1000, MAX = 5;
const hits = new Map<string, number[]>();
const CORS = { "Access-Control-Allow-Origin": "*" };

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now); hits.set(ip, recent);
  if (recent.length > MAX) return NextResponse.json({ error: "Too many submissions — try again later." }, { status: 429, headers: CORS });
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return NextResponse.json({ error: "Invalid body" }, { status: 400, headers: CORS });
  if (b.website) return NextResponse.json({ ok: true }, { headers: CORS }); // honeypot
  const s = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
  const role = s(b.role, 120), name = s(b.name, 120), email = s(b.email, 200);
  if (role.length < 2 || name.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "Role, name and a valid email are required." }, { status: 400, headers: CORS });
  await db.application.create({ data: { role, name, email, phone: s(b.phone, 40), message: s(b.message, 5000), workAuth: s(b.workAuth, 200), veteran: s(b.veteran, 200), disability: s(b.disability, 200) } });
  return NextResponse.json({ ok: true }, { status: 201, headers: CORS });
}
export async function OPTIONS() {
  return new NextResponse(null, { headers: { ...CORS, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
}
