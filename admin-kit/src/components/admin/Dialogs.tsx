"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type ConfirmOptions = {
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red styling + cancel focused by default, for anything destructive. */
  danger?: boolean;
};

type Toast = { id: number; text: string; kind: "ok" | "error" };

type Ctx = {
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
  toast: (text: string, kind?: "ok" | "error") => void;
};

const DialogCtx = createContext<Ctx | null>(null);

export function useConfirm() {
  const ctx = useContext(DialogCtx);
  if (!ctx) throw new Error("useConfirm must be used inside <Dialogs>");
  return ctx.confirm;
}

export function useToast() {
  const ctx = useContext(DialogCtx);
  if (!ctx) throw new Error("useToast must be used inside <Dialogs>");
  return ctx.toast;
}

export default function Dialogs({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<ConfirmOptions | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const resolver = useRef<((v: boolean) => void) | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const nextId = useRef(1);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setPending(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const toast = useCallback((text: string, kind: "ok" | "error" = "ok") => {
    if (kind === "ok") window.dispatchEvent(new Event("site:saved")); // live preview panel listens
    const id = nextId.current++;
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const settle = useCallback((value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setPending(null);
  }, []);

  // Escape cancels; focus starts on Cancel so a stray Enter never destroys anything.
  useEffect(() => {
    if (!pending) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") settle(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, settle]);

  return (
    <DialogCtx.Provider value={{ confirm, toast }}>
      {children}

      {pending ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-5"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f140f] p-6 shadow-2xl">
            <h2 id="confirm-title" className="font-display text-2xl leading-tight">
              {pending.title}
            </h2>
            {pending.body ? <p className="mt-2 text-sm text-white/60">{pending.body}</p> : null}
            <div className="mt-6 flex justify-end gap-2">
              <button
                ref={cancelRef}
                type="button"
                onClick={() => settle(false)}
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
              >
                {pending.cancelLabel || "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => settle(true)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  pending.danger
                    ? "bg-red-500 text-white hover:brightness-110"
                    : "bg-[var(--accent)] text-black hover:brightness-110"
                }`}
              >
                {pending.confirmLabel || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[210] flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-2xl ${
              t.kind === "error"
                ? "border-red-500/40 bg-[#1a0f0f] text-red-100"
                : "border-[var(--accent)]/40 bg-[#0f140f] text-white"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </DialogCtx.Provider>
  );
}
