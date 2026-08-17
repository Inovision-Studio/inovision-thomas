/**
 * One-shot import from the legacy Astro app's SQLite (app-live/data/inovision.db)
 * into this Postgres schema. Idempotent per table (skips rows whose id already exists).
 *   NODE_PATH=../app-live/node_modules npx tsx scripts/import-legacy.ts ../app-live/data/inovision.db [--i-mean-production]
 * (better-sqlite3 lives in app-live's node_modules; this app doesn't depend on it.)
 */
import { PrismaClient } from "@prisma/client";
import { createRequire } from "node:module";
import path from "node:path";

const file = process.argv[2];
if (!file) { console.error("usage: tsx scripts/import-legacy.ts <path/to/inovision.db>"); process.exit(1); }
const dbUrl = process.env.DATABASE_URL || "";
if (!/@(localhost|127\.0\.0\.1)[:/]/.test(dbUrl) && !process.argv.includes("--i-mean-production")) {
  console.error("Refusing to import into a non-local database without --i-mean-production."); process.exit(2);
}
const require = createRequire(path.resolve(process.cwd(), "../app-live/package.json"));
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Database = require("better-sqlite3");
const sq = new Database(file, { readonly: true });
const db = new PrismaClient();
type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const ts = (n: number | null) => (n ? new Date(n < 1e12 ? n * 1000 : n) : null);
const rows = (t: string): Row[] => { try { return sq.prepare(`select * from ${t}`).all(); } catch (e) { console.warn("skip", t, String(e).split("\n")[0]); return []; } };

