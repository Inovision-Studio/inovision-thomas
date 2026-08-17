"use client";

import { useEffect, useRef, useState } from "react";

/** Plays clips back-to-back in an endless loop, crossfading between them.
 *  Video bytes only start loading once the element nears the viewport. */
export default function VideoPlaylist({ sources, poster, className = "" }: { sources: string[]; poster?: string; className?: string }) {
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIsNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function next() {
    setIsFading(true);
    setTimeout(() => {
      setIndex((i) => (i + 1) % sources.length);
      setIsFading(false);
      // src change resets the element; play resumes muted-autoplay style
      requestAnimationFrame(() => ref.current?.play().catch(() => {}));
    }, 250);
  }

  return (
    <video
      ref={ref}
      key={isNear ? sources[index] : "idle"}
      src={isNear ? sources[index] : undefined}
      poster={index === 0 ? poster : undefined}
      autoPlay
      muted
      playsInline
      preload="metadata"
      onEnded={next}
      className={`${className} transition-opacity duration-300 ${isFading ? "opacity-0" : "opacity-100"}`}
    />
  );
}
