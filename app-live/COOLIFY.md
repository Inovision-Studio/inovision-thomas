# Deploying to Coolify

> Legacy reference: the current Inovision main website runs on Vercel from a
> separate repository. Identify the intended legacy deployment before using
> this guide; do not replace the current site with this compiled bundle.

Step-by-step for deploying this app (`app-live/`) to your own VPS running
Coolify. See [`MIGRATION.md`](MIGRATION.md) for background on why this is
build-output-only (no Astro source exists), and [`ENV.md`](ENV.md) for the
full explanation of every environment variable.

## Before you start

Pull the real `.env`, database, and uploaded images off the old host —
Coolify needs these to serve the actual live content, not an empty site.
Exact commands are in `MIGRATION.md` §2. Do this yourself, from your own
terminal — don't paste secrets into chat with anyone, including an AI
assistant.

## 1. Create the application in Coolify

1. Coolify dashboard → **+ New Resource → Application**
2. **Source:** this GitHub repo, branch `v3`
3. **Build Pack:** `Dockerfile`
4. **Base Directory:** `app-live` (this is where `app-live/Dockerfile` lives)
5. **Port:** `3000`

## 2. Persistent storage

Add a **Volume** mount:

- **Destination path (in container):** `/app/data`
- Contains `inovision.db` (SQLite) + `uploads/` (CMS images)
- Without this, every redeploy wipes the database and re-serves an empty site

## 3. Environment variables

Coolify → your app → **Environment Variables** tab → add each key/value
below.

Two groups here:
- **Fixed configuration** — server settings shown below. Verify the domain
  belongs to the deployment before using it.
- **You must replace** — real credentials tied to your accounts (admin
  login, Stripe, HubSpot, fal.ai). Demo/format values only, shown so you
  know what shape they take.

```bash
# --- server (copy as-is) ---
HOST=0.0.0.0
PORT=3000
ASTRO_NODE_AUTOSTART=true
NODE_ENV=production

# --- your domain (verify this is the intended deployment) ---
PUBLIC_SITE_URL=https://inovisionstudios.com

# --- generate unique secrets locally; do not use values from Git history ---
AUTH_SECRET=<generate with openssl rand -hex 32>
NEWS_CRON_KEY=<generate separately with openssl rand -hex 24>

# =====================================================
# EVERYTHING BELOW HERE YOU MUST REPLACE - demo values only
# =====================================================

# --- admin login: pick your own real email + a strong password ---
ADMIN_EMAIL=admin@inovisionstudios.com
ADMIN_PASSWORD=<choose a unique strong password>
ADMIN_NAME=Admin

# --- Stripe (payments, invoices) - from your Stripe dashboard ---
STRIPE_SECRET_KEY=<paste your sk_live_... key here>
STRIPE_WEBHOOK_SECRET=<paste your whsec_... signing secret here>

# --- optional integrations - only if you use these features ---
HUBSPOT_TOKEN=<paste your HubSpot private-app token here>
FAL_KEY=<paste your fal.ai key here: key-id:key-secret>

# FAL_IMAGE_MODEL / FAL_EDIT_MODEL - do NOT set these unless you want to
# override the built-in default. Leave them out entirely; the code already
# falls back to:
#   FAL_IMAGE_MODEL -> fal-ai/bytedance/seedream/v4.5/text-to-image
#   FAL_EDIT_MODEL  -> fal-ai/bytedance/seedream/v4.5/edit
```

**Security notice:** earlier revisions of this public guide contained literal
`AUTH_SECRET` and `NEWS_CRON_KEY` values. Treat those values as exposed. If an
existing deployment uses either value, its owner must rotate it in that
deployment and update any cron caller using the cron key. Removing values from
this guide does not revoke them or remove Git history. This documentation change
does not change any deployed credentials.

For a new deployment, run `openssl rand -hex 32` for `AUTH_SECRET` and a separate
`openssl rand -hex 24` for `NEWS_CRON_KEY` in your own terminal. Save them directly
in the deployment secret settings and your company password manager. Never commit
or paste the generated values into chat. The angle-bracket values above are
placeholders and must be replaced; do not paste the example block into a shell.

Full explanation of what each one does: [`ENV.md`](ENV.md). Leave out
`HOSTINGER_API_TOKEN` — that only worked on the old host.

## 4. Deploy

Click **Deploy**. Coolify will:
- build the Docker image from `app-live/Dockerfile` (`npm install --omit=dev`, then run `dist/`)
- mount your data volume
- start the container and expose it behind Coolify's proxy

Check the build/deploy logs in Coolify if it fails — the most likely cause
is a missing/wrong environment variable (the app fails fast on missing
`AUTH_SECRET`/`ADMIN_*`).

## 5. Domain + SSL

Coolify → your app → **Domains** → add `yourdomain.com`. Coolify issues a
Let's Encrypt certificate automatically once DNS points at it.

## 6. After it's confirmed working

- **Stripe dashboard** → update the webhook endpoint to the new domain
- **DNS** → point the real domain at the new VPS once verified on Coolify's
  temporary domain
- Old host's `nodejs/.env` and `data/` still have live secrets/client data —
  don't commit any local copy of them (already `.gitignore`d here)
