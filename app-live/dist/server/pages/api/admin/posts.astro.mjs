import { l as listPosts, ab as createPost } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

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
const GET = async () => {
  return json({ posts: listPosts({}) });
};
const POST = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return json({ error: "Invalid JSON" }, 400);
  }
  const data = body;
  const title = typeof data.title === "string" ? data.title.trim().slice(0, 200) : "";
  const subtitle = typeof data.subtitle === "string" ? data.subtitle.trim().slice(0, 240) || null : null;
  const bodyText = typeof data.body === "string" ? data.body.slice(0, 5e4) : "";
  const template = typeof data.template === "string" && TEMPLATES.has(data.template) ? data.template : "editorial";
  const images = Array.isArray(data.images) ? data.images.map((x) => typeof x === "string" ? { url: x, alt: "" } : x && typeof x.url === "string" ? { url: x.url, alt: typeof x.alt === "string" ? x.alt.slice(0, 300) : "" } : null).filter(Boolean).slice(0, 20) : [];
  const published = Boolean(data.published);
  if (!title) {
    return json({ error: "Title is required" }, 400);
  }
  if (!bodyText.trim()) {
    return json({ error: "Body is required" }, 400);
  }
  const post = createPost({
    title,
    subtitle,
    body: bodyText,
    template,
    images,
    published
  });
  return json({ ok: true, post });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
