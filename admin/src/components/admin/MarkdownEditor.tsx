"use client";

import { useRef, useState } from "react";
import Markdown from "@/components/Markdown";
import ImagePicker from "./ImagePicker";
import { inputClass } from "./ui";

/**
 * Plain textarea + a toolbar that inserts Markdown at the cursor, with a live
 * preview using the same renderer as the public site. No editor library: the
 * value stays a string that posts through the surrounding <form> untouched.
 */
export default function MarkdownEditor({
  value,
  onChange,
  name,
  rows = 16,
}: {
  value: string;
  onChange: (v: string) => void;
  name: string;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [imgOpen, setImgOpen] = useState(false);

  /** Wrap the selection (or insert a placeholder) and keep focus. */
  function wrap(before: string, after = "", placeholder = "text") {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const sel = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + sel + after + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + sel.length);
    });
  }
  /** Prefix the current line(s). */
  function linePrefix(prefix: string) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    const block = value.slice(lineStart, e);
    const done = block
      .split("\n")
      .map((l) => (l.startsWith(prefix) ? l : prefix + l))
      .join("\n");
    onChange(value.slice(0, lineStart) + done + value.slice(e));
    requestAnimationFrame(() => el.focus());
  }

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  const btn = "rounded px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white";

  return (
    <div className="rounded-lg border border-white/10 bg-black/30">
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 px-2 py-1.5">
        <button type="button" onClick={() => linePrefix("## ")} className={btn} title="Heading">
          H2
        </button>
        <button type="button" onClick={() => linePrefix("### ")} className={btn} title="Subheading">
          H3
        </button>
        <button type="button" onClick={() => wrap("**", "**")} className={`${btn} font-bold`} title="Bold">
          B
        </button>
        <button type="button" onClick={() => wrap("_", "_")} className={`${btn} italic`} title="Italic">
          I
        </button>
        <button type="button" onClick={() => linePrefix("- ")} className={btn} title="Bullet list">
          • List
        </button>
        <button type="button" onClick={() => linePrefix("> ")} className={btn} title="Quote">
          ❝ Quote
        </button>
        <button type="button" onClick={() => wrap("[", "](https://)", "link text")} className={btn} title="Link">
          🔗 Link
        </button>
        <button type="button" onClick={() => setImgOpen((v) => !v)} className={btn} title="Insert image from library">
          🖼 Image
        </button>
        <span className="ml-auto text-xs text-white/40">{words} words</span>
        <div className="ml-2 flex overflow-hidden rounded border border-white/15 text-xs">
          <button type="button" onClick={() => setTab("write")} className={`px-2 py-0.5 ${tab === "write" ? "bg-white/10" : ""}`}>
            Write
          </button>
          <button type="button" onClick={() => setTab("preview")} className={`px-2 py-0.5 ${tab === "preview" ? "bg-white/10" : ""}`}>
            Preview
          </button>
        </div>
      </div>

      {imgOpen ? (
        <div className="border-b border-white/10 p-3">
          <ImagePicker
            value=""
            label="Pick an image to insert"
            onChange={(ref) => {
              wrap(`![](${ref})`, "", "");
              setImgOpen(false);
            }}
          />
        </div>
      ) : null}

      <div className={`grid ${tab === "write" ? "" : "md:grid-cols-2"}`}>
        <textarea
          ref={ref}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={`${inputClass} rounded-none border-0 bg-transparent font-mono text-sm leading-relaxed ${tab === "preview" ? "hidden md:block" : ""}`}
          placeholder="Write in Markdown — or let AI draft it from a topic above."
        />
        {tab === "preview" ? (
          <div className="max-h-[70vh] overflow-y-auto border-l border-white/10 p-4">
            {value.trim() ? <Markdown>{value}</Markdown> : <p className="text-sm text-white/40">Nothing to preview yet.</p>}
          </div>
        ) : null}
      </div>
    </div>
  );
}
