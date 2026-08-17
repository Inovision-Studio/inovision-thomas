"use client";

import { useState, useTransition } from "react";
import ImagePicker from "@/components/admin/ImagePicker";
import { useConfirm, useToast } from "@/components/admin/Dialogs";
import { saveBrand } from "./actions";

/** Logo + favicon. Both are optional — empty means the shipped files. */
export default function BrandForm({ initialLogo, initialFavicon }: { initialLogo: string; initialFavicon: string }) {
  const [logo, setLogo] = useState(initialLogo);
  const [favicon, setFavicon] = useState(initialFavicon);
  const [saved, setSaved] = useState({ logo: initialLogo, favicon: initialFavicon });
  const [pending, start] = useTransition();
  const toast = useToast();
  const confirm = useConfirm();
  const dirty = logo !== saved.logo || favicon !== saved.favicon;

  async function apply() {
    if (!(await confirm({ title: "Apply this logo and favicon to the live site?", confirmLabel: "Apply" }))) return;
    start(async () => {
      const res = await saveBrand({ logo_ref: logo, favicon_ref: favicon });
      if (!res.ok) return toast(res.error, "error");
      setSaved({ logo, favicon });
      toast("Logo and favicon applied");
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-start">
      <div className="card p-4">
        <ImagePicker label="Logo (header, footer, menu, age gate)" value={logo} onChange={setLogo} />
        <p className="mt-2 text-xs text-white/45">Transparent WebP or PNG works best. {logo ? "" : "Currently using the shipped logo."}</p>
        {logo ? (
          <button type="button" onClick={() => setLogo("")} className="mt-1 text-xs text-white/50 hover:text-white">
            Use shipped logo
          </button>
        ) : null}
      </div>
      <div className="card p-4">
        <ImagePicker label="Favicon (browser tab icon)" value={favicon} onChange={setFavicon} />
        <p className="mt-2 text-xs text-white/45">Square image, at least 64×64. {favicon ? "" : "Currently none set."}</p>
        {favicon ? (
          <button type="button" onClick={() => setFavicon("")} className="mt-1 text-xs text-white/50 hover:text-white">
            Remove favicon
          </button>
        ) : null}
      </div>
      <button type="button" onClick={apply} disabled={!dirty || pending} className="btn-accent text-sm disabled:opacity-50">
        {pending ? "Applying…" : "Apply brand"}
      </button>
    </div>
  );
}
