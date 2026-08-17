import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireOwner, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { setSetting } from "@/lib/settings";

/** Every key the settings page may write. Anything else is dropped server-side. */
const SETTING_KEYS = [
  "business_name", "site_url", "contact_email", "phone", "address",
  "seo_title", "seo_description", "og_image",
  "instagram", "facebook", "linkedin", "x_url",
  "accent_color",
  "portal_welcome",
] as const;
type SettingKey = (typeof SETTING_KEYS)[number];
const MAX_LEN: Partial<Record<SettingKey, number>> = { seo_description: 400, portal_welcome: 4000, address: 500 };
const HEX = /^#[0-9a-f]{6}$/i;

export async function POST(req: Request) {
  let session;
  try { session = await requireOwner(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const body = await req.json().catch(() => ({}));

  if (body.action === "save") {
    const values = body.values;
    if (!values || typeof values !== "object") return NextResponse.json({ error: "Bad values" }, { status: 400 });
    const clean: [SettingKey, string][] = [];
    for (const key of SETTING_KEYS) {
      if (!(key in values)) continue;
      if (typeof values[key] !== "string") return NextResponse.json({ error: `Bad ${key}` }, { status: 400 });
      const v = values[key].trim().slice(0, MAX_LEN[key] ?? 200);
      if (key === "accent_color" && v && !HEX.test(v)) return NextResponse.json({ error: "Accent must be #rrggbb" }, { status: 400 });
      clean.push([key, v]);
    }
    for (const [k, v] of clean) await setSetting(k, v);
    return NextResponse.json({ ok: true, saved: clean.length });
  }

  if (body.action === "changePassword") {
    const { current, next } = body;
    if (typeof current !== "string" || typeof next !== "string") return NextResponse.json({ error: "Bad input" }, { status: 400 });
    if (next.length < 8 || next.length > 200) return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    const admin = await db.admin.findUnique({ where: { id: session.adminId } });
    if (!admin || !(await bcrypt.compare(current, admin.passwordHash))) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    await db.admin.update({ where: { id: admin.id }, data: { passwordHash: await hashPassword(next) } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Bad action" }, { status: 400 });
}
