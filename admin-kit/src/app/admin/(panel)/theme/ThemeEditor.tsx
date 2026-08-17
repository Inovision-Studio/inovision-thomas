"use client";
import { useEffect, useState, useTransition } from "react";
import { inputClass } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";
import { saveAccent } from "./actions";
import ColorWheel, { hexToHsv, hsvToHex, type Hsv } from "@/components/admin/ColorWheel";
import HomeMock from "@/components/admin/HomeMock";

const PRESETS = [
  { hex: "#ff5a1f", name: "Ember Orange" },
  { hex: "#22c55e", name: "Green" },
  { hex: "#38bdf8", name: "Sky" },
  { hex: "#a855f7", name: "Purple" },
  { hex: "#f43f5e", name: "Rose" },
  { hex: "#facc15", name: "Gold" },
];

const BUTTON_TEXT = "#04120a";
const PAGE_BG = "#0a0e0a";

/** WCAG relative luminance. */
function luminance(hex: string): number {
  const v = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}

function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

const slider =
  "h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[var(--accent)]";

export default function ThemeEditor({ initial }: { initial: string }) {
  const [color, setColor] = useState(initial || "#ff5a1f");
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(initial || "#ff5a1f"));

  // "Reset to default" writes the database and refreshes the server component, but
  // local state would keep showing the old colour — the editor then lies about
  // what the site is actually using. Re-sync whenever the saved value changes.
  useEffect(() => {
    const hex = initial || "#ff5a1f";
    setColor(hex);
    setHsv(hexToHsv(hex));
  }, [initial]);

  /** Keep the wheel and the hex field as one value, whichever the owner touched. */
  function setFromHsv(next: Hsv) {
    setHsv(next);
    setColor(hsvToHex(next));
  }
  function setFromHex(hex: string) {
    setColor(hex);
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) setHsv(hexToHsv(hex));
  }
  const [pending, start] = useTransition();
  const toast = useToast();
  const confirm = useConfirm();
  const valid = /^#[0-9a-fA-F]{6}$/.test(color);
  const accent = valid ? color : "#ff5a1f";

  // Buttons print dark text on the accent; a dark accent makes them unreadable.
  const onButton = contrast(accent, BUTTON_TEXT);
  const onPage = contrast(accent, PAGE_BG);

  async function save() {
    const ok = await confirm({
      title: "Apply this colour to the live site?",
      body: `Buttons, links and highlights across your site will use ${color}.`,
      confirmLabel: "Apply",
    });
    if (!ok) return;
    start(async () => {
      await saveAccent(color);
      toast("Accent applied to the live site");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <div className="grid gap-4">
        <div className="card p-5">
          <label className="mb-2 block text-sm text-white/80">Accent color</label>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <ColorWheel hsv={hsv} onChange={setFromHsv} />

            <div className="grid flex-1 gap-4">
              <label className="grid gap-1.5">
                <span className="text-xs text-white/60">Brightness</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(hsv.v * 100)}
                  onChange={(e) => setFromHsv({ ...hsv, v: +e.target.value / 100 })}
                  className={slider}
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs text-white/60">Saturation</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(hsv.s * 100)}
                  onChange={(e) => setFromHsv({ ...hsv, s: +e.target.value / 100 })}
                  className={slider}
                />
              </label>
              <input
                value={color}
                onChange={(e) => setFromHex(e.target.value)}
                className={inputClass}
                placeholder="#ff5a1f"
                aria-label="Hex colour"
              />
            </div>
          </div>

          {/* the three roles the accent actually plays on the site */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: accent, color: BUTTON_TEXT }}>
              Accent {accent}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-bold"
              style={{ background: hsvToHex({ ...hsv, v: Math.min(1, hsv.v * 1.15) }), color: BUTTON_TEXT }}
            >
              Hover
            </span>
            <span
              className="rounded-full border px-3 py-1 text-xs font-bold"
              style={{ color: accent, borderColor: `${accent}66`, background: `${accent}1a` }}
            >
              Highlight
            </span>
          </div>
          {!valid && <p className="mt-2 text-xs text-red-400">Enter a 6-digit hex like #ff5a1f</p>}

          <p className="mt-5 mb-2 text-sm text-white/80">Presets</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.hex}
                type="button"
                title={p.name}
                onClick={() => setFromHex(p.hex)}
                aria-label={p.name}
                className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${
                  accent.toLowerCase() === p.hex ? "border-white" : "border-white/20"
                }`}
                style={{ backgroundColor: p.hex }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={save}
            disabled={!valid || pending}
            className="btn-accent mt-5 w-full text-sm disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save accent color"}
          </button>
        </div>

        {/* Readability check — a pretty colour that no one can read is a bug. */}
        <div className="card p-5">
          <p className="text-sm text-white/80">Readability</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="text-white/60">Dark text on buttons</span>
              <span className={onButton >= 4.5 ? "text-green-400" : "text-amber-300"}>
                {onButton.toFixed(1)}:1 {onButton >= 4.5 ? "✓" : "low"}
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-white/60">Accent text on page</span>
              <span className={onPage >= 4.5 ? "text-green-400" : "text-amber-300"}>
                {onPage.toFixed(1)}:1 {onPage >= 4.5 ? "✓" : "low"}
              </span>
            </li>
          </ul>
          {(onButton < 4.5 || onPage < 4.5) && (
            <p className="mt-3 text-xs text-amber-300/90">
              Below 4.5:1 gets hard to read for some visitors. A brighter, more saturated colour usually fixes it.
            </p>
          )}
        </div>
      </div>

      {/* Miniature of the real homepage so the colour can be judged in context. */}
      <div className="card overflow-hidden p-0" style={{ ["--accent" as string]: accent }}>
        <div className="border-b border-white/10 px-5 py-3 text-sm text-white/80">Live preview</div>

        <div className="p-5">
          <HomeMock accent={accent} />
        </div>
      </div>
    </div>
  );
}
