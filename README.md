# Inovision Studios

Source for **inovisionstudios.com** — a premium web design agency site for
restaurants and vape brands, with a client portal, blog/CMS, Stripe billing,
and an admin panel.

## What's in here

```
app-live/
├─ dist/              build output (server + client) — this is what actually runs
├─ Dockerfile          builds + runs dist/ for a self-hosted VPS
├─ COOLIFY.md          step-by-step Coolify deploy guide — start here
├─ MIGRATION.md        why there's no source, and how to pull real .env/data off the old host
└─ ENV.md              what every environment variable does
```

**There is no Astro source code** — only compiled build output. The app
cannot be rebuilt from scratch, only run as-is. See
[`app-live/MIGRATION.md`](app-live/MIGRATION.md) for the full explanation.

## Run locally

```bash
cd app-live
npm install
# create app-live/.env with the variables listed in app-live/ENV.md
npm run start        # http://localhost:3000 (or whatever PORT you set)
```

Requires **Node 22** — `better-sqlite3` is a native module and this repo's
`package-lock.json` was built against Node 22's ABI. Node 24 will fail to
load it.

## Deploy

👉 [**app-live/COOLIFY.md**](app-live/COOLIFY.md) — full walkthrough for
deploying to your own VPS via Coolify (build pack, persistent volume for
the database, environment variables, domain/SSL).

## Admin

The only way into the admin panel is the **`©` symbol at the bottom of any
page**, linking to `/admin/login`. Credentials come entirely from the
`ADMIN_EMAIL` / `ADMIN_PASSWORD` environment variables — nothing is
hardcoded.
