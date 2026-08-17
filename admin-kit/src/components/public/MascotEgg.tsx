"use client";

import { useRef, useState } from "react";

/** Clickable mascot: bounces + drops a quip; every 3rd poke opens the chatbot. */
export default function MascotEgg({ src, alt, className = "", imgAttrs = {}, quips = [] }: { imgAttrs?: Record<string, string>; src: string; alt: string; className?: string; quips?: string[] }) {
  const QUIPS = quips.length ? quips : ["👋"];
  const [quip, setQuip] = useState<string | null>(null);
  const [isPopping, setIsPopping] = useState(false);
  const pokeCount = useRef(0);

  function poke() {
    pokeCount.current++;
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 650);
    if (pokeCount.current % 3 === 0) {
      setQuip(null);
      window.dispatchEvent(new Event("site:open-chat"));
      return;
    }
    setQuip(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
    setTimeout(() => setQuip(null), 2400);
  }

  return (
    <div className="relative mx-auto w-fit cursor-pointer select-none" onClick={poke} title="Click me!">
      {quip ? (
        <div className="mascot-bubble absolute -top-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-2xl rounded-bl-sm border border-white/15 bg-[#0c100c] px-4 py-2 text-sm shadow-xl">
          {quip}
        </div>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} {...imgAttrs} className={`${className} ${isPopping ? "mascot-pop" : ""}`} loading="lazy" />
    </div>
  );
}
