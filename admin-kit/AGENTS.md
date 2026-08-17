<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Storefront Kit — project rules

Read [README.md](README.md) first for stack and architecture. The points below
are the ones agents get wrong.

## Non-negotiable design constraints

Clients have rejected work over each of these. Treat them as hard rules:

1. **Never put text over a photo.** Use a solid panel next to or below the image.
2. **No haze.** No `backdrop-filter`, no blur, no colored glow shadows. Panels are
   solid (`#0d110d`). This has been swept out of the codebase once already — do
   not reintroduce it.
3. **Brand strings are data.** Nothing in `src/` may hardcode a business name, bot name, city, timezone or product category — read `src/lib/brand.ts`, `CONTENT_FIELDS`, Settings, or `TIMEZONE`.

## Images

- Always use `sized(ref, w)` and `srcSet(ref, max)` from `src/lib/img.ts`. A bare
  `src` with one fixed width renders blurry on phones (3x DPR) — this was a real
  bug, don't recreate it.
- Adding a new width means adding it to **both** `VARIANTS` in `src/lib/img.ts`
  and `ALLOWED_WIDTHS` in `src/lib/imageServe.ts`.
- `serveImage` skips re-encoding when the requested width is >= the original.
  Re-encoding already-WebP bytes is a second lossy pass and visibly softens detail.
- The variant cache is per-process and keyed by hash+width. After changing image
  bytes in the database, **restart the dev server** or you will review stale pixels.

## Content is data, not code

Products, galleries, posts, reviews, hours, and settings all live in Postgres and
are edited at `/admin`. If you find yourself hardcoding a phone number, address,
image path, or marketing sentence, it belongs in a setting or a table row instead.

Settings are frequently empty. Every component reading a setting must render sensibly without
it — see the `hasVisitInfo` branch in `src/components/public/Footer.tsx` for the
pattern: collapse the section rather than leaving a hole.

## Local development gotchas

- Background processes need `setsid nohup … & disown`; a plain `&` gets reaped.
- Local `.env` may point at a client's production database. **Writes hit real
  data.** Back up before destructive changes.
- Kill a stuck dev server with
  `ss -ltnp | grep :3100 | grep -oP 'pid=\K[0-9]+' | xargs kill -9`.

## Before shipping

`npm run build` must pass. Deploys go out with `vercel deploy --prod --yes`, but
**ask first** — client sites are live businesses.

## Deploying

`vercel deploy --prod --yes`, but **the commit author must be the Vercel account
email** (`ghiankyledomingo2007@gmail.com`). Now that the repo has a GitHub
remote, the CLI attaches git metadata and Vercel rejects deploys authored by
anyone outside the team with:

```
BLOCKED — Git author <email> must have access to the team's projects on Vercel
```

The status shows as `UNKNOWN` in `vercel ls` and there are no build logs, so it
looks like a hung build. Check the real reason with:

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=<id>&limit=3"
```

If `git config user.email` drifts back to another address, deploys start failing
again the same silent way.


## Analytics, AI and the visual editor

- **First-party analytics**: `src/lib/track.ts` + `POST /api/track` + `<Analytics/>` beacon.
  No cookies, no raw IPs (`visitor` is a daily HMAC). Owner sessions (`mb_session`
  cookie) and bots are excluded. Public beacon may only send `pageview`/`click`;
  spins/vip/careers/chat are recorded server-side inside their routes. Add
  `data-track="group:name"` to any element you want counted. Retention: 180 days
  via `/api/cron/prune` (Vercel Cron, `CRON_SECRET`).
- **Gemini**: shared client in `src/lib/gemini.ts`. Chat uses `TEXT_MODEL`
  (lite); blog drafting uses `DRAFT_MODELS` — a fallback chain, because the lite
  alias sometimes loops in JSON-schema mode. Image generation needs billing on the
  Google key (free tier = quota 0) — the route returns a plain-English 402 then.
- **Visual editor** (`/admin/edit`): the homepage renders from `HOME_SECTIONS`
  (`src/components/home/sections.tsx`) in the order given by the `home_layout`
  setting (`src/lib/homeLayout.ts`). Editable text/images carry
  `data-edit-key` **only** when `?edit=1` AND the owner session is present —
  visitor HTML must stay byte-identical. Layout knobs are presets from `CLS`
  lookup tables (literal Tailwind classes; never template class strings).

## Kit-specific rules

- One codebase, many clients. Business type is a **preset applied once** by
  `npm run new-client -- --vertical <retail|smoke|food|service>` (see
  `src/lib/verticals.ts`); after that the admin is the source of truth. Do not
  branch runtime code on `vertical` — add a Setting or content field instead.
- Adding a client-visible string: add it to `CONTENT_FIELDS` (`src/lib/content.ts`)
  with a generic default; put the vertical-flavored wording in `verticals.ts`.
- `TIMEZONE` env var per deployment (`src/lib/site.ts`).
- Fixes that are generic go here first, then get pulled into client repos via
  their `upstream` remote. Client-specific hacks stay in the client repo.

## Database safety (learned the hard way, 2026-08-17)

- **Never symlink `node_modules` from another project.** Prisma resolves `.env`
  relative to the generated client, so a symlinked client silently points at the
  *other* project's database. A local "truncate + reseed" wiped a client's
  production DB this way. Use `npm ci` / `cp -a`.
- Any script that deletes or truncates must print the target host and refuse
  non-localhost unless given an explicit flag (see `prisma/seed.ts`).
- Before any destructive DB command, run one read query and confirm the row counts
  look like the DB you think you're on.
