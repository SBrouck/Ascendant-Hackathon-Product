"use client";

import { type ReactNode } from "react";
import { Calendar, Layers, Leaf, SlidersHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { scenarioOptions, useAppState } from "@/lib/state";
import { cn } from "@/lib/utils";

const DATE_RANGES = ["Jul – Nov 2025", "FY 2025", "Trailing 6 months", "Last shock window"];

type GlobalToolbarProps = {
  className?: string;
};

export function GlobalToolbar({ className }: GlobalToolbarProps) {
  const {
    dateRange,
    setDateRange,
    scenario,
    setScenario,
    inclusion,
    setInclusion,
    carbonAware,
    setCarbonAware,
    regimeStress,
    setRegimeStress,
  } = useAppState();

  return (
    <div
      className={cn(
        "sticky top-28 z-40 flex flex-col gap-4 rounded-2xl border border-white/6 bg-white/4 px-6 py-4 shadow-[0_24px_60px_rgba(10,8,30,0.35)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Scenario controls</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground/60">
          <Badge className="rounded-full border border-white/10 bg-iris-500/15 text-iris-300">Inclusive-first</Badge>
          <Badge className="rounded-full border border-white/10 bg-white/10 text-muted-foreground/80">Synthetic data</Badge>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[repeat(5,minmax(0,1fr))]">
        <ToolbarCard label="Date range">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between rounded-xl border border-white/5 bg-white/5 text-sm text-foreground">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-iris-300" />
                  {dateRange}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-white/10 bg-panel/95 text-sm">
              {DATE_RANGES.map((range) => (
                <DropdownMenuItem key={range} onClick={() => setDateRange(range)}>
                  {range}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </ToolbarCard>
        <ToolbarCard label="Scenario">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full justify-between rounded-xl bg-iris-500/20 text-sm text-iris-300">
                <span className="inline-flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  {scenario}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-white/10 bg-panel/95 text-sm">
              {scenarioOptions.map((option) => (
                <DropdownMenuItem key={option} onClick={() => setScenario(option)}>
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </ToolbarCard>
        <ToolbarCard label="Inclusion floor">
          <div className="flex items-center gap-3">
            <Slider
              value={[inclusion]}
              onValueChange={([value]) => setInclusion(value)}
              max={100}
              min={40}
              step={1}
              className="flex-1"
            />
            <Badge className="rounded-full border border-white/10 bg-inclusion/15 text-inclusion">{inclusion}%</Badge>
          </div>
        </ToolbarCard>
        <ToolbarCard label="Regime stress">
          <div className="flex items-center gap-3">
            <Slider
              value={[regimeStress]}
              onValueChange={([value]) => setRegimeStress(value)}
              max={100}
              min={0}
              step={5}
              className="flex-1"
            />
            <Badge className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-iris-500/15 text-iris-300">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {regimeStress}
            </Badge>
          </div>
        </ToolbarCard>
        <ToolbarCard label="Carbon aware">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground/80">Toggle offsets</span>
            <Switch checked={carbonAware} onCheckedChange={setCarbonAware} />
            <Leaf className={cn("h-4 w-4", carbonAware ? "text-success" : "text-muted-foreground/40")} />
          </div>
        </ToolbarCard>
      </div>
    </div>
  );
}

type ToolbarCardProps = {
  label: string;
  children: ReactNode;
};

function ToolbarCard({ label, children }: ToolbarCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/6 bg-white/4 p-3 text-sm text-foreground/90">
      <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground/70">{label}</span>
      {children}
    </div>
  );
}
