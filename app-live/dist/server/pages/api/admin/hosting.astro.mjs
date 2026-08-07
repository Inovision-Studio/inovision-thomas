export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
async function hz(token, pathname) {
  try {
    const res = await fetch("https://developers.hostinger.com" + pathname, {
      headers: { Authorization: "Bearer " + token, "User-Agent": UA, Accept: "application/json" },
      signal: AbortSignal.timeout(15e3)
    });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    return await res.json();
  } catch (e) {
    return { error: String(e) };
  }
}
const GET = async () => {
  const token = process.env.HOSTINGER_API_TOKEN;
  if (!token) return json({ needsKey: true, env: "HOSTINGER_API_TOKEN" });
  const [vps, subscriptions] = await Promise.all([
    hz(token, "/api/vps/v1/virtual-machines"),
    hz(token, "/api/billing/v1/subscriptions")
  ]);
  return json({ ok: true, vps, subscriptions });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
