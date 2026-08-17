# storefront-kit — Admin UI System Map

Root: `/home/ghiankylledomingo/Projects/storefront-kit/src`. Files read, nothing modified.

## 1. Where things live

| Path | Role |
|---|---|
| `app/admin/(panel)/layout.tsx` | Auth gate (`getSession()`, role `owner` else redirect `/admin/login`) → wraps children in `<AdminShell name={bizName(settings)}>` |
| `app/admin/(panel)/<route>/page.tsx` | Server component per page (`export const dynamic = "force-dynamic"`), fetches via `@/lib/db`, renders `PageHeader` + a `*Client.tsx` / form component |
| `components/admin/AdminShell.tsx` | Sidebar + mobile drawer + `<main class="admin-canvas">` + `<Dialogs>` provider + `<PreviewPanel/>` |
| `components/admin/ui.tsx` | Primitives: `PageHeader`, `Card`, `Stat`, `QuickAction`, `LinkButton`, `inputClass` |
| `components/admin/Dialogs.tsx` | Context: `useConfirm()`, `useToast()`; default export `Dialogs` provider |
| `components/admin/PreviewPanel.tsx` | Docked live-site iframe (desktop), `notifySaved()` |
| `components/admin/charts.tsx` | Pure-SVG, server-safe: `Sparkline`, `BarChart`, `HBars`, `Delta` |
| `components/admin/navIcons.tsx` | `NAV_ICONS` record (inline SVG paths keyed by href) + `NavIcon` |
| `components/admin/HomeMock.tsx` | Mini homepage preview for theme page (`accent`, `fontDisplay?`, `fontBody?`) |
| `components/admin/ImagePicker.tsx` / `ImageField.tsx` | Upload/library picker; `ImageField` = hidden-input form wrapper |
| `components/admin/MarkdownEditor.tsx` | Textarea + toolbar + preview using site `Markdown` renderer |
| `components/admin/AiBar.tsx` | AI actions for blog post editor (`current`, `onApply(patch)`) |
| `components/admin/CountUp.tsx`, `ResetButton.tsx`, `SiteHealth.tsx`, `ColorWheel.tsx` | Misc helpers |
| `app/globals.css` | Site tokens + `.admin` scoped layer (bottom of file) |

## 2. Design tokens (`globals.css`)

**Colors (`:root`)**
- `--accent: #ff5a1f` (runtime-overridable from Admin → Appearance; whole admin derives from it)
- `--bg: #0a0e0a` (page), `--card: #141814`, `--text: #f4f6f4`, `--muted: #9aa39a`
- Hardcoded surfaces used in admin JSX: sidebar/header/dialog `#0d110d`, canvas `#0a0e0a`, error toast `#1a0f0f`; hairlines `border-white/10`, `white/15`, `white/20`; text tiers `white/85 · /75 · /60 · /50 · /45 · /40 · /35`
- `.admin` scope derives: `--accent-soft` (14% accent), `--accent-line` (45%), `--admin-grad` (accent → accent mixed 55% white, 135deg)
- Status colors via Tailwind: `red-500` (danger/destructive), `amber-400/300` (warn/down), `green-400` (up/new)

**Radii**: cards `1rem` (`.card`) / `rounded-2xl` dialogs; inputs `rounded-lg`; buttons/pills `rounded-full` (9999px); glass panel `1.5rem`; focus outline 4px

**Fonts** (next/font vars in `app/layout.tsx`): `--font-bebas` (Bebas Neue), `--font-inter`, `--font-sora`, `--font-grotesk` (Space Grotesk). Semantic slots: `--font-display: var(--font-bebas)`, `--font-body: var(--font-inter)` (Appearance page overrides at runtime). `h1,h2,h3,.font-display` → display font; body → `--font-body`.

**Motion**: `--ease-out-expo: cubic-bezier(0.16,1,0.3,1)`; all admin animations have `prefers-reduced-motion` off-switches.

