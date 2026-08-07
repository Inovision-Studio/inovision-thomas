import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
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
  const u = (b.url || "").trim();
  if (!/^https?:\/\//i.test(u)) return json({ error: "Invalid image URL" }, 400);
  try {
    const res = await fetch(u, { signal: AbortSignal.timeout(3e4) });
    if (!res.ok) return json({ error: "Could not fetch the image" }, 502);
    const buf = Buffer.from(await res.arrayBuffer());
    const out = await sharp(buf).resize(2048, 2048, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    const name = `gen-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.webp`;
    const dir = path.join(process.cwd(), "data", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), out);
    return json({ ok: true, url: `/media/${name}`, name, ref: name.replace(/\.[^.]+$/, "") });
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
