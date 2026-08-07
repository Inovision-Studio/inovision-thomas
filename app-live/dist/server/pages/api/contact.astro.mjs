import { ap as insertMessage } from '../../chunks/db_xJ927fmw.mjs';
import { r as rateLimit, c as clientIp } from '../../chunks/ratelimit_CcA86__c.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function clean(s, max) {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json" }
});
const POST = async ({ request, clientAddress }) => {
  if (!rateLimit("contact:" + clientIp(request, clientAddress), 6, 15 * 6e4)) {
    return json({ error: "Too many messages. Please try again later." }, 429);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const data = body ?? {};
  if (clean(data.website, 1).length > 0) return json({ ok: true });
  const name = clean(data.name, 120);
  const email = clean(data.email, 200);
  const subject = clean(data.subject, 200);
  const messageBody = clean(data.body, 4e3);
  if (!name) return json({ error: "Name is required" }, 400);
  if (!email || !EMAIL_RE.test(email))
    return json({ error: "Valid email is required" }, 400);
  if (!messageBody || messageBody.length < 5)
    return json(
      { error: "Please include a short description of your project" },
      400
    );
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || clientAddress || null;
  const userAgent = request.headers.get("user-agent") || null;
  try {
    const id = insertMessage({
      name,
      email,
      subject: subject || null,
      body: messageBody,
      ip,
      user_agent: userAgent
    });
    return json({ ok: true, id });
  } catch (err) {
    console.error("contact insert failed", err);
    return json(
      { error: "Could not save your message. Please try again." },
      500
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
