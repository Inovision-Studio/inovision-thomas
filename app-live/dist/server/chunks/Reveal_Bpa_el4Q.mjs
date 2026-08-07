import { jsx } from 'react/jsx-runtime';
import { useRef, useEffect } from 'react';

function Reveal({
  children,
  className,
  style,
  as = "div"
}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "-40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  const merged = `iv-reveal ${className ?? ""}`.trim();
  return (
    // @ts-expect-error dynamic JSX tag with ref
    /* @__PURE__ */ jsx(Tag, { ref, className: merged, style, children })
  );
}

export { Reveal as R };
