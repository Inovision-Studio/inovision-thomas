# Vendored snapshot of storefront-kit @ 319830e (2026-08-17)

This folder is a copy of the **Storefront Kit** — Next.js 16 storefront + the admin
panel used on smokey-broz.vercel.app/admin, with the client brand stripped out.
Upstream: https://github.com/ghiankyledomingo2007-beep/storefront-kit (private, template repo).

Start with `docs/ADMIN-HANDOFF.md` (how to run it locally in 6 commands, where the
admin lives, design tokens, how to add a page). Then `AGENTS.md` (hard rules).

It is a standalone app: `cd admin-kit && npm ci && …` — it does not share code with
the legacy Astro build in `../app-live`. Improvements that are generic belong upstream
in storefront-kit; copy them there (or open a PR) rather than letting this snapshot drift.
