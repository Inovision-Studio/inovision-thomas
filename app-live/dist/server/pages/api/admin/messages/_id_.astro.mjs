import { V as deleteMessage, W as markRead, X as markUnread } from '../../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json" }
});
const PATCH = async ({ request, params }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return json({ error: "Invalid id" }, 400);
  }
  const body = await request.json().catch(() => null);
  const action = body && typeof body === "object" ? body.action : void 0;
  if (action === "read") {
    markRead(id);
  } else if (action === "unread") {
    markUnread(id);
  } else {
    return json({ error: "Invalid action" }, 400);
  }
  return json({ ok: true });
};
const DELETE = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return json({ error: "Invalid id" }, 400);
  }
  deleteMessage(id);
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
