import { l as listPosts } from '../chunks/db_xJ927fmw.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const SITE = "https://inovisionstudios.com";
const GET = async () => {
  const staticPaths = ["/", "/work", "/about", "/news", "/blog", "/careers", "/terms", "/contact", "/faq", "/privacy"];
  let posts = [];
  try {
    posts = listPosts({ publishedOnly: true });
  } catch {
    posts = [];
  }
  const entries = [
    ...staticPaths.map((p) => ({ loc: SITE + p, lastmod: "" })),
    ...posts.map((p) => ({
      loc: `${SITE}/blog/${p.slug}`,
      lastmod: new Date(p.updated_at).toISOString()
    }))
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
` + entries.map(
    (u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`
  ).join("\n") + `
</urlset>
`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
