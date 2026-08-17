"use client";
import { useEffect, useState } from "react";

// Below this the browser has to upscale on retina screens, which is what "blurry" is.
const MIN_SHARP_WIDTH = 1200;

// Reusable: shows current image, upload new (auto-WebP), or pick from library.
// Calls onChange(ref) with "/api/img/<hash>" or "/api/image/<id>".
export default function ImagePicker({
  value,
  onChange,
  label = "Image",
}: {
  value?: string | null;
  onChange: (ref: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [lib, setLib] = useState<{ id: number; ref: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ kind: "warn" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (open && lib.length === 0) {
      fetch("/api/admin/images").then((r) => r.json()).then((d) => setLib(d.items || [])).catch(() => {});
    }
  }, [open, lib.length]);

  /** Natural pixel width, so we can flag a photo that will look soft before it ships. */
  async function measureWidth(file: File): Promise<number> {
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      await new Promise<void>((ok, fail) => {
        img.onload = () => ok();
        img.onerror = () => fail(new Error("decode"));
        img.src = url;
      });
      return img.naturalWidth;
    } catch {
      return 0; // unknown — don't block the upload over it
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function upload(file: File) {
    setBusy(true);
    setNote(null);
    const width = await measureWidth(file);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        setNote({ kind: "error", text: `Upload failed (${res.status}). Try again.` });
        return;
      }
      const d = await res.json();
      onChange(d.ref);
      setLib((l) => [{ id: d.id ?? Date.now(), ref: d.ref }, ...l]);
      if (width && width < MIN_SHARP_WIDTH) {
        setNote({
          kind: "warn",
          text: `Saved, but this photo is only ${width}px wide — it will look soft on phones and big screens. Re-upload the original (${MIN_SHARP_WIDTH}px+) if you have it.`,
        });
      }
    } catch {
      setNote({ kind: "error", text: "Upload failed — check your connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-1 text-sm text-white/80">{label}</div>
      <div className="flex items-center gap-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-xs text-white/40">none</div>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="btn-accent cursor-pointer text-sm">
            {busy ? "Uploading…" : "Upload new"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </label>
          <button type="button" onClick={() => setOpen((o) => !o)} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5">
            {open ? "Close library" : "Pick from library"}
          </button>
        </div>
      </div>
      {note && (
        <p
          className={`mt-2 rounded-lg border px-3 py-2 text-xs ${
            note.kind === "error"
              ? "border-red-500/40 bg-red-500/10 text-red-200"
              : "border-amber-400/40 bg-amber-400/10 text-amber-200"
          }`}
        >
          {note.text}
        </p>
      )}
      {open && (
        <div className="mt-3 grid max-h-64 grid-cols-6 gap-2 overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-2">
          {lib.map((i) => (
            <button key={i.ref} type="button" onClick={() => { onChange(i.ref); setOpen(false); }}
              className="aspect-square overflow-hidden rounded border border-white/10 hover:ring-2 ring-[var(--accent)]">
              <img src={i.ref} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
          {lib.length === 0 && <div className="col-span-6 p-4 text-center text-sm text-white/40">Loading…</div>}
        </div>
      )}
    </div>
  );
}
