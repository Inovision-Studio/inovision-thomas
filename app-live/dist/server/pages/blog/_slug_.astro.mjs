import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate$1, m as maybeRenderHead } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { N as Nav, F as Footer } from '../../chunks/Footer_CTcSx4kn.mjs';
import { B as Breadcrumbs } from '../../chunks/Breadcrumbs_CbOPbxvn.mjs';
import { az as getPostBySlug, aA as incrementPostViews } from '../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../renderers.mjs';

const SITE_URL = "https://inovisionstudios.com";
function formatWhen(ts) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function PostImg({
  src,
  alt,
  className,
  style,
  priority
}) {
  if (src.startsWith("/uploads/")) {
    return /* @__PURE__ */ jsx(
      "img",
      {
        src,
        alt,
        className,
        style,
        loading: priority ? "eager" : "lazy",
        decoding: "async"
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "img",
    {
      src,
      alt,
      width: 1600,
      height: 1e3,
      sizes: "(max-width: 720px) 100vw, 680px",
      loading: priority ? "eager" : "lazy",
      decoding: "async",
      className,
      style
    }
  );
}
function normImgs(a) {
  return (a || []).map(
    (v) => typeof v === "string" ? { url: v, alt: "" } : { url: v && v.url || "", alt: v && v.alt || "" }
  ).filter((v) => v.url);
}
function parseImgOpts(s) {
  const o = { w: 100, align: "center", cap: "" };
  if (!s) return o;
  for (const part of s.replace(/^\|/, "").split(/[|,]/)) {
    const w = /^\s*(?:w|width)\s*=\s*(\d{1,3})\s*%?\s*$/i.exec(part);
    if (w) {
      o.w = Math.max(10, Math.min(100, parseInt(w[1], 10)));
      continue;
    }
    const a = /^\s*align\s*=\s*(left|center|right)\s*$/i.exec(part);
    if (a) {
      o.align = a[1].toLowerCase();
      continue;
    }
    const c = /^\s*cap(?:tion)?\s*=\s*(.+?)\s*$/i.exec(part);
    if (c) {
      o.cap = c[1].slice(0, 300);
      continue;
    }
  }
  return o;
}
function imgWrapStyle(o) {
  const st = { width: o.w + "%", maxWidth: "100%", margin: "28px 0" };
  if (o.align === "center") st.margin = "28px auto";
  else if (o.align === "right") st.margin = "28px 0 28px auto";
  return st;
}
function parseBody(body, imgs) {
  const used = /* @__PURE__ */ new Set();
  const blocks = [];
  for (const raw of String(body || "").split(/\n{2,}/)) {
    const b = raw.trim();
    if (!b) continue;
    const h = /^(#{2,4})\s+(.+)$/.exec(b);
    if (h) {
      blocks.push({ t: "h" + h[1].length, x: h[2].trim() });
      continue;
    }
    const g = /^\[img:(\d+)((?:\|[^\]]*)?)\]$/.exec(b);
    if (g) {
      const n = parseInt(g[1], 10) - 1;
      if (imgs[n]) {
        used.add(n);
        blocks.push({ t: "img", i: n, o: parseImgOpts(g[2]) });
      } else {
        blocks.push({ t: "p", x: b });
      }
      continue;
    }
    blocks.push({ t: "p", x: b });
  }
  return { blocks, used };
}
function renderBlocks(blocks, imgs, title) {
  return blocks.map((b, i) => {
    if (b.t === "img") {
      const im = imgs[b.i];
      const o = b.o || { w: 100, align: "center", cap: "" };
      const cap = o.cap || "";
      return /* @__PURE__ */ jsxs("figure", { className: `iv-post-inline-img iv-img-${o.align}`, style: imgWrapStyle(o), children: [
        /* @__PURE__ */ jsx(PostImg, { src: im.url, alt: im.alt || `${title} — image ${b.i + 1}`, style: { width: "100%", height: "auto", borderRadius: 8, display: "block" } }),
        cap ? /* @__PURE__ */ jsx("figcaption", { style: { fontSize: 12, opacity: 0.7, marginTop: 8, textAlign: o.align === "center" ? "center" : "left" }, children: cap }) : null
      ] }, i);
    }
    if (b.t !== "p") return /* @__PURE__ */ jsx(b.t, { children: b.x }, i);
    return /* @__PURE__ */ jsx("p", { children: b.x }, i);
  });
}
function renderTemplate(post) {
  const imgs = normImgs(post.images);
  const { blocks, used } = parseBody(post.body, imgs);
  const body = renderBlocks(blocks, imgs, post.title);
  const free = imgs.map((im, i) => ({ im, i })).filter((o) => !used.has(o.i));
  const [img1, img2, img3] = free;
  if (post.template === "gallery") {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      free.length > 0 && /* @__PURE__ */ jsx("div", { className: "iv-post-gallery", children: free.map((o, i) => /* @__PURE__ */ jsx(
        PostImg,
        {
          src: o.im.url,
          alt: o.im.alt || `${post.title} — image ${o.i + 1}`,
          priority: i === 0
        },
        o.im.url
      )) }),
      /* @__PURE__ */ jsx("div", { className: "iv-post-body", children: body })
    ] });
  }
  if (post.template === "photo-essay") {
    let k = 0;
    return /* @__PURE__ */ jsx("div", { className: "iv-post-stack", children: blocks.map((b, i) => {
      if (b.t === "img") {
        const im = imgs[b.i];
        const o = b.o || { w: 100, align: "center", cap: "" };
        return /* @__PURE__ */ jsx("div", { className: "iv-post-stack-item", children: /* @__PURE__ */ jsx("div", { style: imgWrapStyle(o), children: /* @__PURE__ */ jsx(PostImg, { src: im.url, alt: im.alt || `${post.title} — image ${b.i + 1}`, style: { width: "100%", height: "auto", borderRadius: 8, display: "block" } }) }) }, i);
      }
      if (b.t !== "p") {
        return /* @__PURE__ */ jsx("div", { className: "iv-post-stack-item", children: /* @__PURE__ */ jsx(b.t, { children: b.x }) }, i);
      }
      const o = free[k++] || null;
      return /* @__PURE__ */ jsxs("div", { className: "iv-post-stack-item", children: [
        o && /* @__PURE__ */ jsx(
          PostImg,
          {
            src: o.im.url,
            alt: o.im.alt || `${post.title} — image ${o.i + 1}`,
            priority: i === 0
          }
        ),
        /* @__PURE__ */ jsx("p", { children: b.x })
      ] }, i);
    }) });
  }
  if (post.template === "minimal") {
    return /* @__PURE__ */ jsx("div", { className: "iv-post-body", children: body });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    img1 && /* @__PURE__ */ jsx("div", { className: "iv-post-hero", children: /* @__PURE__ */ jsx(PostImg, { src: img1.im.url, alt: img1.im.alt || `${post.title} — hero`, priority: true }) }),
    /* @__PURE__ */ jsx("div", { className: "iv-post-body", children: body }),
    (img2 || img3) && /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: img2 && img3 ? "1fr 1fr" : "1fr",
          gap: 12,
          marginTop: 32
        },
        children: [
          img2 && /* @__PURE__ */ jsx(
            PostImg,
            {
              src: img2.im.url,
              alt: img2.im.alt || `${post.title} — image ${img2.i + 1}`,
              style: { width: "100%", height: "auto", borderRadius: 8 }
            }
          ),
          img3 && /* @__PURE__ */ jsx(
            PostImg,
            {
              src: img3.im.url,
              alt: img3.im.alt || `${post.title} — image ${img3.i + 1}`,
              style: { width: "100%", height: "auto", borderRadius: 8 }
            }
          )
        ]
      }
    )
  ] });
}
function BlogPostArticle({ post }) {
  const ldImgs = normImgs(post.images);
  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.subtitle || void 0,
    image: ldImgs.length ? ldImgs.map((im) => `${SITE_URL}${im.url}`) : [`${SITE_URL}/opengraph-image`],
    datePublished: new Date(post.created_at).toISOString(),
    dateModified: new Date(post.updated_at).toISOString(),
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx("main", { className: `iv-post iv-tpl-${post.template}`, children: /* @__PURE__ */ jsxs("div", { className: "iv-container-narrow", children: [
      /* @__PURE__ */ jsx(
        Breadcrumbs,
        {
          items: [
            { name: "Home", href: "/" },
            { name: "Journal", href: "/blog" },
            { name: post.title, href: `/blog/${post.slug}` }
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "iv-post-meta", children: [
        formatWhen(post.created_at),
        " · ",
        post.template
      ] }),
      /* @__PURE__ */ jsx("h1", { children: post.title }),
      post.subtitle && /* @__PURE__ */ jsx("p", { className: "sub", children: post.subtitle }),
      renderTemplate(post),
      /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            marginTop: 60,
            paddingTop: 30,
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "var(--muted)"
          },
          children: [
            /* @__PURE__ */ jsx("a", { href: "/blog", children: "← Journal" }),
            /* @__PURE__ */ jsx("a", { href: "/contact", style: { color: "var(--accent)" }, children: "Start a project →" })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(postJsonLd) }
      }
    )
  ] });
}

