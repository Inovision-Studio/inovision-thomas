# Admin panel kit (for the rebuild)

The reusable admin panel + storefront lives in `../admin-kit/` (vendored snapshot of
`storefront-kit` @ 319830e; upstream https://github.com/ghiankyledomingo2007-beep/storefront-kit).

- Read `admin-kit/docs/ADMIN-HANDOFF.md` first — run instructions, structure, tokens, page recipe, don'ts.
- Reference deployment of the same panel: https://smokey-broz.vercel.app/admin (client site — read-only, don't edit that repo).
- The legacy Astro app in `app-live/` is compiled output only; nothing from it needs to be ported into the kit's admin.
