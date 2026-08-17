"use client";
import { useState } from "react";
import { Card, inputClass } from "@/components/admin/ui";

export default function PasswordCard() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit() {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      setPassword("");
      setMsg("Password updated.");
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error || "Failed to update password.");
    }
  }

  return (
    <Card>
      <h2 className="mb-1 font-display text-xl">Change owner password</h2>
      <p className="mb-3 text-sm text-white/50">Minimum 6 characters.</p>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className={`${inputClass} max-w-xs`}
        />
        <button type="button" onClick={submit} disabled={busy || password.length < 6} className="btn-accent text-sm disabled:opacity-50">
          {busy ? "Saving…" : "Update"}
        </button>
        {msg && <span className="text-sm text-white/60">{msg}</span>}
      </div>
    </Card>
  );
}
