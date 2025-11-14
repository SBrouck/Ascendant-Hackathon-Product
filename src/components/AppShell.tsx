"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/scenario-lab", label: "Scenario Lab" },
  { href: "/awards", label: "Award Builder" },
  { href: "/suppliers", label: "Supplier Explorer" },
  { href: "/about", label: "Sources & Methods" },
] as const;

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <svg className="absolute right-[-10%] top-[-20%] h-[480px] w-[480px]" viewBox="0 0 600 600" aria-hidden>
          <defs>
            <linearGradient id="irisBlur" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--iris-800)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--iris-300)" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <circle cx="300" cy="300" r="280" fill="url(#irisBlur)" />
        </svg>
      </div>
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 pb-16 pt-6 sm:px-12">
        <header className="sticky top-6 z-50">
          <div className="glass-panel-strong hero-gradient flex items-center justify-between gap-6 rounded-[18px] border border-white/8 px-6 py-4 shadow-soft backdrop-blur-xl">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden">
                <Image
                  src="/LOGOV0.png"
                  alt="Pareto logo"
                  width={44}
                  height={44}
                  className="h-full w-full object-contain"
                  priority
                  unoptimized
                  style={{ display: "block" }}
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">Pareto</p>
                <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground/80">Agentic supply intelligence</p>
              </div>
            </Link>
            <nav className="flex flex-wrap items-center gap-2 text-sm">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-full px-4 py-2 transition",
                      active
                        ? "bg-iris-500/25 text-foreground shadow-[0_12px_30px_rgba(20,12,60,0.35)]"
                        : "bg-white/5 text-muted-foreground hover:bg-white/8 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>
        <main className="mt-10 flex-1 space-y-10 pb-16">{children}</main>
        <footer className="mt-auto rounded-[16px] border border-white/10 bg-white/5 px-6 py-4 text-xs text-muted-foreground/80">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>Sources: ACE data abstractions, synthetic inclusive supplier registers.</span>
            <span>All visuals use synthetic demo data.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
