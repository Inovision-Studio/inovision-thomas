import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json" }
});
function extFor(type) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "bin";
}
const POST = async ({ request }) => {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return json({ error: "No file uploaded" }, 400);
  }
  if (!ALLOWED.has(file.type)) {
    return json({ error: "Unsupported file type" }, 415);
  }
  if (file.size > MAX_BYTES) {
    return json({ error: "File exceeds 10 MB limit" }, 413);
  }
  const inBuf = Buffer.from(await file.arrayBuffer());
  const id = crypto.randomBytes(8).toString("hex");
  const ts = Date.now();
  let outBuf = inBuf;
  let filename = `post-${ts}-${id}.${extFor(file.type)}`;
  if (file.type !== "image/gif") {
    try {
      outBuf = await sharp(inBuf).rotate().resize(2048, 2048, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      filename = `post-${ts}-${id}.webp`;
    } catch {
    }
  }
  const uploadsDir = path.join(process.cwd(), "data", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), outBuf);
  return json({ ok: true, url: `/media/${filename}`, name: filename, size: outBuf.length, type: "image/webp" });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
