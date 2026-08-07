import { g as getSettings, ai as setSettings } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = () => json({ ok: true, settings: getSettings() });
const POST = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const clean = {};
  for (const [k, v] of Object.entries(body)) {
    if (/^(theme|content)\.[a-z0-9._-]+$/i.test(k) && typeof v === "string" && v.length < 4e3) {
      clean[k] = v;
    }
  }
  setSettings(clean);
  return json({ ok: true, settings: getSettings() });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
