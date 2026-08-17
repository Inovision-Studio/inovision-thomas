import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { track } from "@/lib/track";

// Public: storefront submits a pickup reservation. No auth by design, so the
// input is clamped hard and the endpoint is rate-limited per IP.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

type Item = { slug: string; name: string; qty: number; price?: number };

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (recent.length > MAX_PER_WINDOW) {
    return NextResponse.json({ error: "Too many reservations from this device — give us a call instead." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const customer = String(body.customer ?? "").trim().slice(0, 80);
  const phone = String(body.phone ?? "").trim().slice(0, 30);
  const note = String(body.note ?? "").trim().slice(0, 300);
  const rawItems: unknown[] = Array.isArray(body.items) ? body.items.slice(0, 10) : [];

  if (customer.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 7) return NextResponse.json({ error: "Enter a phone number we can text or call." }, { status: 400 });

  // only real, published products can be reserved — the client sends slugs, we look them up
  const slugs = rawItems.map((i) => String((i as Item)?.slug ?? "").slice(0, 100)).filter(Boolean);
  const products = slugs.length ? await db.product.findMany({ where: { slug: { in: slugs }, published: true } }).catch(() => []) : [];
  const items = rawItems
    .map((raw) => {
      const r = raw as Item;
      const p = products.find((x) => x.slug === r.slug);
      if (!p) return null;
      const qty = Math.min(10, Math.max(1, Math.round(Number(r.qty) || 1)));
      return { slug: p.slug, name: p.name, qty, price: p.priceMin };
    })
    .filter(Boolean) as Item[];
  if (items.length === 0) return NextResponse.json({ error: "That item isn't available to reserve." }, { status: 400 });

  const order = await db.order.create({
    data: { customer, phone, items: note ? [...items, { note }] : items, status: "open" },
  });
  void track("click", req, { path: "/shop", label: "reserve:submit" });
  return NextResponse.json({ ok: true, id: order.id }, { status: 201 });
}
