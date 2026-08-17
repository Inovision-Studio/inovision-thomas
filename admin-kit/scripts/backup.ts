/**
 * Full logical backup: every table → JSON, every image → file (by id or hash).
 *   npx tsx scripts/backup.ts [outDir]          default: backup/<YYYY-MM-DD>
 * Restore with scripts/restore.ts. Read-only against the DB.
 */
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const db = new PrismaClient();
const TABLES = ["product", "blogPost", "coupon", "review", "gallery", "galleryImage", "vipMember", "newsletterSub", "order", "staffMember", "staffPunch", "staffTask", "businessHour", "setting", "location", "jobApplication"] as const;
// `event` (analytics) is intentionally skipped — large, low value, pruned anyway.

(async () => {
  const out = process.argv[2] || path.join("backup", new Date().toISOString().slice(0, 10));
  fs.mkdirSync(path.join(out, "images"), { recursive: true });
  const manifest: Record<string, number> = {};
  for (const t of TABLES) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await (db as any)[t].findMany();
    fs.writeFileSync(path.join(out, `${t}.json`), JSON.stringify(rows, null, 1));
    manifest[t] = rows.length;
  }
  const imgs = await db.image.findMany({ select: { id: true, hash: true, mime: true, width: true, height: true, createdAt: true } });
  const meta: object[] = [];
  for (const i of imgs) {
    const full = await db.image.findUnique({ where: { id: i.id }, select: { bytes: true } });
    if (!full) continue;
    const ext = i.mime.split("/")[1]?.replace("jpeg", "jpg") || "bin";
    const file = i.hash ? i.hash : `id-${i.id}.${ext}`;
    fs.writeFileSync(path.join(out, "images", file), Buffer.from(full.bytes));
    meta.push({ ...i, file });
  }
  fs.writeFileSync(path.join(out, "image.json"), JSON.stringify(meta, null, 1));
  manifest.image = meta.length;
  fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify({ at: new Date().toISOString(), tables: manifest }, null, 2));
  console.log("backup →", out, manifest);
})().finally(() => db.$disconnect());
