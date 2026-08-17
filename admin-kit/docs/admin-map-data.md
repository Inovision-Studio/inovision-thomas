# storefront-kit — Data + Auth layer map

Root: `/home/ghiankylledomingo/Projects/storefront-kit`

## prisma/schema.prisma (Postgres via `DATABASE_URL` + `DIRECT_URL`)
- **Image** — id, hash? (unique, `b29552_<uuid>.webp`), mime="image/webp", bytes (Bytes), width?, height?. Images stored in DB; served at `/api/img/<hash>` and `/api/image/<id>`.
- **Product** — id, slug (unique), name, category="Accessories", priceMin, priceMax?, description, images String[] (refs), published, sort, timestamps.
- **BlogPost** — id, slug (unique), title, body, excerpt, tags String[], image?, published, publishedAt, timestamps.
- **Coupon** — id, code (unique), label, kind="slot"|"manual", discount (free text), active, usedCount.
- **Review** — id, name, stars=5, text, sort.
- **Gallery** — id, key (unique: hero|coverflow|marquee), title, images GalleryImage[].
- **GalleryImage** — id, galleryId (cascade), imageRef, sort.
- **VipMember** — id, email, couponWon?.
- **NewsletterSub** — id, email (unique).
- **Order** — id, customer, phone, items Json, status="open"|"picked_up".
- **StaffMember** — id, name, pinHash, active, punches[].
- **StaffPunch** — id, staffId (cascade), kind in|out, lat?, lng?, at.
- **StaffTask** — id, text, done, doneBy?, doneAt?.
- **BusinessHour** — id, day (unique 0–6), closed, open="9 AM", close="10 PM".
- **Setting** — key (PK), value="" — all site config/content/`owner_password_hash`/`home_layout`.
- **Location** — id, name, address, city, state="MI", zip, phone, mapsUrl, lat?, lng?, hours (text), published, sort.
- **JobApplication** — id, name, email, phone, position, message, archived.
- **Event** — id, kind, path, label, ref, visitor (daily HMAC), ua, createdAt; indexes (kind,createdAt), (createdAt).

## src/lib/db.ts
Singleton `db = new PrismaClient()` cached on globalThis in non-prod.

## src/lib/auth.ts
- Cookie name: **`mb_session`**; JWT (jose HS256), secret `JWT_SECRET` (fallback "dev-secret-change-me"), 30d expiry, httpOnly, sameSite lax, secure in prod, path "/".
- `Session = { role: "owner"|"staff"; staffId?; name? }`
- `createSession(payload)`, `getSession(): Session|null` (reads cookie via `next/headers`, null on invalid), `clearSession()`.
- `verifyOwnerPassword(pw)` — bcrypt compare vs Setting `owner_password_hash`; `setOwnerPassword(pw)` upserts hash (bcrypt 10).
- `requireOwner()` — throws `Error("UNAUTHORIZED")` unless session.role==="owner".

## src/lib/settings.ts
`getSettings(): Record<string,string>` (all rows), `getSetting(key, fallback="")`, `setSetting(key, value)` (upsert).

## src/lib/content.ts
- `ContentField = { key, label, group, type: "text"|"textarea"|"list"|"image", def, hint? }`
- `CONTENT_FIELDS: ContentField[]` — every editable public string, grouped: "Top banner" (banner_lines, tagline_lines), "Section · Hero/Welcome/Step Inside/Categories/VIP/Why us/Products/Merch/Reviews/Blog", "AI assistant" (bot_name, bot_avatar_ref, chat_greeting, chat_suggestions, ai_persona), "Footer", "About page", "Careers page"/"Careers", "Age gate" (`agegate_title` with `{age}` placeholder). List fields are newline-joined; `why_items` uses `Title | description`.
- `text(settings, key)` → owner value if non-blank else default; `lines(settings, key)` → split/trim/filter lines.
- `CONTENT_DEFAULTS` = key→def map.

