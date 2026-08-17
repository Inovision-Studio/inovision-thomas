import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireModule } from "@/lib/auth";
import { db } from "@/lib/db";

const TEMPLATES = ["editorial", "feature", "note"] as const;
const SLUG_RE = /^[a-z0-9-]+$/;
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

/** Validate + clamp a post payload. Returns an error string or the clean data. */
type PostInput = { title: string; slug: string; subtitle: string; body: string; template: string; images: string[]; published: boolean };
function parsePost(b: Record<string, unknown>): { error: string; data?: undefined } | { data: PostInput; error?: undefined } {
  const title = String(b.title ?? "").trim().slice(0, 200);
  const slug = String(b.slug ?? "").trim().slice(0, 80);
  const subtitle = String(b.subtitle ?? "").trim().slice(0, 300);
  const body = String(b.body ?? "").slice(0, 200_000);
  const template = String(b.template ?? "editorial");
  const images = Array.isArray(b.images) ? b.images.filter((x): x is string => typeof x === "string" && x.length > 0).slice(0, 30) : [];
  const published = Boolean(b.published);
  if (!title) return { error: "Title is required" };
  if (!SLUG_RE.test(slug)) return { error: "Slug may only contain a-z, 0-9 and dashes" };
  if (!(TEMPLATES as readonly string[]).includes(template)) return { error: "Bad template" };
  return { data: { title, slug, subtitle, body, template, images, published } };
}

const isSlugConflict = (e: unknown) => e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";

export async function POST(req: Request) {
  try { await requireModule("posts"); } catch { return bad("Unauthorized", 401); }
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const { action } = b;
  const id = Number(b.id);

  if (action === "create") {
    const p = parsePost(b);
    if (!p.data) return bad(p.error);
    try {
      const post = await db.post.create({ data: p.data });
      return NextResponse.json({ ok: true, id: post.id });
    } catch (e) {
      if (isSlugConflict(e)) return bad("That slug is already taken", 409);
      throw e;
    }
  }

  if (!Number.isInteger(id)) return bad("Bad id");

  if (action === "update") {
    const p = parsePost(b);
    if (!p.data) return bad(p.error);
    try {
      await db.post.update({ where: { id }, data: p.data });
    } catch (e) {
      if (isSlugConflict(e)) return bad("That slug is already taken", 409);
      throw e;
    }
  } else if (action === "togglePublished") {
    const cur = await db.post.findUnique({ where: { id }, select: { published: true } });
    if (!cur) return bad("Not found", 404);
    await db.post.update({ where: { id }, data: { published: !cur.published } });
  } else if (action === "delete") {
    await db.post.delete({ where: { id } });
  } else return bad("Bad action");
  return NextResponse.json({ ok: true });
}
