import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { an as insertApplication } from '../../chunks/db_xJ927fmw.mjs';
import { r as rateLimit, c as clientIp } from '../../chunks/ratelimit_CcA86__c.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const RESUME_EXT = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "text/plain": "txt"
};
const MAX = 8 * 1024 * 1024;
const POST = async ({ request, clientAddress }) => {
  if (!rateLimit("apply:" + clientIp(request, clientAddress), 12, 15 * 6e4)) {
    return json({ error: "Too many submissions. Please try again later." }, 429);
  }
  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Invalid form" }, 400);
  }
  if (form.get("company")?.trim()) return json({ ok: true });
  const str = (k) => (form.get(k) || "").trim();
  const role = str("role");
  const name = str("name");
  const email = str("email");
  if (!role || !name || !email) return json({ error: "Name, email and role are required." }, 400);
  let resume_name;
  const file = form.get("resume");
  if (file instanceof File && file.size > 0) {
    const m = (file.name || "").toLowerCase().match(/\.(pdf|doc|docx|txt|rtf|odt|pages)$/);
    const ext = m ? m[1] : RESUME_EXT[file.type];
    if (!ext) return json({ error: "Résumé must be a PDF, DOC, DOCX, TXT, RTF or ODT." }, 415);
    if (file.size > MAX) return json({ error: "Résumé exceeds 8 MB." }, 413);
    const id = crypto.randomBytes(6).toString("hex");
    resume_name = `resume-${Date.now()}-${id}.${ext}`;
    const dir = path.join(process.cwd(), "data", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, resume_name), Buffer.from(await file.arrayBuffer()));
  }
  insertApplication({
    role,
    name,
    email,
    phone: str("phone"),
    message: str("message"),
    work_auth: str("work_auth"),
    veteran: str("veteran"),
    disability: str("disability"),
    resume_name
  });
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
