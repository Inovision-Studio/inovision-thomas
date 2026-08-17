import { lines, text } from "./content";

type S = Record<string, string>;

/** Business display name (never empty). */
export const bizName = (s: S) => (s.business_name || "").trim() || "Your Store";
/** Logo URL with the shipped placeholder as fallback. */
export const logoOf = (s: S) => s.logo_ref?.trim() || "/logo.svg";
/** AI assistant display name: bot_name → business name. */
export const botName = (s: S) => text(s, "bot_name").trim() || bizName(s);
/** AI assistant avatar: bot_avatar_ref → mascot → logo. */
export const botAvatar = (s: S) => text(s, "bot_avatar_ref").trim() || text(s, "mascot_ref").trim() || logoOf(s);
/** Age gate: "" (off) or a number like "18"/"21". */
export const ageGate = (s: S) => (s.age_gate || "").trim().replace(/\D/g, "");

export function chatBrand(s: S) {
  return { name: botName(s), avatar: botAvatar(s), greeting: text(s, "chat_greeting"), suggestions: lines(s, "chat_suggestions") };
}
