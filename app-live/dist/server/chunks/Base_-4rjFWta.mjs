import { e as createAstro, f as createComponent, r as renderTemplate, l as renderSlot, n as renderHead, u as unescapeHTML, h as addAttribute } from './astro/server_BTR06tDd.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */
import { g as getSettings } from './db_xJ927fmw.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://inovisionstudios.com");
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Base;
  const {
    title = "Inovision Studios \u2014 Custom Web Design, Engineering & SEO",
    description = "Inovision Studios designs and builds custom websites on hand-engineered stacks \u2014 fast, beautiful, and built to rank. Web design, development, AI integrations, and SEO from Rochester Hills, Michigan.",
    noindex = false
  } = Astro2.props;
  const SITE_URL = (Astro2.site?.href || "https://inovisionstudios.com/").replace(/\/$/, "");
  const canonical = new URL(Astro2.url.pathname, SITE_URL).href;
  const _S = getSettings();
  const FONT_STACKS = {
    instrument: '"Instrument Serif", Georgia, serif',
    clash: '"Clash Display", system-ui, sans-serif',
    geist: '"Geist", system-ui, sans-serif'
  };
  const _font = FONT_STACKS[_S["theme.font"] || ""] || "";
  const _accent = _S["theme.accent"] || "";
  const _accentBright = _S["theme.accentBright"] || "";
  const _socialJson = JSON.stringify({
    instagram: _S["content.social.instagram"] || "",
    facebook: _S["content.social.facebook"] || "",
    x: _S["content.social.x"] || "",
    linkedin: _S["content.social.linkedin"] || "",
    youtube: _S["content.social.youtube"] || ""
  }).replace(/</g, "\\u003c");
  const themeCss = [
    _font && `--font-display:${_font}!important;`,
    _accent && `--gold:${_accent}!important;--gold-line:${_accent}55!important;`,
    _accentBright && `--gold-bright:${_accentBright}!important;`
  ].filter(Boolean).join("");
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE_URL}/#organization`,
    name: "Inovision Studios",
    alternateName: "Inovision Studio",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png`, width: 512, height: 512 },
    image: `${SITE_URL}/og-share.jpg`,
    description: "Inovision Studios designs and builds custom websites, AI integrations, and SEO for businesses in Rochester Hills, Michigan and across the US.",
    email: "Inovisionstudiosllc@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "445 S Livernois Rd, Suite 333",
      addressLocality: "Rochester Hills",
      addressRegion: "MI",
      postalCode: "48307",
      addressCountry: "US"
    },
    priceRange: "$$",
    founder: {
      "@type": "Person",
      name: "Bartlomiej Krawiecki",
      jobTitle: "Founder & Creative Director"
    },
    areaServed: { "@type": "State", name: "Michigan" }
  };
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="generator"', "><title>", '</title><meta name="description"', '><meta name="google-site-verification" content="zQ2V9JUkAKFejRiYqbrSsU3Nsi3bY92hB6RsBIwr-zo"><link rel="canonical"', ">", '<meta property="og:type" content="website"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:site_name" content="Inovision Studios"><meta property="og:url"', '><meta property="og:image"', '><meta property="og:image:secure_url"', '><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Inovision Studios \u2014 custom web design, AI & SEO"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><meta name="theme-color" content="#0a0a0a"><link rel="icon" href="/favicon.png" type="image/png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://api.fontshare.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap"><link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&display=swap"><script type="application/ld+json">', "<\/script>", "", '</head> <body> <div class="iv-grain" aria-hidden="true"></div> ', " </body></html>"])), addAttribute(Astro2.generator, "content"), title, addAttribute(description, "content"), addAttribute(canonical, "href"), noindex && renderTemplate`<meta name="robots" content="noindex, nofollow">`, addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(canonical, "content"), addAttribute(`${SITE_URL}/og-cover.jpg`, "content"), addAttribute(`${SITE_URL}/og-cover.jpg`, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(`${SITE_URL}/og-cover.jpg`, "content"), unescapeHTML(JSON.stringify(orgJsonLd)), themeCss && renderTemplate`<style>${unescapeHTML(`:root{${themeCss}}`)}</style>`, renderTemplate`<script>${unescapeHTML(`window.__IV_SOCIAL=${_socialJson}`)}</script>`, renderHead(), renderSlot($$result, $$slots["default"]));
}, "D:/Wix/Inovision/web/src/layouts/Base.astro", void 0);

export { $$Base as $ };
