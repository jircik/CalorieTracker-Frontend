"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, BookOpen, BarChart3, User, LogOut } from "lucide-react";
import { useAuth } from "@/store/auth";
import { FatSecretAttribution } from "@/components/FatSecretAttribution";

const NAV = [
  { href: "/dashboard", label: "Dashboard", Icon: Home },
  { href: "/diary", label: "Diary", Icon: BookOpen },
  { href: "/history", label: "History", Icon: BarChart3 },
  { href: "/profile", label: "Profile", Icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, hydrated, name, clear } = useAuth();

  useEffect(() => {
    if (hydrated && !token) router.replace("/login");
  }, [hydrated, token, router]);

  if (!hydrated || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  const onLogout = () => {
    clear();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <Link href="/dashboard" aria-label="CalorieTracker home" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.svg" alt="" className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight text-[#085041]">
              CalorieTracker
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map(({ href, label, Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-slate-600 sm:inline">{name}</span>
            <button
              onClick={onLogout}
              className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Log out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 sm:pb-10">
        {children}
      </main>

      <footer className="mx-auto w-full max-w-5xl px-4 pb-24 text-center text-xs text-slate-400 sm:pb-6">
        <FatSecretAttribution />
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white sm:hidden">
        <div className="mx-auto grid max-w-5xl grid-cols-4">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-medium ${
                  active ? "text-emerald-700" : "text-slate-500"
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
