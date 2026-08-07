import { M as getInvoice } from '../../../chunks/db_xJ927fmw.mjs';
import { b as buildInvoicePdf } from '../../../chunks/pdf_B5ePfIez.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  const inv = getInvoice(Number(url.searchParams.get("id")));
  if (!inv) return new Response("Not found", { status: 404 });
  const bytes = await buildInvoicePdf(inv);
  return new Response(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="inovision-invoice-${String(inv.id).padStart(4, "0")}.pdf"`
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
