"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    setBusy(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setErr(d.error || "Login failed");
    }
  }

  const field = "mt-1 w-full rounded-lg bg-black/50 px-3 py-2 text-white outline-none focus:ring-2 ring-[var(--accent)]";
  return (
    <div className="admin grid min-h-screen place-items-center bg-[#0a0e0a] px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141814] p-8 shadow-2xl">
        <div className="mb-6">
          <div className="font-display text-3xl text-white">Inovision Studios</div>
          <span className="text-xs font-bold tracking-widest text-[var(--accent)]">TEAM PORTAL</span>
        </div>
        <label className="block text-sm">
          <span className="text-white/80">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus autoComplete="username" className={field} />
        </label>
        <label className="mt-3 block text-sm">
          <span className="text-white/80">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className={field} />
        </label>
        {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
        <button disabled={busy} className="mt-5 w-full rounded-full bg-[var(--accent)] py-2.5 font-bold text-black disabled:opacity-60">
          {busy ? "…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