(async () => {
  const done: Record<string, number> = {};
  const put = async (name: string, list: Row[], fn: (r: Row) => Promise<unknown>) => { let n = 0; if (process.env.DEBUG) console.log(name, "rows:", list.length); for (const r of list) { try { await fn(r); n++; } catch (e) { console.warn(name, r.id, String(e).split("\n")[0]); } } done[name] = n; };

  await put("admins", rows("admins"), (r) => db.admin.upsert({ where: { email: String(r.email).toLowerCase() }, update: {}, create: { email: String(r.email).toLowerCase(), name: r.name || "", passwordHash: r.password_hash, role: r.role === "owner" ? "owner" : "staff", permissions: JSON.parse(r.permissions || "[]"), disabled: !!r.disabled, createdBy: r.created_by || "legacy", createdAt: ts(r.created_at) || new Date() } }));
  await put("messages", rows("messages"), (r) => db.message.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, name: r.name, email: r.email, subject: r.subject || "", body: r.body, ip: r.ip || "", userAgent: r.user_agent || "", createdAt: ts(r.created_at)!, readAt: ts(r.read_at) } }));
  await put("posts", rows("posts"), (r) => db.post.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, slug: r.slug, title: r.title, subtitle: r.subtitle || "", body: r.body, template: r.template || "editorial", images: JSON.parse(r.images || "[]"), published: !!r.published, views: r.views || 0, createdAt: ts(r.created_at)!, updatedAt: ts(r.updated_at)! } }));
  await put("news", rows("news"), (r) => db.news.upsert({ where: { link: r.link }, update: {}, create: { source: r.source, title: r.title, link: r.link, summary: r.summary || "", image: r.image || "", publishedAt: ts(r.published_at), fetchedAt: ts(r.fetched_at)! } }));
  await put("settings", rows("settings"), (r) => db.setting.upsert({ where: { key: r.key }, update: {}, create: { key: r.key, value: r.value } }));
  await put("gallery", rows("gallery"), (r) => db.galleryItem.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, url: r.url, title: r.title || "", category: r.category || "", sort: r.sort || 0, createdAt: ts(r.created_at)! } }));
  await put("team_members", rows("team_members"), (r) => db.teamMember.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, name: r.name, title: r.title || "", image: r.image || "", sort: r.sort || 0, createdAt: ts(r.created_at)! } }));
  await put("team_messages", rows("team_messages"), (r) => db.teamMessage.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, authorEmail: r.author_email, authorName: r.author_name || "", body: r.body || "", image: r.image || "", createdAt: ts(r.created_at)! } }));
  await put("clients", rows("clients"), (r) => db.client.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, name: r.name, email: r.email || "", phone: r.phone || "", site: r.site || "", plan: r.plan || "", hosting: !!r.hosting, ai: !!r.ai, extra: r.extra || 0, projectFee: r.project_fee || 0, depositAmount: r.deposit_amount || 0, depositPaid: !!r.deposit_paid, stage: r.stage || "onboarding", stageAt: ts(r.stage_at), brief: r.brief || "", notes: r.notes || "", launchedAt: ts(r.launched_at), subActive: !!r.sub_active, subId: r.sub_id || "", hzSubscriptionId: r.hz_subscription_id || "", passwordHash: r.password_hash || "", portalToken: r.portal_token || "", createdAt: ts(r.created_at)! } }));
  await put("invoices", rows("invoices"), (r) => db.invoice.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, clientId: r.client_id, period: r.period || "", description: r.description || "", recipient: r.recipient || "", amount: r.amount || 0, status: r.status || "unpaid", payUrl: r.pay_url || "", token: r.token || "", createdAt: ts(r.created_at)!, paidAt: ts(r.paid_at) } }));
  await put("ledger", rows("ledger"), (r) => db.ledger.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, ts: ts(r.ts)!, kind: r.kind, category: r.category || "", amount: r.amount || 0, note: r.note || "", createdAt: ts(r.created_at)! } }));
  await put("milestones", rows("milestones"), (r) => db.milestone.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, clientId: r.client_id, title: r.title, due: r.due || "", done: !!r.done, sort: r.sort || 0, createdAt: ts(r.created_at)! } }));
  await put("client_messages", rows("client_messages"), (r) => db.clientMessage.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, clientId: r.client_id, sender: r.sender || "team", author: r.author || "", body: r.body, readByClient: !!r.read_by_client, readByTeam: !!r.read_by_team, createdAt: ts(r.created_at)! } }));
  await put("deployments", rows("deployments"), (r) => db.deployment.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, clientId: r.client_id, summary: r.summary, url: r.url || "", ts: ts(r.ts)! } }));
  await put("agreements", rows("agreements"), (r) => db.agreement.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, clientId: r.client_id, tosVersion: r.tos_version, privacyVersion: r.privacy_version, agreedTos: !!r.agreed_tos, agreedPrivacy: !!r.agreed_privacy, agreedArbitration: !!r.agreed_arbitration, ip: r.ip || "", userAgent: r.user_agent || "", fullName: r.full_name || "", createdAt: ts(r.created_at)! } }));
  await put("projects", rows("projects"), (r) => db.project.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, name: r.name, status: r.status || "Active", createdAt: ts(r.created_at)! } }));
  await put("project_updates", rows("project_updates"), (r) => db.projectUpdate.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, projectId: r.project_id, authorName: r.author_name || "", body: r.body, kind: r.kind || "update", createdAt: ts(r.created_at)! } }));
  await put("applications", rows("applications"), (r) => db.application.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, role: r.role, name: r.name, email: r.email, phone: r.phone || "", message: r.message || "", workAuth: r.work_auth || "", veteran: r.veteran || "", disability: r.disability || "", resumeName: r.resume_name || "", createdAt: ts(r.created_at)!, readAt: ts(r.read_at) } }));
  await put("audits", rows("audits"), (r) => db.audit.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, company: r.company, contact: r.contact || "", email: r.email || "", status: r.status || "in_progress", summary: r.summary || "", createdAt: ts(r.created_at)! } }));
  await put("audit_items", rows("audit_items"), (r) => db.auditItem.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, auditId: r.audit_id, area: r.area || "", finding: r.finding, recommendation: r.recommendation || "", impact: r.impact || "medium", effort: r.effort || "medium", done: !!r.done, createdAt: ts(r.created_at)! } }));
  await put("mockups", rows("mockups"), (r) => db.mockup.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, name: r.name, html: r.html || "", messages: JSON.parse(r.messages || "[]"), updatedAt: ts(r.updated_at)! } }));
  for (const t of ["Message", "Post", "GalleryItem", "TeamMember", "TeamMessage", "Client", "Invoice", "Ledger", "Milestone", "ClientMessage", "Deployment", "Agreement", "Project", "ProjectUpdate", "Application", "Audit", "AuditItem", "Mockup", "Admin"]) {
    await db.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${t}"','id'), (SELECT COALESCE(MAX(id),1) FROM "${t}"))`).catch(() => {});
  }
  console.log("imported", done);
})().finally(() => db.$disconnect());
