import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "inovision.db");
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
const SAMPLE_POST = {
  slug: "mi-budz-redeye-and-the-case-for-the-michigan-smoke-shop",
  title: "Mi Budz, Redeye, and the case for the Michigan smoke shop",
  subtitle: "A first look at three local brands we're proud to have in the portfolio — and what each one taught us about designing for the rooms they live in.",
  template: "gallery",
  images: JSON.stringify([
    "/portfolio-mi-budz.webp",
    "/portfolio-redeye.webp",
    "/portfolio-cornerstore.webp"
  ]),
  body: "There's a stretch of small Michigan towns where smoke shops have quietly become some of the most considered retail spaces in the state. The good ones aren't gas-station counters with fluorescent lighting and a Plexiglas display case. They're rooms with point of view — character mascots, curated glass collections, RAW outlets you can actually walk into. The web work has to keep up.\n\nThe first three brands in our portfolio land squarely in that world. All three are Michigan-owned, all three serve communities that walk in by name, and all three needed sites that worked harder than the templates they started with. Here's the case for each.\n\n— Mi Budz —\n\nSterling Heights. Hayes Road. A character-led shop with a laughing mascot and a real point of view about being approachable instead of edgy. The brief writes itself: warm color, bold type, the mascot front and center, every product surfaced fast for a phone audience that's deciding which corner to drive to.\n\nVisit: mi-budz.com\n\n— Redeye Fenton —\n\nThe upscale entry in the lineup. Fenton, Michigan, with a deliberate move away from the traditional smoke-shop aesthetic toward something more boutique — high-quality glass pieces, modern vapes, an environment that reads more art gallery than convenience store. The site had to do the same. Quieter type, more whitespace, less yelling. The kind of room where the design lets the product breathe.\n\nVisit: redeyefenton.com\n\n— Your Corner Store Smoke Shop —\n\nThe official RAW outlet in Fraser. A specialty positioning — the full line of RAW's rolling papers, hemp wick, trays, and apparel — that earns a specialty experience. The challenge here was treating the RAW partnership as a co-brand without losing the local-shop personality. Bold orange-and-natural cues, but the welcome at the door is still very much yours.\n\nVisit: yourcornerstoresmokeshop.com\n\n— What we took from all three —\n\nThree very different brands. Three different shoppers. One shared lesson: Michigan smoke-shop customers respond to specificity. Generic premium-vape aesthetics get scrolled past. Mascots, location pride, RAW partnerships, a recognizable storefront photo on the homepage — the local details are exactly what makes the digital presence feel real.\n\nWe'll be writing more case studies as the work ships. If you run a vape shop, a smoke shop, or anything where the storefront does most of the talking, that's exactly the brief we want."
};
function open() {
  const db2 = new Database(DB_PATH);
  db2.pragma("journal_mode = WAL");
  db2.pragma("foreign_keys = ON");
  db2.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL,
      subject     TEXT,
      body        TEXT NOT NULL,
      ip          TEXT,
      user_agent  TEXT,
      created_at  INTEGER NOT NULL,
      read_at     INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_messages_unread  ON messages(read_at) WHERE read_at IS NULL;

    CREATE TABLE IF NOT EXISTS posts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      slug        TEXT UNIQUE NOT NULL,
      title       TEXT NOT NULL,
      subtitle    TEXT,
      body        TEXT NOT NULL,
      template    TEXT NOT NULL DEFAULT 'editorial',
      images      TEXT NOT NULL DEFAULT '[]',
      published   INTEGER NOT NULL DEFAULT 0,
      views       INTEGER NOT NULL DEFAULT 0,
      created_at  INTEGER NOT NULL,
      updated_at  INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
    CREATE INDEX IF NOT EXISTS idx_posts_pub  ON posts(published, created_at DESC);

    CREATE TABLE IF NOT EXISTS events (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      kind        TEXT NOT NULL,
      path        TEXT,
      post_id     INTEGER,
      created_at  INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_events_kind    ON events(kind, created_at DESC);

    CREATE TABLE IF NOT EXISTS news (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      source        TEXT NOT NULL,
      title         TEXT NOT NULL,
      link          TEXT UNIQUE NOT NULL,
      summary       TEXT,
      image         TEXT,
      published_at  INTEGER,
      fetched_at    INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_news_pub ON news(published_at DESC);

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      url        TEXT NOT NULL,
      title      TEXT,
      category   TEXT,
      sort       INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_gallery_sort ON gallery(sort);

    CREATE TABLE IF NOT EXISTS team_members (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      title      TEXT,
      image      TEXT,
      sort       INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_team_members_sort ON team_members(sort);

    CREATE TABLE IF NOT EXISTS mockups (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      html       TEXT NOT NULL DEFAULT '',
      messages   TEXT NOT NULL DEFAULT '[]',
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_mockups_updated ON mockups(updated_at DESC);

    CREATE TABLE IF NOT EXISTS clients (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT,
      site       TEXT,
      hosting    INTEGER NOT NULL DEFAULT 0,
      ai         INTEGER NOT NULL DEFAULT 0,
      extra      REAL NOT NULL DEFAULT 0,
      notes      TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id  INTEGER NOT NULL,
      period     TEXT NOT NULL,
      amount     REAL NOT NULL DEFAULT 0,
      status     TEXT NOT NULL DEFAULT 'unpaid',
      created_at INTEGER NOT NULL,
      paid_at    INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);

    CREATE TABLE IF NOT EXISTS ledger (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      ts         INTEGER NOT NULL,
      kind       TEXT NOT NULL,
      category   TEXT,
      amount     REAL NOT NULL DEFAULT 0,
      note       TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_ledger_ts ON ledger(ts DESC);

    CREATE TABLE IF NOT EXISTS deployments (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id  INTEGER NOT NULL,
      summary    TEXT NOT NULL,
      url        TEXT,
      ts         INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_deploy_client ON deployments(client_id, ts DESC);

    CREATE TABLE IF NOT EXISTS applications (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      role        TEXT NOT NULL,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL,
      phone       TEXT,
      message     TEXT,
      work_auth   TEXT,
      veteran     TEXT,
      disability  TEXT,
      resume_name TEXT,
      created_at  INTEGER NOT NULL,
      read_at     INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_apps_created ON applications(created_at DESC);

    CREATE TABLE IF NOT EXISTS team_messages (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      author_email TEXT NOT NULL,
      author_name  TEXT,
      body         TEXT,
      image        TEXT,
      created_at   INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_team_created ON team_messages(created_at);

    CREATE TABLE IF NOT EXISTS projects (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'Active',
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS project_updates (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id  INTEGER NOT NULL,
      author_name TEXT,
      body        TEXT NOT NULL,
      kind        TEXT NOT NULL DEFAULT 'update',
      created_at  INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_pupd_project ON project_updates(project_id, created_at DESC);

    CREATE TABLE IF NOT EXISTS admins (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT UNIQUE NOT NULL,
      name          TEXT,
      password_hash TEXT NOT NULL,
      created_at    INTEGER NOT NULL
    );
  `);
  const adminCount = db2.prepare(`SELECT COUNT(*) AS n FROM admins`).get().n;
  if (adminCount === 0) {
    const seed = [
      { email: process.env.ADMIN_EMAIL, name: process.env.ADMIN_NAME || "Bart", pw: process.env.ADMIN_PASSWORD },
      { email: process.env.ADMIN_EMAIL_2, name: process.env.ADMIN_NAME_2 || "Thomas", pw: process.env.ADMIN_PASSWORD_2 }
    ].filter((a) => a.email && a.pw);
    const ins = db2.prepare(`INSERT OR IGNORE INTO admins (email,name,password_hash,created_at) VALUES (?,?,?,?)`);
    for (const a of seed) ins.run(a.email.toLowerCase(), a.name, bcrypt.hashSync(a.pw, 10), Date.now());
  }
  for (const sql of [
    `ALTER TABLE clients ADD COLUMN hz_subscription_id TEXT`,
    `ALTER TABLE invoices ADD COLUMN pay_url TEXT`,
    `ALTER TABLE invoices ADD COLUMN token TEXT`,
    `ALTER TABLE clients ADD COLUMN password_hash TEXT`,
    `ALTER TABLE clients ADD COLUMN portal_token TEXT`,
    `ALTER TABLE clients ADD COLUMN phone TEXT`,
    `ALTER TABLE clients ADD COLUMN plan TEXT`,
    `ALTER TABLE clients ADD COLUMN project_fee REAL NOT NULL DEFAULT 0`,
    `ALTER TABLE clients ADD COLUMN deposit_amount REAL NOT NULL DEFAULT 0`,
    `ALTER TABLE clients ADD COLUMN deposit_paid INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE clients ADD COLUMN stage TEXT NOT NULL DEFAULT 'onboarding'`,
    `ALTER TABLE clients ADD COLUMN stage_at INTEGER`,
    `ALTER TABLE clients ADD COLUMN brief TEXT`,
    `ALTER TABLE clients ADD COLUMN launched_at INTEGER`,
    `ALTER TABLE clients ADD COLUMN sub_active INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE clients ADD COLUMN sub_id TEXT`,
    `ALTER TABLE invoices ADD COLUMN description TEXT`,
    `ALTER TABLE invoices ADD COLUMN recipient TEXT`,
    `ALTER TABLE admins ADD COLUMN role TEXT NOT NULL DEFAULT 'staff'`,
    `ALTER TABLE admins ADD COLUMN permissions TEXT NOT NULL DEFAULT '[]'`,
    `ALTER TABLE admins ADD COLUMN created_by TEXT`,
    `ALTER TABLE admins ADD COLUMN disabled INTEGER NOT NULL DEFAULT 0`
  ]) {
    try {
      db2.exec(sql);
    } catch {
    }
  }
  try {
    const owners = [process.env.ADMIN_EMAIL, process.env.ADMIN_EMAIL_2].filter(Boolean).map((e) => String(e).trim().toLowerCase());
    const up = db2.prepare(`UPDATE admins SET role='owner', permissions='[]' WHERE email = ?`);
    for (const e of owners) up.run(e);
    const anyOwner = db2.prepare(`SELECT COUNT(*) AS n FROM admins WHERE role='owner'`).get().n;
    if (!anyOwner) {
      db2.exec(`UPDATE admins SET role='owner' WHERE id = (SELECT MIN(id) FROM admins)`);
    }
  } catch {
  }
  db2.exec(`
    CREATE TABLE IF NOT EXISTS agreements (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id     INTEGER NOT NULL,
      tos_version   TEXT NOT NULL,
      privacy_version TEXT NOT NULL,
      agreed_tos    INTEGER NOT NULL DEFAULT 0,
      agreed_privacy INTEGER NOT NULL DEFAULT 0,
      agreed_arbitration INTEGER NOT NULL DEFAULT 0,
      ip            TEXT,
      user_agent    TEXT,
      full_name     TEXT,
      created_at    INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_agreements_client ON agreements(client_id);
    CREATE TABLE IF NOT EXISTS client_messages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id   INTEGER NOT NULL,
      sender      TEXT NOT NULL DEFAULT 'team',
      author      TEXT,
      body        TEXT NOT NULL,
      read_by_client INTEGER NOT NULL DEFAULT 0,
      read_by_team   INTEGER NOT NULL DEFAULT 0,
      created_at  INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_client_messages_client ON client_messages(client_id);
    CREATE TABLE IF NOT EXISTS milestones (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id   INTEGER NOT NULL,
      title       TEXT NOT NULL,
      due         TEXT,
      done        INTEGER NOT NULL DEFAULT 0,
      sort        INTEGER NOT NULL DEFAULT 0,
      created_at  INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_milestones_client ON milestones(client_id);
    CREATE TABLE IF NOT EXISTS audits (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      company     TEXT NOT NULL,
      contact     TEXT,
      email       TEXT,
      status      TEXT NOT NULL DEFAULT 'in_progress',
      summary     TEXT,
      created_at  INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS audit_items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      audit_id    INTEGER NOT NULL,
      area        TEXT,
      finding     TEXT NOT NULL,
      recommendation TEXT,
      impact      TEXT NOT NULL DEFAULT 'medium',
      effort      TEXT NOT NULL DEFAULT 'medium',
      done        INTEGER NOT NULL DEFAULT 0,
      created_at  INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_audit_items_audit ON audit_items(audit_id);
  `);
  try {
    const need = db2.prepare(`SELECT id FROM invoices WHERE token IS NULL OR token = ''`).all();
    const upd = db2.prepare(`UPDATE invoices SET token=? WHERE id=?`);
    for (const r of need) upd.run(crypto.randomBytes(9).toString("hex"), r.id);
  } catch {
  }
  const postCountRow = db2.prepare(`SELECT COUNT(*) AS n FROM posts`).get();
  if (postCountRow.n === 0) {
    const now = Date.now();
    db2.prepare(
      `INSERT INTO posts (slug, title, subtitle, body, template, images, published, views, created_at, updated_at)
       VALUES (@slug, @title, @subtitle, @body, @template, @images, 1, 0, @created_at, @updated_at)`
    ).run({
      ...SAMPLE_POST,
      created_at: now,
      updated_at: now
    });
  }
  return db2;
}
function db() {
  if (!global.__inovisionDb) {
    global.__inovisionDb = open();
  }
  return global.__inovisionDb;
}
function insertMessage(input) {
  const stmt = db().prepare(`
    INSERT INTO messages (name, email, subject, body, ip, user_agent, created_at)
    VALUES (@name, @email, @subject, @body, @ip, @user_agent, @created_at)
  `);
  const info = stmt.run({ ...input, created_at: Date.now() });
  trackEvent({ kind: "message", path: "/api/contact" });
  return Number(info.lastInsertRowid);
}
function listMessages() {
  return db().prepare(`SELECT * FROM messages ORDER BY created_at DESC LIMIT 500`).all();
}
function unreadCount() {
  const row = db().prepare(`SELECT COUNT(*) AS n FROM messages WHERE read_at IS NULL`).get();
  return row.n;
}
function messageCount() {
  const row = db().prepare(`SELECT COUNT(*) AS n FROM messages`).get();
  return row.n;
}
function markRead(id) {
  db().prepare(`UPDATE messages SET read_at = ? WHERE id = ? AND read_at IS NULL`).run(Date.now(), id);
}
function markUnread(id) {
  db().prepare(`UPDATE messages SET read_at = NULL WHERE id = ?`).run(id);
}
function deleteMessage(id) {
  db().prepare(`DELETE FROM messages WHERE id = ?`).run(id);
}
const POST_IMAGE_MAX = 20;
function normPostImages(a) {
  return (Array.isArray(a) ? a : []).map(
    (x) => typeof x === "string" ? { url: x, alt: "" } : x && typeof x.url === "string" ? { url: x.url, alt: typeof x.alt === "string" ? x.alt : "" } : null
  ).filter(Boolean).slice(0, POST_IMAGE_MAX);
}
function rowToPost(row) {
  let images = [];
  try {
    const parsed = JSON.parse(row.images);
    if (Array.isArray(parsed)) images = parsed.map((x) => typeof x === "string" ? { url: x, alt: "" } : x && typeof x.url === "string" ? { url: x.url, alt: typeof x.alt === "string" ? x.alt : "" } : null).filter(Boolean);
  } catch {
    images = [];
  }
  return { ...row, images };
}
function listPosts(opts = {}) {
  const where = opts.publishedOnly ? `WHERE published = 1` : "";
  const rows = db().prepare(`SELECT * FROM posts ${where} ORDER BY created_at DESC LIMIT 200`).all();
  return rows.map(rowToPost);
}
function getPostById(id) {
  const row = db().prepare(`SELECT * FROM posts WHERE id = ?`).get(id);
  return row ? rowToPost(row) : null;
}
function getPostBySlug(slug) {
  const row = db().prepare(`SELECT * FROM posts WHERE slug = ?`).get(slug);
  return row ? rowToPost(row) : null;
}
function uniqueSlug(base, ignoreId) {
  let slug = base || "post";
  let i = 1;
  while (true) {
    const row = db().prepare(`SELECT id FROM posts WHERE slug = ?`).get(slug);
    if (!row || row.id === ignoreId) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}
function slugify(s) {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}
function createPost(input) {
  const now = Date.now();
  const baseSlug = uniqueSlug(input.slug || slugify(input.title));
  const stmt = db().prepare(`
    INSERT INTO posts (slug, title, subtitle, body, template, images, published, views, created_at, updated_at)
    VALUES (@slug, @title, @subtitle, @body, @template, @images, @published, 0, @created_at, @updated_at)
  `);
  const info = stmt.run({
    slug: baseSlug,
    title: input.title,
    subtitle: input.subtitle,
    body: input.body,
    template: input.template,
    images: JSON.stringify(normPostImages(input.images)),
    published: input.published ? 1 : 0,
    created_at: now,
    updated_at: now
  });
  return getPostById(Number(info.lastInsertRowid));
}
function updatePost(id, patch) {
  const existing = getPostById(id);
  if (!existing) return null;
  const next = {
    title: patch.title ?? existing.title,
    subtitle: patch.subtitle ?? existing.subtitle,
    body: patch.body ?? existing.body,
    template: patch.template ?? existing.template,
    images: normPostImages(patch.images ?? existing.images),
    published: patch.published ?? Boolean(existing.published),
    slug: patch.slug ? uniqueSlug(slugify(patch.slug), id) : existing.slug
  };
  db().prepare(
    `UPDATE posts SET title=?, subtitle=?, body=?, template=?, images=?, published=?, slug=?, updated_at=? WHERE id=?`
  ).run(
    next.title,
    next.subtitle,
    next.body,
    next.template,
    JSON.stringify(next.images),
    next.published ? 1 : 0,
    next.slug,
    Date.now(),
    id
  );
  return getPostById(id);
}
function deletePost(id) {
  db().prepare(`DELETE FROM posts WHERE id = ?`).run(id);
}
function incrementPostViews(id) {
  db().prepare(`UPDATE posts SET views = views + 1 WHERE id = ?`).run(id);
  trackEvent({ kind: "post_view", post_id: id });
}
function postCount(opts = {}) {
  const where = opts.publishedOnly ? `WHERE published = 1` : "";
  const row = db().prepare(`SELECT COUNT(*) AS n FROM posts ${where}`).get();
  return row.n;
}
function totalPostViews() {
  const row = db().prepare(`SELECT COALESCE(SUM(views), 0) AS n FROM posts`).get();
  return row.n;
}
function topPostsByViews(limit = 5) {
  const rows = db().prepare(`SELECT * FROM posts ORDER BY views DESC LIMIT ?`).all(limit);
  return rows.map(rowToPost);
}
function trackEvent(input) {
  db().prepare(
    `INSERT INTO events (kind, path, post_id, created_at) VALUES (?, ?, ?, ?)`
  ).run(input.kind, input.path ?? null, input.post_id ?? null, Date.now());
}
function recentEvents(limit = 30) {
  return db().prepare(`SELECT * FROM events ORDER BY created_at DESC LIMIT ?`).all(limit);
}
function eventsByDay(kind, days = 14) {
  const since = Date.now() - days * 24 * 60 * 60 * 1e3;
  const rows = db().prepare(
    `SELECT created_at FROM events WHERE kind = ? AND created_at >= ?`
  ).all(kind, since);
  const buckets = /* @__PURE__ */ new Map();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1e3);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }
  for (const r of rows) {
    const key = new Date(r.created_at).toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) || 0) + 1);
  }
  return Array.from(buckets.entries()).map(([day, count]) => ({ day, count }));
}
function upsertNews(items) {
  const stmt = db().prepare(`
    INSERT OR IGNORE INTO news (source, title, link, summary, image, published_at, fetched_at)
    VALUES (@source, @title, @link, @summary, @image, @published_at, @fetched_at)
  `);
  const now = Date.now();
  let n = 0;
  const tx = db().transaction((rows) => {
    for (const r of rows) {
      const info = stmt.run({
        source: r.source,
        title: r.title,
        link: r.link,
        summary: r.summary ?? null,
        image: r.image ?? null,
        published_at: r.published_at ?? null,
        fetched_at: now
      });
      if (info.changes) n++;
    }
  });
  tx(items);
  return n;
}
function listNews(limit = 40) {
  return db().prepare(
    `SELECT * FROM news ORDER BY COALESCE(published_at, fetched_at) DESC LIMIT ?`
  ).all(limit);
}
function newsCount() {
  return db().prepare(`SELECT COUNT(*) AS n FROM news`).get().n;
}
function lastNewsFetch() {
  const row = db().prepare(`SELECT MAX(fetched_at) AS t FROM news`).get();
  return row.t ?? 0;
}
function pruneNews(keep = 80) {
  db().prepare(
    `DELETE FROM news WHERE id NOT IN (
         SELECT id FROM news ORDER BY COALESCE(published_at, fetched_at) DESC LIMIT ?
       )`
  ).run(keep);
}
function getSettings() {
  const rows = db().prepare(`SELECT key, value FROM settings`).all();
  const out = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}
function setSettings(entries) {
  const stmt = db().prepare(
    `INSERT INTO settings (key, value) VALUES (@key, @value)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  );
  const tx = db().transaction((rows) => {
    for (const r of rows) stmt.run(r);
  });
  tx(Object.entries(entries).map(([key, value]) => ({ key, value: String(value ?? "") })));
}
function listGallery() {
  return db().prepare(`SELECT * FROM gallery ORDER BY sort ASC, id ASC`).all();
}
function galleryCount() {
  return db().prepare(`SELECT COUNT(*) AS n FROM gallery`).get().n;
}
function replaceGallery(items) {
  const now = Date.now();
  const del = db().prepare(`DELETE FROM gallery`);
  const ins = db().prepare(`INSERT INTO gallery (url, title, category, sort, created_at) VALUES (@url, @title, @category, @sort, @created_at)`);
  const tx = db().transaction((rows) => {
    del.run();
    rows.forEach((r, i) => ins.run({ url: r.url, title: r.title ?? null, category: r.category ?? null, sort: i, created_at: now }));
  });
  tx(items);
}
function listTeamMembers() {
  return db().prepare(`SELECT * FROM team_members ORDER BY sort ASC, id ASC`).all();
}
function replaceTeamMembers(items) {
  const now = Date.now();
  const del = db().prepare(`DELETE FROM team_members`);
  const ins = db().prepare(`INSERT INTO team_members (name, title, image, sort, created_at) VALUES (@name, @title, @image, @sort, @created_at)`);
  const tx = db().transaction((rows) => {
    del.run();
    rows.forEach((r, i) => ins.run({ name: r.name, title: r.title ?? null, image: r.image ?? null, sort: i, created_at: now }));
  });
  tx(items);
}
function saveMockup(input) {
  const now = Date.now();
  if (input.id) {
    db().prepare(`UPDATE mockups SET name=@name, html=@html, messages=@messages, updated_at=@now WHERE id=@id`).run({ id: input.id, name: input.name, html: input.html, messages: input.messages, now });
    return input.id;
  }
  const info = db().prepare(`INSERT INTO mockups (name, html, messages, updated_at) VALUES (@name, @html, @messages, @now)`).run({ name: input.name, html: input.html, messages: input.messages, now });
  return Number(info.lastInsertRowid);
}
function listMockups() {
  return db().prepare(`SELECT id, name, updated_at FROM mockups ORDER BY updated_at DESC LIMIT 200`).all();
}
function getMockup(id) {
  return db().prepare(`SELECT * FROM mockups WHERE id = ?`).get(id);
}
function deleteMockup(id) {
  db().prepare(`DELETE FROM mockups WHERE id = ?`).run(id);
}
const PRICING = { hosting: 20, ai: 70 };
function clientMonthly(c) {
  return (c.hosting ? PRICING.hosting : 0) + (c.ai ? PRICING.ai : 0) + (c.extra || 0);
}
function listClients() {
  return db().prepare(`SELECT * FROM clients ORDER BY name`).all();
}
function saveClient(c) {
  const p = { name: c.name, email: c.email ?? null, site: c.site ?? null, hosting: c.hosting ? 1 : 0, ai: c.ai ? 1 : 0, extra: Number(c.extra || 0), notes: c.notes ?? null };
  if (c.id) {
    db().prepare(`UPDATE clients SET name=@name,email=@email,site=@site,hosting=@hosting,ai=@ai,extra=@extra,notes=@notes WHERE id=@id`).run({ ...p, id: c.id });
    return c.id;
  }
  return Number(db().prepare(`INSERT INTO clients (name,email,site,hosting,ai,extra,notes,created_at) VALUES (@name,@email,@site,@hosting,@ai,@extra,@notes,@now)`).run({ ...p, now: Date.now() }).lastInsertRowid);
}
function deleteClient(id) {
  db().prepare(`DELETE FROM clients WHERE id=?`).run(id);
}
function listInvoices() {
  return db().prepare(`SELECT invoices.*, clients.name AS client_name FROM invoices LEFT JOIN clients ON clients.id = invoices.client_id ORDER BY invoices.created_at DESC`).all();
}
function createInvoice(input) {
  return Number(db().prepare(`INSERT INTO invoices (client_id,period,amount,status,created_at,token) VALUES (@client_id,@period,@amount,'unpaid',@now,@token)`).run({ ...input, now: Date.now(), token: crypto.randomBytes(9).toString("hex") }).lastInsertRowid);
}
function getInvoiceByToken(token) {
  return db().prepare(`SELECT i.*, c.name AS client_name FROM invoices i LEFT JOIN clients c ON c.id = i.client_id WHERE i.token = ?`).get(token);
}
function setInvoiceStatus(id, status) {
  db().prepare(`UPDATE invoices SET status=?, paid_at=? WHERE id=?`).run(status, status === "paid" ? Date.now() : null, id);
}
function deleteInvoice(id) {
  db().prepare(`DELETE FROM invoices WHERE id=?`).run(id);
}
function listLedger() {
  return db().prepare(`SELECT * FROM ledger ORDER BY ts DESC LIMIT 500`).all();
}
function addLedger(input) {
  return Number(db().prepare(`INSERT INTO ledger (ts,kind,category,amount,note,created_at) VALUES (@ts,@kind,@category,@amount,@note,@now)`).run({ ts: input.ts || Date.now(), kind: input.kind, category: input.category ?? null, amount: Number(input.amount || 0), note: input.note ?? null, now: Date.now() }).lastInsertRowid);
}
function deleteLedger(id) {
  db().prepare(`DELETE FROM ledger WHERE id=?`).run(id);
}
function getClient(id) {
  return db().prepare(`SELECT * FROM clients WHERE id=?`).get(id);
}
const LEGAL_VERSION = "2026-07-04";
const PIPELINE = [
  { key: "spec", label: "Discovery & Spec" },
  { key: "design", label: "Design" },
  { key: "build", label: "Build" },
  { key: "review", label: "Review & QA" },
  { key: "launch", label: "Launch" },
  { key: "live", label: "Live" }
];
function createOnboardClient(d) {
  const token = crypto.randomBytes(16).toString("hex");
  const hash = bcrypt.hashSync(d.password, 10);
  const now = Date.now();
  const id = Number(db().prepare(
    `INSERT INTO clients (name,email,phone,site,hosting,ai,extra,notes,created_at,password_hash,portal_token,plan,project_fee,deposit_amount,deposit_paid,stage,stage_at,brief)
     VALUES (@name,@email,@phone,@site,@hosting,@ai,0,'',@now,@hash,@token,@plan,@fee,@deposit,0,'onboarding',@now,@brief)`
  ).run({
    name: d.name,
    email: d.email.toLowerCase(),
    phone: d.phone || null,
    site: d.site || null,
    hosting: 20,
    ai: d.ai_enabled ? 70 : 0,
    now,
    hash,
    token,
    plan: d.plan,
    fee: d.project_fee,
    deposit: d.deposit_amount,
    brief: d.brief || null
  }).lastInsertRowid);
  return { id, token };
}
function getClientByEmail(email) {
  return db().prepare(`SELECT * FROM clients WHERE lower(email)=?`).get(email.toLowerCase().trim());
}
function verifyClientLogin(email, password) {
  const c = getClientByEmail(email);
  if (!c || !c.password_hash) return void 0;
  return bcrypt.compareSync(password, c.password_hash) ? c : void 0;
}
function recordAgreement(d) {
  db().prepare(
    `INSERT INTO agreements (client_id,tos_version,privacy_version,agreed_tos,agreed_privacy,agreed_arbitration,ip,user_agent,full_name,created_at)
     VALUES (@cid,@v,@v,1,1,1,@ip,@ua,@fn,@now)`
  ).run({ cid: d.client_id, v: LEGAL_VERSION, ip: d.ip || null, ua: d.user_agent || null, fn: d.full_name || null, now: Date.now() });
}
function markClientDepositPaid(id) {
  db().prepare(`UPDATE clients SET deposit_paid=1, stage=CASE WHEN stage='onboarding' THEN 'spec' ELSE stage END, stage_at=? WHERE id=?`).run(Date.now(), id);
}
function setClientStage(id, stage) {
  const launching = stage === "launch" || stage === "live";
  db().prepare(`UPDATE clients SET stage=?, stage_at=?, launched_at=CASE WHEN ? AND launched_at IS NULL THEN ? ELSE launched_at END WHERE id=?`).run(stage, Date.now(), launching ? 1 : 0, Date.now(), id);
}
function setClientSubscribed(id, subId) {
  db().prepare(`UPDATE clients SET sub_active=1, sub_id=? WHERE id=?`).run(subId, id);
}
function setClientLaunched(id) {
  db().prepare(`UPDATE clients SET launched_at=COALESCE(launched_at,?), stage=CASE WHEN stage NOT IN ('launch','live') THEN 'launch' ELSE stage END, stage_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
}
function setClientNote(id, notes) {
  db().prepare(`UPDATE clients SET notes=? WHERE id=?`).run(notes, id);
}
function createAudit(d) {
  return Number(db().prepare(`INSERT INTO audits (company,contact,email,status,summary,created_at) VALUES (@c,@ct,@e,'in_progress',@s,@now)`).run({ c: d.company.slice(0, 160), ct: d.contact || null, e: d.email || null, s: d.summary || null, now: Date.now() }).lastInsertRowid);
}
function listAudits() {
  return db().prepare(`SELECT a.*, (SELECT COUNT(*) FROM audit_items i WHERE i.audit_id=a.id) AS items, (SELECT COUNT(*) FROM audit_items i WHERE i.audit_id=a.id AND i.done=1) AS done FROM audits a ORDER BY a.created_at DESC`).all();
}
function setAuditStatus(id, status) {
  db().prepare(`UPDATE audits SET status=? WHERE id=?`).run(status, id);
}
function deleteAudit(id) {
  db().prepare(`DELETE FROM audits WHERE id=?`).run(id);
  db().prepare(`DELETE FROM audit_items WHERE audit_id=?`).run(id);
}
function addAuditItem(d) {
  return Number(db().prepare(`INSERT INTO audit_items (audit_id,area,finding,recommendation,impact,effort,done,created_at) VALUES (@a,@ar,@f,@r,@im,@ef,0,@now)`).run({ a: d.audit_id, ar: d.area || null, f: String(d.finding).slice(0, 500), r: d.recommendation || null, im: d.impact || "medium", ef: d.effort || "medium", now: Date.now() }).lastInsertRowid);
}
function listAuditItems(auditId) {
  return db().prepare(`SELECT * FROM audit_items WHERE audit_id=? ORDER BY done ASC, created_at ASC`).all(auditId);
}
function toggleAuditItem(id, done) {
  db().prepare(`UPDATE audit_items SET done=? WHERE id=?`).run(done ? 1 : 0, id);
}
function deleteAuditItem(id) {
  db().prepare(`DELETE FROM audit_items WHERE id=?`).run(id);
}
function addClientMessage(d) {
  const now = Date.now();
  return Number(db().prepare(
    `INSERT INTO client_messages (client_id,sender,author,body,read_by_client,read_by_team,created_at) VALUES (@cid,@s,@a,@b,@rc,@rt,@now)`
  ).run({ cid: d.client_id, s: d.sender, a: d.author || null, b: String(d.body).slice(0, 4e3), rc: d.sender === "client" ? 1 : 0, rt: d.sender === "team" ? 1 : 0, now }).lastInsertRowid);
}
function listClientMessages(clientId) {
  return db().prepare(`SELECT * FROM client_messages WHERE client_id=? ORDER BY created_at ASC`).all(clientId);
}
function markClientMessagesRead(clientId, by) {
  const col = by === "team" ? "read_by_team" : "read_by_client";
  db().prepare(`UPDATE client_messages SET ${col}=1 WHERE client_id=? AND sender=?`).run(clientId, by === "team" ? "client" : "team");
}
function unreadForTeam() {
  const rows = db().prepare(`SELECT client_id, COUNT(*) AS n FROM client_messages WHERE sender='client' AND read_by_team=0 GROUP BY client_id`).all();
  const out = {};
  for (const r of rows) out[r.client_id] = r.n;
  return out;
}
function addMilestone(d) {
  const now = Date.now();
  return Number(db().prepare(`INSERT INTO milestones (client_id,title,due,done,sort,created_at) VALUES (@cid,@t,@due,0,@now,@now)`).run({ cid: d.client_id, t: String(d.title).slice(0, 200), due: d.due || null, now }).lastInsertRowid);
}
function listMilestones(clientId) {
  return db().prepare(`SELECT * FROM milestones WHERE client_id=? ORDER BY done ASC, sort ASC, created_at ASC`).all(clientId);
}
function toggleMilestone(id, done) {
  db().prepare(`UPDATE milestones SET done=? WHERE id=?`).run(done ? 1 : 0, id);
}
function deleteMilestone(id) {
  db().prepare(`DELETE FROM milestones WHERE id=?`).run(id);
}
function createCustomInvoice(d) {
  const token = crypto.randomBytes(9).toString("hex");
  const id = Number(db().prepare(
    `INSERT INTO invoices (client_id,period,amount,status,created_at,token,description,recipient) VALUES (@cid,@period,@amount,'unpaid',@now,@token,@desc,@rcpt)`
  ).run({ cid: d.client_id || 0, period: String(d.description).slice(0, 60), amount: d.amount, now: Date.now(), token, desc: String(d.description).slice(0, 300), rcpt: d.recipient || null }).lastInsertRowid);
  return { id, token };
}
function getInvoice(id) {
  return db().prepare(`SELECT invoices.*, clients.name AS client_name, clients.email AS client_email FROM invoices LEFT JOIN clients ON clients.id=invoices.client_id WHERE invoices.id=?`).get(id);
}
function setInvoicePayUrl(id, url) {
  db().prepare(`UPDATE invoices SET pay_url=? WHERE id=?`).run(url, id);
}
function listDeployments(clientId) {
  const sql = `SELECT deployments.*, clients.name AS client_name FROM deployments LEFT JOIN clients ON clients.id=deployments.client_id ${clientId ? "WHERE client_id=?" : ""} ORDER BY ts DESC LIMIT 300`;
  return clientId ? db().prepare(sql).all(clientId) : db().prepare(sql).all();
}
function addDeployment(input) {
  return Number(db().prepare(`INSERT INTO deployments (client_id, summary, url, ts) VALUES (@client_id,@summary,@url,@ts)`).run({ client_id: input.client_id, summary: input.summary, url: input.url ?? null, ts: input.ts || Date.now() }).lastInsertRowid);
}
function deleteDeployment(id) {
  db().prepare(`DELETE FROM deployments WHERE id=?`).run(id);
}
function insertApplication(a) {
  return Number(db().prepare(
    `INSERT INTO applications (role,name,email,phone,message,work_auth,veteran,disability,resume_name,created_at)
     VALUES (@role,@name,@email,@phone,@message,@work_auth,@veteran,@disability,@resume_name,@now)`
  ).run({
    role: a.role,
    name: a.name,
    email: a.email,
    phone: a.phone ?? null,
    message: a.message ?? null,
    work_auth: a.work_auth ?? null,
    veteran: a.veteran ?? null,
    disability: a.disability ?? null,
    resume_name: a.resume_name ?? null,
    now: Date.now()
  }).lastInsertRowid);
}
function listApplications() {
  return db().prepare(`SELECT * FROM applications ORDER BY created_at DESC LIMIT 500`).all();
}
function deleteApplication(id) {
  db().prepare(`DELETE FROM applications WHERE id = ?`).run(id);
}
function listTeamMessages(limit = 300) {
  return db().prepare(`SELECT * FROM team_messages ORDER BY created_at ASC LIMIT ?`).all(limit);
}
function addTeamMessage(m) {
  return Number(db().prepare(`INSERT INTO team_messages (author_email,author_name,body,image,created_at) VALUES (@e,@n,@b,@i,@t)`).run({ e: m.author_email, n: m.author_name ?? null, b: m.body ?? null, i: m.image ?? null, t: Date.now() }).lastInsertRowid);
}
function deleteTeamMessage(id) {
  db().prepare(`DELETE FROM team_messages WHERE id=?`).run(id);
}
function listProjects() {
  return db().prepare(`SELECT * FROM projects ORDER BY created_at DESC`).all();
}
function saveProject(p) {
  if (p.id) {
    db().prepare(`UPDATE projects SET name=@name, status=@status WHERE id=@id`).run({ id: p.id, name: p.name, status: p.status || "Active" });
    return p.id;
  }
  return Number(db().prepare(`INSERT INTO projects (name,status,created_at) VALUES (@name,@status,@t)`).run({ name: p.name, status: p.status || "Active", t: Date.now() }).lastInsertRowid);
}
function deleteProject(id) {
  db().prepare(`DELETE FROM project_updates WHERE project_id=?`).run(id);
  db().prepare(`DELETE FROM projects WHERE id=?`).run(id);
}
function listProjectUpdates(projectId) {
  return db().prepare(`SELECT * FROM project_updates ORDER BY created_at DESC LIMIT 500`).all();
}
function addProjectUpdate(u) {
  return Number(db().prepare(`INSERT INTO project_updates (project_id,author_name,body,kind,created_at) VALUES (@p,@n,@b,@k,@t)`).run({ p: u.project_id, n: u.author_name ?? null, b: u.body, k: u.kind === "milestone" ? "milestone" : "update", t: Date.now() }).lastInsertRowid);
}
function deleteProjectUpdate(id) {
  db().prepare(`DELETE FROM project_updates WHERE id=?`).run(id);
}
const STAFF_SECTIONS = ["gallery", "copy", "seo", "posts", "team", "projects"];
function normPerms(v) {
  let a = v;
  if (typeof a === "string") {
    try {
      a = JSON.parse(a);
    } catch {
      a = [];
    }
  }
  if (!Array.isArray(a)) a = [];
  return STAFF_SECTIONS.filter((s) => a.includes(s));
}
function rowToAdmin(row) {
  const role = row.role === "owner" ? "owner" : "staff";
  return {
    id: row.id,
    email: row.email,
    name: row.name || "",
    role,
    permissions: role === "owner" ? STAFF_SECTIONS.slice() : normPerms(row.permissions),
    disabled: !!row.disabled,
    created_at: row.created_at,
    created_by: row.created_by || null
  };
}
function verifyAdmin(email, password) {
  const row = db().prepare(`SELECT * FROM admins WHERE email = ?`).get(email.trim().toLowerCase());
  if (!row) return null;
  if (row.disabled) return null;
  if (!bcrypt.compareSync(password, row.password_hash)) return null;
  const a = rowToAdmin(row);
  return { email: a.email, name: a.name, role: a.role, permissions: a.permissions };
}
function listAdmins() {
  return db().prepare(`SELECT * FROM admins ORDER BY role='owner' DESC, created_at ASC`).all().map(rowToAdmin);
}
function getAdminByEmail(email) {
  const row = db().prepare(`SELECT * FROM admins WHERE email = ?`).get(String(email || "").trim().toLowerCase());
  return row ? rowToAdmin(row) : null;
}
function createStaff(input) {
  const email = String(input.email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Enter a valid email address." };
  const pw = String(input.password || "");
  if (pw.length < 10) return { ok: false, error: "Password must be at least 10 characters." };
  if (db().prepare(`SELECT id FROM admins WHERE email = ?`).get(email)) {
    return { ok: false, error: "An account with that email already exists." };
  }
  const perms = normPerms(input.permissions);
  db().prepare(
    `INSERT INTO admins (email,name,password_hash,created_at,role,permissions,created_by,disabled)
     VALUES (?,?,?,?, 'staff', ?, ?, 0)`
  ).run(email, String(input.name || "").trim(), bcrypt.hashSync(pw, 10), Date.now(), JSON.stringify(perms), String(input.created_by || "").toLowerCase());
  return { ok: true, admin: getAdminByEmail(email) };
}
function updateStaff(email, patch) {
  const target = String(email || "").trim().toLowerCase();
  const row = db().prepare(`SELECT * FROM admins WHERE email = ?`).get(target);
  if (!row) return { ok: false, error: "Account not found." };
  if (row.role === "owner") return { ok: false, error: "Owner accounts cannot be edited here." };
  if (patch.permissions !== void 0) {
    db().prepare(`UPDATE admins SET permissions = ? WHERE email = ?`).run(JSON.stringify(normPerms(patch.permissions)), target);
  }
  if (patch.name !== void 0) {
    db().prepare(`UPDATE admins SET name = ? WHERE email = ?`).run(String(patch.name).trim(), target);
  }
  if (patch.disabled !== void 0) {
    db().prepare(`UPDATE admins SET disabled = ? WHERE email = ?`).run(patch.disabled ? 1 : 0, target);
  }
  if (patch.password !== void 0 && patch.password !== "") {
    const pw = String(patch.password);
    if (pw.length < 10) return { ok: false, error: "Password must be at least 10 characters." };
    db().prepare(`UPDATE admins SET password_hash = ? WHERE email = ?`).run(bcrypt.hashSync(pw, 10), target);
  }
  return { ok: true, admin: getAdminByEmail(target) };
}
function deleteStaff(email) {
  const target = String(email || "").trim().toLowerCase();
  const row = db().prepare(`SELECT * FROM admins WHERE email = ?`).get(target);
  if (!row) return { ok: false, error: "Account not found." };
  if (row.role === "owner") return { ok: false, error: "Owner accounts cannot be deleted." };
  db().prepare(`DELETE FROM admins WHERE email = ?`).run(target);
  return { ok: true };
}
function changeAdminPassword(email, current, next) {
  const row = db().prepare(`SELECT * FROM admins WHERE email = ?`).get(email.trim().toLowerCase());
  if (!row) return { ok: false, error: "Account not found." };
  if (!bcrypt.compareSync(current, row.password_hash)) return { ok: false, error: "Current password is incorrect." };
  if (!next || next.length < 6) return { ok: false, error: "New password must be at least 6 characters." };
  db().prepare(`UPDATE admins SET password_hash = ? WHERE id = ?`).run(bcrypt.hashSync(next, 10), row.id);
  return { ok: true };
}

export { addClientMessage as $, clientMonthly as A, saveClient as B, setClientLaunched as C, PRICING as D, deleteDeployment as E, listDeployments as F, addDeployment as G, galleryCount as H, replaceGallery as I, listGallery as J, db as K, addLedger as L, getInvoice as M, deleteInvoice as N, listInvoices as O, PIPELINE as P, setInvoiceStatus as Q, createCustomInvoice as R, createInvoice as S, deleteLedger as T, listLedger as U, deleteMessage as V, markRead as W, markUnread as X, unreadForTeam as Y, markClientMessagesRead as Z, listClientMessages as _, topPostsByViews as a, deleteMilestone as a0, listMilestones as a1, toggleMilestone as a2, addMilestone as a3, deleteMockup as a4, getMockup as a5, listMockups as a6, saveMockup as a7, changeAdminPassword as a8, deletePost as a9, incrementPostViews as aA, newsCount as aB, lastNewsFetch as aC, listNews as aD, updatePost as aa, createPost as ab, deleteProjectUpdate as ac, addProjectUpdate as ad, deleteProject as ae, listProjectUpdates as af, listProjects as ag, saveProject as ah, setSettings as ai, setInvoicePayUrl as aj, deleteTeamMessage as ak, listTeamMessages as al, addTeamMessage as am, insertApplication as an, verifyAdmin as ao, insertMessage as ap, upsertNews as aq, pruneNews as ar, markClientDepositPaid as as, getClientByEmail as at, createOnboardClient as au, recordAgreement as av, getInvoiceByToken as aw, verifyClientLogin as ax, setClientSubscribed as ay, getPostBySlug as az, listMessages as b, getPostById as c, deleteApplication as d, eventsByDay as e, listApplications as f, getSettings as g, deleteAuditItem as h, listAuditItems as i, toggleAuditItem as j, addAuditItem as k, listPosts as l, messageCount as m, deleteAudit as n, listAudits as o, postCount as p, createAudit as q, recentEvents as r, setAuditStatus as s, totalPostViews as t, unreadCount as u, getClient as v, setClientNote as w, setClientStage as x, deleteClient as y, listClients as z, listTeamMembers, replaceTeamMembers };
