import { listTeamMembers, replaceTeamMembers } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = () => {
  return json({ ok: true, items: listTeamMembers() });
};
const POST = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const items = (body.items || []).filter((i) => i && typeof i.name === "string" && i.name.trim()).slice(0, 100);
  replaceTeamMembers(items);
  return json({ ok: true, items: listTeamMembers() });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