## src/lib/defaults.ts
- `DEFAULT_SETTINGS` = `...CONTENT_DEFAULTS` + accent_color "#ff5a1f", font_display, font_body, business_name "Your Store", business_blurb, vertical "retail", age_gate, phone, address, maps_url, instagram, facebook, logo_ref, favicon_ref, home_layout.
- `RESET_SCOPES` = { theme: [accent_color, fonts, logo_ref, favicon_ref], home: [all "Section ·"/"Top banner" keys, home_layout], all: theme+home+business_name } — deliberately excludes contact/socials/integration keys.

## src/lib/homeLayout.ts
- `SECTION_IDS`: banner, hero, taglines, welcome, inside, categories, vip, why, products, photos, merch, reviews, blog. `DEFAULT_ORDER` puts merch after inside.
- `SectionLayout { width?, textSize?, align?, imageSide?, columns?, spacing?, speed? }`; `HomeLayout { order, hidden, sections }`.
- `SECTION_CONTROLS` (per-section allowed knobs + allowed column counts), `CLS` literal Tailwind lookup tables (columns/width/align/imageSide/spacing), `TEXT_SCALE`, `SPEED_MULT`, `SECTION_DEFAULTS`, `DEFAULT_LAYOUT`.
- `parseLayout(raw)` (tolerant JSON from `home_layout` setting), `sanitizeLayout(unknown)` (whitelist everything, every id exactly once in order), `sectionLayout(id, layout)`, `classesFor(id, layout)` → {columns,width,align,imageSide,spacing,style,raw}.

## src/lib/brand.ts
`bizName(s)` ("Your Store" fallback), `logoOf(s)` ("/logo.svg"), `botName(s)` (bot_name→bizName), `botAvatar(s)` (bot_avatar_ref→mascot_ref→logo), `ageGate(s)` (digits only, "" = off), `chatBrand(s)` → {name, avatar, greeting, suggestions}.

## src/lib/site.ts
`TIMEZONE = process.env.TIMEZONE || "America/New_York"`.

## src/lib/verticals.ts
`Vertical = retail|smoke|food|service`; `VERTICALS[v] = { label, age_gate: ""|"18"|"21", content: Record<key,string> (overrides on CONTENT_FIELDS defaults), hidden: SectionId[] }`. retail: no overrides, hides merch. smoke: age 21. food/service: reworded CTAs, careers_positions, chat prompts. Applied once by seed; runtime never reads it.

## src/lib/img.ts + imageServe.ts + /api/img
- `VARIANTS = [200,400,800,1200,1600,2000,2400]`; `sized(ref, w)` → `${ref}?w=` only for `/api/` refs (static passes through); `srcSet(ref, max=2000)` → candidates ≤ max, undefined for non-API refs.
- `imageServe.serveImage(key, {hash}|{id}, width?)`: `ALLOWED_WIDTHS` same set (must be kept in sync with VARIANTS); per-process LRU-ish Map cache (400 entries, keyed `key@w`); DB find with 3 retries (503 + Retry-After on failure, 404 missing); sharp resize→webp q88 only if w < original width (else serves original bytes); `Cache-Control: public, max-age=31536000, immutable`. `widthFromUrl(url)`.
- Routes: `src/app/api/img/[hash]/route.ts` → `serveImage("h:"+hash, {hash}, widthFromUrl)`; `src/app/api/image/[id]/` similar by id.

## src/lib/storeImage.ts
`storeImage(buffer, {cover?:{width,height}})` — sharp rotate, resize (cover or inside 2400 max, no enlarge), webp q88, insert Image row with hash `b29552_<uuid>.webp`; returns `{ id, ref: "/api/img/<hash>", hash }`. Shared by upload route + AI cover gen.

## src/lib/gemini.ts
Raw fetch to `generativelanguage.googleapis.com/v1beta/models/<model>:generateContent`, key `GEMINI_API_KEY`. `TEXT_MODEL="gemini-flash-lite-latest"`, `DRAFT_MODELS` fallback chain, `IMAGE_MODEL="gemini-2.5-flash-image"`. `GeminiError(message,status=502)`, `hasGeminiKey()`, `generate(model, body)` (503 if no key; throws on block/HTTP error), `textOf(res)`, `imageOf(res)`, `storeContext()` (5-min in-memory cache of settings+hours+40 products as prompt text), `generateWithFallback(models, body, accept)`.

