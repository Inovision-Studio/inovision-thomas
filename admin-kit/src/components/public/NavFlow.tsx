"use client";

import { useState } from "react";
import Link from "next/link";

export type NavPeek = {
  label: string;
  href: string;
  tagline: string;
  images: string[];
};

/**
 * Desktop nav with a FlowingMenu-style peek (adapted from reactbits.dev
 * flowing-menu): hovering a link slides open a band under the header with an
 * infinitely scrolling strip of the destination's label + preview images.
 */
export default function NavFlow({ items }: { items: NavPeek[] }) {
  const [active, setActive] = useState<NavPeek | null>(null);

  const strip = active
    ? Array.from({ length: 4 }).flatMap((_, r) =>
        [
          <span key={`t${r}`} className="whitespace-nowrap font-display text-3xl uppercase tracking-wide text-[color:var(--text)]">
            {active.tagline}
          </span>,
          ...active.images.slice(0, 4).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`i${r}-${i}`}
              src={src.startsWith("/api/") ? src + "?w=200" : src}
              srcSet={src.startsWith("/api/") ? `${src}?w=200 200w, ${src}?w=400 400w` : undefined}
              sizes="96px"
              alt=""
              className="h-14 w-24 rounded-full object-cover ring-1 ring-white/15"
              loading="lazy"
            />
          )),
        ].flatMap((node, i) => [
          node,
          <span key={`s${r}-${i}`} className="text-xl text-[color:var(--accent)]">
            ✦
          </span>,
        ]),
      )
    : [];

  return (
    <div className="contents" onMouseLeave={() => setActive(null)}>
      <nav
        className="ml-auto hidden items-center gap-5 text-sm font-medium text-[color:var(--muted)] lg:flex"
        aria-label="Main navigation"
      >
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            onMouseEnter={() => setActive(it)}
            onFocus={() => setActive(it)}
            className={`relative py-1 transition-colors hover:text-[color:var(--text)] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[color:var(--accent)] after:transition-all after:duration-300 hover:after:w-full ${
              active?.href === it.href ? "text-[color:var(--text)] after:w-full" : ""
            }`}
          >
            {it.label}
          </Link>
        ))}
      </nav>

      {/* peek band — slides open under the header */}
      <div
        aria-hidden
        className={`absolute inset-x-0 top-full hidden overflow-hidden border-b border-white/10 bg-[#060906] transition-all duration-300 ease-out lg:block ${
          active ? "h-20 opacity-100" : "h-0 opacity-0"
        }`}
      >
        {active ? (
          <div key={active.href} className="peek-in flex h-20 items-center overflow-hidden">
            <div className="peek-track flex w-max items-center gap-6 pr-6">
              {[...strip, ...strip]}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
