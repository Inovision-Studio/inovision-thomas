/**
 * Structured layout model for the homepage. Everything here is a *preset* the
 * owner can pick — never a pixel position — so nothing can overlap or break the
 * phone layout (all classes below are md:/lg: variants; the mobile base stays
 * hardcoded in each section renderer).
 */
export const SECTION_IDS = [
  "banner",
  "hero",
  "taglines",
  "welcome",
  "inside",
  "categories",
  "vip",
  "why",
  "products",
  "photos",
  "merch",
  "reviews",
  "blog",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];
// Merch video sits high (right after the store photos) — it's one of the best visuals
// on the page and was buried at #11. Owner can still drag it anywhere in Edit Home.
export const DEFAULT_ORDER: SectionId[] = [
  "banner", "hero", "taglines", "welcome", "inside", "merch",
  "categories", "vip", "why", "products", "photos", "reviews", "blog",
];

export type SectionLayout = {
  width?: "narrow" | "normal" | "wide";
  textSize?: "s" | "m" | "l" | "xl";
  align?: "left" | "center";
  imageSide?: "left" | "right";
  columns?: number;
  spacing?: "tight" | "normal" | "roomy";
  /** animation pace for marquees / the hero slideshow */
  speed?: "slow" | "normal" | "fast";
};
export type LayoutControl = keyof SectionLayout;

/** Duration multiplier: slow = longer cycle. */
export const SPEED_MULT: Record<NonNullable<SectionLayout["speed"]>, number> = { slow: 1.6, normal: 1, fast: 0.6 };

export type HomeLayout = {
  order: SectionId[];
  hidden: SectionId[];
  sections: Partial<Record<SectionId, SectionLayout>>;
};

/** Which knobs each section exposes; `columns` lists the allowed desktop counts. */
export const SECTION_CONTROLS: Record<SectionId, { label: string; controls: LayoutControl[]; columns?: number[] }> = {
  banner: { label: "Scrolling banner", controls: ["speed"] },
  hero: { label: "Hero", controls: ["textSize", "align", "spacing", "speed"] },
  taglines: { label: "Tagline strip", controls: ["speed"] },
  welcome: { label: "Welcome / mascot", controls: ["imageSide", "textSize", "spacing"] },
  inside: { label: "Step Inside", controls: ["spacing", "speed"] },
  categories: { label: "Categories", controls: ["columns", "spacing"], columns: [3, 4, 6] },
  vip: { label: "VIP signup", controls: ["width", "spacing"] },
  why: { label: "Why us", controls: ["columns", "spacing"], columns: [2, 3, 4] },
  products: { label: "Products", controls: ["columns", "spacing"], columns: [2, 3, 4] },
  photos: { label: "Photo marquee", controls: ["speed"] },
  merch: { label: "Merch", controls: ["textSize", "spacing"] },
  reviews: { label: "Reviews", controls: ["columns", "spacing"], columns: [2, 3] },
  blog: { label: "Blog", controls: ["columns", "spacing"], columns: [2, 3] },
};

/**
 * Class lookup tables. Literal strings only — Tailwind v4 scans source for
 * class names, so templated strings would silently produce no CSS.
 */
export const CLS = {
  columns: {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    6: "lg:grid-cols-6",
  } as Record<number, string>,
  width: { narrow: "max-w-3xl", normal: "max-w-6xl", wide: "max-w-7xl" },
  align: { left: "text-left sm:justify-start", center: "text-center sm:justify-center" },
  imageSide: { left: "md:order-first", right: "md:order-last" },
  spacing: { tight: "py-6", normal: "py-10", roomy: "py-[var(--space-section)]" },
} as const;

export const TEXT_SCALE: Record<NonNullable<SectionLayout["textSize"]>, string> = {
  s: "0.85",
  m: "1",
  l: "1.15",
  xl: "1.3",
};

