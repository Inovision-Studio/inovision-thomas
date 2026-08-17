/**
 * Creates the first owner admin. Idempotent.
 *   npx tsx prisma/seed.ts --email you@inovisionstudios.com --password "…" --name "Ghian"
 * or set ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME in the environment (same names the legacy app used).
 * Refuses non-localhost databases unless --i-mean-production is passed.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const arg = (n: string, d = "") => { const i = process.argv.indexOf(`--${n}`); return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const dbUrl = process.env.DATABASE_URL || "";
if (!/@(localhost|127\.0\.0\.1)[:/]/.test(dbUrl) && !process.argv.includes("--i-mean-production")) {
  console.error(`Refusing to seed non-local database (${dbUrl.replace(/:[^:@]*@/, ":***@").slice(0, 60)}…). Pass --i-mean-production.`);
  process.exit(2);
}
const db = new PrismaClient();
(async () => {
  const email = (arg("email", process.env.ADMIN_EMAIL || "")).trim().toLowerCase();
  const password = arg("password", process.env.ADMIN_PASSWORD || "");
  const name = arg("name", process.env.ADMIN_NAME || "Owner");
  if (!email || !password) throw new Error("need --email and --password (or ADMIN_EMAIL / ADMIN_PASSWORD)");
  const existing = await db.admin.findUnique({ where: { email } });
  if (existing) { console.log("admin exists:", email); return; }
  await db.admin.create({ data: { email, name, passwordHash: await bcrypt.hash(password, 10), role: "owner", createdBy: "seed" } });
  for (const [key, value] of Object.entries({ business_name: "Inovision Studios", site_url: "https://inovisionstudios.com", accent_color: "#f5a623" })) {
    await db.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }
  console.log(`owner created: ${email}`);
})().finally(() => db.$disconnect());
