# Admin panel — handoff for agents

You are picking up the **admin panel** of Storefront Kit. It is the product: the
same panel ships to every client (smoke shop, café, boutique, barber…), so anything
you build here must stay business-agnostic. The storefront is the part that gets
reworded per client; the admin does not.

Repo: `git@github.com:ghiankyledomingo2007-beep/storefront-kit.git` (private, GitHub
"template" repo). Reference deployment of the same panel: https://smokey-broz.vercel.app/admin
(that client's own repo is `smokey-broz-v2`; do **not** edit it — improvements go
into the kit first and get pulled into clients).

## 0. Read first
1. `README.md` — stack, verticals, new-client flow
2. `AGENTS.md` — hard rules (design constraints, images, "content is data", **DB safety**)
3. This file, then the three maps in `docs/`:
   - `admin-map-routes.md` — every admin page, server action, `/api/admin/*` route, auth layers
   - `admin-map-ui.md` — design tokens, primitives, conventions, **new-page skeleton**
   - `admin-map-data.md` — Prisma models, auth, settings/content registries, lib helpers

## 1. Run it locally (safe, no client data)
```bash
git clone git@github.com:ghiankyledomingo2007-beep/storefront-kit.git && cd storefront-kit
npm ci                                   # NEVER symlink node_modules from another project
npx prisma dev --name kit                # local Postgres; copy the printed DATABASE_URL
cp .env.example .env                     # DATABASE_URL + DIRECT_URL = that URL **plus &pgbouncer=true**, JWT_SECRET anything, TIMEZONE
npx prisma migrate deploy
npm run new-client -- --name "Demo Cafe" --vertical food --accent "#c8102e" --password demo
npm run dev -- -p 3200                   # http://localhost:3200/admin  password: demo
```
`GEMINI_API_KEY` optional (AI chat/blog buttons show a friendly error without it).
The seed refuses any non-localhost DB without `--i-mean-production`; keep it that way.

## 2. Where the admin lives
```
src/app/admin/login/page.tsx              owner password / staff PIN login
src/app/admin/(panel)/layout.tsx          owner-only gate → <AdminShell name=…>
src/app/admin/(panel)/<route>/page.tsx    one server page per menu item (force-dynamic)
src/app/admin/(panel)/<route>/actions.ts  "use server" mutations (requireOwner first line)
src/app/admin/(panel)/<route>/*Client.tsx interactive part, calls /api/admin/* or server actions
src/app/api/admin/**                      JSON routes (all requireOwner → 401)
src/components/admin/AdminShell.tsx       sidebar (NAV_GROUPS), mobile drawer, PreviewPanel, Dialogs provider
src/components/admin/ui.tsx               PageHeader · Card · Stat · QuickAction · LinkButton · inputClass
src/components/admin/Dialogs.tsx          useConfirm() / useToast() — never window.confirm/alert
src/components/admin/charts.tsx           pure-SVG Sparkline · BarChart · HBars · Delta
src/components/admin/{ImagePicker,ImageField,MarkdownEditor,AiBar,ColorWheel,PreviewPanel,SiteHealth,CountUp,ResetButton,HomeMock,navIcons}.tsx
src/app/globals.css  (bottom, `.admin` scope)  admin-canvas · .card hairline · nav-active · stat-value · admin-rise · admin-sheen · chart-*
```
Menu order today: Dashboard, Edit Home · CONTENT: Products, Photos & galleries, Blog & News, Coupons, Reviews · INBOX: Orders, Job applications, Emails & VIP · STORE: Staff & hours, Appearance, Settings.

