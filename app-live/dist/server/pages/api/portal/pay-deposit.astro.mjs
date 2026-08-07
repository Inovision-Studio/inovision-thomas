import { v as getClient } from '../../../chunks/db_xJ927fmw.mjs';
import { g as getClientSession } from '../../../chunks/clientauth_C72sOTMC.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ cookies, url, redirect }) => {
  const session = await getClientSession(cookies);
  if (!session) return redirect("/portal", 302);
  const c = getClient(session.id);
  if (!c) return redirect("/portal", 302);
  if (c.deposit_paid) return redirect("/portal", 302);
  const key = process.env.STRIPE_SECRET_KEY;
  const deposit = Number(c.deposit_amount || 0);
  if (!key || deposit < 0.5) return redirect("/portal", 302);
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      mode: "payment",
      customer_email: c.email || "",
      success_url: url.origin + "/api/onboard/return?cid=" + c.id + "&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: url.origin + "/portal",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][product_data][name]": `Inovision Studios — ${c.plan || "Project"} deposit (50%)`,
      "line_items[0][price_data][unit_amount]": String(Math.round(deposit * 100)),
      "line_items[0][quantity]": "1",
      "payment_intent_data[description]": `Inovision ${c.plan || "project"} deposit — ${c.name}`,
      "metadata[client_id]": String(c.id),
      "metadata[kind]": "project_deposit"
    }),
    signal: AbortSignal.timeout(2e4)
  });
  const data = await res.json();
  if (!res.ok || !data.url) return redirect("/portal", 302);
  return redirect(data.url, 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
