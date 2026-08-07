import { r as refreshNews } from '../../../chunks/news_6wg9tm7r.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, status = 200) => new Response(JSON.stringify(d), {
  status,
  headers: { "Content-Type": "application/json" }
});
const GET = async ({ url }) => {
  const expected = process.env.NEWS_CRON_KEY;
  const key = url.searchParams.get("key");
  if (!expected || key !== expected) return json({ error: "Unauthorized" }, 401);
  try {
    const added = await refreshNews();
    return json({ ok: true, added });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
