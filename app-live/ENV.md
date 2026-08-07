# Environment Variables — app-live (the real inovisionstudios.com)

Every variable below was found by scanning the compiled `dist/` output for
`process.env.*` usage — this is the full list, nothing guessed.

## How to add these

**Locally (to run on your machine):** create a file named `.env` inside
`app-live/` (same folder as this file) with one line per variable:

```
HOST=127.0.0.1
PORT=4321
PUBLIC_SITE_URL=http://127.0.0.1:4321
AUTH_SECRET=some-long-random-string
...
```

Node reads `.env` automatically when you run `node dist/server/entry.mjs`
from inside `app-live/` (Node 20+ has built-in `.env` support). This file is
already covered by `.gitignore` — it will never get committed.

**On Coolify:** open your application → **Environment Variables** tab →
add each one as a `Key` / `Value` pair → redeploy for it to take effect.

---

## Server

| Variable | Purpose | Required | Example |
|---|---|---|---|
| `HOST` | address the server binds to | yes | `0.0.0.0` (on a VPS) / `127.0.0.1` (local) |
| `PORT` | port the server listens on | yes | `3000` (Coolify) / `4321` (local) |
| `ASTRO_NODE_AUTOSTART` | must be `true` or the server won't boot | yes | `true` |
| `NODE_ENV` | | recommended | `production` |
| `PUBLIC_SITE_URL` | canonical URL used in SEO tags, breadcrumbs, Stripe redirect URLs | yes | `https://inovisionstudios.com` |

## Admin login

| Variable | Purpose | Required |
|---|---|---|
| `AUTH_SECRET` | signs the admin session cookie. Generate with `openssl rand -hex 32` — never reuse the local-dev value in production | yes |
| `ADMIN_EMAIL` | login email for `/admin/login` | yes |
| `ADMIN_PASSWORD` | login password | yes |
| `ADMIN_NAME` | display name in the admin panel | yes |

## Payments (client portal, invoices)

| Variable | Purpose | Required |
|---|---|---|
| `STRIPE_SECRET_KEY` | server-side Stripe API calls (deposits, invoices) | only if you use payments |
| `STRIPE_WEBHOOK_SECRET` | verifies Stripe webhook requests are really from Stripe | only if you use payments — **must be updated in the Stripe dashboard to point at your new host's URL** |

## Optional integrations (admin panel features)

| Variable | Purpose | Required |
|---|---|---|
| `HUBSPOT_TOKEN` | syncs contacts/deals to HubSpot CRM from admin | only if used |
| `FAL_KEY` | auth for fal.ai | only if AI image gen/edit is used |
| `FAL_IMAGE_MODEL` | overrides which fal.ai model generates images | **no — leave unset.** Defaults to `fal-ai/bytedance/seedream/v4.5/text-to-image` |
| `FAL_EDIT_MODEL` | overrides which fal.ai model edits images | **no — leave unset.** Defaults to `fal-ai/bytedance/seedream/v4.5/edit` |
| `NEWS_CRON_KEY` | shared secret so `/api/news/refresh` can't be triggered by strangers | recommended if that endpoint is exposed |
| `HOSTINGER_API_TOKEN` | an admin panel widget that talks to Hostinger's control panel API | **tied to the old host — leave unset once you move off Hostinger, that admin feature just won't work anymore** |

---

## Where to get the real production values

They already exist in the old host's `nodejs/.env` file — see
[`MIGRATION.md`](MIGRATION.md) for the exact command to pull it over SSH.
Don't paste real Stripe/API keys into chat with anyone, including an AI
assistant — copy that file directly between servers/your machine.

---

## About switching the database to MongoDB

Short answer: **not possible on this codebase as it stands**, and probably
not worth it even if it were. Two reasons:

1. **There's no source code to change.** This app is compiled `dist/`
   output only (see the top-level README) — the database logic
   (`better-sqlite3` queries across 22 tables: posts, clients, invoices,
   ledger, projects, messages, agreements, milestones, audits, etc.) is
   baked into the build. Switching databases means rewriting that layer,
   which means editing source that doesn't exist anywhere — not on the old
   host, not here. It would have to be recovered or rebuilt from scratch
   first, then every query across ~30 admin API routes rewritten for
   MongoDB's driver/query style.

2. **SQLite is a reasonable fit for what this app actually does** — one
   admin, moderate traffic, no multi-region writes. It's a single file, no
   separate database server to run/secure/pay for, and it's already what's
   live and working. MongoDB would add a real piece of infrastructure
   (self-hosted container + persistent volume, or a hosted Atlas cluster
   + connection string secret) for a workload that doesn't need it.

If there's a specific reason MongoDB matters to you (e.g. you're building a
new feature that needs it, or scaling to multiple app instances that all
need to share a database — which a single SQLite file on one VPS can't do),
say what it is and I'll factor that into the recommendation.
