/**
 * Restore a scripts/backup.ts snapshot. Upserts everything by primary key, so it is
 * safe to run on a partially-populated DB; it never deletes rows that aren't in
 * the snapshot.
 *   npx tsx scripts/restore.ts backup/2026-08-17 --i-mean-production
 */
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
if (!dir || !fs.existsSync(path.join(dir, "manifest.json"))) {
  console.error("usage: tsx scripts/restore.ts <backupDir> [--i-mean-production]");
  process.exit(1);
}
const dbUrl = process.env.DATABASE_URL || "";
if (!/@(localhost|127\.0\.0\.1)[:/]/.test(dbUrl) && !process.argv.includes("--i-mean-production")) {
  console.error(`Refusing to restore into non-local database (${dbUrl.replace(/:[^:@]*@/, ":***@").slice(0, 60)}…). Pass --i-mean-production.`);
  process.exit(2);
}
const db = new PrismaClient();
const read = (n: string) => JSON.parse(fs.readFileSync(path.join(dir, `${n}.json`), "utf8"));
// parents before children (foreign keys)
const ORDER = ["setting", "admin", "message", "application", "post", "galleryItem", "teamMember", "teamMessage", "client", "invoice", "ledger", "milestone", "clientMessage", "deployment", "agreement", "project", "projectUpdate", "audit", "auditItem", "mockup", "news"];

(async () => {
  // images first — everything else references them by ref string
  const imgs = read("image") as { id: number; hash: string | null; mime: string; width: number | null; height: number | null; createdAt: string; file: string }[];
  for (const i of imgs) {
    const bytes = fs.readFileSync(path.join(dir, "images", i.file));
    const data = { hash: i.hash, mime: i.mime, bytes, width: i.width, height: i.height, createdAt: new Date(i.createdAt) };
    await db.image.upsert({ where: { id: i.id }, update: data, create: { id: i.id, ...data } });
  }
  await db.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Image"','id'), GREATEST((SELECT COALESCE(MAX(id),0) FROM "Image"), 100))`);
  console.log("images", imgs.length);
  for (const t of ORDER) {
    const rows = read(t) as Record<string, unknown>[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model = (db as any)[t];
    const pk = t === "setting" ? "key" : "id";
    for (const r of rows) {
      const { [pk]: id, ...rest } = r;
      await model.upsert({ where: { [pk]: id }, update: rest, create: r });
    }
    if (pk === "id" && rows.length) {
      const table = t.charAt(0).toUpperCase() + t.slice(1);
      await db.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${table}"','id'), (SELECT COALESCE(MAX(id),1) FROM "${table}"))`).catch(() => {});
    }
    console.log(t, rows.length);
  }
  console.log("restore complete from", dir);
})().finally(() => db.$disconnect());
