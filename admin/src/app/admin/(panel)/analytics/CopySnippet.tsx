"use client";
import { useToast } from "@/components/admin/Dialogs";

export default function CopySnippet({ code }: { code: string }) {
  const toast = useToast();
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      toast("Snippet copied");
    } catch {
      toast("Copy failed — select the code and copy it by hand", "error");
    }
  }
  return (
    <div>
      <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 text-xs leading-relaxed text-white/80"><code>{code}</code></pre>
      <button onClick={copy} className="btn-accent mt-3 text-sm">Copy snippet</button>
    </div>
  );
}
