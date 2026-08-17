"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Msg = { role: "user" | "model"; text: string };

export type ChatBrand = { name: string; avatar: string; greeting: string; suggestions: string[] };

export default function ChatWidget({ brand }: { brand: ChatBrand }) {
  const SUGGESTIONS = brand.suggestions;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const pathname = usePathname();

  // A fixed launcher always overlaps something; on small phones it landed on the
  // hero headline. Hold it back until the visitor scrolls past the hero.
  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  // mascot easter egg opens the chat
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener("site:open-chat", open);
    return () => window.removeEventListener("site:open-chat", open);
  }, []);

  if (pathname.startsWith("/admin") || pathname.startsWith("/clock")) return null;

  async function send(text: string) {
    const clean = text.trim().slice(0, 600);
    if (!clean || isTyping) return;
    const next: Msg[] = [...messages, { role: "user", text: clean }];
    setMessages(next);
    setInput("");
    setIsTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json().catch(() => null);
      setMessages((m) => [...m, { role: "model", text: data?.reply || "Something went wrong — try again!" }]);
    } catch {
      setMessages((m) => [...m, { role: "model", text: "Connection hiccup — try again in a sec." }]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <>
      {/* floating launcher */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-9 right-24 z-[90] hidden lg:inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0c100c]/95 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur transition hover:border-[color:var(--accent)]/60"
        >
          <span className="h-2 w-2 rounded-full bg-[color:var(--accent)] animate-pulse" aria-hidden />
          Ask {brand.name} AI
          <span className="text-[color:var(--muted)]">· hours, prices, products</span>
        </button>
      ) : null}
      <button
        type="button"
        aria-label={isOpen ? "Hide chat" : `Chat with ${brand.name}`}
        onClick={() => setIsOpen((v) => !v)}
        className={`fixed bottom-5 right-5 z-[90] hidden lg:flex h-12 w-12 items-center justify-center rounded-full lg:h-16 lg:w-16 border border-white/15 bg-[#0c100c] shadow-[0_2px_10px_-2px_rgba(255,90,31,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen ? "scale-90" : ""
        }`}
      >
        {isOpen ? (
          <span className="text-2xl">✕</span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brand.avatar} alt="" className="h-9 w-9 object-contain lg:h-12 lg:w-12" />
        )}
      </button>

      {/* panel */}
      <div
        className={`fixed z-[89] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c100c] shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        } bottom-[84px] right-5 left-5 top-20 sm:left-auto sm:top-auto sm:h-[520px] sm:w-[380px] lg:bottom-24`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 bg-[color:var(--accent)]/10 px-4 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={brand.avatar} alt="" className="h-9 w-9 object-contain" />
          <div>
            <p className="font-display text-lg leading-none">{brand.name}</p>
            <p className="text-xs text-[color:var(--muted)]">Ask me anything about us</p>
          </div>
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => setIsOpen(false)}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-lg active:scale-95"
          >
            ✕
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="space-y-3">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/5 px-3 py-2 text-sm">
                {brand.greeting}
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-[color:var(--accent)]/40 px-3 py-1.5 text-xs text-[color:var(--accent)] transition-colors hover:bg-[color:var(--accent)]/10 active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                m.role === "user"
                  ? "ml-auto rounded-tr-sm bg-[color:var(--accent)] text-[#04120a]"
                  : "rounded-tl-sm bg-white/5"
              }`}
            >
              {m.text}
            </div>
          ))}

          {isTyping ? (
            <div className="flex w-14 items-center justify-center gap-1 rounded-2xl rounded-tl-sm bg-white/5 px-3 py-3">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--muted)]"
                  style={{ animationDelay: `${d * 150}ms` }}
                />
              ))}
            </div>
          ) : null}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-white/10 p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={600}
            placeholder="Type a message…"
            className="min-w-0 flex-1 rounded-full bg-white/5 px-4 py-2.5 text-sm outline-none ring-[color:var(--accent)] placeholder:text-[color:var(--muted)] focus:ring-2"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            aria-label="Send"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)] text-[#04120a] transition-transform active:scale-90 disabled:opacity-50"
          >
            ➤
          </button>
        </form>
      </div>
    </>
  );
}
