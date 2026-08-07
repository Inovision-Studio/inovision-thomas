import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const MAX_BYTES = 8 * 1024 * 1024;
const EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif"
};
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const dir = () => path.join(process.cwd(), "data", "uploads");
const GET = async () => {
  try {
    const files = await readdir(dir());
    const items = files.filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f)).sort().reverse().map((f) => ({ name: f, url: `/media/${f}`, ref: f.replace(/\.[^.]+$/, "") }));
    return json({ ok: true, items });
  } catch {
    return json({ ok: true, items: [] });
  }
};
const POST = async ({ request }) => {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return json({ error: "No file" }, 400);
  const ext = EXT[file.type];
  if (!ext) return json({ error: "Unsupported type" }, 415);
  if (file.size > MAX_BYTES) return json({ error: "Max 8 MB" }, 413);
  const buf = Buffer.from(await file.arrayBuffer());
  const id = crypto.randomBytes(6).toString("hex");
  const base = (file.name || "img").replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/gi, "-").slice(0, 24).toLowerCase() || "img";
  await mkdir(dir(), { recursive: true });
  let outBuf = buf;
  let name = `${base}-${id}.${ext}`;
  if (ext !== "gif") {
    try {
      outBuf = await sharp(buf).rotate().resize(2048, 2048, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      name = `${base}-${id}.webp`;
    } catch {
    }
  }
  await writeFile(path.join(dir(), name), outBuf);
  return json({ ok: true, name, url: `/media/${name}`, ref: name.replace(/\.[^.]+$/, "") });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
