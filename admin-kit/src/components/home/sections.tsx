import { bizName } from "@/lib/brand";
import type { ReactNode } from "react";
import type { BlogPost, Product, Review } from "@prisma/client";
import Link from "next/link";
import Marquee from "@/components/public/Marquee";
import ProductCard from "@/components/public/ProductCard";
import OpenStatus from "@/components/public/OpenStatus";
import Reveal from "@/components/public/Reveal";
import BlurText from "@/components/reactbits/BlurText";
import ShinyText from "@/components/reactbits/ShinyText";
import Particles from "@/components/reactbits/Particles";
import Parallax from "@/components/public/Parallax";
import MascotEgg from "@/components/public/MascotEgg";
import VipSignup from "@/components/public/VipSignup";
import VideoPlaylist from "@/components/public/VideoPlaylist";
import DesktopOnly from "@/components/public/DesktopOnly";
import { sized, srcSet } from "@/lib/img";
import { text, lines } from "@/lib/content";
import { editAttrs, sectionAttrs, layoutAttrs } from "@/lib/editAttrs";
import { classesFor, sectionLayout, SPEED_MULT, type HomeLayout, type SectionId } from "@/lib/homeLayout";

const mult = (c: HomeCtx, id: SectionId) => SPEED_MULT[sectionLayout(id, c.layout).speed ?? "normal"];
/** edit-only hint so the bridge can rescale a marquee live without knowing its base */
const baseAttr = (c: HomeCtx, seconds: number): Record<string, string> => (c.isEditing ? { "data-base-seconds": String(seconds) } : {});

/**
 * Everything a homepage section needs to render. Built once in page.tsx and
 * handed to every renderer, so adding a section is one entry in HOME_SECTIONS.
 */
export type HomeCtx = {
  s: Record<string, string>;
  layout: HomeLayout;
  isEditing: boolean;
  e: ReturnType<typeof editAttrs>;
  sec: ReturnType<typeof sectionAttrs>;
  lay: ReturnType<typeof layoutAttrs>;
  hero: string[];
  coverflow: string[];
  marquee: string[];
  products: Product[];
  posts: BlogPost[];
  reviews: Review[];
  categories: { name: string; count: number }[];
  mapsUrl: string;
  phone: string;
};

// Hero has no py-* of its own; its copy block carries the vertical rhythm.
const HERO_SPACING = {
  tight: "pt-2 pb-8 md:pt-4 md:pb-12",
  normal: "pt-4 pb-12 md:pt-8 md:pb-20",
  roomy: "pt-6 pb-16 md:pt-12 md:pb-28",
} as const;

const heading = "font-display text-[length:calc(var(--text-h2)*var(--scale,1))]";

