"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Sparkles, XCircle } from "lucide-react";
import { awards } from "@/data/seed";
import { AwardRow } from "@/components/AwardRow";
import { Button } from "@/components/ui/button";
import { GlobalToolbar } from "@/components/GlobalToolbar";
import { motion, AnimatePresence } from "framer-motion";

export default function AwardBuilderPage() {
  const [decisions, setDecisions] = useState(() =>
    awards.map((item) => ({ primary: true, backup: item.inclusiveBackup, variant: "base" })),
  );

  const validation = useMemo(() => {
    return decisions.map((decision, index) => {
      const errors: string[] = [];
      if (!decision.primary) {
        errors.push("Keep primary active");
      }
      if (!decision.backup) {
        errors.push("Enable backup coverage");
      }
      if (decision.backup && !awards[index].inclusiveBackup) {
        errors.push("Choose inclusive backup");
      }
      return errors;
    });
  }, [decisions]);

  const validCount = validation.filter((row) => row.length === 0).length;
  const celebrate = validCount === awards.length;

  return (
    <div className="space-y-10">
      <section className="glass-panel-strong hero-gradient overflow-hidden rounded-[24px] px-8 py-10">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground/70">Award builder</p>
          <h1 className="text-4xl font-semibold text-foreground md:text-5xl">Lock resilient awards with inclusive coverage.</h1>
          <p className="max-w-2xl text-base text-muted-foreground/85 md:text-lg">
            Toggle primary and backup positions, confirm dual-sourcing, and compare HS variants before committing the final plan.
          </p>
        </div>
      </section>

      <GlobalToolbar />

      <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-white/8 px-6 py-4 text-sm">
        <div className="flex items-center gap-3 text-foreground/90">
          <CheckCircle2 className="h-5 w-5 text-resilience" />
          <span>{validCount} of {awards.length} awards passing</span>
        </div>
        <div className="flex items-center gap-3 text-danger">
          <XCircle className="h-5 w-5" />
          <span>{awards.length - validCount} pending fixes</span>
        </div>
        <AnimatePresence>
          {celebrate ? (
            <motion.div
              key="celebration"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center gap-2 rounded-full border border-resilience/40 bg-resilience/15 px-3 py-1 text-xs text-resilience"
            >
              <Sparkles className="h-4 w-4" /> All awards validated
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        {awards.map((item, index) => (
          <AwardRow
            key={`${item.site}-${item.sku}`}
            item={item}
            enabled={decisions[index]}
            selectedVariant={decisions[index].variant}
            errors={validation[index]}
            onChange={(update) => {
              setDecisions((prev) => {
                const next = [...prev];
                next[index] = { ...next[index], ...update };
                return next;
              });
            }}
          />
        ))}
      </div>

      <div className="sticky bottom-6 flex justify-end">
        <Button className="rounded-full bg-iris-500 px-6 py-3 text-white shadow-soft hover:bg-iris-500/90">
          Commit award plan
        </Button>
      </div>
    </div>
  );
}
