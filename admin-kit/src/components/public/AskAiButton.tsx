"use client";

/** Opens the floating chat panel; ChatWidget listens for this event. */
export default function AskAiButton({
  className,
  children,
  ...rest
}: { className?: string; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label="Ask our AI assistant"
      onClick={() => window.dispatchEvent(new Event("site:open-chat"))}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}
