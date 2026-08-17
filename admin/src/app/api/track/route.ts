import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_KINDS, track, type Kind } from "@/lib/track";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 120;
const hits = new Map<string, number[]>();

const LABEL = /^[a-z]+:[a-z0-9-]+$/;
const BLOCKED_PATH = /^\/(admin|clock|api)(\/|$)/;

/** Public beacon target. Always 204 for anything shaped right; 400 only for garbage. */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (recent.length > MAX_PER_WINDOW) return new NextResponse(null, { status: 204 }); // silently drop, don't feed abusers errors

  // sendBeacon posts text/plain; parse by hand
  let body: { kind?: string; path?: string; label?: string; ref?: string } | null = null;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return NextResponse.json({ error: "Bad body" }, { status: 400 });
  }
  const kind = body?.kind as Kind;
  if (!PUBLIC_KINDS.includes(kind)) return NextResponse.json({ error: "Bad kind" }, { status: 400 });
  const path = String(body?.path ?? "");
  if (!path.startsWith("/") || path.startsWith("//") || BLOCKED_PATH.test(path)) return new NextResponse(null, { status: 204 });
  const label = String(body?.label ?? "");
  if (kind === "click" && !LABEL.test(label)) return NextResponse.json({ error: "Bad label" }, { status: 400 });

  await track(kind, req, { path, label, ref: String(body?.ref ?? "") });
  return new NextResponse(null, { status: 204 });
}
