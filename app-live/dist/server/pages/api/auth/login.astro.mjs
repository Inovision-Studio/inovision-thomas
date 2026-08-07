import { c as createToken, A as AUTH_COOKIE, a as AUTH_MAX_AGE_S } from '../../../chunks/auth_bfH86Az4.mjs';
import { r as rateLimit, c as clientIp } from '../../../chunks/ratelimit_CcA86__c.mjs';
import { ao as verifyAdmin } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json" }
});
const POST = async ({ request, cookies, clientAddress }) => {
  if (!rateLimit("login:" + clientIp(request, clientAddress), 8, 5 * 6e4)) {
    return json({ error: "Too many attempts. Try again in a few minutes." }, 429);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const data = body ?? {};
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const password = typeof data.password === "string" ? data.password : "";
  if (!email || !password)
    return json({ error: "Email and password are required" }, 400);
  const matched = verifyAdmin(email, password);
  if (!matched) return json({ error: "Incorrect email or password" }, 401);
  const token = await createToken(matched);
  cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: AUTH_MAX_AGE_S
  });
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
