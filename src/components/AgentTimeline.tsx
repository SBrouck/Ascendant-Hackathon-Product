"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type AgentStep = {
  id: string;
  label: string;
  artifact: string;
  notes: string;
};

type AgentTimelineProps = {
  steps?: AgentStep[];
  className?: string;
};

const DEFAULT_STEPS: AgentStep[] = [
  { id: "data", label: "Data", artifact: "/runs/2025-11-13/data/intake.parquet", notes: "Ingested demand, tariffs, carbon scope" },
  { id: "entity", label: "Entity", artifact: "/runs/2025-11-13/entity/graph.json", notes: "Reconciled suppliers & inclusive flags" },
  { id: "risk", label: "Risk", artifact: "/runs/2025-11-13/risk/monte-carlo.feather", notes: "Simulated 10k shocks with CVaR scoring" },
  { id: "inclusion", label: "Inclusion", artifact: "/runs/2025-11-13/inclusion/audit.md", notes: "Validated dual sourcing threshold ≥ 1.5" },
  { id: "tariff", label: "Tariff", artifact: "/runs/2025-11-13/tariff/reclass.xlsx", notes: "Applied HS differentials and duty abatement" },
  { id: "optimizer", label: "Optimizer", artifact: "/runs/2025-11-13/optimizer/pareto.csv", notes: "Pareto solved 40 candidate policies" },
  { id: "twin", label: "Twin", artifact: "/runs/2025-11-13/twin/forecast.json", notes: "Stress tested Shock A / Shock B" },
  { id: "presenter", label: "Presenter", artifact: "/runs/2025-11-13/presenter/brief.html", notes: "Packaged slides + data room" },
];

export function AgentTimeline({ steps = DEFAULT_STEPS, className }: AgentTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [steps.length]);

  const latestLog = useMemo(() => steps.slice(0, activeIndex + 1).reverse(), [steps, activeIndex]);
  const progress = ((activeIndex + 1) / steps.length) * 100;

  return (
    <div className={className ?? "glass-panel rounded-[20px] border border-white/8 p-6"}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground/70">
            Scenario agent timeline
          </h3>
          <p className="mt-1 text-sm text-muted-foreground/80">
            Live capture of the latest agentic run with artifact checkpoints.
          </p>
        </div>
        <Badge className="gap-2 rounded-full border border-white/10 bg-iris-500/15 text-iris-300">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="inline-block h-3 w-3 rounded-full border-2 border-iris-300"
          />
          Streaming
        </Badge>
      </div>
      <div className="mt-6">
        <div className="relative mb-6">
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/10" aria-hidden />
          <motion.div
            className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-iris-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          <div className="relative flex flex-wrap items-center justify-between gap-3">
            {steps.map((step, index) => {
              const state = index === activeIndex ? "active" : index < activeIndex ? "complete" : "pending";
              return (
                <button
                  key={step.id}
                  type="button"
                  className={cn(
                    "relative flex min-w-[90px] flex-col items-center gap-1 rounded-full border px-3 py-2 text-xs transition",
                    state === "complete"
                      ? "border-resilience/40 bg-resilience/10 text-resilience"
                      : state === "active"
                        ? "border-iris-500/60 bg-iris-500/15 text-foreground"
                        : "border-white/10 bg-white/5 text-muted-foreground/70",
                  )}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="font-medium tracking-wide">{step.label}</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">Step {index + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div className="space-y-3 text-sm text-muted-foreground/85">
            {steps.map((step, index) => {
              const state = index === activeIndex ? "active" : index < activeIndex ? "complete" : "pending";
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={cn(
                    "rounded-xl border px-4 py-3",
                    state === "active"
                      ? "border-iris-500/40 bg-iris-500/10"
                      : state === "complete"
                        ? "border-resilience/30 bg-resilience/10"
                        : "border-white/8 bg-white/4",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-foreground/90">{step.label}</p>
                    <a
                      href={step.artifact}
                      className="text-[11px] uppercase tracking-[0.24em] text-iris-300 underline-offset-4 hover:underline"
                    >
                      View artifact
                    </a>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground/75">{step.notes}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="rounded-xl border border-white/8 bg-white/5 p-4">
            <h4 className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">Latest artifacts</h4>
            <ScrollArea className="mt-3 h-48 pr-2">
              <ul className="space-y-3 text-xs text-muted-foreground/80">
                {latestLog.map((step) => (
                  <li key={step.id} className="rounded-lg border border-white/8 bg-white/6 p-3">
                    <p className="font-semibold text-foreground/90">{step.label}</p>
                    <a
                      href={step.artifact}
                      className="mt-1 block font-mono text-[11px] text-iris-300 underline-offset-4 hover:underline"
                    >
                      {step.artifact}
                    </a>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/70">{step.notes}</p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
