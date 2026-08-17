# Admin panel (v2) — where to start

The new backend for inovisionstudios.com lives in [`../admin/`](../admin/). Standalone
Next.js 16 app, same look and building blocks as the Smokey Broz admin.

- Start with `admin/docs/HANDOFF.md` (run in 5 minutes, how it's built, what's not done).
- `admin/README.md` — modules, layout of the code, public endpoints.
- Legacy Astro app in `app-live/` stays as-is; its SQLite imports via `admin/scripts/import-legacy.ts`.