## src/lib/track.ts + analytics.ts
- `KINDS = pageview|click|spin|vip|careers|chat`; `PUBLIC_KINDS = pageview,click`; `BOT_UA` regex; `visitorId(ip, ua)` = HMAC(JWT_SECRET, ip|ua|day in TIMEZONE)[0:24]; `track(kind, req, {path,label,ref})` never throws, skips bots and requests carrying `mb_session` cookie, truncates fields.
- `analytics.summary(range 7|30)` → `{ total, prevTotal, uniques, today, series (zero-filled per day), topPages (8), clicks (product:* rolled up), conversions {spins,vip,careers,chat}, totalEvents }`, every query `.catch` → 0/[]. `CLICK_LABELS` human names for click buckets.

## prisma/seed.ts (`npm run new-client` / `db:seed` / `seed`)
Args `--name --vertical --accent --password --age --force --i-mean-production`. Refuses non-localhost `DATABASE_URL` without `--i-mean-production`. Writes Settings = DEFAULT_SETTINGS + preset.content + business_name/accent_color/age_gate/vertical/home_layout (hidden preset) + owner_password_hash; skips existing keys unless `--force`. Upserts BusinessHour 0–6 (9 AM–6 PM, Sunday closed) and empty galleries hero/coverflow/marquee. Idempotent.

## scripts/
- `backup.ts` — all tables (except Event) → JSON + images → files under `backup/<date>`; read-only.
- `restore.ts <dir> [--i-mean-production]` — upserts by PK, images first, resets sequences; refuses non-local w/o flag.
- `dbg.ts` — prints table/setting/hour/migration counts (the "one read query" sanity check).
- `setup-supabase.sh` — sources `.env.supabase`, prisma generate + migrate deploy + seed (note: echoes stale "smokey2025" password line).

## Hard rules (AGENTS.md + README)
1. Never put text over a photo — solid panel beside/below.
2. No haze: no `backdrop-filter`, blur, or colored glow shadows; panels solid `#0d110d`.
3. Brand strings are data — nothing in `src/` hardcodes business/bot name, city, timezone, product category; use brand.ts / CONTENT_FIELDS / Settings / TIMEZONE.
4. Images: always `sized()` + `srcSet()`; new width goes in both `VARIANTS` and `ALLOWED_WIDTHS`; don't re-encode when w >= original; restart dev server after changing image bytes (per-process cache).
5. Content is data: products/galleries/posts/reviews/hours/settings live in Postgres, edited at `/admin`; every component must render sensibly with empty settings (collapse section, e.g. `hasVisitInfo` in Footer).
6. Analytics: no cookies/raw IPs; owner (`mb_session`) and bots excluded; public beacon only pageview/click; retention 180d via `/api/cron/prune` + `CRON_SECRET`.
7. Gemini: chat uses TEXT_MODEL, drafting uses DRAFT_MODELS chain; image gen needs billing (402 otherwise).
8. Visual editor: `data-edit-key` only when `?edit=1` AND owner session; visitor HTML byte-identical; layout classes only from `CLS` literal tables (never templated).
9. Verticals are a one-time preset (`new-client --vertical`); never branch runtime on `vertical` — add a Setting/content field. New client-visible strings → CONTENT_FIELDS with generic default, vertical flavor in verticals.ts. `TIMEZONE` is per-deployment env.
10. Generic fixes land in the kit first, then pulled into client repos via `upstream`.
11. Dev: background procs need `setsid nohup … & disown`; local `.env` may hit a client's prod DB — back up first; kill stuck dev on :3100 with the `ss` one-liner.
12. `npm run build` must pass; deploy `vercel deploy --prod --yes` but ask first; commit author must be `ghiankyledomingo2007@gmail.com` (Vercel git-author rule).
13. DB safety: never symlink `node_modules` from another project (Prisma resolves `.env` from the generated client — wiped a prod DB once); destructive scripts must print target host and refuse non-localhost without explicit flag; run one read query (`scripts/dbg.ts`) before anything destructive.
