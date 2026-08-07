import { jsxs, Fragment, jsx } from 'react/jsx-runtime';

const SITE_URL = process.env.PUBLIC_SITE_URL || "https://inovisionstudios.com";
function Breadcrumbs({ items }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.href}`
    }))
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "nav",
      {
        "aria-label": "Breadcrumb",
        style: {
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "var(--gold, #d9b26a)",
          marginBottom: 24
        },
        children: items.map((it, i) => /* @__PURE__ */ jsxs("span", { children: [
          i > 0 && /* @__PURE__ */ jsx("span", { style: { margin: "0 10px", color: "var(--gold, #d9b26a)", opacity: 0.5 }, children: "/" }),
          i === items.length - 1 ? /* @__PURE__ */ jsx("span", { style: { color: "var(--gold-bright, #f0cf94)", fontWeight: 600 }, children: it.name }) : /* @__PURE__ */ jsx("a", { href: it.href, style: { color: "var(--gold, #d9b26a)", opacity: 0.85, textDecoration: "none" }, children: it.name })
        ] }, it.href))
      }
    ),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(ld) }
      }
    )
  ] });
}

export { Breadcrumbs as B };
