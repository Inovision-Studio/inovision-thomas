import { C as CLIENT_COOKIE } from '../../../chunks/clientauth_C72sOTMC.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ cookies, redirect }) => {
  cookies.delete(CLIENT_COOKIE, { path: "/" });
  return redirect("/portal", 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