/** Per-section defaults — MUST equal the classes the page shipped with before layout controls existed. */
export const SECTION_DEFAULTS: Record<SectionId, Required<Pick<SectionLayout, "spacing">> & SectionLayout> = {
  banner: { spacing: "normal" },
  hero: { spacing: "normal", align: "center", textSize: "m" },
  taglines: { spacing: "normal" },
  welcome: { spacing: "roomy", imageSide: "right", textSize: "m" },
  inside: { spacing: "roomy" },
  categories: { spacing: "normal", columns: 6 },
  vip: { spacing: "normal", width: "normal" },
  why: { spacing: "normal", columns: 3 },
  products: { spacing: "normal", columns: 4 },
  photos: { spacing: "normal" },
  merch: { spacing: "roomy", textSize: "m" },
  reviews: { spacing: "normal", columns: 3 },
  blog: { spacing: "normal", columns: 3 },
};

export const DEFAULT_LAYOUT: HomeLayout = { order: DEFAULT_ORDER, hidden: [], sections: {} };

const isId = (v: unknown): v is SectionId => typeof v === "string" && (SECTION_IDS as readonly string[]).includes(v);

/** Tolerant parse: unknown ids dropped, missing ids appended in default position, empty → default. */
export function parseLayout(raw?: string | null): HomeLayout {
  if (!raw || !raw.trim()) return DEFAULT_LAYOUT;
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    return DEFAULT_LAYOUT;
  }
  return sanitizeLayout(obj);
}

/** Whitelist every id, control and value; guarantees each id appears exactly once in `order`. */
export function sanitizeLayout(input: unknown): HomeLayout {
  const o = (input && typeof input === "object" ? input : {}) as Partial<HomeLayout>;
  const seen = new Set<SectionId>();
  const order: SectionId[] = [];
  for (const id of Array.isArray(o.order) ? o.order : []) {
    if (isId(id) && !seen.has(id)) {
      seen.add(id);
      order.push(id);
    }
  }
  for (const id of DEFAULT_ORDER) if (!seen.has(id)) order.push(id);

  const hidden = (Array.isArray(o.hidden) ? o.hidden : []).filter(isId);

  const sections: HomeLayout["sections"] = {};
  const src = (o.sections && typeof o.sections === "object" ? o.sections : {}) as Record<string, unknown>;
  for (const [id, val] of Object.entries(src)) {
    if (!isId(id) || !val || typeof val !== "object") continue;
    const allowed = SECTION_CONTROLS[id];
    const v = val as Record<string, unknown>;
    const out: SectionLayout = {};
    for (const c of allowed.controls) {
      const x = v[c];
      if (x === undefined || x === null) continue;
      if (c === "columns") {
        const n = Number(x);
        if (allowed.columns?.includes(n)) out.columns = n;
      } else if (c === "width" && typeof x === "string" && x in CLS.width) out.width = x as SectionLayout["width"];
      else if (c === "align" && typeof x === "string" && x in CLS.align) out.align = x as SectionLayout["align"];
      else if (c === "imageSide" && typeof x === "string" && x in CLS.imageSide) out.imageSide = x as SectionLayout["imageSide"];
      else if (c === "spacing" && typeof x === "string" && x in CLS.spacing) out.spacing = x as SectionLayout["spacing"];
      else if (c === "textSize" && typeof x === "string" && x in TEXT_SCALE) out.textSize = x as SectionLayout["textSize"];
      else if (c === "speed" && typeof x === "string" && x in SPEED_MULT) out.speed = x as SectionLayout["speed"];
    }
    if (Object.keys(out).length) sections[id] = out;
  }
  return { order, hidden, sections };
}

/** Effective (default-merged) layout for one section. */
export function sectionLayout(id: SectionId, layout: HomeLayout): SectionLayout {
  return { ...SECTION_DEFAULTS[id], ...(layout.sections[id] ?? {}) };
}

/** Resolved class strings + inline style for one section. */
export function classesFor(id: SectionId, layout: HomeLayout) {
  const l = sectionLayout(id, layout);
  return {
    columns: l.columns != null ? CLS.columns[l.columns] ?? "" : "",
    width: l.width ? CLS.width[l.width] : "",
    align: l.align ? CLS.align[l.align] : "",
    imageSide: l.imageSide ? CLS.imageSide[l.imageSide] : "",
    spacing: l.spacing ? CLS.spacing[l.spacing] : "",
    style: l.textSize && l.textSize !== "m" ? ({ "--scale": TEXT_SCALE[l.textSize] } as React.CSSProperties) : undefined,
    raw: l,
  };
}
