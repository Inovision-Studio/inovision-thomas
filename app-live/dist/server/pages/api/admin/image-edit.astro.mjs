import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
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
const MAX_REFS = 8;
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
  if (!prompt) return json({ error: "Describe the edit" }, 400);
  const fwdHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const origin = fwdHost && !fwdHost.includes("localhost") ? `https://${fwdHost}` : process.env.PUBLIC_SITE_URL || "https://inovisionstudios.com";
  const image_urls = (body.images || []).map((u) => u.startsWith("http") ? u : origin + u).slice(0, MAX_REFS);
  if (image_urls.length === 0) return json({ error: "Add at least one reference image" }, 400);
  const size = body.aspect && SIZES[body.aspect] ? SIZES[body.aspect] : null;
  const model = process.env.FAL_EDIT_MODEL ?? "fal-ai/bytedance/seedream/v4.5/edit";
  try {
    const res = await fetch("https://fal.run/" + model, {
      method: "POST",
      headers: { Authorization: "Key " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        image_urls,
        num_images: Math.min(Math.max(body.n || 1, 1), 4),
        enable_safety_checker: false,
        ...size ? { image_size: size } : {}
      }),
      signal: AbortSignal.timeout(12e4)
    });
    const data = await res.json();
    if (!res.ok) return json({ error: data?.detail || "fal error", raw: data }, 502);
    const falUrls = (data.images || []).map((i) => typeof i === "string" ? i : i.url).filter(Boolean);
    const dir = path.join(process.cwd(), "data", "uploads");
    await mkdir(dir, { recursive: true });
    const images = [];
    for (const u of falUrls) {
      try {
        const r = await fetch(u, { signal: AbortSignal.timeout(3e4) });
        const opt = await sharp(Buffer.from(await r.arrayBuffer())).resize(2048, 2048, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
        const name = `edit-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.webp`;
        await writeFile(path.join(dir, name), opt);
        images.push(`/media/${name}`);
      } catch {
        images.push(u);
      }
    }
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