**Buttons (global classes)**: `.btn-accent` (accent bg, `#04120a` text, pill, min-h 44px, hover brighten+lift), `.btn-ghost` (white/15 border pill). Secondary inline pattern repeated in JSX: `rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5`.

## 3. Admin CSS layer (`.admin` scope, globals.css ~L300–402)

- `.admin-canvas` — two radial accent washes behind `<main>`
- `.admin .card` — `position:relative; overflow:hidden` + `::before` 1px accent-gradient hairline on top edge; `a.card:hover` / `.card-hover:hover` lifts −2px with accent shadow
- `.admin .nav-active` — gradient fill, dark text (active sidebar item)
- `.admin .stat-value` — gradient-clipped text for accent numerals
- `.admin-rise` — keyframe fade/rise 0.45s, `animation-delay: calc(var(--i,0)*45ms)`; set `style={{ ["--i" as string]: index }}` for stagger
- `.admin-sheen::after` — slow sweeping highlight for "needs attention" rows (needs `position:relative` parent — `.card` provides it)
- Charts: `.chart-draw` (stroke draw-in with `pathLength={1}`), `.chart-mark` (hover brighten), `.chart-bar` group; `figure:has(.chart-bar:hover)` dims siblings
- Reduced motion: disables rise/sheen/draw/lift

## 4. Primitives & props

**ui.tsx** (server-safe)
- `PageHeader({ title, sub?, action?: ReactNode })` — "ADMIN" eyebrow in accent, `h1 text-4xl font-display`, optional right-side action
- `Card({ children, className? })` → `div.card.p-5`
- `Stat({ label, value: ReactNode, href?, accent?, index?, sub?, chart? })` — number values animate via `CountUp`; `href` makes it a `Link` (`hover:border-accent/60 active:scale-[0.98]`); `accent` adds `.stat-value` gradient; `index` drives `--i` stagger; `chart` slot right-aligned (e.g. `<Sparkline/>`)
- `QuickAction({ href, label, hint?, index? })` — big tap-target card link
- `LinkButton({ href, children })` → `Link.btn-accent.text-sm`
- `inputClass` = `"w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white outline-none focus:ring-2 ring-[var(--accent)]"` — used for input/select/textarea everywhere (extend by template: `` `${inputClass} mt-1` ``)

**Dialogs.tsx** (client)
- `<Dialogs>` provider (already mounted by AdminShell)
- `useConfirm()` → `(opts: { title, body?, confirmLabel?, cancelLabel?, danger? }) => Promise<boolean>`; Escape cancels, focus starts on Cancel; `danger` = red confirm
- `useToast()` → `(text, kind?: "ok"|"error")`; auto-dismiss 4s; `"ok"` toasts dispatch `site:saved` so PreviewPanel reloads

**PreviewPanel.tsx** — `notifySaved()` exported; panel reloads on `site:saved` and 1.5s after any `<form>` submit; persists open/width in `localStorage sb_preview` (320–900px); hidden on `/admin/edit`

**charts.tsx** — `Sparkline({ points, width=120, height=32, label })`, `BarChart({ data: {key,value,title?}[], height=150, label, valueLabel="views" })`, `HBars({ rows: {label,value,hint?}[], label, empty? })`, `Delta({ now, prev })`. All ship sr-only tables; only accent hue.

**navIcons.tsx** — add a route: add a `<path>` under its href in `NAV_ICONS`, add `[href,label]` to `NAV_GROUPS` in AdminShell (groups: none/Dashboard+Edit Home, Content, Inbox, Store).

**ImagePicker({ value?, onChange(ref), label? })** — POST `/api/admin/upload`, library from `/api/admin/images`, warns under 1200px width. **ImageField({ name, initial, label? })** for plain-form use.
**MarkdownEditor({ value, onChange, name, rows=16 })**. **AiBar({ current: Snapshot, onApply(AiPatch) })**. **ResetButton({ scope, label? })**. **SiteHealth({ issues: Issue[] })**. **CountUp({ value, duration? })**.

## 5. Conventions

