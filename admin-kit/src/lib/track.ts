import { TIMEZONE } from "./site";
import { createHmac } from "node:crypto";
import { db } from "@/lib/db";

/**
 * First-party analytics. No cookies and no raw IP: `visitor` is an HMAC of
 * ip+ua+day that rotates every midnight (store timezone), so uniques can be counted
 * without ever storing something that identifies a person.
 */
export const KINDS = ["pageview", "click", "spin", "vip", "careers", "chat"] as const;
export type Kind = (typeof KINDS)[number];
/** Kinds the public beacon may send; the rest are recorded server-side only. */
export const PUBLIC_KINDS: Kind[] = ["pageview", "click"];

export const BOT_UA =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python-requests|go-http|axios|node-fetch|monitor|uptime|vercel-screenshot/i;

const secret = process.env.JWT_SECRET || "dev-secret-change-me";

function dayKey(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function visitorId(ip: string, ua: string): string {
  return createHmac("sha256", secret).update(`${ip}|${ua}|${dayKey()}`).digest("hex").slice(0, 24);
}

function isOwner(req: Request): boolean {
  const c = req.headers.get("cookie") || "";
  return /(?:^|;\s*)mb_session=/.test(c);
}

/**
 * Record one event. Never throws and never blocks the caller — analytics must
 * not be able to break a checkout, a spin or a chat reply.
 */
export async function track(kind: Kind, req: Request, extra: { path?: string; label?: string; ref?: string } = {}): Promise<void> {
  try {
    const ua = (req.headers.get("user-agent") || "").slice(0, 160);
    if (!ua || BOT_UA.test(ua)) return;
    if (isOwner(req)) return; // the owner poking around the site isn't traffic
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    await db.event.create({
      data: {
        kind,
        path: (extra.path || "").slice(0, 200),
        label: (extra.label || "").slice(0, 60),
        ref: (extra.ref || "").slice(0, 200),
        visitor: visitorId(ip, ua),
        ua,
      },
    });
  } catch {
    // swallow — see docblock
  }
}
