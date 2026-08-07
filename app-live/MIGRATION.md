# Migrating inovisionstudios.com to your own VPS (Coolify)

This app is **build output only** — there is no Astro source anywhere (not
on the old host, not in this repo). `Dockerfile` in this folder installs
production dependencies and runs the existing `dist/` as-is. You cannot
rebuild the site from source; you can only run what's already compiled.

## 1. What this app actually needs at runtime (found by scanning dist/)

| Variable | Used for | Required? |
|---|---|---|
| `HOST` | bind address | yes — set `0.0.0.0` |
| `PORT` | bind port | yes — set `3000` |
| `PUBLIC_SITE_URL` | canonical URL in breadcrumbs/SEO/Stripe redirects | yes |
| `AUTH_SECRET` | signs the admin session cookie | yes |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | admin login | yes |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | client portal deposits/payments, invoices | yes, if payments are used |
| `HUBSPOT_TOKEN` | CRM sync from admin | only if that feature is used |
| `FAL_KEY`, `FAL_IMAGE_MODEL`, `FAL_EDIT_MODEL` | AI image generation/edit in admin | only if that feature is used |
| `HOSTINGER_API_TOKEN` | an admin "hosting" panel that calls Hostinger's API | **tied to the old host — will not work post-migration, safe to leave unset** |
| `NEWS_CRON_KEY` | protects `/api/news/refresh` from being called by randoms | recommended |
| `ASTRO_NODE_AUTOSTART` | must be `true` so the standalone server boots | yes |
| `NODE_ENV` | | set `production` |

**These are all currently set on the old host's `nodejs/.env`, which was
deliberately never pulled into this repo (production secrets stay on the
server).** Get the real values by copying that file directly from the old
server to the new one — don't paste Stripe/API keys into chat with anyone,
including an AI assistant.

## 2. Copy the real .env, database, and uploads from the old host

Run this **yourself**, from a terminal with SSH access to the old host:

```bash
# old host connection:
#   host 82.25.94.171, port 65002, user u243732583
#   app root: ~/domains/inovisionstudios.com/nodejs

scp -P 65002 u243732583@82.25.94.171:~/domains/inovisionstudios.com/nodejs/.env ./app-live/.env
scp -P 65002 -r u243732583@82.25.94.171:~/domains/inovisionstudios.com/nodejs/data ./app-live/data
```

Or, better for a direct host-to-host move (skips your local machine
entirely):

```bash
ssh u243732583@82.25.94.171 -p 65002 \
  "tar -czf - -C ~/domains/inovisionstudios.com/nodejs .env data" \
  | ssh youruser@your-new-vps "tar -xzf - -C /path/to/app-live"
```

## 3. Coolify setup

1. **New Resource → Application**, point it at this GitHub repo, `live-deploy` branch
2. **Build Pack:** Dockerfile
3. **Base directory:** `app-live` (so it picks up `app-live/Dockerfile`)
4. **Port:** `3000`
5. **Persistent volume:** mount to `/app/data` — put the `data/` you copied
   in step 2 there (contains `inovision.db` + `uploads/`)
6. **Environment variables:** paste in the real values from the old host's
   `.env` (table above), plus `PUBLIC_SITE_URL` set to your new domain
7. Deploy

## 4. After it's live on the new domain/IP

- **Stripe dashboard** → update the webhook endpoint URL to point at the
  new host (old one will start failing silently otherwise)
- **DNS** → point `inovisionstudios.com` at the new VPS once you've verified
  the new deployment works (test on the Coolify-assigned domain first)
- `HOSTINGER_API_TOKEN`-backed admin features will stop working — that's
  expected, they were talking to the old host's control panel
- Old host's `nodejs/.env`, `data/`, and any local copies you make (including
  `app-live/.env` and `app-live/data/` here) contain live secrets and real
  client data — don't commit them. Both are already covered by `.gitignore`.
