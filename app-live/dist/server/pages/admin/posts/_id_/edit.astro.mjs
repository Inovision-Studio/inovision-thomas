import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../../../chunks/Base_-4rjFWta.mjs';
import { A as AdminPostEditorPage } from '../../../../chunks/AdminPostEditorPage_DwxVa6DE.mjs';
import { c as getPostById } from '../../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro("https://inovisionstudios.com");
const prerender = false;
const $$Edit = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Edit;
  const post = getPostById(Number(Astro2.params.id));
  if (!post) {
    Astro2.response.status = 404;
  }
  const initial = post ? {
    id: post.id,
    title: post.title,
    subtitle: post.subtitle ?? "",
    body: post.body,
    template: post.template,
    images: post.images,
    published: Boolean(post.published)
  } : null;
  return renderTemplate`${post && initial ? renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Edit Post \xB7 Inovision Studios", "noindex": true }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "AdminPostEditorPage", AdminPostEditorPage, { "mode": "edit", "title": "Edit Post", "subtitle": `/blog/${post.slug} \xB7 ${post.views} views`, "initial": initial, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/AdminPostEditorPage", "client:component-export": "default" })}` })}` : renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Post not found \xB7 Inovision Studios", "noindex": true }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<main style="min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.25rem;padding:2rem;text-align:center;"><h1 style="font-family:var(--font-display);font-size:clamp(2rem,7vw,4rem);margin:0;">
Post not found
</h1><a href="/admin/posts" style="margin-top:.5rem;padding:.75rem 1.5rem;border:1px solid rgba(255,255,255,.2);border-radius:999px;color:var(--text);text-decoration:none;">
← Back to posts
</a></main>` })}`}`;
}, "D:/wix/Inovision/web/src/pages/admin/posts/[id]/edit.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/posts/[id]/edit.astro";
const $$url = "/admin/posts/[id]/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Edit,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
