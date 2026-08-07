import { f as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/Base_-4rjFWta.mjs';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { N as Nav, F as Footer } from '../chunks/Footer_CTcSx4kn.mjs';
import { B as Breadcrumbs } from '../chunks/Breadcrumbs_CbOPbxvn.mjs';
import { R as Reveal } from '../chunks/Reveal_Bpa_el4Q.mjs';
import { l as listPosts } from '../chunks/db_xJ927fmw.mjs';
export { renderers } from '../renderers.mjs';

const SITE_URL = "https://inovisionstudios.com";
function formatWhen(ts) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function BlogListPage({ posts }) {
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog`,
    name: "Inovision Studios — Journal",
    url: `${SITE_URL}/blog`,
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: new Date(p.created_at).toISOString(),
      dateModified: new Date(p.updated_at).toISOString(),
      author: { "@id": `${SITE_URL}/#organization` }
    }))
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsx("section", { className: "iv-section", style: { paddingTop: 130 }, children: /* @__PURE__ */ jsxs("div", { className: "iv-container-narrow", children: [
      /* @__PURE__ */ jsx(
        Breadcrumbs,
        {
          items: [
            { name: "Home", href: "/" },
            { name: "Journal", href: "/blog" }
          ]
        }
      ),
      /* @__PURE__ */ jsxs(Reveal, { className: "iv-section-head", children: [
        /* @__PURE__ */ jsx("div", { className: "iv-eyebrow", children: "Journal" }),
        /* @__PURE__ */ jsxs("h1", { children: [
          "Notes from ",
          /* @__PURE__ */ jsx("em", { children: "the studio." })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { color: "#aaa", marginTop: 14 }, children: "Occasional writing about web design, vape branding, smoke shop retail, and the craft of building things that feel considered." })
      ] }),
      posts.length === 0 ? /* @__PURE__ */ jsx("div", { className: "iv-empty", style: { marginTop: 40 }, children: "Nothing here yet. Check back soon." }) : /* @__PURE__ */ jsx("div", { className: "iv-blog-list", children: posts.map((p) => {
        const c0 = p.images && p.images[0];
        const cover = typeof c0 === "string" ? c0 : c0 && c0.url || "";
        const coverAlt = (c0 && typeof c0 === "object" && c0.alt) || p.title;
        return /* @__PURE__ */ jsxs(
        "a",
        {
          href: `/blog/${p.slug}`,
          className: "iv-blog-card",
          children: [
            cover ? /* @__PURE__ */ jsx("div", { className: "iv-blog-card-image", children: cover.startsWith("/uploads/") ? (
              // Bypass next/image for uploaded files (LiteSpeed quirk)
              // eslint-disable-next-line @next/next/no-img-element
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: cover,
                  alt: coverAlt,
                  loading: "lazy",
                  decoding: "async"
                }
              )
            ) : /* @__PURE__ */ jsx(
              "img",
              {
                src: cover,
                alt: coverAlt,
                width: 560,
                height: 420,
                sizes: "(max-width: 720px) 100vw, 280px"
              }
            ) }) : /* @__PURE__ */ jsx("div", { className: "iv-blog-card-image empty", children: "IS" }),
            /* @__PURE__ */ jsxs("div", { className: "iv-blog-card-body", children: [
              /* @__PURE__ */ jsx("div", { className: "when", children: formatWhen(p.created_at) }),
              /* @__PURE__ */ jsx("h3", { children: p.title }),
              p.subtitle && /* @__PURE__ */ jsx("p", { className: "sub", children: p.subtitle }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    fontSize: 11,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    borderBottom: "1px solid currentColor",
                    paddingBottom: 2
                  },
                  children: "Read →"
                }
              )
            ] })
          ]
        },
        p.id
      );
      }) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(blogJsonLd) }
      }
    )
  ] });
}

const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const posts = listPosts({ publishedOnly: true });
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Journal \u2014 Notes from Inovision Studios", "description": "Notes, case studies, and craft writing from Inovision Studios \u2014 a web design & solutions studio for small business and enterprise." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "BlogListPage", BlogListPage, { "posts": posts, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/BlogListPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/blog/index.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
