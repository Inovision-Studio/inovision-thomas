import { g as getSession } from '../../../chunks/auth_bfH86Az4.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ cookies }) => {
  const s = await getSession(cookies);
  return new Response(JSON.stringify({ ok: true, email: s?.email || "", name: s?.name || "" }), { headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
