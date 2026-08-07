import nodemailer from 'nodemailer';
import { M as getInvoice } from '../../../chunks/db_xJ927fmw.mjs';
import { b as buildInvoicePdf } from '../../../chunks/pdf_B5ePfIez.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const env = (k) => process.env[k];
const POST = async ({ request }) => {
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");
  if (!user || !pass) return json({ needsConfig: true, env: "SMTP_USER / SMTP_PASS" });
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const inv = getInvoice(Number(b.invoice_id));
  if (!inv) return json({ error: "Invoice not found" }, 404);
  const to = inv.client_email;
  if (!to) return json({ error: "Client has no email on file" }, 400);
  const pdf = await buildInvoicePdf(inv);
  const transport = nodemailer.createTransport({
    host: env("SMTP_HOST") || "smtp.hostinger.com",
    port: Number(env("SMTP_PORT") || 465),
    secure: Number(env("SMTP_PORT") || 465) === 465,
    auth: { user, pass }
  });
  const pay = inv.pay_url ? `

Pay online: ${inv.pay_url}` : "";
  try {
    await transport.sendMail({
      from: env("SMTP_FROM") || `Inovision Studios <${user}>`,
      to,
      subject: `Invoice #${String(inv.id).padStart(4, "0")} — ${inv.period}`,
      text: `Hi ${inv.client_name || ""},

Please find attached invoice #${String(inv.id).padStart(4, "0")} for ${inv.period}: $${inv.amount.toFixed(2)}.${pay}

Thank you,
Inovision Studios
445 S Livernois Rd, Suite 333, Rochester Hills, MI 48307`,
      attachments: [{ filename: `inovision-invoice-${String(inv.id).padStart(4, "0")}.pdf`, content: Buffer.from(pdf), contentType: "application/pdf" }]
    });
    return json({ ok: true, to });
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
