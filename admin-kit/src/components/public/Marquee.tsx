import type { ReactNode } from "react";

/**
 * Infinite horizontal marquee. Renders the items twice and slides the track
 * by -50% so the loop is seamless. Pure CSS, no client JS.
 */
export default function Marquee({
  items,
  seconds = 30,
  reverse = false,
  className = "",
  itemClassName = "",
  attrs = {},
}: {
  items: ReactNode[];
  seconds?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
  /** Extra root attributes (edit-mode data-* hooks); empty for visitors. */
  attrs?: Record<string, string>;
}) {
  const doubled = [...items, ...items];
  return (
    <div className={`group relative overflow-hidden ${className}`} {...attrs}>
      <style>{`@keyframes mb-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div
        className="marquee-track flex w-max items-center gap-8 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animation: `mb-marquee ${seconds}s linear infinite ${reverse ? "reverse" : "normal"}` }}
      >
        {doubled.map((node, i) => (
          <div key={i} className={`shrink-0 ${itemClassName}`} aria-hidden={i >= items.length}>
            {node}
          </div>
        ))}
      </div>
    </div>
  );
}
