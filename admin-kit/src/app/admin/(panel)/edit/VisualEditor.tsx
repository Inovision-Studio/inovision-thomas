"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ImagePicker from "@/components/admin/ImagePicker";
import { useConfirm, useToast } from "@/components/admin/Dialogs";
import { inputClass } from "@/components/admin/ui";
import { CONTENT_DEFAULTS, CONTENT_FIELDS } from "@/lib/content";
import { EDIT_MSG, type Envelope, type ToFrame, type ToParent } from "@/lib/editProtocol";
import {
  CLS,
  SECTION_CONTROLS,
  SPEED_MULT,
  TEXT_SCALE,
  sectionLayout,
  type HomeLayout,
  type LayoutControl,
  type SectionId,
} from "@/lib/homeLayout";
import type { EditType } from "@/lib/editAttrs";
import { saveVisualEdits } from "./actions";

type Device = "desktop" | "tablet" | "phone";
const DEVICE_W: Record<Device, number> = { desktop: 1440, tablet: 768, phone: 390 };

type Selected = { key: string; editType: EditType; value: string; section: string };

const FIELD_BY_KEY = new Map(CONTENT_FIELDS.map((f) => [f.key, f]));

const CONTROL_LABEL: Record<LayoutControl, string> = {
  columns: "Columns",
  width: "Width",
  align: "Align",
  imageSide: "Image side",
  textSize: "Text size",
  spacing: "Spacing",
  speed: "Speed",
};

