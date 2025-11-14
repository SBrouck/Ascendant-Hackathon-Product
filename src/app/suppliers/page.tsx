"use client";

import { Filter } from "lucide-react";
import { suppliers } from "@/data/seed";
import { SupplierTable } from "@/components/SupplierTable";
import { GlobalToolbar } from "@/components/GlobalToolbar";

export default function SupplierExplorerPage() {
  return (
    <div className="space-y-10">
      <section className="glass-panel-strong hero-gradient overflow-hidden rounded-[24px] px-8 py-10">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground/70">Supplier explorer</p>
          <h1 className="text-4xl font-semibold text-foreground md:text-5xl">Track inclusive capacity across critical suppliers.</h1>
          <p className="max-w-3xl text-base text-muted-foreground/85 md:text-lg">
            Slice by site, SKU, region, and inclusion flags to confirm resilience coverage before locking awards.
          </p>
        </div>
      </section>

      <GlobalToolbar />

      <div className="flex items-center gap-2 text-sm text-muted-foreground/70">
        <Filter className="h-4 w-4 text-iris-300" />
        Filters auto-sync across Pareto actions, award builder, and scenario snapshots.
      </div>

      <SupplierTable data={suppliers} />
    </div>
  );
}
