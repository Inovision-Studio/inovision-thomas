import { j as e } from "./jsx-runtime.ClP7wGfN.js";
import { r as o } from "./index.DK-fsZOb.js";
import { A as U } from "./AdminShell.qrEY5bww.js";

function TeamMembersEditorPage() {
  const [items, setItems] = o.useState([]);
  const [library, setLibrary] = o.useState([]);
  const [saving, setSaving] = o.useState(false);
  const [saved, setSaved] = o.useState(false);
  const [uploading, setUploading] = o.useState(false);
  function loadLib() {
    fetch("/api/admin/media").then((r) => r.json()).then((d) => setLibrary(d.items || []));
  }
  o.useEffect(() => {
    fetch("/api/admin/team-members").then((r) => r.json()).then(
      (d) => setItems((d.items || []).map((m) => ({ name: m.name || "", title: m.title || "", image: m.image || "" })))
    );
    loadLib();
  }, []);
  const dirty = () => setSaved(false);
  const move = (i, d) => {
    setItems((arr) => {
      const n = [...arr];
      const j = i + d;
      if (j < 0 || j >= n.length) return n;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
    dirty();
  };
  const remove = (i) => {
    setItems((a) => a.filter((_, k) => k !== i));
    dirty();
  };
  const edit = (i, k, v) => {
    setItems((a) => a.map((it, idx) => idx === i ? { ...it, [k]: v } : it));
    dirty();
  };
  const add = () => {
    setItems((a) => [{ name: "", title: "", image: "" }, ...a]);
    dirty();
  };
  async function upload(i, files) {
    const f = files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const r = await fetch("/api/admin/media", { method: "POST", body: fd });
      const d = await r.json();
      if (d?.url) edit(i, "image", d.url);
      loadLib();
    } catch {
    }
    setUploading(false);
  }
  async function save() {
    setSaving(true);
    try {
      await fetch("/api/admin/team-members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items }) });
      setSaved(true);
    } catch {
    }
    setSaving(false);
  }
  return e.jsx(U, { active: "team-members", title: "Team Members", subtitle: "Add, remove, reorder, and edit the public team roster.", children: e.jsxs("div", { className: "tool", children: [
    e.jsxs("div", { className: "tool-row", children: [
      e.jsx("button", { className: "tool-btn", onClick: add, children: "Add member" }),
      e.jsx("button", { className: "tool-btn", disabled: saving, onClick: save, children: saving ? "Saving…" : "Save & publish" }),
      saved && e.jsx("span", { className: "tool-label", style: { margin: 0, color: "#58d6a0" }, children: "Saved — live." }),
      e.jsxs("span", { className: "tool-label", style: { margin: 0 }, children: [items.length, " members"] })
    ] }),
    e.jsx("div", { className: "gal-list", children: items.map((it, i) => e.jsxs("div", { className: "gal-row", children: [
      it.image ? e.jsx("img", { className: "gal-thumb", src: it.image, alt: it.name }) : e.jsx("div", { className: "gal-thumb", style: { display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#888" }, children: "No photo" }),
      e.jsxs("div", { className: "gal-fields", children: [
        e.jsx("input", { className: "tool-input", value: it.name, placeholder: "Name", onChange: (ev) => edit(i, "name", ev.target.value) }),
        e.jsx("input", { className: "tool-input", value: it.title, placeholder: "Title", onChange: (ev) => edit(i, "title", ev.target.value) }),
        e.jsx("input", { type: "file", accept: "image/*", disabled: uploading, onChange: (ev) => upload(i, ev.target.files) })
      ] }),
      e.jsxs("div", { className: "gal-act", children: [
        e.jsx("button", { className: "tool-chip", onClick: () => move(i, -1), title: "Up", children: "↑" }),
        e.jsx("button", { className: "tool-chip", onClick: () => move(i, 1), title: "Down", children: "↓" }),
        e.jsx("button", { className: "tool-chip", onClick: () => remove(i), title: "Remove", children: "✕" })
      ] })
    ] }, i)) })
  ] }) });
}

export { TeamMembersEditorPage as default };
