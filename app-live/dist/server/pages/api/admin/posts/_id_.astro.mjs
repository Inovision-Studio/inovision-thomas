import { a9 as deletePost, c as getPostById, aa as updatePost } from '../../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const TEMPLATES = /* @__PURE__ */ new Set([
  "editorial",
  "gallery",
  "photo-essay",
  "minimal"
]);
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json" }
});
const PATCH = async ({ request, params }) => {
  const numericId = Number(params.id);
  const existing = getPostById(numericId);
  if (!existing) {
    return json({ error: "Not found" }, 404);
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return json({ error: "Invalid JSON" }, 400);
  }
  const data = body;
  const patch = {};
  if (typeof data.title === "string")
    patch.title = data.title.trim().slice(0, 200);
  if (typeof data.subtitle === "string" || data.subtitle === null)
    patch.subtitle = typeof data.subtitle === "string" ? data.subtitle.trim().slice(0, 240) || null : null;
  if (typeof data.body === "string") patch.body = data.body.slice(0, 5e4);
  if (typeof data.template === "string" && TEMPLATES.has(data.template))
    patch.template = data.template;
  if (Array.isArray(data.images))
    patch.images = data.images.map((x) => typeof x === "string" ? { url: x, alt: "" } : x && typeof x.url === "string" ? { url: x.url, alt: typeof x.alt === "string" ? x.alt.slice(0, 300) : "" } : null).filter(Boolean).slice(0, 20);
  if (typeof data.published === "boolean") patch.published = data.published;
  const post = updatePost(numericId, patch);
  return json({ ok: true, post });
};
const DELETE = async ({ params }) => {
  deletePost(Number(params.id));
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
