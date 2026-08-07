import { d as deleteApplication, f as listApplications } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = () => json({ ok: true, items: listApplications() });
const DELETE = ({ url }) => {
  const id = url.searchParams.get("id");
  if (id) deleteApplication(Number(id));
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
