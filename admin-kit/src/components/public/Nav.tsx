import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import MobileMenu from "./MobileMenu";
import NavFlow, { type NavPeek } from "./NavFlow";
import StickyHeader from "./StickyHeader";
import OpenStatus from "./OpenStatus";
import SocialLinks from "./SocialLinks";
import AskAiButton from "./AskAiButton";
import { bizName, botAvatar, botName, logoOf } from "@/lib/brand";
import { text } from "@/lib/content";
import { directionsTarget } from "@/lib/locations";

const LINKS = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Blog", "/blog"],
  ["News", "/news"],
  ["Reviews", "/reviews"],
  ["About", "/about"],
  ["Careers", "/careers"],
  ["Contact", "/contact"],
] as const;

async function galleryRefs(key: string, take: number) {
  const g = await db.gallery
    .findUnique({ where: { key }, include: { images: { orderBy: { sort: "asc" }, take } } })
    .catch(() => null);
  return g?.images.map((i) => i.imageRef) ?? [];
}

export default async function Nav() {
  const [s, productImgs, blogImgs, storeImgs, heroImgs] = await Promise.all([
    getSettings().catch(() => ({}) as Record<string, string>),
    db.product
      .findMany({ where: { published: true }, orderBy: { sort: "asc" }, select: { images: true }, take: 6 })
      .then((ps) => ps.map((p) => p.images[0]).filter(Boolean))
      .catch(() => [] as string[]),
    db.blogPost
      .findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, select: { image: true }, take: 4 })
      .then((bs) => bs.map((b) => b.image).filter((i): i is string => Boolean(i)))
      .catch(() => [] as string[]),
    galleryRefs("coverflow", 4),
    galleryRefs("hero", 4),
  ]);

  const name = bizName(s);
  const bot = botName(s);
  const botImg = botAvatar(s);
  const phone = s.phone || "";
  // Owner-set logo (Admin → Appearance) with the shipped file as the fallback.
  const logo = logoOf(s);
  const address = s.address || "";
  const mapsUrl = await directionsTarget(s);

  const peeks: NavPeek[] = [
    { label: "Home", href: "/", tagline: name, images: heroImgs },
    { label: "Shop", href: "/shop", tagline: "Fresh Drops Weekly", images: productImgs },
    { label: "Blog", href: "/blog", tagline: "Latest Reads", images: blogImgs },
    { label: "News", href: "/news", tagline: "What's New", images: blogImgs },
    { label: "Reviews", href: "/reviews", tagline: "★★★★★ Loved by Locals", images: [] },
    { label: "About", href: "/about", tagline: "Step Inside", images: storeImgs },
    { label: "Careers", href: "/careers", tagline: "Join the Crew", images: [text(s, "mascot_ref").trim() || logo] },
    { label: "Contact", href: "/contact", tagline: "Come Say Hi", images: storeImgs },
  ];

  return (
    <StickyHeader>
      {/* Mi Budz-style stack on phones: brand + socials, then contact + menu.
          Desktop keeps the single inline row. */}
      <div className="mx-auto max-w-6xl px-4">
        {/* one row on phones: brand left, socials + menu right. Directions used to
            sit on a second row, but the fixed bottom bar already carries it. */}
        <div className="flex items-center gap-3 py-2 lg:hidden">
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={name} className="h-9 w-auto max-w-[150px] object-contain" />
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <SocialLinks settings={s} />
            <MobileMenu
              links={LINKS}
              phone={phone}
              previews={productImgs}
              mapsUrl={mapsUrl}
              status={<OpenStatus />}
              socials={<SocialLinks settings={s} />}
              logo={logo}
            />
          </div>
        </div>

        <div className="hidden items-center gap-4 py-3 lg:flex">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={name} className="h-12 w-auto max-w-[200px] object-contain drop-shadow" />
          </Link>

          <NavFlow items={peeks} />

          <AskAiButton
            data-track="nav:ask-ai"
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 py-1.5 pl-1.5 pr-3.5 text-sm font-medium transition hover:bg-[color:var(--accent)]/20"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={botImg} alt="" className="h-6 w-6 object-contain" />
            Ask {bot} AI
          </AskAiButton>

          <SocialLinks settings={s} />

          {phone ? (
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="btn-accent text-sm">
              {phone}
            </a>
          ) : null}
        </div>
      </div>
    </StickyHeader>
  );
}
