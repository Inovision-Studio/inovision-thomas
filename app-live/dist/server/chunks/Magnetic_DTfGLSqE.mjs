import { jsx } from 'react/jsx-runtime';
import { useRef, useEffect } from 'react';

function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  useEffect(() => {
    const wrapper = ref.current;
    if (!wrapper) return;
    const child = wrapper.firstElementChild;
    if (!child) return;
    const fineCursor = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = fineCursor.matches && !reduced.matches;
    const update = () => {
      enabled = fineCursor.matches && !reduced.matches;
      if (!enabled) child.style.transform = "";
    };
    fineCursor.addEventListener("change", update);
    reduced.addEventListener("change", update);
    const onMove = (e) => {
      if (!enabled) return;
      const rect = child.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      child.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    };
    const onLeave = () => {
      if (!enabled) return;
      child.style.transform = "";
    };
    wrapper.addEventListener("pointermove", onMove);
    wrapper.addEventListener("pointerleave", onLeave);
    child.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
    child.style.willChange = "transform";
    return () => {
      wrapper.removeEventListener("pointermove", onMove);
      wrapper.removeEventListener("pointerleave", onLeave);
      fineCursor.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, [strength]);
  return /* @__PURE__ */ jsx(
    "span",
    {
      ref,
      style: { display: "inline-block", position: "relative" },
      children
    }
  );
}

export { Magnetic as M };
