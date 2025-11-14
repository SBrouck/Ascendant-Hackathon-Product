"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6 md:px-12">
        <header className="sticky top-3 z-50 sm:top-6">
          <div className="glass-panel-strong hero-gradient flex items-center justify-between gap-4 rounded-[18px] border border-white/8 px-4 py-3 shadow-soft backdrop-blur-xl sm:gap-6 sm:px-6 sm:py-4">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <img
                src="/dff1725e4e1a7aaba55a70695693080dc10e306f5196afd47c30522fe8ffb648.tiff"
                alt="Pareto logo"
                className="h-10 w-10 flex-shrink-0 object-contain sm:h-14 sm:w-14"
                onError={(e) => {
                  console.error("Logo failed to load:", e);
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="hidden sm:block">
                <p className="text-lg font-semibold text-foreground">Pareto</p>
                <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground/80">Agentic supply intelligence</p>
              </div>
              <div className="sm:hidden">
                <p className="text-base font-semibold text-foreground">Pareto</p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-wrap items-center gap-2 text-sm">
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

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-foreground hover:bg-white/10 transition"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] border-l border-white/10 bg-panel/98 backdrop-blur-xl">
                <nav className="mt-8 flex flex-col gap-2">
                  {NAV_ITEMS.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "rounded-xl px-4 py-3 text-sm font-medium transition",
                          active
                            ? "bg-iris-500/25 text-foreground"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <main className="mt-6 flex-1 space-y-6 pb-12 sm:mt-10 sm:space-y-10 sm:pb-16">{children}</main>
        <footer className="mt-auto rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-[10px] text-muted-foreground/80 sm:px-6 sm:py-4 sm:text-xs">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <span>Sources: ACE data abstractions, synthetic inclusive supplier registers.</span>
            <span>All visuals use synthetic demo data.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
