// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";

// Inovision Studios — stable Astro rebuild.
// Marketing pages prerender to static HTML (nothing to crash-loop).
// Admin + API routes opt out with `export const prerender = false`
// and run on the Node standalone server (better-sqlite3 backend).
export default defineConfig({
  site: "https://inovisionstudios.com",
  adapter: node({ mode: "standalone" }),
  integrations: [react()],
  prefetch: true,
  build: { assets: "_assets", inlineStylesheets: "never" },
  // CSRF is already covered by the admin session cookie (httpOnly + sameSite=lax,
  // which blocks cross-site state-changing POSTs). Astro's origin check is redundant
  // here and would 403 legitimate same-origin multipart uploads behind a reverse
  // proxy, so disable it for reliable admin image uploads in production.
  security: { checkOrigin: false },
  vite: {
    ssr: {
      // native module — keep external so Astro/Vite don't try to bundle it
      external: ["better-sqlite3", "sharp"],
    },
  },
});
