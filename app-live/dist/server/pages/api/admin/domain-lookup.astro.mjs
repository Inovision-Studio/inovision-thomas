export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const POST = async ({ request }) => {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const d = (b.domain || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/[^a-z0-9.-]/g, "");
  if (!d || !d.includes(".")) return json({ error: "Enter a domain like example.com" }, 400);
  const dns = async (type) => {
    try {
      const r = await fetch(`https://dns.google/resolve?name=${d}&type=${type}`, { signal: AbortSignal.timeout(8e3) });
      const j = await r.json();
      return (j.Answer || []).map((a2) => a2.data);
    } catch {
      return [];
    }
  };
  let rdap = {};
  try {
    const r = await fetch(`https://rdap.org/domain/${d}`, { headers: { Accept: "application/rdap+json" }, signal: AbortSignal.timeout(1e4) });
    if (r.ok) {
      const j = await r.json();
      const ev = (a2) => (j.events || []).find((e) => e.eventAction === a2)?.eventDate;
      const reg = (j.entities || []).find((e) => (e.roles || []).includes("registrar"));
      const regName = reg?.vcardArray?.[1]?.find((x) => x[0] === "fn")?.[3] || "";
      rdap = {
        registrar: regName,
        created: ev("registration"),
        expires: ev("expiration"),
        status: j.status || [],
        nameservers: (j.nameservers || []).map((n) => n.ldhName)
      };
    }
  } catch {
  }
  const [a, ns, mx] = await Promise.all([dns("A"), dns("NS"), dns("MX")]);
  return json({ ok: true, domain: d, rdap, dns: { a, ns, mx } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
