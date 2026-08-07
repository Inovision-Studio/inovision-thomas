import { ax as verifyClientLogin } from '../../../chunks/db_xJ927fmw.mjs';
import { c as createClientToken, C as CLIENT_COOKIE, a as CLIENT_MAX_AGE_S } from '../../../chunks/clientauth_C72sOTMC.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const POST = async ({ request, cookies }) => {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  if (!email || !password) return json({ error: "Enter your email and password." }, 400);
  const c = verifyClientLogin(email, password);
  if (!c) return json({ error: "Incorrect email or password." }, 401);
  const token = await createClientToken({ id: c.id, email: c.email || email, name: c.name });
  cookies.set(CLIENT_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: CLIENT_MAX_AGE_S });
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
