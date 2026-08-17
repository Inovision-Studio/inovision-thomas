import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { db } from "@/lib/db";

/**
 * Normalize any image bytes to WebP (2400px max, q88) and store them in the
 * Image table. Shared by the admin upload route and AI cover generation so
 * every image on the site goes through the same pipeline.
 */
export async function storeImage(input: Buffer, opts?: { cover?: { width: number; height: number } }) {
  let pipeline = sharp(input).rotate();
  pipeline = opts?.cover
    ? pipeline.resize({ width: opts.cover.width, height: opts.cover.height, fit: "cover" })
    : pipeline.resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true });
  const webp = await pipeline.webp({ quality: 88 }).toBuffer();
  const meta = await sharp(webp).metadata();
  const hash = `iv_${randomUUID().replace(/-/g, "")}.webp`;
  const row = await db.image.create({
    data: { hash, mime: "image/webp", bytes: webp, width: meta.width, height: meta.height },
    select: { id: true },
  });
  return { id: row.id, ref: `/api/img/${hash}`, hash };
}
