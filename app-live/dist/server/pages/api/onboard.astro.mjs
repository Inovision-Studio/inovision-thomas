import { at as getClientByEmail, au as createOnboardClient, av as recordAgreement } from '../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const PLANS = {
  launch: { name: "Launch", fee: 500 },
  business: { name: "Business", fee: 1e3 },
  fullstack: { name: "Full-Stack", fee: 3e3 }
};
const POST = async ({ request, url, clientAddress }) => {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const name = String(b.name || "").trim();
  const business = String(b.business || "").trim();
  const email = String(b.email || "").trim().toLowerCase();
  const phone = String(b.phone || "").trim();
  const planKey = String(b.plan || "").trim();
  const aiEnabled = b.aiEnabled === true;
  const brief = String(b.brief || "").trim();
  const site = String(b.site || "").trim();
  const password = String(b.password || "");
  const plan = PLANS[planKey];
  if (!name || !email || !plan) return json({ error: "Please complete your name, email, and plan." }, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "Please enter a valid email address." }, 400);
  if (password.length < 8) return json({ error: "Choose a password of at least 8 characters." }, 400);
  if (!(b.agreeTos === true && b.agreePrivacy === true && b.agreeArbitration === true)) {
    return json({ error: "You must accept the Terms, Privacy Policy, and arbitration agreement to continue." }, 400);
  }
  if (getClientByEmail(email)) return json({ error: "An account with this email already exists — please sign in to your portal instead.", exists: true }, 409);
  const projectFee = plan.fee;
  const deposit = Math.round(projectFee * 0.5 * 100) / 100;
  const { id } = createOnboardClient({
    name: business || name,
    email,
    phone,
    site,
    plan: plan.name,
    project_fee: projectFee,
    deposit_amount: deposit,
    ai_enabled: aiEnabled,
    brief,
    password
  });
  recordAgreement({
    client_id: id,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || clientAddress || void 0,
    user_agent: request.headers.get("user-agent") || void 0,
    full_name: name
  });
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return json({ ok: true, needsKey: true, portal: "/portal" });
  const origin = url.origin;
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      mode: "payment",
      customer_email: email,
      success_url: origin + "/api/onboard/return?cid=" + id + "&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin + "/start?cancelled=1",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][product_data][name]": `Inovision Studios — ${plan.name} project deposit (50%)`,
      "line_items[0][price_data][product_data][description]": `Deposit to begin your ${plan.name} build. Remaining $${(projectFee - deposit).toFixed(2)} invoiced at launch.`,
      "line_items[0][price_data][unit_amount]": String(Math.round(deposit * 100)),
      "line_items[0][quantity]": "1",
      "payment_intent_data[description]": `Inovision ${plan.name} deposit — ${business || name}`,
      "metadata[client_id]": String(id),
      "metadata[kind]": "project_deposit"
    }),
    signal: AbortSignal.timeout(2e4)
  });
  const data = await res.json();
  if (!res.ok) return json({ error: data?.error?.message || "Could not start checkout." }, 502);
  return json({ ok: true, url: data.url });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PLANS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
