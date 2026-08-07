import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../../chunks/Base_-4rjFWta.mjs';
import { A as AdminPostEditorPage } from '../../../chunks/AdminPostEditorPage_DwxVa6DE.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const $$New = createComponent(($$result, $$props, $$slots) => {
  const initial = {
    title: "",
    subtitle: "",
    body: "",
    template: "editorial",
    images: [],
    published: false
  };
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "New Post \xB7 Inovision Studios", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AdminPostEditorPage", AdminPostEditorPage, { "mode": "create", "title": "New Post", "subtitle": "Write, drag in up to 20 images, pick a template, publish.", "initial": initial, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/AdminPostEditorPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/posts/new.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/posts/new.astro";
const $$url = "/admin/posts/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
