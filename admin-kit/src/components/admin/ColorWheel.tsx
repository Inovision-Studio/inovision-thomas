"use client";

import { useCallback, useEffect, useRef } from "react";

export type Hsv = { h: number; s: number; v: number };

export function hsvToHex({ h, s, v }: Hsv): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    const c = v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(5)}${f(3)}${f(1)}`;
}

export function hexToHsv(hex: string): Hsv {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

/**
 * HSV disc: hue runs around the circumference, saturation from centre outward.
 * Brightness stays on its own slider — folding it into the disc makes dark
 * colours impossible to aim at.
 */
export default function ColorWheel({ hsv, onChange }: { hsv: Hsv; onChange: (v: Hsv) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const pick = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const radius = r.width / 2;
      const dist = Math.min(Math.hypot(dx, dy), radius);
      // 0° at the top, sweeping clockwise, matching the conic gradient below
      let h = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      if (h < 0) h += 360;
      onChange({ h, s: dist / radius, v: hsv.v });
    },
    [hsv.v, onChange],
  );

  useEffect(() => {
    const move = (e: PointerEvent) => dragging.current && pick(e.clientX, e.clientY);
    const up = () => (dragging.current = false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [pick]);

  // handle position from current hue/saturation
  const rad = ((hsv.h - 90) * Math.PI) / 180;
  const left = 50 + Math.cos(rad) * hsv.s * 50;
  const top = 50 + Math.sin(rad) * hsv.s * 50;

  return (
    <div
      ref={ref}
      role="application"
      aria-label="Accent colour wheel"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        pick(e.clientX, e.clientY);
      }}
      className="relative aspect-square w-full max-w-[190px] cursor-crosshair touch-none rounded-full border border-white/10"
      style={{
        background:
          "radial-gradient(circle at center, #fff 0%, transparent 70%)," +
          "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
      }}
    >
      {/* brightness darkens the whole disc so the wheel shows the real colour */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full bg-black"
        style={{ opacity: 1 - hsv.v }}
      />
      <span
        className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.6)]"
        style={{ left: `${left}%`, top: `${top}%`, backgroundColor: hsvToHex(hsv) }}
      />
    </div>
  );
}
