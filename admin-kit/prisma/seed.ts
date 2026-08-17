/**
 * New-client seed. Idempotent: safe to re-run; never overwrites a setting the
 * owner already changed unless --force.
 *
 *   npx tsx prisma/seed.ts --name "Joe's Cafe" --vertical food --accent "#c8102e" --password "changeme" [--age 21] [--force]
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_SETTINGS } from "../src/lib/defaults";
import { VERTICALS, type Vertical } from "../src/lib/verticals";
import { DEFAULT_ORDER } from "../src/lib/homeLayout";

// Safety: refuse to run against anything that isn't a local database unless
// explicitly told to. On 2026-08-17 a seed meant for a scratch DB truncated a
// client's production Supabase because Prisma picked up a different .env.
const dbUrl = process.env.DATABASE_URL || "";
const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(dbUrl);
if (!isLocal && !process.argv.includes("--i-mean-production")) {
  console.error(`Refusing to seed a non-local database (${dbUrl.replace(/:[^:@]*@/, ":***@").slice(0, 60)}…).\nPass --i-mean-production if this really is a fresh client database.`);
  process.exit(2);
}
const db = new PrismaClient();

function arg(name: string, def = ""): string {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
const has = (name: string) => process.argv.includes(`--${name}`);

async function main() {
  const name = arg("name", "Your Store");
  const vertical = arg("vertical", "retail") as Vertical;
  const preset = VERTICALS[vertical];
  if (!preset) throw new Error(`Unknown vertical "${vertical}". One of: ${Object.keys(VERTICALS).join(", ")}`);
  const accent = arg("accent", DEFAULT_SETTINGS.accent_color);
  const password = arg("password", "changeme");
  const age = arg("age", preset.age_gate);
  const force = has("force");

  const settings: Record<string, string> = {
    ...DEFAULT_SETTINGS,
    ...preset.content,
    business_name: name,
    accent_color: accent,
    age_gate: age,
    vertical,
    home_layout: preset.hidden.length ? JSON.stringify({ order: DEFAULT_ORDER, hidden: preset.hidden, sections: {} }) : "",
    owner_password_hash: bcrypt.hashSync(password, 10),
  };
  let written = 0;
  for (const [key, value] of Object.entries(settings)) {
    const existing = await db.setting.findUnique({ where: { key } });
    if (existing && !force) continue;
    await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
    written++;
  }

  // Hours: 9–6 every day, closed Sunday. Owner edits in Admin → Staff & hours.
  for (let day = 0; day < 7; day++) {
    await db.businessHour.upsert({
      where: { day },
      update: {},
      create: { day, open: "9 AM", close: "6 PM", closed: day === 0 },
    });
  }

  // Empty galleries so Admin → Photos shows the slots to fill.
  for (const g of [
    { key: "hero", title: "Hero Slideshow" },
    { key: "coverflow", title: '"Step Inside" Gallery' },
    { key: "marquee", title: "Product Marquee" },
  ]) {
    await db.gallery.upsert({ where: { key: g.key }, update: {}, create: g });
  }

  console.log(`Seeded "${name}" (${preset.label}) — ${written} settings written, accent ${accent}, age gate ${age || "off"}.`);
  console.log(`Admin: /admin  password: ${password}  ← tell the owner to change it.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
