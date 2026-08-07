import { a4 as deleteMockup, a5 as getMockup, a6 as listMockups, a7 as saveMockup } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = ({ url }) => {
  const id = url.searchParams.get("id");
  if (id) {
    const m = getMockup(Number(id));
    if (!m) return json({ error: "Not found" }, 404);
    return json({ ok: true, mockup: { id: m.id, name: m.name, html: m.html, messages: JSON.parse(m.messages || "[]") } });
  }
  return json({ ok: true, items: listMockups() });
};
const POST = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const name = (body.name || "").trim();
  if (!name) return json({ error: "Name required" }, 400);
  const id = saveMockup({
    id: body.id,
    name,
    html: String(body.html || ""),
    messages: JSON.stringify(body.messages || [])
  });
  return json({ ok: true, id });
};
const DELETE = ({ url }) => {
  const id = url.searchParams.get("id");
  if (id) deleteMockup(Number(id));
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
