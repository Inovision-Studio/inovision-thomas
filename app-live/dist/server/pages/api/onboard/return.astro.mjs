import { v as getClient, as as markClientDepositPaid } from '../../../chunks/db_xJ927fmw.mjs';
import { c as createClientToken, C as CLIENT_COOKIE, a as CLIENT_MAX_AGE_S } from '../../../chunks/clientauth_C72sOTMC.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ url, cookies, redirect }) => {
  const cid = Number(url.searchParams.get("cid"));
  const sessionId = url.searchParams.get("session_id");
  const c = getClient(cid);
  if (!c) return redirect("/portal", 302);
  let paid = false;
  const key = process.env.STRIPE_SECRET_KEY;
  if (key && sessionId) {
    try {
      const r = await fetch("https://api.stripe.com/v1/checkout/sessions/" + encodeURIComponent(sessionId), {
        headers: { Authorization: "Bearer " + key },
        signal: AbortSignal.timeout(15e3)
      });
      const s = await r.json();
      if (r.ok && s.payment_status === "paid") {
        markClientDepositPaid(cid);
        paid = true;
      }
    } catch {
    }
  }
  const token = await createClientToken({ id: c.id, email: c.email || "", name: c.name });
  cookies.set(CLIENT_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: CLIENT_MAX_AGE_S });
  return redirect("/portal?welcome=" + (paid ? "1" : "pending"), 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
