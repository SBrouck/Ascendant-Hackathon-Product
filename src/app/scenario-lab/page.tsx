"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AgentTimeline } from "@/components/AgentTimeline";
import { ServiceCurves } from "@/components/ServiceCurves";
import { GlobalToolbar } from "@/components/GlobalToolbar";
import { serviceCurves, topActions } from "@/data/seed";
import { useAppState } from "@/lib/state";

export default function ScenarioLabPage() {
  const { scenario, selectedAction, setSelectedAction } = useAppState();

  return (
    <div className="space-y-10">
      <section className="glass-panel-strong hero-gradient overflow-hidden rounded-[24px] px-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground/70">Scenario lab</p>
            <h1 className="text-4xl font-semibold text-foreground md:text-5xl">Rehearse the agentic run in real time.</h1>
            <p className="text-base text-muted-foreground/90 md:text-lg">
              Replay each step, inspect generated artifacts, and compare recovery curves for the <span className="text-iris-300">{scenario}</span> scenario blend.
            </p>
          </div>
          <Button
            variant="ghost"
            className="gap-2 rounded-full border border-white/10 bg-white/8 text-sm text-foreground shadow-soft hover:bg-white/12"
            onClick={() => setSelectedAction(topActions[0])}
          >
            <Play className="h-4 w-4" /> Replay latest run
          </Button>
        </div>
      </section>

      <GlobalToolbar />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <AgentTimeline className="glass-panel rounded-[20px] border border-white/8" />
        <Card className="glass-panel flex flex-col gap-4 rounded-[20px] border border-white/8 p-6">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground/70">Scenario snapshot</h2>
            <p className="mt-2 text-sm text-muted-foreground/90">
              Selected action: {selectedAction ? selectedAction.action : "Sync from Overview"}
            </p>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Recovery uplift: +5.6 pts vs baseline</li>
            <li>Carbon aware mode: inline with current toggle</li>
            <li>Inclusive floor: mirrors global inclusion slider</li>
            <li>Regime stress value propagates to optimizer queue</li>
          </ul>
          <Button
            className="mt-auto rounded-full bg-iris-500 text-white hover:bg-iris-500/90"
            onClick={() => selectedAction && setSelectedAction(selectedAction)}
          >
            Apply to Overview
          </Button>
        </Card>
      </div>
      <ServiceCurves series={serviceCurves.series} histogram={serviceCurves.ttrBuckets} />
    </div>
  );
}
