import { readFile } from 'node:fs/promises';
import path from 'node:path';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const TYPES = { pdf: "application/pdf", doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", txt: "text/plain" };
const GET = async ({ url }) => {
  const name = (url.searchParams.get("name") || "").replace(/[^a-zA-Z0-9._-]/g, "");
  if (!name || !name.startsWith("resume-")) return new Response("Not found", { status: 404 });
  const ext = name.split(".").pop()?.toLowerCase() || "";
  try {
    const buf = await readFile(path.join(process.cwd(), "data", "uploads", name));
    return new Response(Buffer.from(buf), { status: 200, headers: { "Content-Type": TYPES[ext] || "application/octet-stream", "Content-Disposition": `attachment; filename="${name}"` } });
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
