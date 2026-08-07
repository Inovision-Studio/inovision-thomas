import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
import { l as listPosts } from '../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../renderers.mjs';

function formatWhen(ts) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function AdminPostsPage({ posts }) {
  return /* @__PURE__ */ jsx(
    AdminShell,
    {
      active: "posts",
      title: "Posts",
      subtitle: `${posts.length} total · ${posts.filter((p) => p.published).length} published`,
      actions: /* @__PURE__ */ jsx("a", { href: "/admin/posts/new", className: "iv-admin-btn iv-admin-btn-primary", children: "+ New Post" }),
      children: posts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "iv-empty", style: { marginTop: 24 }, children: [
        "No posts yet. Click ",
        /* @__PURE__ */ jsx("strong", { children: "New Post" }),
        " to write your first one."
      ] }) : /* @__PURE__ */ jsxs("table", { className: "iv-posts-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { children: "Title" }),
          /* @__PURE__ */ jsx("th", { children: "Template" }),
          /* @__PURE__ */ jsx("th", { children: "Status" }),
          /* @__PURE__ */ jsx("th", { children: "Views" }),
          /* @__PURE__ */ jsx("th", { children: "Updated" }),
          /* @__PURE__ */ jsx("th", {})
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: posts.map((p) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsxs("td", { children: [
            /* @__PURE__ */ jsx("div", { className: "title", children: p.title }),
            /* @__PURE__ */ jsxs("div", { className: "meta", children: [
              "/blog/",
              p.slug
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { style: { color: "var(--muted)", fontSize: 13 }, children: p.template }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `iv-pill ${p.published ? "iv-pill-pub" : "iv-pill-draft"}`,
              children: p.published ? "Published" : "Draft"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { style: { color: "var(--muted)", fontSize: 13 }, children: p.views }),
          /* @__PURE__ */ jsx("td", { style: { color: "var(--muted)", fontSize: 13 }, children: formatWhen(p.updated_at) }),
          /* @__PURE__ */ jsx("td", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsx(
            "a",
            {
              href: `/admin/posts/${p.id}/edit`,
              className: "iv-btn-ghost",
              children: "Edit"
            }
          ) })
        ] }, p.id)) })
      ] })
    }
  );
}

const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const posts = listPosts({});
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Posts \xB7 Inovision Studios", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AdminPostsPage", AdminPostsPage, { "posts": posts, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/AdminPostsPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/posts/index.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/posts/index.astro";
const $$url = "/admin/posts";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
