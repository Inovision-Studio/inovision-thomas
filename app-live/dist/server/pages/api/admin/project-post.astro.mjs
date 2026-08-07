import { g as getSession } from '../../../chunks/auth_bfH86Az4.mjs';
import { ac as deleteProjectUpdate, ad as addProjectUpdate } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const POST = async ({ request, cookies }) => {
  const session = await getSession(cookies);
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  if (!b.project_id || !b.body?.trim()) return json({ error: "Project and message required" }, 400);
  addProjectUpdate({ project_id: b.project_id, author_name: session?.name || "", body: b.body.trim(), kind: b.kind });
  return json({ ok: true });
};
const DELETE = ({ url }) => {
  const id = url.searchParams.get("id");
  if (id) deleteProjectUpdate(Number(id));
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