export default function VisualEditor({
  page,
  title,
  content,
  layout: initialLayout,
}: {
  page: string;
  title: string;
  content: Record<string, string>;
  layout: HomeLayout;
}) {
  const confirm = useConfirm();
  const toast = useToast();

  const [staged, setStaged] = useState<Record<string, string>>({});
  const [layout, setLayout] = useState<HomeLayout>(initialLayout);
  const [savedLayout, setSavedLayout] = useState<HomeLayout>(initialLayout);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionId | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [saving, setSaving] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const [scale, setScale] = useState(1);
  const [wrapH, setWrapH] = useState(800);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const layoutDirty = JSON.stringify(layout) !== JSON.stringify(savedLayout);
  const dirty = Object.keys(staged).length > 0 || layoutDirty;

  // ---------- messaging ----------
  const post = useCallback((msg: ToFrame) => {
    iframeRef.current?.contentWindow?.postMessage({ src: EDIT_MSG, msg } satisfies Envelope<ToFrame>, location.origin);
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent<Envelope<ToParent>>) => {
      if (e.origin !== location.origin) return;
      if (e.source !== iframeRef.current?.contentWindow) return;
      const env = e.data;
      if (!env || env.src !== EDIT_MSG) return;
      const m = env.msg;
      if (m.type === "ready") {
        setFrameReady(true);
        // the iframe just (re)loaded — replay everything not yet saved
        post({ type: "layout", layout });
        for (const [key, value] of Object.entries(staged)) {
          const f = FIELD_BY_KEY.get(key);
          post({ type: "preview", key, editType: (f?.type ?? "text") as EditType, value });
        }
      } else if (m.type === "select") {
        setSelectedSection(null);
        // prefer what we already hold over what the DOM shows
        const value = staged[m.key] ?? content[m.key] ?? m.value;
        setSelected({ key: m.key, editType: m.editType, value, section: m.section });
      } else if (m.type === "selectSection") {
        setSelected(null);
        setSelectedSection(m.section);
      } else if (m.type === "layout") {
        setLayout((prev) => ({
          ...prev,
          sections: { ...prev.sections, [m.section]: { ...(prev.sections[m.section] ?? {}), [m.control]: m.value } },
        }));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [post, layout, staged, content]);

  // parent is the single source of truth for layout → echo every change down
  useEffect(() => {
    if (frameReady) post({ type: "layout", layout });
  }, [layout, frameReady, post]);

  // ---------- device scaling ----------
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      setScale(Math.min(1, w / DEVICE_W[device]));
      setWrapH(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [device]);

  // ---------- unsaved-changes guard ----------
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  // ---------- edits ----------
  function stage(key: string, value: string) {
    const f = FIELD_BY_KEY.get(key);
    setStaged((prev) => {
      const next = { ...prev };
      if ((content[key] ?? "") === value) delete next[key];
      else next[key] = value;
      return next;
    });
    setSelected((sel) => (sel && sel.key === key ? { ...sel, value } : sel));
    post({ type: "preview", key, editType: (f?.type ?? "text") as EditType, value });
  }

  function setControl(id: SectionId, control: LayoutControl, value: string | number) {
    setLayout((prev) => ({
      ...prev,
      sections: { ...prev.sections, [id]: { ...(prev.sections[id] ?? {}), [control]: value } },
    }));
  }

  function move(id: SectionId, dir: -1 | 1) {
    setLayout((prev) => {
      const order = [...prev.order];
      const i = order.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= order.length) return prev;
      [order[i], order[j]] = [order[j], order[i]];
      return { ...prev, order };
    });
  }

  function moveTo(id: SectionId, index: number) {
    setLayout((prev) => {
      const order = prev.order.filter((x) => x !== id);
      order.splice(index, 0, id);
      return { ...prev, order };
    });
  }

  function toggleHidden(id: SectionId) {
    setLayout((prev) => ({
      ...prev,
      hidden: prev.hidden.includes(id) ? prev.hidden.filter((x) => x !== id) : [...prev.hidden, id],
    }));
  }

  async function save() {
    setSaving(true);
    const res = await saveVisualEdits({ content: staged, layout: layoutDirty ? layout : undefined }).catch(() => ({
      ok: false as const,
      error: "Save failed — check your connection and try again.",
    }));
    setSaving(false);
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    // fold staged into the baseline; the page will re-render from the DB anyway
    for (const [k, v] of Object.entries(staged)) content[k] = v;
    setStaged({});
    setSavedLayout(layout);
    toast("Published — the live site is updated");
    post({ type: "reload" });
  }

  async function discard() {
    if (!(await confirm({ title: "Discard unsaved changes?", confirmLabel: "Discard", danger: true }))) return;
    setStaged({});
    setLayout(savedLayout);
    setSelected(null);
    post({ type: "reload" });
  }

  const sectionRows = useMemo(() => layout.order, [layout.order]);

  if (isDesktop === null) return null;

  // The editor needs room for a live page AND a drawer — on phones it can't
  // work, so say so instead of rendering something broken (and don't load the
  // iframe at all).
  if (!isDesktop) {
    return (
      <div className="card p-6">
        <p className="font-display text-2xl">Use a laptop or desktop for the visual editor</p>
        <p className="mt-2 text-sm text-white/60">
          Clicking around the live page needs a screen at least ~1000px wide. On this device you can still change any text
          in the plain form.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/admin/content" className="btn-accent text-sm">
            Edit text as a form
          </Link>
          <Link href="/admin" className="btn-ghost text-sm">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="-m-4 flex h-[calc(100vh-4rem)] flex-col lg:-m-8 lg:h-screen">
      {/* top bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-[#0d110d] px-4 py-2">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-[var(--accent)]">EDIT</div>
          <div className="font-display text-xl leading-none">{title} page</div>
        </div>
        <div className="ml-4 flex overflow-hidden rounded-full border border-white/15 text-xs">
          {(["desktop", "tablet", "phone"] as Device[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDevice(d)}
              className={`px-3 py-1.5 capitalize ${device === d ? "bg-[var(--accent)] text-black" : "text-white/70 hover:bg-white/5"}`}
            >
              {d}
            </button>
          ))}
        </div>
        <span className="ml-auto flex items-center gap-2 text-xs text-white/50">
          {dirty ? (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Unsaved changes
            </>
          ) : (
            "All changes published"
          )}
        </span>
        <Link href="/admin/content" className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5" title="Every text field as a plain form — includes footer and careers page copy">
          All text (form) →
        </Link>
        <button type="button" onClick={discard} disabled={!dirty || saving} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5 disabled:opacity-40">
          Discard
        </button>
        <button type="button" onClick={save} disabled={!dirty || saving} className="btn-accent text-sm disabled:opacity-50">
          {saving ? "Publishing…" : "Save & publish"}
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* live preview */}
        <div ref={wrapRef} className="relative min-w-0 flex-1 overflow-hidden bg-black/40">
          <div className="absolute left-1/2 top-0 origin-top" style={{ transform: `translateX(-50%) scale(${scale})`, width: DEVICE_W[device] }}>
            <iframe
              ref={iframeRef}
              src={`${page}?edit=1`}
              title="Live preview — click anything to edit"
              className="block border-0 bg-[#0a0e0a]"
              style={{ width: DEVICE_W[device], height: wrapH / scale }}
            />
          </div>
          {!frameReady ? (
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-white/50">Loading preview…</div>
          ) : null}
        </div>

        {/* drawer */}
        <aside className="flex w-96 shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-[#0d110d]">
          {selected ? (
            <FieldEditor sel={selected} onChange={(v) => stage(selected.key, v)} onClose={() => setSelected(null)} />
          ) : (
            <p className="border-b border-white/10 px-4 py-3 text-xs text-white/50">
              👆 Click a headline, paragraph, button or photo in the preview to change it. Drag the sections below to reorder.
            </p>
          )}

          <div className="px-4 py-3">
            <h2 className="mb-2 text-[11px] font-bold tracking-widest text-white/50">SECTIONS</h2>
            <SectionList
              order={sectionRows}
              hidden={layout.hidden}
              layout={layout}
              selected={selectedSection}
              onSelect={(id) => {
                setSelectedSection(id);
                setSelected(null);
                post({ type: "scrollTo", section: id });
              }}
              onMove={move}
              onMoveTo={moveTo}
              onToggleHidden={toggleHidden}
              onControl={setControl}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function FieldEditor({ sel, onChange, onClose }: { sel: Selected; onChange: (v: string) => void; onClose: () => void }) {
  const f = FIELD_BY_KEY.get(sel.key);
  const isGallery = sel.editType === "gallery" || sel.key.startsWith("gallery:");
  const label = f?.label ?? sel.key;
  const group = f?.group ?? "";
  const def = CONTENT_DEFAULTS[sel.key] ?? "";

  return (
    <div className="border-b border-white/10 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-white/40">{group.toUpperCase()}</div>
          <div className="font-semibold">{label}</div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="text-white/50 hover:text-white">
          ✕
        </button>
      </div>

      {isGallery ? (
        <div className="mt-3 text-sm text-white/70">
          <p>Slideshow and gallery photos are managed in Galleries.</p>
          <Link href="/admin/galleries" className="btn-accent mt-3 inline-flex text-sm">
            Open Galleries →
          </Link>
        </div>
      ) : sel.editType === "image" ? (
        <div className="mt-3">
          <ImagePicker value={sel.value} onChange={onChange} label="" />
          {sel.value !== def ? (
            <button type="button" onClick={() => onChange("")} className="mt-2 text-xs text-white/50 hover:text-white">
              Use default image
            </button>
          ) : null}
        </div>
      ) : sel.editType === "list" || f?.type === "list" ? (
        <label className="mt-3 grid gap-1">
          <textarea value={sel.value} onChange={(e) => onChange(e.target.value)} rows={7} className={inputClass} placeholder={def} />
          <span className="text-xs text-white/45">{f?.hint ?? "One item per line."} Reorders show after publishing.</span>
        </label>
      ) : sel.editType === "textarea" || f?.type === "textarea" ? (
        <textarea value={sel.value} onChange={(e) => onChange(e.target.value)} rows={5} className={`${inputClass} mt-3`} placeholder={def} />
      ) : (
        <input value={sel.value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} mt-3`} placeholder={def} />
      )}

      {!isGallery && def && sel.value !== def && sel.editType !== "image" ? (
        <button type="button" onClick={() => onChange(def)} className="mt-2 text-xs text-white/50 hover:text-white">
          Reset to original wording
        </button>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------

function SectionList({
  order,
  hidden,
  layout,
  selected,
  onSelect,
  onMove,
  onMoveTo,
  onToggleHidden,
  onControl,
}: {
  order: SectionId[];
  hidden: SectionId[];
  layout: HomeLayout;
  selected: SectionId | null;
  onSelect: (id: SectionId) => void;
  onMove: (id: SectionId, dir: -1 | 1) => void;
  onMoveTo: (id: SectionId, index: number) => void;
  onToggleHidden: (id: SectionId) => void;
  onControl: (id: SectionId, control: LayoutControl, value: string | number) => void;
}) {
  const [dragging, setDragging] = useState<SectionId | null>(null);
  const [over, setOver] = useState<number | null>(null);

  return (
    <ul className="space-y-1">
      {order.map((id, i) => {
        const meta = SECTION_CONTROLS[id];
        const isHidden = hidden.includes(id);
        const isSel = selected === id;
        const l = sectionLayout(id, layout);
        return (
          <li
            key={id}
            draggable
            onDragStart={(e) => {
              setDragging(id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(i);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragging) onMoveTo(dragging, i);
              setDragging(null);
              setOver(null);
            }}
            onDragEnd={() => {
              setDragging(null);
              setOver(null);
            }}
            className={`rounded-lg border ${isSel ? "border-[var(--accent)]/60 bg-[var(--accent)]/5" : "border-white/10"} ${
              over === i && dragging && dragging !== id ? "border-t-2 border-t-[var(--accent)]" : ""
            } ${isHidden ? "opacity-50" : ""}`}
          >
            <div className="flex items-center gap-2 px-2 py-1.5">
              <span className="cursor-grab select-none text-white/30" title="Drag to reorder" aria-hidden="true">
                ⋮⋮
              </span>
              <button type="button" onClick={() => onSelect(id)} className="min-w-0 flex-1 truncate text-left text-sm font-medium">
                {meta.label}
              </button>
              <button type="button" onClick={() => onMove(id, -1)} disabled={i === 0} aria-label={`Move ${meta.label} up`} className="rounded px-1.5 text-white/60 hover:bg-white/5 disabled:opacity-30">
                ▲
              </button>
              <button type="button" onClick={() => onMove(id, 1)} disabled={i === order.length - 1} aria-label={`Move ${meta.label} down`} className="rounded px-1.5 text-white/60 hover:bg-white/5 disabled:opacity-30">
                ▼
              </button>
              <button
                type="button"
                onClick={() => onToggleHidden(id)}
                aria-pressed={isHidden}
                aria-label={isHidden ? `Show ${meta.label}` : `Hide ${meta.label}`}
                title={isHidden ? "Hidden — click to show" : "Visible — click to hide"}
                className={`rounded px-1.5 ${isHidden ? "text-white/40" : "text-[var(--accent)]"} hover:bg-white/5`}
              >
                {isHidden ? "◌" : "●"}
              </button>
            </div>

            {isSel && meta.controls.length > 0 ? (
              <div className="grid gap-2 border-t border-white/10 px-2 py-2">
                {meta.controls.map((control) => (
                  <div key={control} className="flex items-center gap-2">
                    <span className="w-20 shrink-0 text-xs text-white/50">{CONTROL_LABEL[control]}</span>
                    <div className="flex flex-wrap gap-1">
                      {optionsFor(id, control).map((opt) => {
                        const cur = l[control];
                        const active = String(cur) === String(opt);
                        return (
                          <button
                            key={String(opt)}
                            type="button"
                            onClick={() => onControl(id, control, opt)}
                            className={`rounded-full border px-2.5 py-0.5 text-xs capitalize ${
                              active ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]" : "border-white/15 text-white/70 hover:border-white/30"
                            }`}
                          >
                            {String(opt)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function optionsFor(id: SectionId, control: LayoutControl): (string | number)[] {
  switch (control) {
    case "columns":
      return SECTION_CONTROLS[id].columns ?? [];
    case "width":
      return Object.keys(CLS.width);
    case "align":
      return Object.keys(CLS.align);
    case "imageSide":
      return Object.keys(CLS.imageSide);
    case "spacing":
      return Object.keys(CLS.spacing);
    case "textSize":
      return Object.keys(TEXT_SCALE);
    case "speed":
      return Object.keys(SPEED_MULT);
  }
}
