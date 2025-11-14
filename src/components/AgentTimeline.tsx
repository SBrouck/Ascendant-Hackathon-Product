"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % steps.length);
        setIsTransitioning(false);
      }, 400);
    }, 2800);
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

      {/* Timeline horizontale épurée */}
      <div className="mt-8">
        <div className="relative">
          {/* Ligne de progression de fond */}
          <div className="absolute left-0 right-0 top-6 h-0.5 bg-white/8" aria-hidden />
          
          {/* Ligne de progression active */}
          <motion.div
            className="absolute left-0 top-6 h-0.5 bg-gradient-to-r from-iris-500 to-success"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {/* Points de la timeline */}
          <div className="relative flex items-start justify-between gap-2">
            {steps.map((step, index) => {
              const state = index === activeIndex ? "active" : index < activeIndex ? "complete" : "pending";
              const isCurrent = index === activeIndex;
              
              return (
                <div key={step.id} className="relative flex flex-1 flex-col items-center">
                  {/* Point de la timeline */}
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="relative z-10 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105"
                  >
                    {/* Cercle du point */}
                    <div className="relative">
                      {state === "complete" ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-success/20 border-2 border-success"
                        >
                          <CheckCircle2 className="h-6 w-6 text-success" />
                        </motion.div>
                      ) : state === "active" ? (
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-iris-500/20 border-2 border-iris-500"
                        >
                          {isTransitioning ? (
                            <Loader2 className="h-5 w-5 text-iris-300 animate-spin" />
                          ) : (
                            <motion.div
                              className="h-3 w-3 rounded-full bg-iris-500"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [1, 0.7, 1],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          )}
                          {/* Anneau pulsant */}
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-iris-500"
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.6, 0, 0.6],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeOut",
                            }}
                          />
                        </motion.div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border-2 border-white/20">
                          <Circle className="h-4 w-4 text-muted-foreground/40 fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <div className="text-center">
                      <p className={cn(
                        "text-xs font-medium transition-colors",
                        state === "active" ? "text-foreground" : state === "complete" ? "text-success" : "text-muted-foreground/60"
                      )}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                        {index + 1}/{steps.length}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Détails de l'étape active */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 md:grid-cols-[2fr,1fr]"
          >
            <div className="rounded-xl border border-iris-500/30 bg-iris-500/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-sm font-semibold text-foreground">{steps[activeIndex].label}</h4>
                    <Badge className="rounded-full border border-iris-500/30 bg-iris-500/15 text-iris-300 text-[10px]">
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed">{steps[activeIndex].notes}</p>
                </div>
                <a
                  href={steps[activeIndex].artifact}
                  className="text-xs uppercase tracking-[0.2em] text-iris-300 hover:text-iris-200 underline-offset-4 hover:underline transition-colors whitespace-nowrap"
                >
                  View →
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/5 p-4">
              <h4 className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70 mb-3">Latest artifacts</h4>
              <ScrollArea className="h-48 pr-2">
                <ul className="space-y-2.5">
                  {latestLog.slice(0, 4).map((step) => (
                    <li key={step.id} className="rounded-lg border border-white/8 bg-white/6 p-2.5">
                      <p className="text-xs font-medium text-foreground/90">{step.label}</p>
                      <a
                        href={step.artifact}
                        className="mt-1 block font-mono text-[10px] text-iris-300/80 hover:text-iris-300 underline-offset-2 hover:underline truncate"
                      >
                        {step.artifact.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