## 3. The look (don't drift from it)
- Dark canvas `#0a0e0a`, surfaces `#0d110d` / `--card #141814`, hairlines `border-white/10`, text tiers `white/85…/40`.
- **One accent** `var(--accent)` (owner-changeable in Appearance) — never a literal orange. Derived: `--accent-soft`, `--accent-line`, `--admin-grad`.
- Type: `font-display` (Bebas by default) for h1/h2/section titles, Inter body. Eyebrow labels `text-[11px] font-bold tracking-widest`.
- Radii: cards `1rem`, inputs `rounded-lg`, buttons/pills `rounded-full`. Buttons: `.btn-accent` / `.btn-ghost`.
- Motion: `.admin-rise` stagger via `style={{["--i" as string]: i}}`; everything respects `prefers-reduced-motion`.
- **No text over photos. No blur/backdrop-filter/glow haze.** Clients rejected work over both.
- Tailwind v4, no config file. Class strings must be literals or exported constants (`inputClass`) — never `bg-${x}`.
- Icons are inline SVG paths in `navIcons.tsx` (CSP blocks CDNs).
- Mobile: sidebar → drawer under `lg`, touch targets ≥ 44px, `<main>` has `pt-24`.

## 4. How things are wired
- **Auth**: `mb_session` JWT cookie; `src/middleware.ts` guards `/admin/*`; `(panel)/layout.tsx` enforces owner role; every action/API calls `requireOwner()`.
- **Settings** = one `Setting(key,value)` table. Read all with `getSettings()`, write with `setSetting()`. Site copy is the `CONTENT_FIELDS` registry (`src/lib/content.ts`) — add a field there and it appears in Admin → Content and the visual editor automatically.
- **Images** live in Postgres (`Image` table), served by `/api/img/<hash>?w=`; always render with `sized()`/`srcSet()` from `src/lib/img.ts`. Upload via `ImagePicker` → `/api/admin/upload` → `storeImage()`.
- **Visual editor** (`/admin/edit`): homepage sections registry `src/components/home/sections.tsx` + `home_layout` setting (`src/lib/homeLayout.ts`). Edit hooks render only for owner + `?edit=1`.
- **Analytics**: `Event` table, `src/lib/analytics.ts` `summary(range)`, charts on dashboard.
- **AI**: `src/lib/gemini.ts`; blog AI at `/api/admin/ai/blog`, cover image at `/api/admin/ai/image` (needs billing on the Google key).
- **Backups**: `npm run backup` / `npm run restore <dir> --i-mean-production`; `.github/workflows/backup.yml` runs nightly into a `backups` branch (needs `DATABASE_URL`/`DIRECT_URL` repo secrets).

## 5. Adding a page (5 steps)
1. `src/app/admin/(panel)/<route>/page.tsx` — server, `force-dynamic`, `PageHeader` + client component. Skeleton in `docs/admin-map-ui.md §6`.
2. Mutations: `actions.ts` (`"use server"`, `await requireOwner()` first) **or** `src/app/api/admin/<route>/route.ts` (try `requireOwner` → 401). Validate input; `revalidatePath` what changed.
3. Client: `useConfirm({danger:true})` before destructive ops, `useToast()` after; `router.refresh()`.
4. Register: `NAV_GROUPS` in `AdminShell.tsx` + icon path in `navIcons.tsx`.
5. Test on 390px width too. `npm run build` must pass.

## 6. Don'ts
- Don't hardcode a business name, city, timezone, product category, or marketing sentence — Settings / `CONTENT_FIELDS` / `TIMEZONE`.
- Don't branch on `vertical` at runtime; presets are applied once by the seed.
- Don't touch client repos or client databases. Local Prisma dev DB only. Read `AGENTS.md → Database safety`.
- Don't add UI libraries (no shadcn/MUI); no external scripts/fonts from CDNs.
- Don't put text over photos; no blur.

## 7. Open ideas (nobody owns these yet — pick one and say so)
- Staff role: staff sessions exist (`/clock`) but have no panel routes; a limited "staff" view (orders, tasks) is a natural next feature.
- Locations manager UI (model + public page exist, admin CRUD doesn't).
- Menu view for the `food` vertical (products grouped by category with prices, printable).
- Catering / custom inquiry form (generic "inquiry" inbox).
- Email/SMS ping when a new order or job application lands.
- `npm run export` from the admin UI (download backup zip) so owners can self-serve.
