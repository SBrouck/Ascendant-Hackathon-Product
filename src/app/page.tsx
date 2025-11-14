"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Radar } from "lucide-react";
import { GlobalToolbar } from "@/components/GlobalToolbar";
import { KpiTile } from "@/components/KpiTile";
import { ParetoChart } from "@/components/ParetoChart";
import { TopActions } from "@/components/TopActions";
import { scoreboard, paretoPoints, topActions } from "@/data/seed";
import { useAppState } from "@/lib/state";

type KpiConfig = {
  key: keyof typeof scoreboard;
  label: string;
  unit?: string;
  help: string;
  goodWhen: "higher" | "lower";
  intent: "risk" | "inclusion";
};

const KPI_CONFIG: Readonly<KpiConfig[]> = [
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
    let value = Number(metric.scen);
    let baseline = Number(metric.base);

    if (selectedPareto) {
      switch (config.key) {
        case "cvar95":
          value = Number(selectedPareto.cvar.toFixed(1));
          break;
        case "clic":
          value = Number(selectedPareto.clic);
          break;
        case "indepth":
          value = Number(selectedPareto.indepth.toFixed(1));
          break;
        case "costDelta":
          value = Number(selectedPareto.costDelta.toFixed(1));
          baseline = Number(metric.base);
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
      <section className="hero-gradient glass-panel-strong overflow-hidden rounded-[20px] px-4 py-8 text-left sm:rounded-[26px] sm:px-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-3xl space-y-4 sm:space-y-5"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] uppercase tracking-[0.32em] text-muted-foreground/80 sm:px-4 sm:text-[11px]">
            <Radar className="h-3 w-3 text-iris-300 sm:h-3.5 sm:w-3.5" /> Pareto scenario brief
          </span>
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-5xl md:text-6xl">
            Resilience and inclusion, engineered on the Pareto frontier.
          </h1>
          <p className="text-base text-muted-foreground/90 sm:text-lg md:text-xl">
            Compare baseline vs optimized awards, surface inclusive risk actions, and export the scenario that keeps your tail in check.
          </p>
          <div className="flex flex-col gap-2 text-xs text-muted-foreground/80 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:text-sm">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/8 px-3 py-1.5">
              <ArrowUpRight className="h-3 w-3 text-iris-300 sm:h-3.5 sm:w-3.5" /> Focus current point to sync tiles and actions
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/8 px-3 py-1.5">
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
