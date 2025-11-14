"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";

export type ServiceCurvePoint = {
  day: number;
  baseline: number;
  scenario: number;
};

export type TtrBucket = {
  bucket: string;
  baseline: number;
  scenario: number;
};

type ServiceCurvesProps = {
  series: readonly ServiceCurvePoint[];
  histogram: readonly TtrBucket[];
  className?: string;
};

export function ServiceCurves({ series, histogram, className }: ServiceCurvesProps) {
  return (
    <div className={className ?? "glass-panel rounded-[24px] border border-white/8 p-6"}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground/70">
            Service recovery window
          </h3>
          <p className="text-sm text-muted-foreground/80">
            Compare baseline vs scenario recovery curves and time-to-recovery distribution.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
          <Badge className="rounded-full border border-white/10 bg-danger/15 text-danger">Baseline</Badge>
          <Badge className="rounded-full border border-white/10 bg-resilience/15 text-resilience">Scenario</Badge>
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="h-[260px] rounded-2xl border border-white/6 bg-white/4 p-3">
          <ResponsiveContainer>
            <LineChart data={series} margin={{ top: 10, right: 16, bottom: 0, left: -8 }}>
              <CartesianGrid stroke="rgba(182,160,255,0.16)" strokeDasharray="4 8" />
              <XAxis dataKey="day" stroke="#aeb4c4" tickLine={false} axisLine={{ stroke: "rgba(182,160,255,0.2)" }} />
              <YAxis
                stroke="#aeb4c4"
                tickLine={false}
                axisLine={{ stroke: "rgba(182,160,255,0.2)" }}
                domain={[30, 60]}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(22,18,40,0.96)",
                  border: "1px solid rgba(182,160,255,0.25)",
                  borderRadius: 12,
                }}
              />
              <Legend verticalAlign="top" height={32} iconType="circle" wrapperStyle={{ color: "#aeb4c4" }} />
              <Line type="monotone" dataKey="baseline" stroke="#ff6b6b" strokeWidth={2} dot={false} name="Baseline" />
              <Line type="monotone" dataKey="scenario" stroke="#28c4ad" strokeWidth={2.4} dot={false} name="Scenario" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-[260px] rounded-2xl border border-white/6 bg-white/4 p-3">
          <ResponsiveContainer>
            <BarChart data={histogram} margin={{ top: 10, right: 16, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="rgba(182,160,255,0.16)" vertical={false} />
              <XAxis dataKey="bucket" stroke="#aeb4c4" axisLine={false} tickLine={false} />
              <YAxis stroke="#aeb4c4" axisLine={false} tickLine={false} width={36} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(22,18,40,0.96)",
                  border: "1px solid rgba(182,160,255,0.25)",
                  borderRadius: 12,
                }}
              />
              <Legend verticalAlign="top" height={32} iconType="circle" wrapperStyle={{ color: "#aeb4c4" }} />
              <Bar dataKey="baseline" fill="#ff6b6b" radius={[12, 12, 0, 0]} name="Baseline" />
              <Bar dataKey="scenario" fill="#6c5dd3" radius={[12, 12, 0, 0]} name="Scenario" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
