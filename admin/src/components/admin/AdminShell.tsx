"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NavIcon } from "./navIcons";
import Dialogs from "./Dialogs";
import { MODULES, canSee } from "@/lib/modules";

export type ShellUser = { name: string; email: string; role: "owner" | "staff"; permissions: string[] };

export default function AdminShell({ children, name, user, siteUrl }: { children: React.ReactNode; name: string; user: ShellUser; siteUrl: string }) {
  const visible = MODULES.filter((m) => canSee(user.role, user.permissions, m.key));
  const groups = [...new Set(visible.map((m) => m.group))].map((g) => ({ title: g, items: visible.filter((m) => m.group === g) }));
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // close the drawer whenever navigation lands on a new page
  useEffect(() => setIsOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <>
      <div className="mb-6 px-2">
        <div className="text-lg font-extrabold">{name}</div>
        <div className="text-[10px] font-bold tracking-widest text-[var(--accent)]">ADMIN</div>
      </div>
      <nav className="space-y-4">
        {groups.map((g, gi) => (
          <div key={gi} className="space-y-1">
            {g.title ? <div className="px-3 pt-1 text-[10px] font-bold tracking-widest text-white/35">{g.title.toUpperCase()}</div> : null}
            {g.items.map(({ href, label }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                active ? "nav-active" : "text-white/75 hover:bg-white/5"
              }`}
            >
              <NavIcon href={href} className={`h-4 w-4 shrink-0 ${active ? "" : "text-white/40"}`} />
              {label}
            </Link>
          );
        })}
          </div>
        ))}
      </nav>
      <div className="mt-6 space-y-1 border-t border-white/10 pt-4 text-sm">
        <div className="px-3 pb-1 text-xs text-white/45">
          <div className="truncate text-white/70">{user.name || user.email}</div>
          <div className="text-[10px] uppercase tracking-widest">{user.role}</div>
        </div>
        {siteUrl ? <a href={siteUrl} target="_blank" rel="noopener" className="block rounded-lg px-3 py-2.5 text-white/60 hover:bg-white/5">↗ View site</a> : null}
        <button onClick={logout} className="block w-full rounded-lg px-3 py-2.5 text-left text-white/60 hover:bg-white/5">
          Log out
        </button>
      </div>
    </>
  );

  return (
    <Dialogs>
    <div className="admin flex min-h-screen items-start">
      {/* phones: the 224px sidebar left only ~166px of usable width, so it becomes a drawer */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center gap-3 border-b border-white/10 bg-[#0d110d] px-4 py-3 lg:hidden">
        <div>
          <div className="text-base font-extrabold leading-none">{name}</div>
          <div className="text-[10px] font-bold tracking-widest text-[var(--accent)]">ADMIN</div>
        </div>
        <button
          type="button"
          aria-label="Open admin menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          className="ml-auto flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-lg border border-white/15 active:scale-95"
        >
          <span className="h-[2px] w-5 rounded-full bg-current" />
          <span className="h-[2px] w-5 rounded-full bg-current" />
          <span className="h-[2px] w-5 rounded-full bg-current" />
        </button>
      </header>

      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setIsOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] overflow-y-auto border-r border-white/10 bg-[#0d110d] p-4">
            <button
              type="button"
              aria-label="Close admin menu"
              onClick={() => setIsOpen(false)}
              className="mb-2 ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-lg"
            >
              ✕
            </button>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <aside className="hidden w-56 shrink-0 border-r border-white/10 bg-[#0d110d] p-4 lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto">
        {sidebar}
      </aside>

      <main className="admin-canvas min-w-0 flex-1 overflow-x-hidden p-4 pt-24 lg:p-8 lg:pt-8">{children}</main>
    </div>
    </Dialogs>
  );
}
