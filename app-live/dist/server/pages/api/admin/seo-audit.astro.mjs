export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const POST = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  let url = (body.url || "").trim();
  if (!url) return json({ error: "Enter a URL" }, 400);
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try {
    const h = new URL(url).hostname.toLowerCase();
    const blocked = h === "localhost" || h.endsWith(".internal") || h.endsWith(".local") || /^(127\.|10\.|192\.168\.|169\.254\.|0\.0\.0\.0|::1|\[)/.test(h) || /^172\.(1[6-9]|2\d|3[01])\./.test(h);
    if (blocked) return json({ error: "That host isn't allowed." }, 400);
  } catch {
    return json({ error: "Invalid URL" }, 400);
  }
  let html = "";
  let finalStatus = 0;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "InovisionSEOAudit/1.0 (+https://inovisionstudios.com)" },
      signal: AbortSignal.timeout(15e3),
      redirect: "follow"
    });
    finalStatus = res.status;
    html = await res.text();
  } catch (e) {
    return json({ error: "Could not fetch the page: " + String(e) }, 502);
  }
  const m = (re) => (html.match(re)?.[1] || "").trim();
  const all = (re) => html.match(re) || [];
  const title = m(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const desc = m(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  const h1s = all(/<h1[\s>]/gi).length;
  const imgs = all(/<img\b[^>]*>/gi);
  const imgsNoAlt = imgs.filter((t) => !/\balt\s*=/.test(t)).length;
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  const checks = [
    { label: "HTTPS", status: url.startsWith("https") ? "pass" : "fail", detail: url.startsWith("https") ? "Secure" : "Not served over HTTPS" },
    { label: "Status", status: finalStatus === 200 ? "pass" : "warn", detail: "HTTP " + finalStatus },
    { label: "Title tag", status: !title ? "fail" : title.length < 30 || title.length > 65 ? "warn" : "pass", detail: title ? `${title.length} chars — “${title.slice(0, 70)}”` : "Missing" },
    { label: "Meta description", status: !desc ? "fail" : desc.length < 70 || desc.length > 165 ? "warn" : "pass", detail: desc ? `${desc.length} chars` : "Missing" },
    { label: "H1 heading", status: h1s === 1 ? "pass" : h1s === 0 ? "fail" : "warn", detail: `${h1s} found (1 is ideal)` },
    { label: "Canonical", status: /<link[^>]+rel=["']canonical["']/i.test(html) ? "pass" : "warn", detail: /canonical/i.test(html) ? "Present" : "Missing" },
    { label: "Viewport (mobile)", status: /<meta[^>]+name=["']viewport["']/i.test(html) ? "pass" : "fail", detail: /viewport/i.test(html) ? "Set" : "Missing" },
    { label: "Open Graph", status: /property=["']og:title["']/i.test(html) && /property=["']og:image["']/i.test(html) ? "pass" : "warn", detail: "og:title + og:image" },
    { label: "Structured data", status: /application\/ld\+json/i.test(html) ? "pass" : "warn", detail: /ld\+json/i.test(html) ? "JSON-LD present" : "None found" },
    { label: "Image alt text", status: imgsNoAlt === 0 ? "pass" : imgsNoAlt > 3 ? "fail" : "warn", detail: `${imgsNoAlt}/${imgs.length} images missing alt` },
    { label: "Robots", status: /<meta[^>]+content=["'][^"']*noindex/i.test(html) ? "fail" : "pass", detail: /noindex/i.test(html) ? "noindex set!" : "Indexable" },
    { label: "Content depth", status: words >= 300 ? "pass" : words >= 120 ? "warn" : "fail", detail: `~${words} words` },
    { label: "Lang attribute", status: /<html[^>]+lang=/i.test(html) ? "pass" : "warn", detail: /<html[^>]+lang=/i.test(html) ? "Set" : "Missing" }
  ];
  const score = Math.round(checks.filter((c) => c.status === "pass").length / checks.length * 100);
  return json({ ok: true, url, score, checks });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
