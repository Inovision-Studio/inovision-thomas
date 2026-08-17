"use client";

import { useRef, type ReactNode } from "react";

/** Sets --px / --py (-0.5..0.5) from cursor position; children translate off them. */
export default function Parallax({
  children,
  className = "",
  attrs = {},
}: {
  children: ReactNode;
  className?: string;
  /** Extra root attributes (edit-mode data-* hooks); empty for visitors. */
  attrs?: Record<string, string>;
}) {
  const ref = useRef<HTMLElement>(null);

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  }

  return (
    <section ref={ref} onPointerMove={onMove} className={className} {...attrs}>
      {children}
    </section>
  );
}
