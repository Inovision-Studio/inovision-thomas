# Inovision Studios — admin panel (v2)

New backend panel for inovisionstudios.com. Replaces the admin baked into the legacy
Astro build in `../app-live` (compiled output only, no source). Same look and
building blocks as the Smokey Broz admin the team liked; the data model mirrors the
legacy SQLite tables so old data imports in one command.

Stack: Next.js 16 (App Router), React 19, Prisma 6 + Postgres, Tailwind v4. No UI
libraries, no CDN scripts.

## Run locally

```bash
cd admin && npm ci
# Postgres: any local one. Zero-install option (real Postgres, no sudo):
#   cd ~/.local/share/embedded-pg && node run.mjs ivadmin 54329      (see docs/HANDOFF.md)
cp .env.example .env            # DATABASE_URL/DIRECT_URL → postgres://postgres:postgres@localhost:54329/ivadmin, JWT_SECRET anything
npx prisma migrate deploy
npx tsx prisma/seed.ts --email you@inovisionstudios.com --password "…" --name "You"
NODE_PATH=../app-live/node_modules npx tsx scripts/import-legacy.ts ../app-live/data/inovision.db   # optional: old data
npm run dev -- -p 3400          # http://localhost:3400/admin
```

## Modules

Dashboard · Clients (portal users: stages, milestones, messages, deployments, agreements)
· Projects (+ updates) · Audits (+ items, copy-as-Markdown report) · Invoices · Ledger ·
Posts (Markdown + images) · Work gallery · Team page · News feed (RSS refresh) · Inbox
(contact form) · Applications (careers) · Mockups (HTML + preview) · Analytics ·
Settings · Admins (roles + per-module permissions).

Public endpoints the website posts to: `POST /api/contact`, `POST /api/apply`,
`POST /api/track` (pageview/click beacons). Images: `POST /api/admin/upload` →
`/api/img/<hash>?w=`.

## Where things live

```
prisma/schema.prisma            models (1:1 with legacy tables, camelCase)
src/lib/auth.ts                 iv_session JWT; requireAdmin / requireOwner / requireModule(key)
src/lib/modules.ts              MODULES list = sidebar + permission keys; OWNER_ONLY
src/app/admin/(panel)/<mod>/    page.tsx (server) + *Client.tsx (client)
src/app/api/admin/<mod>/        JSON actions for that module
src/components/admin/           AdminShell, ui (PageHeader/Card/Stat), Dialogs (useConfirm/useToast), charts, ImagePicker, MarkdownEditor
scripts/                        backup.ts / restore.ts / import-legacy.ts
```

See `docs/HANDOFF.md` before changing anything.