- Tailwind v4 (`@import "tailwindcss"`, `tailwindcss ^4`, PostCSS) — no `tailwind.config`; arbitrary values used freely (`text-[11px]`, `bg-[#0d110d]`, `border-[var(--accent)]/40`, `z-[200]`).
- Class strings are static literals or exported constants (`inputClass`, local `const btn = "..."`), with variants chosen by ternary/`${cond ? "a" : "b"}` — never runtime-composed class names like `` `bg-${color}` `` (they would not be generated). Reusable global styles live as CSS classes in globals.css (`.card`, `.btn-accent`, `.admin-rise`) rather than repeated utility strings.
- Accent always via `var(--accent)` / `[var(--accent)]`, never a literal, so Appearance changes propagate.
- Server page fetches; interactive part is a sibling `*Client.tsx` (`"use client"`) that calls `/api/admin/*` with `fetch` + `router.refresh()`, or a `<form action={serverAction}>` with `useFormStatus` (`content/SaveBar.tsx`, `products/actions.ts`).
- Destructive ops go through `useConfirm({ danger: true })`; outcome via `useToast`. No `window.confirm`.
- Icons are inline SVG paths (CSP blocks CDNs); emoji ok for small glyphs.
- Eyebrow labels: `text-[11px] font-bold tracking-widest` (10px in sidebar); section titles `font-display text-xl`.
- Tables: `w-full text-sm`, `thead text-white/50`, rows `border-t border-white/10`, cells `py-2 pr-3`, wrapped in `overflow-x-auto` inside a `Card`; empty state `py-6 text-center text-white/40`.
- Mobile: sidebar becomes a drawer < `lg`; `<main>` has `pt-24` for the fixed header; touch targets ≥ 44px.

## 6. New admin page skeleton

```
app/admin/(panel)/widgets/page.tsx
import { db } from "@/lib/db";
import { PageHeader, LinkButton } from "@/components/admin/ui";
import WidgetsClient from "./WidgetsClient";
export const dynamic = "force-dynamic";
export default async function WidgetsPage() {
  const rows = await db.widget.findMany({ orderBy: { id: "asc" } });
  return (
    <div>
      <PageHeader title="Widgets" sub="One-line purpose." action={<LinkButton href="/admin/widgets/new">New widget</LinkButton>} />
      <WidgetsClient rows={rows} />
    </div>
  );
}

app/admin/(panel)/widgets/WidgetsClient.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";
export default function WidgetsClient({ rows }: { rows: Widget[] }) {
  const confirm = useConfirm(); const toast = useToast(); const router = useRouter();
  const [form, setForm] = useState(empty); const [busy, setBusy] = useState(false);
  async function save() { setBusy(true); const r = await fetch("/api/admin/widgets", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) }); setBusy(false); r.ok ? (toast("Saved"), router.refresh()) : toast("Save failed", "error"); }
  async function del(id: number) { if (!(await confirm({ title:"Delete this widget?", confirmLabel:"Delete", danger:true }))) return; /* fetch delete */ router.refresh(); }
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>{/* overflow-x-auto table: thead text-white/50, tr border-t border-white/10, td py-2 pr-3 */}</Card>
      <Card>
        <h2 className="mb-4 font-display text-xl">{form.id ? "Edit" : "New"}</h2>
        <div className="flex flex-col gap-3">
          <input className={inputClass} ... />
          <button onClick={save} disabled={busy} className="btn-accent text-sm">{busy ? "Saving…" : "Save"}</button>
        </div>
      </Card>
    </div>
  );
}
```
Then register nav: add `["/admin/widgets", "Widgets"]` to the right group in `AdminShell.NAV_GROUPS` and a `<path>` under `"/admin/widgets"` in `navIcons.NAV_ICONS`. Add an API route at `app/api/admin/widgets/route.ts` (or server actions + `<form>` with `SaveBar`-style `useFormStatus` submit). For dashboard-style tiles use `Stat`/`QuickAction` grids with `index={i}` for `.admin-rise` stagger and `chart={<Sparkline .../>}`. Layout auth is inherited automatically from `(panel)/layout.tsx`.
