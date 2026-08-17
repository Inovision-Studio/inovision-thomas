"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useConfirm, useToast } from "@/components/admin/Dialogs";
import HomeMock from "@/components/admin/HomeMock";
import { BODY_FONTS, DISPLAY_FONTS, googleCss2Url, parseFont, serializeFont, type FontChoice } from "@/lib/fonts";
import { saveFonts } from "./actions";

type Slot = "display" | "body";

/** CSS font-family for a choice, for the local preview only. */
function familyFor(c: FontChoice, slot: Slot): string | undefined {
  if (c.kind === "google") return `"${c.family}"`;
  if (c.kind === "custom") return `"SB Preview ${slot} ${c.hash}"`;
  return undefined;
}

export default function FontPicker({ initialDisplay, initialBody, accent }: { initialDisplay: string; initialBody: string; accent: string }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [pending, start] = useTransition();
  const [display, setDisplay] = useState<FontChoice>(() => parseFont(initialDisplay));
  const [body, setBody] = useState<FontChoice>(() => parseFont(initialBody));
  const [saved, setSaved] = useState({ display: initialDisplay, body: initialBody });
  const faces = useRef<Set<string>>(new Set());

  // one stylesheet for the whole allow-list so each row can render in its own font
  useEffect(() => {
    const id = "sb-font-preview";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = googleCss2Url([...new Set<string>([...DISPLAY_FONTS, ...BODY_FONTS])]);
    document.head.appendChild(link);
  }, []);

  // uploaded fonts get a local @font-face for the preview
  function ensureFace(c: FontChoice, slot: Slot) {
    if (c.kind !== "custom" || faces.current.has(c.hash + slot)) return;
    faces.current.add(c.hash + slot);
    const st = document.createElement("style");
    st.textContent = `@font-face{font-family:"SB Preview ${slot} ${c.hash}";src:url(/api/font/${c.hash}) format("${c.format}");font-display:swap;}`;
    document.head.appendChild(st);
  }
  useEffect(() => {
    ensureFace(display, "display");
    ensureFace(body, "body");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, body]);

  const dirty = serializeFont(display) !== saved.display || serializeFont(body) !== saved.body;

  async function upload(slot: Slot, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/font", { method: "POST", body: fd });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      toast(data?.error || "Upload failed.", "error");
      return;
    }
    const c: FontChoice = { kind: "custom", hash: data.hash, name: data.name, format: data.hash.endsWith(".woff2") ? "woff2" : data.hash.endsWith(".ttf") ? "truetype" : "opentype" };
    (slot === "display" ? setDisplay : setBody)(c);
    toast(`Uploaded ${data.name}`);
  }

  async function apply() {
    const ok = await confirm({
      title: "Apply these fonts to the live site?",
      body: "Headings and body text across your site will switch immediately.",
      confirmLabel: "Apply",
    });
    if (!ok) return;
    start(async () => {
      const res = await saveFonts(serializeFont(display), serializeFont(body));
      if (!res.ok) {
        toast(res.error, "error");
        return;
      }
      setSaved({ display: serializeFont(display), body: serializeFont(body) });
      toast("Fonts applied to the live site");
    });
  }

  const Column = ({ slot, list, value, onChange }: { slot: Slot; list: readonly string[]; value: FontChoice; onChange: (c: FontChoice) => void }) => (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-xl">{slot === "display" ? "Headings" : "Body text"}</h3>
        <button type="button" onClick={() => onChange({ kind: "default" })} className={`text-xs ${value.kind === "default" ? "text-[var(--accent)]" : "text-white/50 hover:text-white"}`}>
          {value.kind === "default" ? "● Site default" : "Use site default"}
        </button>
      </div>
      <ul className="max-h-72 space-y-1 overflow-y-auto pr-1">
        {list.map((f) => {
          const active = value.kind === "google" && value.family === f;
          return (
            <li key={f}>
              <button
                type="button"
                onClick={() => onChange({ kind: "google", family: f })}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left ${active ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-white/10 hover:border-white/25"}`}
              >
                <span style={{ fontFamily: `"${f}"` }} className={slot === "display" ? "text-xl leading-none" : "text-base"}>
                  {slot === "display" ? "Your Store Name" : "The quick brown fox jumps over the lazy dog"}
                </span>
                <span className="ml-3 shrink-0 text-xs text-white/50">{f}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <label className="mt-3 flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-white/20 px-3 py-2 text-sm text-white/70 hover:border-white/40">
        <span>{value.kind === "custom" ? `Uploaded: ${value.name}` : "Upload your own (.woff2 / .ttf / .otf, 2 MB)"}</span>
        <input type="file" accept=".woff2,.ttf,.otf,font/woff2,font/ttf,font/otf" className="hidden" onChange={(e) => e.target.files?.[0] && upload(slot, e.target.files[0])} />
        <span className="text-xs text-[var(--accent)]">Browse</span>
      </label>
    </div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,22rem)]">
      <Column slot="display" list={DISPLAY_FONTS} value={display} onChange={setDisplay} />
      <Column slot="body" list={BODY_FONTS} value={body} onChange={setBody} />
      <div className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-white/80">Preview</span>
          <button type="button" onClick={apply} disabled={!dirty || pending} className="btn-accent text-sm disabled:opacity-50">
            {pending ? "Applying…" : "Apply fonts"}
          </button>
        </div>
        <HomeMock accent={accent} fontDisplay={familyFor(display, "display")} fontBody={familyFor(body, "body")} />
        <p className="mt-3 text-xs text-white/45">
          Google Fonts load from Google's servers when chosen; the site defaults are self-hosted. Uploaded files are served from this site.
        </p>
      </div>
    </div>
  );
}
