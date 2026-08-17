# Handoff — Inovision admin panel

## What this is
`admin/` is the new backend for inovisionstudios.com. It is a standalone Next.js 16 app.
The legacy site (`../app-live`) keeps running as-is; the plan is to point its forms at
this app's public endpoints (`/api/contact`, `/api/apply`, `/api/track`) and rebuild the
public site later against this database.

## Run it (5 min)
1. Postgres. Zero-install real Postgres, no sudo:
   `cd ~/.local/share/embedded-pg && node run.mjs ivadmin 54329` (leave running; data
   persists in `~/.local/share/embedded-pg/data/ivadmin`). Do **not** use `prisma dev` for
   this app — it falls over under concurrent connections.
2. `cp .env.example .env` → `DATABASE_URL`/`DIRECT_URL` = `postgres://postgres:postgres@localhost:54329/ivadmin`, `JWT_SECRET` anything.
3. `npm ci && npx prisma migrate deploy`
4. `npx tsx prisma/seed.ts --email admin@inovisionstudios.com --password admin --name You`
5. `npm run dev -- -p 3400` → http://localhost:3400/admin

**Never** point `.env` at a client database. Seeds/import/restore refuse non-localhost
URLs unless `--i-mean-production` is passed. Never symlink `node_modules` from another
project (Prisma then loads the other project's `.env`).

## How the panel is built (copy this shape)
- Reference module: `src/app/admin/(panel)/inbox/` + `src/app/api/admin/inbox/route.ts`.
- Server `page.tsx` (`export const dynamic = "force-dynamic"`, `PageHeader`) fetches with
  Prisma and passes plain data (dates as ISO strings) to a `"use client"` component.
- Client component calls its own `/api/admin/<module>/route.ts` (`{action, …}` JSON),
  every action guarded by `requireModule("<key>")` (or `requireOwner()` for
  invoices/ledger/settings/admins), validates + clamps input, `router.refresh()` after.
- `useConfirm({danger:true})` before deletes, `useToast()` for outcomes. No `alert/confirm`.
- Primitives in `src/components/admin/ui.tsx`; tables `w-full text-sm` / `thead text-white/50` /
  rows `border-t border-white/10` inside `Card`; empty state `py-8 text-center text-white/40`.
- Adding a module: add to `MODULES` in `src/lib/modules.ts` (sidebar + permission key), add an
  icon path in `src/components/admin/navIcons.tsx`, create the page + API route.
- Look: dark canvas, one accent `var(--accent)`, Bebas display + Inter, pills, `.admin-rise`
  stagger, no blur/haze, no text over photos. Tailwind v4, literal class strings only.
- Auth: `iv_session` JWT cookie; `src/middleware.ts` guards `/admin/*`; roles owner|staff,
  staff see only modules in their `permissions[]` (set in Admins).

## Not done yet (pick up here)
- Stripe: invoices have `payUrl` for pasted payment links; no Stripe API/webhooks wired.
- Email (SMTP) for invoices / replies; nodemailer not installed on purpose until needed.
- Client portal (login for clients, milestones/messages view) — schema ready (`Client.passwordHash`, `portalToken`), no routes.
- Mockups AI generation; News feeds are hardcoded in the route.
- Deploy: Vercel + Supabase like smokey-broz (see `~/Vault/playbooks/vercel-deploy.md`), or Coolify. Add `.github/workflows/backup.yml` from `storefront-kit` once a prod DB exists.
- Public site rebuild (Next) reading Posts/Gallery/Team from this DB — separate project.
