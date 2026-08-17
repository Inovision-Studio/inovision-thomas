"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileMenu({
  links,
  phone,
  previews = [],
  mapsUrl,
  status,
  socials,
  logo = "/logo.svg",
}: {
  links: ReadonlyArray<readonly [string, string]>;
  phone: string;
  previews?: string[];
  mapsUrl?: string;
  /** Server-rendered <OpenStatus /> passed in as a slot — this component is client-side. */
  status?: React.ReactNode;
  socials?: React.ReactNode;
  logo?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // portal target only exists client-side
  useEffect(() => setIsMounted(true), []);

  // close on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // scroll lock + Escape to close
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  // Portaled to <body>: the sticky header's backdrop-filter creates a containing
  // block that clips fixed descendants — rendering inside it broke the overlay.
  const overlay = (
    <div className={`fixed inset-0 z-[100] lg:hidden ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      {/* darkened + blurred page behind the drawer */}
      <div
        onClick={() => setIsOpen(false)}
        className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* right-side drawer */}
      <div
        className={`absolute inset-y-0 right-0 flex w-[84%] max-w-sm flex-col overflow-y-auto border-l border-white/10 bg-[#0c100c] pb-[env(safe-area-inset-bottom)] shadow-[-24px_0_60px_-12px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" className="h-9 w-auto object-contain" />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-xl active:scale-95"
          >
            ✕
          </button>
        </div>

        <nav className="mt-1 flex flex-col px-5" aria-label="Mobile navigation">
          {links.map(([label, href], i) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-baseline gap-4 border-b border-white/[0.07] py-3.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.99] ${
                  isActive ? "text-[color:var(--accent)]" : "text-[color:var(--text)]"
                } ${isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
                style={{ transitionDelay: isOpen ? `${60 + i * 40}ms` : "0ms" }}
              >
                <span
                  className={`w-6 shrink-0 font-grotesk text-[0.7rem] tabular-nums ${
                    isActive ? "text-[color:var(--accent)]" : "text-[color:var(--muted)]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-3xl leading-none">{label}</span>
                <span
                  className={`ml-auto text-lg transition-transform duration-300 group-hover:translate-x-1 ${
                    isActive ? "text-[color:var(--accent)]" : "text-[color:var(--muted)]"
                  }`}
                >
                  →
                </span>
              </Link>
            );
          })}
        </nav>

        {/* status + directions fill what used to be dead space under the links */}
        <div className="mt-5 flex flex-wrap items-center gap-3 px-5">
          {status}
          {mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-sm"
              onClick={() => setIsOpen(false)}
            >
              Get directions
            </a>
          ) : null}
          {socials}
        </div>

        {/* flowing sneak-peek strip (same animation as the desktop nav peeks) */}
        {previews.length > 0 && isOpen ? (
          <div className="mt-auto pt-6">
            <p className="px-5 pb-2 font-grotesk text-[0.7rem] uppercase tracking-[0.2em] text-[color:var(--muted)]">
              In the shop
            </p>
            <div className="overflow-hidden border-y border-white/10 py-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <div className="peek-track flex w-max items-center gap-3">
                {[...previews, ...previews].map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src.startsWith("/api/") ? src + "?w=200" : src}
                    srcSet={src.startsWith("/api/") ? `${src}?w=200 200w, ${src}?w=400 400w` : undefined}
                    sizes="112px"
                    alt=""
                    className="img-tile h-20 w-28 rounded-lg object-cover ring-1 ring-white/10"
                    loading="lazy"
                    aria-hidden={i >= previews.length}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className={`px-5 pt-5 pb-8 ${previews.length > 0 ? "" : "mt-auto"}`}>
          {phone ? (
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="btn-accent w-full text-lg">
              Call {phone}
            </a>
          ) : (
            <Link href="/shop" onClick={() => setIsOpen(false)} className="btn-accent w-full text-lg">
              Shop the catalog
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-white/15 active:scale-95"
      >
        <span className="h-[2px] w-5 rounded-full bg-current" />
        <span className="h-[2px] w-5 rounded-full bg-current" />
        <span className="h-[2px] w-5 rounded-full bg-current" />
      </button>
      {isMounted ? createPortal(overlay, document.body) : null}
    </div>
  );
}
