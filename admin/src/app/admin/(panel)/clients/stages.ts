export const STAGES = ["onboarding", "design", "build", "review", "launched", "maintenance", "churned"] as const;
export type Stage = (typeof STAGES)[number];
/** Literal Tailwind classes per stage (no template-built class names). */
export const STAGE_PILL: Record<string, string> = {
  onboarding: "bg-white/10 text-white/80",
  design: "bg-purple-500/20 text-purple-200",
  build: "bg-blue-500/20 text-blue-200",
  review: "bg-amber-500/20 text-amber-200",
  launched: "bg-[var(--accent)]/20 text-[var(--accent)]",
  maintenance: "bg-emerald-500/20 text-emerald-200",
  churned: "bg-red-500/20 text-red-200",
};
export const money = (n: number) => `$${n.toFixed(2)}`;
