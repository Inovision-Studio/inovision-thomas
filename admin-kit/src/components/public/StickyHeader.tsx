"use client";

import { useEffect, useState } from "react";

/** Sticky header that turns ghost-transparent while the user scrolls (desktop)
 *  and fades back in when scrolling stops, at the top, or on hover. */
export default function StickyHeader({ children }: { children: React.ReactNode }) {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      if (window.scrollY < 80) {
        clearTimeout(timer);
        setIsScrolling(false);
        return;
      }
      setIsScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => setIsScrolling(false), 250);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/10 bg-[#0a0e0a] ${
        isScrolling ? "header-ghost" : ""
      }`}
    >
      {children}
    </header>
  );
}
