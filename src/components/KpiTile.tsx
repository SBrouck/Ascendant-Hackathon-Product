import { useMemo } from "react";
import { Info, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatDelta, formatNumber } from "@/lib/formatters";

export type KpiTileProps = {
  label: string;
  value: number;
  baseline?: number;
  unit?: string;
  delta?: number;
  help: string;
  goodWhen?: "higher" | "lower";
  formatter?: (value: number) => string;
  className?: string;
  intent?: "risk" | "inclusion";
};

export function KpiTile({
  label,
  value,
  baseline,
  unit,
  delta,
  help,
  goodWhen = "lower",
  formatter = (input: number) => formatNumber(input, { digits: 1 }),
  className,
  intent = "risk",
}: KpiTileProps) {
  const computedDelta =
    typeof delta === "number" ? delta : typeof baseline === "number" ? value - baseline : undefined;
  const baseDisplay = typeof baseline === "number" ? formatter(baseline) : undefined;

  const accentClass = intent === "inclusion" ? "text-inclusion" : "text-resilience";
  const badgeToneClass = computedDelta === undefined
    ? intent === "inclusion"
      ? "bg-inclusion/15 text-inclusion"
      : "bg-resilience/15 text-resilience"
    : goodWhen === "higher"
      ? computedDelta >= 0
        ? "bg-resilience/15 text-resilience"
        : "bg-danger/15 text-danger"
      : computedDelta <= 0
        ? "bg-resilience/15 text-resilience"
        : "bg-danger/15 text-danger";

  const displayValue = `${formatter(value)}${unit ?? ""}`;
  const displayDelta = computedDelta !== undefined ? formatDelta(computedDelta, unit ?? "%") : undefined;

  const sparklinePoints = useMemo(() => buildSparklinePoints(label, value, baseline), [label, value, baseline]);
  const sparkId = useMemo(() => `spark-${label.replace(/\s+/g, "-").toLowerCase()}`, [label]);

  return (
    <TooltipProvider delayDuration={80}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
            <Card
              className={cn(
                "group relative overflow-hidden rounded-[18px] border border-white/8 bg-white/6 px-5 py-4 transition",
                "hover:border-white/12",
                className,
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground/70">{label}</p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className={cn("font-numeric text-4xl font-semibold", accentClass)}>{displayValue}</span>
                    {baseline !== undefined ? (
                      <span className="text-xs text-muted-foreground/70">vs {baseDisplay}</span>
                    ) : null}
                  </div>
                </div>
                {computedDelta !== undefined ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      "flex items-center gap-1 rounded-full border-white/10 px-2.5 py-1 text-[11px] font-medium",
                      badgeToneClass,
                    )}
                  >
                    {computedDelta > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : computedDelta < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : null}
                    <span>{displayDelta}</span>
                  </Badge>
                ) : null}
              </div>
              <div className="mt-6 h-10 w-full overflow-hidden">
                <svg viewBox="0 0 120 32" className="h-full w-full text-iris-500/60">
                  <defs>
                    <linearGradient id={sparkId} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.48" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M0,32 ${sparklinePoints} L120,32Z`}
                    fill={`url(#${sparkId})`}
                    stroke="none"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polyline
                    points={sparklinePoints}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-iris-500"
                  />
                </svg>
              </div>
              <button
                className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[11px] text-muted-foreground transition hover:text-foreground"
                aria-label={`What is ${label}`}
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs border border-white/10 bg-panel-strong text-sm text-muted-foreground/90">
          {help}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function buildSparklinePoints(label: string, value: number, baseline?: number) {
  const steps = 7;
  const points: number[] = [];
  const base = baseline ?? value;
  const amplitude = Math.max(Math.abs(value - base), 1);
  for (let i = 0; i < steps; i += 1) {
    const phase = (i + label.length) * 0.9;
    const wave = (Math.sin(phase) + 1) / 2;
    const drift = (value - base) * (i / (steps - 1));
    const point = base + wave * amplitude * 0.6 + drift;
    points.push(point);
  }
  const maxPoint = Math.max(...points);
  const minPoint = Math.min(...points);
  const range = maxPoint - minPoint || 1;
  return points
    .map((point, index) => {
      const x = (index / (steps - 1)) * 120;
      const normalizedY = 32 - ((point - minPoint) / range) * 24 - 2;
      return `${x.toFixed(2)},${normalizedY.toFixed(2)}`;
    })
    .join(" ");
}