export const HOME_SECTIONS: Record<SectionId, (c: HomeCtx) => ReactNode> = {
  banner: (c) => {
    const items = lines(c.s, "banner_lines");
    return (
      <Marquee
        seconds={40 * mult(c, "banner")}
        className="bg-[color:var(--accent)] py-1.5 md:py-2"
        attrs={{ ...c.sec("banner"), ...c.e("banner_lines", "list"), ...baseAttr(c, 40) }}
        items={items.map((t) => (
          <span
            key={t}
            className="flex items-center gap-8 whitespace-nowrap text-xs font-bold uppercase tracking-wide text-[#04120a] md:text-sm"
          >
            {t}
            <span aria-hidden="true">✦</span>
          </span>
        ))}
      />
    );
  },

  hero: (c) => {
    const heroImg = c.hero[0]; // storefront — the walk-in starts outside
    // Everything after the storefront, so slides added in Admin → Galleries actually
    // show up. Capped only to keep the loop from getting absurdly long.
    const heroSlides = c.hero.slice(1, 9);
    const slideSec = 5 * mult(c, "hero");
    const cls = classesFor("hero", c.layout);
    const l = sectionLayout("hero", c.layout);
    const copyAlign = l.align === "left" ? "text-left" : "text-center";
    const ctaAlign = l.align === "left" ? "sm:justify-start" : "sm:justify-center";
    const subAlign = l.align === "left" ? "" : "mx-auto ";
    return (
      <Parallax className="relative overflow-hidden" attrs={{ ...c.sec("hero"), ...c.lay("hero", "textSize") }}>
        {heroImg ? (
          // overflow-hidden is load-bearing: the Ken Burns zoom scales slides to 1.1,
          // and without it the enlarged photo bleeds ~25px past the block as a bright
          // strip under the fade.
          <div className="relative h-[44vh] min-h-[280px] overflow-hidden md:h-[58vh] md:min-h-[420px]" {...c.e("gallery:hero", "gallery")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sized(heroImg, 1600)}
              srcSet={srcSet(heroImg)}
              sizes="100vw"
              alt=""
              className="hero-base parallax-far absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
              style={{ "--hero-cycle": `${(heroSlides.length + 1) * slideSec}s` } as React.CSSProperties}
            />
            {heroSlides.map((ref, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={ref}
                src={sized(ref, 1600)}
                srcSet={srcSet(ref)}
                sizes="100vw"
                alt=""
                loading="lazy"
                className="hero-slide parallax-far absolute inset-0 h-full w-full object-cover"
                // slot 0 of every cycle belongs to the storefront base layer — interiors start at +6s
                style={{ "--hero-cycle": `${(heroSlides.length + 1) * slideSec}s`, "--hero-delay": `${(i + 1) * slideSec}s` } as React.CSSProperties}
              />
            ))}
            {/* embers ride on top of the photo instead of taking layout space —
                as a flow element they were pushing the copy 400px down the page */}
            <DesktopOnly>
              <div className="pointer-events-none absolute inset-0">
                <Particles
                  className="h-full w-full"
                  particleColors={["#ff5a1f", "#ffb347", "#f4f6f4"]}
                  particleCount={140}
                  particleSpread={12}
                  speed={0.08}
                  particleBaseSize={90}
                  alphaParticles
                />
              </div>
            </DesktopOnly>
            {/* single bottom fade so the photo melts into the copy below it */}
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[color:var(--bg)] via-[color:var(--bg)]/85 to-transparent" />
          </div>
        ) : null}
        <div className={`relative mx-auto max-w-6xl px-4 ${HERO_SPACING[l.spacing ?? "normal"]}`} style={cls.style}>
          <div className={`hero-copy parallax-near mx-auto max-w-3xl ${copyAlign}`}>
            <p className="font-display text-lg tracking-wide text-[color:var(--accent)]" {...c.e("home_hero_kicker")}>
              <ShinyText text={text(c.s, "home_hero_kicker")} speed={3} color="var(--accent)" shineColor="#ffd9c4" />
            </p>
            <OpenStatus className="mt-4 md:mb-2" />
            <h1 className="mt-4 font-display leading-[0.95] text-[length:calc(var(--text-hero)*var(--scale,1))]" {...c.e("home_hero_title")}>
              <BlurText text={text(c.s, "home_hero_title")} animateBy="words" direction="top" delay={120} className={l.align === "left" ? "" : "justify-center"} />
            </h1>
            <p className={`${subAlign}mt-6 max-w-2xl text-lg text-[color:var(--text)]/80`} {...c.e("home_hero_sub", "textarea")}>
              {text(c.s, "home_hero_sub")}
            </p>
            <div className={`mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap ${ctaAlign}`}>
              <Link href="/shop" className="btn-accent" data-track="cta:shop" {...c.e("hero_cta_shop")}>{text(c.s, "hero_cta_shop")}</Link>
              <a href={c.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" data-track="cta:directions" {...c.e("hero_cta_directions")}>
                {text(c.s, "hero_cta_directions")}
              </a>
              {c.phone ? (
                <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} className="btn-ghost" data-track="cta:call">
                  Call {c.phone}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </Parallax>
    );
  },

  taglines: (c) => {
    const items = lines(c.s, "tagline_lines");
    return (
      <div className="border-y border-white/10 bg-black/40 py-4" {...c.sec("taglines")}>
        <Marquee
          seconds={28 * mult(c, "taglines")}
          attrs={{ ...c.e("tagline_lines", "list"), ...baseAttr(c, 28) }}
          items={items.map((t) => (
            <span className="flex items-center gap-8 font-display text-2xl text-[color:var(--muted)]">
              {t}
              <span className="text-[color:var(--accent)]">✦</span>
            </span>
          ))}
        />
      </div>
    );
  },

  welcome: (c) => {
    const cls = classesFor("welcome", c.layout);
    const l = sectionLayout("welcome", c.layout);
    // natural order puts the mascot second (right on desktop); only "left" needs a class
    const imgOrder = l.imageSide === "left" ? "md:order-first" : "";
    return (
      <section
        className={`relative mx-auto grid max-w-6xl items-center gap-8 px-4 ${cls.spacing} md:grid-cols-2`}
        style={cls.style}
        {...c.sec("welcome")}
        {...c.lay("welcome", "imageSide")}
      >
        <Reveal>
          <p className="font-display text-lg tracking-wide text-[color:var(--accent)]" {...c.e("welcome_kicker")}>
            {text(c.s, "welcome_kicker")}
          </p>
          <h2 className={`mt-2 ${heading} leading-[0.95]`} {...c.e("welcome_title")}>
            {text(c.s, "welcome_title")}
          </h2>
          <p className="mt-6 max-w-xl text-lg text-[color:var(--muted)]" {...c.e("welcome_body", "textarea")}>
            {text(c.s, "welcome_body")}
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Link href="/shop" className="btn-accent" {...c.e("welcome_cta_shop")}>{text(c.s, "welcome_cta_shop")}</Link>
            <Link href="/about" className="btn-ghost" {...c.e("welcome_cta_about")}>{text(c.s, "welcome_cta_about")}</Link>
          </div>
        </Reveal>
        {text(c.s, "mascot_ref").trim() ? (
        <Reveal delay={150} className={imgOrder}>
          <MascotEgg
            src={text(c.s, "mascot_ref")}
            alt={`${bizName(c.s)} mascot`}
            quips={lines(c.s, "mascot_egg_lines")}
            className="float-slow mx-auto max-h-[420px] w-auto object-contain drop-shadow-lg md:max-h-[520px]"
            imgAttrs={c.e("mascot_ref", "image")}
          />
        </Reveal>
        ) : null}
      </section>
    );
  },

  inside: (c) => {
    if (c.coverflow.length === 0) return null;
    const cls = classesFor("inside", c.layout);
    return (
      <section className={`mx-auto max-w-6xl px-4 ${cls.spacing}`} {...c.sec("inside")}>
        <Reveal className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-display text-lg text-[color:var(--accent)]" {...c.e("sec_inside_kicker")}>{text(c.s, "sec_inside_kicker")}</p>
            <h2 className="font-display text-[length:var(--text-h2)]" {...c.e("sec_inside_title")}>{text(c.s, "sec_inside_title")}</h2>
          </div>
          <Link href="/shop" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--text)]" {...c.e("sec_inside_link")}>
            {text(c.s, "sec_inside_link")}
          </Link>
        </Reveal>
        {/* slow auto-slide; pauses on hover/touch-hold */}
        <div className="[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]" {...c.e("gallery:coverflow", "gallery")}>
          <Marquee
            seconds={70 * mult(c, "inside")}
            className="pb-4"
            attrs={baseAttr(c, 70)}
            items={c.coverflow.map((ref, i) => (
              <div key={i} className="card w-64 overflow-hidden transition-transform duration-300 hover:-translate-y-1 md:w-80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sized(ref, 400)} srcSet={srcSet(ref, 800)} sizes="(min-width: 768px) 320px, 256px" alt={`Inside ${bizName(c.s)}`} className="img-tile aspect-[3/4] w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              </div>
            ))}
          />
        </div>
      </section>
    );
  },

  categories: (c) => {
    if (c.categories.length === 0) return null;
    const cls = classesFor("categories", c.layout);
    return (
      <section className={`mx-auto max-w-6xl px-4 ${cls.spacing}`} {...c.sec("categories")}>
        <Reveal className="mb-6">
          <p className="font-display text-lg text-[color:var(--accent)]" {...c.e("sec_cats_kicker")}>{text(c.s, "sec_cats_kicker")}</p>
          <h2 className="font-display text-[length:var(--text-h2)]" {...c.e("sec_cats_title")}>{text(c.s, "sec_cats_title")}</h2>
        </Reveal>
        <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${cls.columns}`} {...c.lay("categories", "columns")}>
          {c.categories.map((cat, i) => (
            <Reveal key={cat.name} delay={i * 50}>
              <Link
                href={`/shop?cat=${encodeURIComponent(cat.name)}`}
                className="card group flex h-full flex-col justify-between p-4 transition-transform hover:-translate-y-1"
              >
                <span className="font-display text-xl leading-tight">{cat.name}</span>
                <span className="mt-3 text-sm text-[color:var(--muted)]">
                  {cat.count} item{cat.count === 1 ? "" : "s"}
                  <span className="ml-1 inline-block text-[color:var(--accent)] transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    );
  },

  vip: (c) => {
    const cls = classesFor("vip", c.layout);
    return (
      <section className={`mx-auto ${cls.width} px-4 ${cls.spacing}`} {...c.sec("vip")} {...c.lay("vip", "width")}>
        <Reveal>
          <div className="card overflow-hidden p-8 text-center md:p-12">
            <p className="font-display text-lg text-[color:var(--accent)]" {...c.e("sec_vip_kicker")}>{text(c.s, "sec_vip_kicker")}</p>
            <h2 className="mt-1 font-display text-[length:var(--text-h2)]" {...c.e("sec_vip_title")}>{text(c.s, "sec_vip_title")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-[color:var(--muted)]" {...c.e("sec_vip_body", "textarea")}>
              {text(c.s, "sec_vip_body")}
            </p>
            <VipSignup />
          </div>
        </Reveal>
      </section>
    );
  },

  why: (c) => {
    const cls = classesFor("why", c.layout);
    return (
      <section className={`mx-auto max-w-6xl px-4 ${cls.spacing}`} {...c.sec("why")}>
        <Reveal className="mb-6">
          <p className="font-display text-lg text-[color:var(--accent)]" {...c.e("sec_why_kicker")}>{text(c.s, "sec_why_kicker")}</p>
          <h2 className="font-display text-[length:var(--text-h2)]" {...c.e("sec_why_title")}>{text(c.s, "sec_why_title")}</h2>
        </Reveal>
        <div className={`grid gap-3 ${cls.columns}`} {...c.lay("why", "columns")} {...c.e("why_items", "list")}>
          {lines(c.s, "why_items")
            .map((l) => l.split("|").map((x) => x.trim()))
            .map(([title, body], i) => (
              <Reveal key={title} delay={i * 70}>
                <div className="card h-full p-5">
                  <h3 className="font-display text-2xl leading-tight">{title}</h3>
                  {body ? (
                    <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">{body}</p>
                  ) : null}
                </div>
              </Reveal>
            ))}
        </div>
      </section>
    );
  },

  products: (c) => {
    if (c.products.length === 0) return null;
    const cls = classesFor("products", c.layout);
    const cols = sectionLayout("products", c.layout).columns ?? 4;
    return (
      <section className={`mx-auto max-w-6xl px-4 ${cls.spacing}`} {...c.sec("products")}>
        <Reveal className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-display text-lg text-[color:var(--accent)]" {...c.e("sec_products_kicker")}>{text(c.s, "sec_products_kicker")}</p>
            <h2 className="font-display text-[length:var(--text-h2)]" {...c.e("sec_products_title")}>{text(c.s, "sec_products_title")}</h2>
          </div>
          <Link href="/shop" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--text)]" {...c.e("sec_products_link")}>
            {text(c.s, "sec_products_link")}
          </Link>
        </Reveal>
        <div className={`grid grid-cols-2 gap-3 ${cls.columns} md:gap-4`} {...c.lay("products", "columns")}>
          {c.products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % cols) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    );
  },

  photos: (c) => {
    if (c.marquee.length < 8) return null;
    const half = Math.ceil(c.marquee.length / 2);
    const tile = (ref: string) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={sized(ref, 400)}
        srcSet={srcSet(ref, 800)}
        sizes="(min-width: 768px) 160px, 128px"
        alt=""
        className="h-32 w-32 img-tile rounded-xl object-cover ring-1 ring-white/10 transition-transform duration-300 hover:scale-110 hover:ring-[color:var(--accent)]/60 md:h-40 md:w-40"
        loading="lazy"
      />
    );
    return (
      <div
        className="my-16 space-y-4 border-y border-white/10 bg-black/40 py-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        {...c.sec("photos")}
        {...c.e("gallery:marquee", "gallery")}
      >
        <Marquee seconds={45 * mult(c, "photos")} attrs={baseAttr(c, 45)} items={c.marquee.slice(0, half).map(tile)} />
        <Marquee seconds={55 * mult(c, "photos")} attrs={baseAttr(c, 55)} reverse items={c.marquee.slice(half).map(tile)} />
      </div>
    );
  },

  merch: (c) => {
    const cls = classesFor("merch", c.layout);
    // full-bleed cinematic band: video edge to edge, copy underneath (never over the video)
    if (lines(c.s, "merch_videos").length === 0) return null;
    return (
      <section className={`relative ${cls.spacing}`} style={cls.style} {...c.sec("merch")}>
        <Reveal>
          <div className="relative overflow-hidden bg-black">
            <VideoPlaylist
              sources={lines(c.s, "merch_videos")}
              poster={text(c.s, "merch_poster") || undefined}
              className="aspect-[4/5] w-full bg-black object-cover sm:aspect-video sm:max-h-[85vh] sm:object-contain"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[color:var(--bg)] to-transparent" aria-hidden />
          </div>
        </Reveal>
        <Reveal delay={150} className="mx-auto max-w-3xl px-4 pt-6 text-center">
          <p className="font-display text-lg tracking-wide text-[color:var(--accent)]" {...c.e("sec_merch_kicker")}>{text(c.s, "sec_merch_kicker")}</p>
          <h2 className={`mt-2 ${heading} leading-[0.95]`} {...c.e("sec_merch_title")}>{text(c.s, "sec_merch_title")}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[color:var(--muted)]" {...c.e("sec_merch_body", "textarea")}>
            {text(c.s, "sec_merch_body")}
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Link href="/contact" className="btn-accent" {...c.e("sec_merch_cta_ask")}>{text(c.s, "sec_merch_cta_ask")}</Link>
            <Link href="/shop" className="btn-ghost" {...c.e("sec_merch_cta_shop")}>{text(c.s, "sec_merch_cta_shop")}</Link>
          </div>
        </Reveal>
      </section>
    );
  },

  reviews: (c) => {
    const cls = classesFor("reviews", c.layout);
    return (
      <section className={`mx-auto max-w-6xl px-4 ${cls.spacing}`} {...c.sec("reviews")}>
        <Reveal>
          <p className="font-display text-lg text-[color:var(--accent)]" {...c.e("sec_reviews_kicker")}>{text(c.s, "sec_reviews_kicker")}</p>
          <h2 className="font-display text-[length:var(--text-h2)]" {...c.e("sec_reviews_title")}>{text(c.s, "sec_reviews_title")}</h2>
        </Reveal>
        {c.reviews.length > 0 ? (
          <div className={`-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid ${cls.columns} md:overflow-visible md:px-0 md:pb-0`} {...c.lay("reviews", "columns")}>
            {c.reviews.map((r) => (
              <figure key={r.id} className="card w-[82%] shrink-0 snap-center p-5 md:w-auto md:shrink">
                <div className="text-[color:var(--accent)]">{"★".repeat(r.stars)}</div>
                <blockquote className="mt-2 text-[color:var(--muted)]">{r.text}</blockquote>
                <figcaption className="mt-3 font-medium">— {r.name}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="card mt-6 p-8 text-center">
            <p className="text-[color:var(--accent)]">★★★★★</p>
            <p className="mt-2 font-display text-3xl">We strive for 5-star service</p>
            <p className="mx-auto mt-2 max-w-lg text-[color:var(--muted)]">
              {text(c.s, "sec_reviews_nudge")}
            </p>
            <Link href="/reviews" className="btn-accent mt-4">Leave us a review</Link>
          </div>
        )}
      </section>
    );
  },

  blog: (c) => {
    if (c.posts.length === 0) return null;
    const cls = classesFor("blog", c.layout);
    return (
      <section className={`mx-auto max-w-6xl px-4 ${cls.spacing}`} {...c.sec("blog")}>
        <Reveal className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-display text-lg text-[color:var(--accent)]" {...c.e("sec_blog_kicker")}>{text(c.s, "sec_blog_kicker")}</p>
            <h2 className="font-display text-[length:var(--text-h2)]" {...c.e("sec_blog_title")}>{text(c.s, "sec_blog_title")}</h2>
          </div>
          <Link href="/blog" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--text)]" {...c.e("sec_blog_link")}>
            {text(c.s, "sec_blog_link")}
          </Link>
        </Reveal>
        <div className={`grid gap-4 ${cls.columns}`} {...c.lay("blog", "columns")}>
          {c.posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card group overflow-hidden">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sized(p.image, 800)} srcSet={srcSet(p.image, 1200)} sizes="(min-width: 768px) 33vw, 100vw" alt={p.title} className="aspect-video w-full object-cover" loading="lazy" />
              ) : null}
              <div className="p-4">
                <time className="text-xs text-[color:var(--muted)]">
                  {new Date(p.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </time>
                <h3 className="mt-1 line-clamp-2 font-medium leading-snug group-hover:text-[color:var(--accent)]">{p.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  },
};
