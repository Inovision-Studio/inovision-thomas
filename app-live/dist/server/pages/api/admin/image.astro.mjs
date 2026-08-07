export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const SIZES = {
  "1:1": { width: 2048, height: 2048 },
  "16:9": { width: 2048, height: 1152 },
  "9:16": { width: 1152, height: 2048 },
  "4:3": { width: 2048, height: 1536 },
  "3:4": { width: 1536, height: 2048 },
  "3:2": { width: 2048, height: 1365 },
  "2:3": { width: 1365, height: 2048 },
  "21:9": { width: 2048, height: 878 }
};
const POST = async ({ request }) => {
  const key = process.env.FAL_KEY;
  if (!key) return json({ needsKey: true, env: "FAL_KEY" });
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const prompt = (body.prompt || "").trim();
  if (!prompt) return json({ error: "Enter a prompt" }, 400);
  const size = SIZES[body.aspect || "1:1"] || SIZES["1:1"];
  const model = process.env.FAL_IMAGE_MODEL ?? "fal-ai/bytedance/seedream/v4.5/text-to-image";
  try {
    const res = await fetch("https://fal.run/" + model, {
      method: "POST",
      headers: { Authorization: "Key " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        image_size: size,
        // capped at 2048 (2K) via SIZES
        num_images: Math.min(Math.max(body.n || 1, 1), 4),
        enable_safety_checker: false
      }),
      signal: AbortSignal.timeout(9e4)
    });
    const data = await res.json();
    if (!res.ok) return json({ error: data?.detail || data?.error || "fal error", raw: data }, 502);
    const arr = Array.isArray(data.images) ? data.images : data.image ? [data.image] : [];
    const images = arr.map((i) => typeof i === "string" ? i : i?.url).filter(Boolean);
    return json({ ok: true, images });
  } catch (e) {
    return json({ error: String(e) }, 502);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
