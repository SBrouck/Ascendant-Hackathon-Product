"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Radar } from "lucide-react";
import { GlobalToolbar } from "@/components/GlobalToolbar";
import { KpiTile } from "@/components/KpiTile";
import { ParetoChart } from "@/components/ParetoChart";
import { TopActions } from "@/components/TopActions";
import { scoreboard, paretoPoints, topActions } from "@/data/seed";
import { useAppState } from "@/lib/state";

const KPI_CONFIG = [
  {
    key: "tailP95",
    label: "Tail P95",
    unit: " hrs",
    help: "Exceeded by only one in twenty deliveries; lower is safer.",
    goodWhen: "lower" as const,
    intent: "risk" as const,
  },
  {
    key: "cvar95",
    label: "CVaR95",
    unit: " hrs",
    help: "Average among the worst 5% deliveries.",
    goodWhen: "lower" as const,
    intent: "risk" as const,
  },
  {
    key: "dualPct",
    label: "Dual-sourcing %",
    unit: "%",
    help: "Share of site×SKU pairs with two viable suppliers.",
    goodWhen: "higher" as const,
    intent: "risk" as const,
  },
  {
    key: "hhi",
    label: "Site HHI",
    help: "Herfindahl index for active sites; lower is healthier.",
    goodWhen: "lower" as const,
    intent: "risk" as const,
  },
  {
    key: "clic",
    label: "CLIC %",
    unit: "%",
    help: "Inclusive coverage on critical site×SKU pairs.",
    goodWhen: "higher" as const,
    intent: "inclusion" as const,
  },
  {
    key: "indepth",
    label: "INDEPTH",
    help: "Average count of inclusive suppliers on critical pairs.",
    goodWhen: "higher" as const,
    intent: "inclusion" as const,
  },
  {
    key: "costDelta",
    label: "Landed cost Δ %",
    unit: "%",
    help: "Scenario landed cost change vs base.",
    goodWhen: "lower" as const,
    intent: "risk" as const,
  },
  {
    key: "co2Delta",
    label: "CO₂ Δ %",
    unit: "%",
    help: "Scope 3 intensity change vs base.",
    goodWhen: "lower" as const,
    intent: "risk" as const,
  },
] as const;

export default function OverviewPage() {
  const { selectedPareto, setSelectedPareto, selectedAction, setSelectedAction } = useAppState();

  const highlightRank =
    selectedAction?.rank ?? (selectedPareto ? (paretoPoints.findIndex((point) => point.name === selectedPareto.name) % topActions.length) + 1 : undefined);

  const kpis = KPI_CONFIG.map((config) => {
    const metric = scoreboard[config.key as keyof typeof scoreboard];
    let value = metric.scen;
    let baseline = metric.base;

    if (selectedPareto) {
      switch (config.key) {
        case "cvar95":
          value = Number(selectedPareto.cvar.toFixed(1));
          break;
        case "clic":
          value = selectedPareto.clic;
          break;
        case "indepth":
          value = Number(selectedPareto.indepth.toFixed(1));
          break;
        case "costDelta":
          value = Number(selectedPareto.costDelta.toFixed(1));
          baseline = metric.base;
          break;
        default:
          break;
      }
    }

    return {
      label: config.label,
      unit: config.unit,
      help: config.help,
      goodWhen: config.goodWhen,
      intent: config.intent,
      value,
      baseline,
    };
  });

  return (
    <div className="space-y-10">
      <section className="hero-gradient glass-panel-strong overflow-hidden rounded-[26px] px-8 py-12 text-left">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-3xl space-y-5"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-1 text-[11px] uppercase tracking-[0.32em] text-muted-foreground/80">
            <Radar className="h-3.5 w-3.5 text-iris-300" /> Pareto scenario brief
          </span>
          <h1 className="text-5xl font-semibold leading-tight text-foreground md:text-6xl">
            Resilience and inclusion, engineered on the Pareto frontier.
          </h1>
          <p className="text-lg text-muted-foreground/90 md:text-xl">
            Compare baseline vs optimized awards, surface inclusive risk actions, and export the scenario that keeps your tail in check.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground/80">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/8 px-3 py-1">
              <ArrowUpRight className="h-3.5 w-3.5 text-iris-300" /> Focus current point to sync tiles and actions
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/8 px-3 py-1">
              Agentic run · Synthetic data
            </span>
          </div>
        </motion.div>
      </section>

      <GlobalToolbar />

      <section
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        aria-label="Key performance indicators"
      >
        {kpis.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.25, ease: "easeOut" }}
          >
            <KpiTile
              intent={item.intent}
              label={item.label}
              value={item.value}
              baseline={item.baseline}
              delta={item.value - item.baseline}
              unit={item.unit}
              help={item.help}
            />
          </motion.div>
        ))}
      </section>

      <section className="space-y-6">
        <ParetoChart
          points={paretoPoints}
          selectedName={selectedPareto?.name}
          onSelect={(point) => {
            setSelectedPareto(point);
            const pointIndex = paretoPoints.findIndex((p) => p.name === point.name);
            if (pointIndex >= 0) {
              const mappedAction = topActions[pointIndex % topActions.length];
              setSelectedAction(mappedAction);
            }
          }}
        />
        <TopActions
          rows={topActions}
          activeRank={highlightRank}
          onSendToScenario={(row) => {
            setSelectedAction(row);
          }}
        />
      </section>
    </div>
  );
}
