import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { g as getSession } from '../../../chunks/auth_bfH86Az4.mjs';
import { ak as deleteTeamMessage, al as listTeamMessages, am as addTeamMessage } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const MAX = 5 * 1024 * 1024;
const GET = () => json({ ok: true, items: listTeamMessages() });
const POST = async ({ request, cookies }) => {
  const session = await getSession(cookies);
  const form = await request.formData();
  const body = (form.get("body") || "").trim();
  let image;
  const file = form.get("image");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX) return json({ error: "That image is too large to send." }, 413);
    try {
      const out = await sharp(Buffer.from(await file.arrayBuffer())).rotate().resize(1600, 1600, { fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
      const name = `team-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.webp`;
      const dir = path.join(process.cwd(), "data", "uploads");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, name), out);
      image = `/media/${name}`;
    } catch {
    }
  }
  if (!body && !image) return json({ error: "Nothing to send" }, 400);
  const id = addTeamMessage({ author_email: session?.email || "unknown", author_name: session?.name || "", body, image });
  return json({ ok: true, id });
};
const DELETE = ({ url }) => {
  const id = url.searchParams.get("id");
  if (id) deleteTeamMessage(Number(id));
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
