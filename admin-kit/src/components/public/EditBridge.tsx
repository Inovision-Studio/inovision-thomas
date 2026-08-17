"use client";

import { useEffect } from "react";
import { sized, srcSet } from "@/lib/img";
import { CLS, SECTION_CONTROLS, SPEED_MULT, TEXT_SCALE, sectionLayout, type HomeLayout, type SectionId } from "@/lib/homeLayout";
import { EDIT_MSG, type Envelope, type ToFrame, type ToParent } from "@/lib/editProtocol";
import type { EditType } from "@/lib/editAttrs";

/**
 * Runs only inside the admin's edit iframe (owner + ?edit=1). Vanilla DOM on
 * purpose: the page is server markup, and this just decorates it — clicks
 * become `select` messages, `preview`/`layout` messages mutate the DOM live so
 * the owner sees the change before saving. Nothing here is bundled for visitors.
 */
export default function EditBridge() {
  useEffect(() => {
    if (window.self === window.top) return; // not framed → do nothing
    const parent = window.parent;
    const origin = location.origin;
    const post = (msg: ToParent) => parent.postMessage({ src: EDIT_MSG, msg } satisfies Envelope<ToParent>, origin);

    document.documentElement.classList.add("sb-editing");

    // ---------- selection ----------
    let selected: Element | null = null;
    const clearSel = () => {
      selected?.classList.remove("sb-selected");
      selected = null;
      document.querySelectorAll(".sb-section-selected").forEach((el) => el.classList.remove("sb-section-selected"));
      removeHandles();
    };
    const selectEl = (el: Element) => {
      clearSel();
      selected = el;
      el.classList.add("sb-selected");
      const section = (el.closest("[data-section]") as HTMLElement | null)?.dataset.section ?? "";
      const key = (el as HTMLElement).dataset.editKey ?? "";
      const editType = ((el as HTMLElement).dataset.editType ?? "text") as EditType;
      const value =
        editType === "image"
          ? ((el as HTMLImageElement).getAttribute("src") ?? "").replace(/\?w=\d+$/, "")
          : (el.textContent ?? "").trim();
      const r = el.getBoundingClientRect();
      post({ type: "select", key, editType, value, section, rect: { x: r.x, y: r.y, width: r.width, height: r.height } });
      showHandlesFor(el);
    };

    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t) return;
      if (t.closest(".sb-handle")) return; // handles manage their own events
      const editable = t.closest("[data-edit-key]");
      if (editable) {
        e.preventDefault();
        e.stopPropagation();
        selectEl(editable);
        return;
      }
      const sec = t.closest("[data-section]") as HTMLElement | null;
      // any click inside the page: block navigation, select the section
      if (t.closest("a, button")) e.preventDefault();
      if (sec) {
        clearSel();
        sec.classList.add("sb-section-selected");
        post({ type: "selectSection", section: sec.dataset.section as SectionId });
        showHandlesFor(sec);
      }
    };
    document.addEventListener("click", onClick, true);
    // forms inside the preview must never submit (VIP signup etc.)
    const onSubmit = (e: Event) => e.preventDefault();
    document.addEventListener("submit", onSubmit, true);

    // ---------- live preview ----------
    const applyPreview = (m: Extract<ToFrame, { type: "preview" }>) => {
      document.querySelectorAll<HTMLElement>(`[data-edit-key="${CSS.escape(m.key)}"]`).forEach((el) => {
        if (m.editType === "image") {
          const img = el as HTMLImageElement;
          img.src = sized(m.value, 800);
          const ss = srcSet(m.value);
          if (ss) img.srcset = ss;
          else img.removeAttribute("srcset");
        } else if (m.editType === "list") {
          // banner / tagline strips: rebuild the doubled track from the first item as a template
          const track = el.querySelector<HTMLElement>(".marquee-track");
          const template = track?.firstElementChild as HTMLElement | null;
          if (!track || !template) return; // other lists (why-us cards) refresh after publish
          const lines = m.value.split("\n").map((l) => l.trim()).filter(Boolean);
          if (lines.length === 0) return;
          track.replaceChildren();
          [...lines, ...lines].forEach((line, i) => {
            const node = template.cloneNode(true) as HTMLElement;
            node.setAttribute("aria-hidden", String(i >= lines.length));
            // the visible text is the first text node inside the item's <span>
            const span = node.querySelector("span") ?? node;
            const textNode = [...span.childNodes].find((n) => n.nodeType === Node.TEXT_NODE);
            if (textNode) textNode.textContent = line;
            else span.prepend(document.createTextNode(line));
            track.appendChild(node);
          });
        } else {
          el.textContent = m.value;
        }
      });
    };

    const applyLayout = (layout: HomeLayout) => {
      const root = document.querySelector("[data-edit-root]");
      if (!root) return;
      // order + hidden
      const nodes = new Map<string, Element>();
      root.querySelectorAll<HTMLElement>("[data-section], [data-section-hidden]").forEach((el) => {
        const id = el.dataset.section ?? el.dataset.sectionHidden;
        if (id && !nodes.has(id)) nodes.set(id, el.closest("[data-section-hidden]") ?? el);
      });
      // Reorder by re-appending in the requested order. Sections are direct
      // children of the root (either the section itself or its hidden wrapper).
      const topLevel = (el: Element): Element => {
        let cur = el;
        while (cur.parentElement && cur.parentElement !== root) cur = cur.parentElement;
        return cur;
      };
      for (const id of layout.order) {
        const el = nodes.get(id);
        if (!el) continue;
        const top = topLevel(el);
        root.appendChild(top);
        const isHidden = layout.hidden.includes(id);
        if (top.hasAttribute("data-section-hidden")) {
          (top as HTMLElement).hidden = isHidden;
        } else {
          (top as HTMLElement).hidden = isHidden;
        }
      }
      // per-section classes / scale
      for (const id of layout.order) {
        const l = sectionLayout(id, layout);
        const secEl = root.querySelector<HTMLElement>(`[data-section="${id}"]`);
        if (!secEl) continue;
        // text scale
        const scaleTarget = id === "hero" ? secEl.querySelector<HTMLElement>(".hero-copy")?.parentElement ?? secEl : secEl;
        if (l.textSize && l.textSize !== "m") scaleTarget.style.setProperty("--scale", TEXT_SCALE[l.textSize]);
        else scaleTarget.style.removeProperty("--scale");
        // spacing (section root py-*), width, columns, imageSide
        swapClass(secEl, Object.values(CLS.spacing), l.spacing ? CLS.spacing[l.spacing] : "");
        if (SECTION_CONTROLS[id].controls.includes("width"))
          swapClass(secEl, Object.values(CLS.width), l.width ? CLS.width[l.width] : "");
        const grid = secEl.querySelector<HTMLElement>(`[data-edit-layout="${id}:columns"]`);
        if (grid && l.columns != null) swapClass(grid, Object.values(CLS.columns), CLS.columns[l.columns] ?? "");
        if (SECTION_CONTROLS[id].controls.includes("imageSide")) {
          const wrap = secEl.querySelector<HTMLElement>(":scope > .reveal:has(img), :scope > .reveal:has(video)") ??
            (id === "welcome" ? secEl.querySelector<HTMLElement>(":scope > .reveal:nth-child(2)") : secEl.querySelector<HTMLElement>(":scope > .reveal:nth-child(1)"));
          if (wrap) {
            const natural = id === "welcome" ? "right" : "left";
            swapClass(wrap, Object.values(CLS.imageSide), l.imageSide && l.imageSide !== natural ? CLS.imageSide[l.imageSide] : "");
          }
        }
        if (id === "hero") {
          const copy = secEl.querySelector<HTMLElement>(".hero-copy");
          if (copy) swapClass(copy, ["text-left", "text-center"], l.align === "left" ? "text-left" : "text-center");
        }
        // speed → marquee durations (data-base-seconds is emitted only in edit mode) and hero cycle
        if (SECTION_CONTROLS[id].controls.includes("speed")) {
          const k = SPEED_MULT[l.speed ?? "normal"];
          // the banner's marker is on the section root itself; the rest are descendants
          const roots = [secEl.matches("[data-base-seconds]") ? secEl : null, ...secEl.querySelectorAll<HTMLElement>("[data-base-seconds]")].filter(Boolean) as HTMLElement[];
          roots.forEach((root) => {
            const base = Number(root.dataset.baseSeconds) || 30;
            const track = root.querySelector<HTMLElement>(".marquee-track");
            if (track) track.style.animationDuration = `${base * k}s`;
          });
          if (id === "hero") {
            const slides = secEl.querySelectorAll<HTMLElement>(".hero-slide");
            const per = 5 * k;
            const cycle = `${(slides.length + 1) * per}s`;
            secEl.querySelector<HTMLElement>(".hero-base")?.style.setProperty("--hero-cycle", cycle);
            slides.forEach((s, i) => {
              s.style.setProperty("--hero-cycle", cycle);
              s.style.setProperty("--hero-delay", `${(i + 1) * per}s`);
            });
          }
        }
      }
      if (selected) showHandlesFor(selected);
    };

    const swapClass = (el: HTMLElement, all: string[], want: string) => {
      all.forEach((c) => c && el.classList.remove(...c.split(" ")));
      if (want) el.classList.add(...want.split(" "));
    };

    // ---------- resize handles (snap to presets) ----------
    let handles: HTMLElement[] = [];
    const removeHandles = () => {
      handles.forEach((h) => h.remove());
      handles = [];
    };
    const showHandlesFor = (el: Element) => {
      removeHandles();
      const secEl = el.closest("[data-section]") as HTMLElement | null;
      if (!secEl) return;
      const id = secEl.dataset.section as SectionId;
      const controls = SECTION_CONTROLS[id]?.controls ?? [];
      const l = sectionLayout(id, currentLayout);
      const mk = (cls: string, title: string) => {
        const h = document.createElement("div");
        h.className = `sb-handle ${cls}`;
        h.title = title;
        document.body.appendChild(h);
        handles.push(h);
        return h;
      };
      const place = (h: HTMLElement, target: Element, atRight = true) => {
        const r = target.getBoundingClientRect();
        h.style.left = `${(atRight ? r.right : r.left) + window.scrollX - 7}px`;
        h.style.top = `${r.top + window.scrollY + r.height / 2 - 20}px`;
      };
      if (controls.includes("columns")) {
        const grid = secEl.querySelector<HTMLElement>(`[data-edit-layout="${id}:columns"]`);
        const allowed = SECTION_CONTROLS[id].columns ?? [];
        if (grid && allowed.length) {
          const h = mk("", "Drag to change how many columns");
          place(h, grid);
          dragSnap(h, (dx) => {
            const r = grid.getBoundingClientRect();
            const cur = l.columns ?? allowed[allowed.length - 1];
            const per = r.width / cur;
            const step = Math.round(dx / Math.max(80, per / 2));
            const i = Math.max(0, Math.min(allowed.length - 1, allowed.indexOf(cur) + step));
            return allowed[i];
          }, (v) => post({ type: "layout", section: id, control: "columns", value: v }));
        }
      }
      if (controls.includes("width")) {
        const h = mk("", "Drag to change section width");
        place(h, secEl);
        const order = ["narrow", "normal", "wide"] as const;
        dragSnap(h, (dx) => {
          const cur = l.width ?? "normal";
          const step = Math.round(dx / 140);
          const i = Math.max(0, Math.min(order.length - 1, order.indexOf(cur) + step));
          return order[i];
        }, (v) => post({ type: "layout", section: id, control: "width", value: v }));
      }
      if (controls.includes("imageSide")) {
        const h = mk("sb-handle-flip", "Swap image side");
        h.textContent = "⇄ swap sides";
        const r = secEl.getBoundingClientRect();
        h.style.left = `${r.left + window.scrollX + r.width / 2 - 50}px`;
        h.style.top = `${r.top + window.scrollY + 8}px`;
        h.addEventListener("click", (e) => {
          e.stopPropagation();
          const next = (l.imageSide ?? (id === "welcome" ? "right" : "left")) === "left" ? "right" : "left";
          post({ type: "layout", section: id, control: "imageSide", value: next });
        });
      }
    };
    const dragSnap = (h: HTMLElement, compute: (dx: number) => string | number, commit: (v: string | number) => void) => {
      let startX = 0;
      let last: string | number | null = null;
      const move = (e: PointerEvent) => {
        const v = compute(e.clientX - startX);
        if (v !== last) {
          last = v;
          commit(v); // parent stages + echoes back a `layout` message → live reflow
        }
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      h.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        startX = e.clientX;
        last = null;
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      });
    };

    // ---------- inbound ----------
    let currentLayout: HomeLayout = { order: [], hidden: [], sections: {} };
    const onMessage = (e: MessageEvent<Envelope<ToFrame>>) => {
      if (e.origin !== origin || e.source !== parent) return;
      const env = e.data;
      if (!env || env.src !== EDIT_MSG) return;
      const m = env.msg;
      switch (m.type) {
        case "preview":
          applyPreview(m);
          break;
        case "layout":
          currentLayout = m.layout;
          applyLayout(m.layout);
          break;
        case "reload":
          location.reload();
          break;
        case "scrollTo":
          document.querySelector(`[data-section="${m.section}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
          break;
        case "select": {
          const el = document.querySelector(`[data-edit-key="${CSS.escape(m.key)}"]`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            selectEl(el);
          }
          break;
        }
      }
    };
    window.addEventListener("message", onMessage);
    const onScroll = () => selected && showHandlesFor(selected);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    post({ type: "ready" });

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      window.removeEventListener("message", onMessage);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      removeHandles();
      document.documentElement.classList.remove("sb-editing");
    };
  }, []);

  return null;
}
