# Storefront Kit

Reusable website + admin panel for local businesses (retail, smoke/vape, café / F&B,
barber / studio / service). One codebase; each client is a repo created from this
template with its own Supabase database and Vercel project. The **admin panel is
the product** — it stays identical across clients; the storefront is re-worded
and re-ordered per business through data, not code.

Stack: Next.js 16 (App Router, RSC), React 19, Prisma 6 on Postgres (Supabase),
Tailwind v4, Gemini for the AI chat + blog assistant, Vercel.

## What a client gets

**Storefront:** hero slideshow, ticker, welcome (+ optional mascot), store photos,
optional full-bleed video band, categories, VIP/rewards signup, why-us, products
(reserve for pickup — no online payment), gallery, reviews, blog, careers form,
contact, locations, age gate (off / 18+ / 21+), Spin-to-Win, AI chat, mobile
action bar, first-party analytics.

**Admin (`/admin`):** dashboard with built-in analytics · **Edit Home** (click any
text/photo on a live preview, drag/hide/resize sections — desktop only) · Products
· Photos & galleries · Blog & News with AI draft/rewrite/SEO + AI cover image ·
Coupons · Reviews · Orders (pickup reservations) · Job applications · Emails & VIP
· Staff & hours (+ `/clock`) · Appearance (accent color, Google Fonts or upload,
logo/favicon) · Settings (business info, socials, age gate, GA) · side live preview.

## New client in ~15 minutes

```bash
gh repo create <client-slug> --template <this repo> --private --clone && cd <client-slug>
git config user.email ghiankyledomingo2007@gmail.com   # Vercel git-author rule
npm i
# Supabase: new project → Project Settings → Database → copy pooled + direct URLs
cp .env.example .env && $EDITOR .env                   # DATABASE_URL, DIRECT_URL, JWT_SECRET, GEMINI_API_KEY, TIMEZONE
npx prisma migrate deploy
npm run new-client -- --name "Joe's Cafe" --vertical food --accent "#c8102e" --password "pick-one" --i-mean-production
vercel link && vercel env add …                         # same vars as .env (+ CRON_SECRET)
vercel deploy --prod --yes
```

Then in the admin: upload logo (Appearance), photos (Photos & galleries), products,
hours, phone/address (Settings). Hand over the admin URL + password and tell the
owner to change it.

Verticals (`src/lib/verticals.ts`): `retail` (default), `smoke` (21+ gate),
`food`, `service`. A vertical is only a starting preset — everything is editable
afterwards. `--force` re-applies the preset over existing settings. Seeds refuse any non-localhost database unless `--i-mean-production` is passed.

## Where things live

- `src/lib/content.ts` — every editable string (`CONTENT_FIELDS`), generic defaults
- `src/lib/verticals.ts` — per-business-type wording + age gate + hidden sections
- `src/lib/brand.ts` — `bizName / logoOf / botName / botAvatar / ageGate / chatBrand`
- `src/lib/site.ts` — `TIMEZONE` (env)
- `src/lib/homeLayout.ts` + `src/components/home/sections.tsx` — homepage sections, order, layout presets
- `src/app/admin/(panel)/*` — admin pages; `edit/` is the visual editor
- `src/lib/track.ts`, `src/lib/analytics.ts` — first-party analytics
- `src/lib/gemini.ts` — AI client; text works on free tier, image needs billing
- `prisma/seed.ts` — `new-client` seed (settings, hours, empty galleries)

## Pulling kit updates into a client

```bash
git remote add upstream git@github.com:<org>/storefront-kit.git   # once
git fetch upstream && git merge upstream/main
```

See `AGENTS.md` for the rules agents get wrong, and `docs/ADMIN-HANDOFF.md` if you are working on the admin panel.