const $$Astro = createAstro("https://inovisionstudios.com");
const prerender = false;
const $$slug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const post = slug ? getPostBySlug(slug) : null;
  const found = !!(post && post.published);
  if (found) {
    incrementPostViews(post.id);
  } else {
    Astro2.response.status = 404;
  }
  const desc = found ? post.subtitle || post.body.replace(/^#{2,4}\s+/gm, "").replace(/^\[img:\d+[^\]]*\]$/gm, "").replace(/\s+/g, " ").trim().slice(0, 155) : "Post not found";
  return renderTemplate$1`${found ? renderTemplate$1`${renderComponent($$result, "Base", $$Base, { "title": `${post.title} \xB7 Inovision Studios`, "description": desc }, { "default": ($$result2) => renderTemplate$1`${renderComponent($$result2, "BlogPostArticle", BlogPostArticle, { "post": post, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/BlogPostArticle", "client:component-export": "default" })}` })}` : renderTemplate$1`${renderComponent($$result, "Base", $$Base, { "title": "Post not found \xB7 Inovision Studios", "noindex": true }, { "default": ($$result2) => renderTemplate$1`${maybeRenderHead()}<main style="min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.25rem;padding:2rem;text-align:center;"><p style="font-size:.8rem;letter-spacing:.3em;opacity:.6;">
INOVISION STUDIOS
</p><h1 style="font-family:var(--font-display);font-size:clamp(2.5rem,9vw,5rem);margin:0;">
Post not found
</h1><p style="opacity:.7;max-width:34ch;">
That post may have moved or been unpublished.
</p><a href="/blog" style="margin-top:.5rem;padding:.75rem 1.5rem;border:1px solid rgba(255,255,255,.2);border-radius:999px;color:var(--text);text-decoration:none;">
← Back to the journal
</a></main>` })}`}`;
}, "D:/wix/Inovision/web/src/pages/blog/[slug].astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
