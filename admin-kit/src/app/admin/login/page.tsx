"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"owner" | "staff">("owner");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const body = tab === "owner" ? { mode: "owner", password } : { mode: "staff", name, pin };
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (res.ok) {
      router.push(tab === "owner" ? "/admin" : "/admin/staff");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setErr(d.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#0a0e0a] px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-[#12161200] border border-white/10 bg-[#141814] p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="text-xl font-extrabold text-white">Admin</div>
          <span className="text-xs font-bold tracking-widest text-[var(--accent)]">TEAM PORTAL</span>
        </div>
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-full bg-black/40 p-1">
          <button type="button" onClick={() => setTab("owner")}
            className={`rounded-full py-2 text-sm font-semibold ${tab === "owner" ? "bg-[var(--accent)] text-black" : "text-white/70"}`}>Owner</button>
          <button type="button" onClick={() => setTab("staff")}
            className={`rounded-full py-2 text-sm font-semibold ${tab === "staff" ? "bg-[var(--accent)] text-black" : "text-white/70"}`}>Staff Clock-In</button>
        </div>
        {tab === "owner" ? (
          <label className="block text-sm">
            <span className="text-white/80">Owner password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus
              className="mt-1 w-full rounded-lg bg-black/50 px-3 py-2 text-white outline-none focus:ring-2 ring-[var(--accent)]" />
          </label>
        ) : (
          <div className="space-y-3">
            <label className="block text-sm">
              <span className="text-white/80">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg bg-black/50 px-3 py-2 text-white outline-none focus:ring-2 ring-[var(--accent)]" />
            </label>
            <label className="block text-sm">
              <span className="text-white/80">PIN</span>
              <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric"
                className="mt-1 w-full rounded-lg bg-black/50 px-3 py-2 text-white outline-none focus:ring-2 ring-[var(--accent)]" />
            </label>
          </div>
        )}
        {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
        <button disabled={busy} className="mt-5 w-full rounded-full bg-[var(--accent)] py-2.5 font-bold text-black disabled:opacity-60">
          {busy ? "…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
