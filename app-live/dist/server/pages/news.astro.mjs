import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/Base_-4rjFWta.mjs';
/* empty css                                   */
import { N as Nav, F as Footer } from '../chunks/Footer_CTcSx4kn.mjs';
import { aB as newsCount, aC as lastNewsFetch, aD as listNews } from '../chunks/db_xJ927fmw.mjs';
import { r as refreshNews } from '../chunks/news_6wg9tm7r.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$News = createComponent(async ($$result, $$props, $$slots) => {
  const STALE_MS = 3 * 60 * 60 * 1e3;
  if (newsCount() === 0 || Date.now() - lastNewsFetch() > STALE_MS) {
    try {
      await refreshNews();
    } catch {
    }
  }
  const items = listNews(40);
  function ago(ts) {
    if (!ts) return "";
    const s = Math.max(1, Math.floor((Date.now() - ts) / 1e3));
    if (s < 3600) return Math.floor(s / 60) + "m ago";
    if (s < 86400) return Math.floor(s / 3600) + "h ago";
    return Math.floor(s / 86400) + "d ago";
  }
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "AI News \u2014 Inovision Studios", "description": "A live feed of AI and technology headlines from across the web, curated by Inovision Studios. Updated automatically." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="studio"> <div class="studio-aurora"></div> <div class="studio-grain"></div> ${renderComponent($$result2, "Nav", Nav, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Nav", "client:component-export": "default" })} <section class="s-section page-hero-top" id="news-top"> <div class="s-wrap"> <div class="s-head"> <nav class="iv-crumb" aria-label="Breadcrumb"><a href="/">Home</a><span class="sep">/</span><span class="cur">News</span></nav> <p class="s-kicker">AI News</p> <h1 class="s-display">
The feed, <span class="s-grad-text">live.</span> </h1> <p class="s-lead">
AI and technology headlines from across the web, pulled in
            automatically. Tap any story to read it at the source.
</p> </div> ${items.length === 0 ? renderTemplate`<p class="news-empty">The feed is warming up — check back in a minute.</p>` : renderTemplate`<div class="news-list"> ${items.map((it) => renderTemplate`<a class="news-item"${addAttribute(it.link, "href")} target="_blank" rel="noopener noreferrer nofollow"> <div class="news-meta"> <span class="news-src">${it.source}</span> <span class="news-time">${ago(it.published_at ?? it.fetched_at)}</span> </div> <h3 class="news-title">${it.title}</h3> ${it.summary && renderTemplate`<p class="news-sum">${it.summary}</p>`} <span class="news-read">Read at source ↗</span> </a>`)} </div>`} </div> </section> ${renderComponent($$result2, "Footer", Footer, {})} </div> ` })}`;
}, "D:/wix/Inovision/web/src/pages/news.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/news.astro";
const $$url = "/news";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$News,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
