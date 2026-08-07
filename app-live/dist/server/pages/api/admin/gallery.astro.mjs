import { H as galleryCount, I as replaceGallery, J as listGallery } from '../../../chunks/db_xJ927fmw.mjs';
import { G as GALLERY } from '../../../chunks/gallery_YWiXHYbc.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = () => {
  if (galleryCount() === 0) {
    replaceGallery(GALLERY.map((g) => ({ url: g.src, title: g.title, category: g.category })));
  }
  return json({ ok: true, items: listGallery() });
};
const POST = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const items = (body.items || []).filter((i) => i && typeof i.url === "string" && i.url).slice(0, 300);
  replaceGallery(items);
  return json({ ok: true, items: listGallery() });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
