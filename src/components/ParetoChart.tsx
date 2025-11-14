"use client";

import { useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { Target, ZoomIn } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCost, formatCvar } from "@/lib/formatters";

export type ParetoPoint = {
  name: string;
  costDelta: number;
  cvar: number;
  clic: number;
  indepth: number;
};

type ParetoChartProps = {
  points: ParetoPoint[];
  selectedName?: string;
  onSelect?: (point: ParetoPoint) => void;
};

const DEPTH_BANDS = [
  { limit: 0.9, label: "Sparse", color: "#ff6b6b" },
  { limit: 1.2, label: "Emerging", color: "#f5b971" },
  { limit: 1.5, label: "Stable", color: "#6c5dd3" },
  { limit: Infinity, label: "Inclusive", color: "#3ddc97" },
] as const;

function getBand(value: number) {
  return DEPTH_BANDS.find((band) => value <= band.limit) ?? DEPTH_BANDS[DEPTH_BANDS.length - 1];
}

export function ParetoChart({ points, selectedName, onSelect }: ParetoChartProps) {
  const chartRef = useRef<any>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [lasso, setLasso] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [groupSelection, setGroupSelection] = useState<ParetoPoint[]>([]);

  const sortedPoints = useMemo(() => points.slice().sort((a, b) => a.costDelta - b.costDelta), [points]);

  if (!points.length) {
    return (
      <Card className="flex h-full min-h-[280px] items-center justify-center rounded-[20px] border border-dashed border-white/12 bg-white/4 text-sm text-muted-foreground">
        No Pareto candidates available for the current filters.
      </Card>
    );
  }

  const handleLassoEnd = () => {
    if (!lasso || !chartRef.current) {
      setLasso(null);
      return;
    }
    const domainX = [Math.min(lasso.x1, lasso.x2), Math.max(lasso.x1, lasso.x2)] as [number, number];
    const domainY = [Math.min(lasso.y1, lasso.y2), Math.max(lasso.y1, lasso.y2)] as [number, number];
    const selected = sortedPoints.filter(
      (point) => point.costDelta >= domainX[0] && point.costDelta <= domainX[1] && point.cvar >= domainY[0] && point.cvar <= domainY[1],
    );
    if (selected.length) {
      setGroupSelection(selected);
      onSelect?.(selected[0]);
    }
    setLasso(null);
  };

  return (
    <Card className="relative overflow-hidden rounded-[24px] border border-white/8 bg-white/4 p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground/70">Pareto frontier</h3>
          <p className="text-sm text-muted-foreground/80">
            Cost Δ vs CVaR95 with bubble size for CLIC coverage and color for inclusive depth.
          </p>
          {groupSelection.length > 1 ? (
            <p className="text-xs text-muted-foreground/70">
              {groupSelection.length} points selected via lasso. Focus to sync KPIs and actions.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <Badge className="rounded-full border border-white/10 bg-resilience/15 text-resilience">CLIC bubble</Badge>
            <Badge className="rounded-full border border-white/10 bg-inclusion/15 text-inclusion">INDEPTH color</Badge>
          </div>
          <Button
            variant="ghost"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs",
              focusMode ? "text-foreground" : "text-muted-foreground",
            )}
            onClick={() => setFocusMode((prev) => !prev)}
          >
            <Target className="h-4 w-4" /> Focus current point
          </Button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground/70">
        {DEPTH_BANDS.map((band) => (
          <Badge key={band.label} className="gap-2 rounded-full border border-white/10 bg-white/8">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: band.color }} aria-hidden />
            {band.label}
          </Badge>
        ))}
      </div>
      <div className="mt-6 h-[360px] w-full">
        <ResponsiveContainer>
          <ScatterChart
            ref={chartRef}
            margin={{ top: 20, right: 24, bottom: 24, left: 24 }}
            onMouseDown={(event) => {
              if (!event || focusMode) return;
              const pointer = event as any;
              const state = chartRef.current?.state;
              const xScale = state?.xAxisMap?.[0]?.scale;
              const yScale = state?.yAxisMap?.[0]?.scale;
              if (!xScale || !yScale || pointer?.chartX === undefined || pointer?.chartY === undefined) return;
              setLasso({
                x1: xScale.invert(pointer.chartX),
                y1: yScale.invert(pointer.chartY),
                x2: xScale.invert(pointer.chartX),
                y2: yScale.invert(pointer.chartY),
              });
            }}
            onMouseMove={(event) => {
              if (!event || !lasso) return;
              const pointer = event as any;
              const state = chartRef.current?.state;
              const xScale = state?.xAxisMap?.[0]?.scale;
              const yScale = state?.yAxisMap?.[0]?.scale;
              if (!xScale || !yScale || pointer?.chartX === undefined || pointer?.chartY === undefined) return;
              setLasso((prev) =>
                prev
                  ? {
                      ...prev,
                      x2: xScale.invert(pointer.chartX),
                      y2: yScale.invert(pointer.chartY),
                    }
                  : prev,
              );
            }}
            onMouseUp={handleLassoEnd}
            onMouseLeave={() => lasso && handleLassoEnd()}
          >
            <CartesianGrid stroke="rgba(182,160,255,0.16)" strokeDasharray="4 8" />
            <XAxis
              type="number"
              dataKey="costDelta"
              name="Cost delta"
              unit="%"
              stroke="#aeb4c4"
              tickLine={false}
              axisLine={{ stroke: "rgba(182,160,255,0.2)" }}
            />
            <YAxis
              type="number"
              dataKey="cvar"
              name="CVaR95"
              unit=" hrs"
              stroke="#aeb4c4"
              tickLine={false}
              axisLine={{ stroke: "rgba(182,160,255,0.2)" }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "4 4", stroke: "rgba(182,160,255,0.25)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const datum = payload[0].payload as ParetoPoint;
                const band = getBand(datum.indepth);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel-strong w-[230px] border border-white/10 p-3 text-sm"
                  >
                    <p className="font-semibold text-foreground">{datum.name}</p>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground/80">
                      <p>
                        Cost Δ <span className="text-foreground">{formatCost(datum.costDelta)}</span>
                      </p>
                      <p>
                        CVaR95 <span className="text-foreground">{formatCvar(datum.cvar)}</span>
                      </p>
                      <p>
                        CLIC coverage <span className="text-resilience">{datum.clic}%</span>
                      </p>
                      <p>
                        INDEPTH <span style={{ color: band.color }}>{datum.indepth.toFixed(1)}</span>
                      </p>
                    </div>
                  </motion.div>
                );
              }}
            />
            {lasso ? (
              <ReferenceArea
                x1={Math.min(lasso.x1, lasso.x2)}
                x2={Math.max(lasso.x1, lasso.x2)}
                y1={Math.min(lasso.y1, lasso.y2)}
                y2={Math.max(lasso.y1, lasso.y2)}
                stroke="#6c5dd3"
                strokeOpacity={0.6}
                fill="#6c5dd3"
                fillOpacity={0.12}
                ifOverflow="extendDomain"
              />
            ) : null}
            <Scatter
              data={sortedPoints}
              fill="#6c5dd3"
              shape={(props: any) => {
                const pointer = props as typeof props & { payload: ParetoPoint };
                const { cx, cy, payload } = pointer;
                if (typeof cx !== "number" || typeof cy !== "number" || !payload) {
                  return <></>;
                }
                const band = getBand(payload.indepth);
                const isSelected = payload.name === selectedName;
                const dimmed = focusMode && selectedName && !isSelected;
                const size = 10 + Math.sqrt(payload.clic);
                return (
                  <g
                    onClick={() => onSelect?.(payload)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        onSelect?.(payload);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${payload.name}`}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={size / 2}
                      fill={band.color}
                      fillOpacity={dimmed ? 0.12 : isSelected ? 0.95 : 0.35}
                      stroke={band.color}
                      strokeWidth={isSelected ? 3 : 1.4}
                    />
                    {isSelected ? <circle cx={cx} cy={cy} r={size / 2 + 4} stroke={band.color} strokeWidth={1.4} fill="none" /> : null}
                  </g>
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground/70">
        <span className="inline-flex items-center gap-2">
          <ZoomIn className="h-4 w-4 text-iris-300" /> Drag to lasso-select points. Release to sync the leading candidate.
        </span>
        {selectedName ? <span>Focused: {selectedName}</span> : <span>Select a point to inspect metrics.</span>}
      </div>
    </Card>
  );
}
