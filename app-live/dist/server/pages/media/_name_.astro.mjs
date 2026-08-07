import { readFile } from 'node:fs/promises';
import path from 'node:path';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif"
};
const GET = async ({ params }) => {
  const name = (params.name || "").replace(/[^a-zA-Z0-9._-]/g, "");
  if (!name) return new Response("Not found", { status: 404 });
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const type = TYPES[ext];
  if (!type) return new Response("Not found", { status: 404 });
  try {
    const buf = await readFile(path.join(process.cwd(), "data", "uploads", name));
    return new Response(buf, {
      status: 200,
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" }
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
