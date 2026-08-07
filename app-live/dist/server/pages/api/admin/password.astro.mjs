import { g as getSession } from '../../../chunks/auth_bfH86Az4.mjs';
import { a8 as changeAdminPassword } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const POST = async ({ request, cookies }) => {
  const s = await getSession(cookies);
  if (!s) return json({ error: "Not signed in" }, 401);
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const r = changeAdminPassword(s.email, b.current || "", b.next || "");
  if (!r.ok) return json({ error: r.error }, 400);
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
