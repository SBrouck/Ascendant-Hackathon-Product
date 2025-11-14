"use client";

import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDelta } from "@/lib/formatters";

export type AwardItem = {
  site: string;
  sku: string;
  primary: string;
  backup: string;
  inclusiveBackup: boolean;
  hs: string;
  duty: number;
  reclassRisk: "Low" | "Moderate" | "Elevated";
  costDelta: number;
  tailDelta: number;
};

export type AwardVariant = {
  id: string;
  label: string;
  hs: string;
  duty: number;
  reclassRisk: "Low" | "Moderate" | "Elevated";
};

type AwardRowProps = {
  item: AwardItem;
  enabled: {
    primary: boolean;
    backup: boolean;
  };
  selectedVariant: string;
  onChange: (update: { primary?: boolean; backup?: boolean; variant?: string }) => void;
  errors?: string[];
};

export function AwardRow({ item, enabled, selectedVariant, onChange, errors }: AwardRowProps) {
  const variants = useMemo<AwardVariant[]>(() => {
    const base: AwardVariant = {
      id: "base",
      label: `HS ${item.hs}`,
      hs: item.hs,
      duty: item.duty,
      reclassRisk: item.reclassRisk,
    };

    const flexDuty: AwardVariant = {
      id: "flex",
      label: "Flex duty mitigation",
      hs: `${item.hs.slice(0, 4)}.XX`,
      duty: Math.max(item.duty - 1.4, 0.2),
      reclassRisk: "Moderate",
    };

    const inclusiveBlend: AwardVariant = {
      id: "inclusive",
      label: "Inclusive supplier blend",
      hs: `${item.hs.slice(0, 4)}.IN`,
      duty: item.duty + 0.6,
      reclassRisk: "Low",
    };

    return [base, flexDuty, inclusiveBlend];
  }, [item]);

  const activeVariant = variants.find((variant) => variant.id === selectedVariant) ?? variants[0];
  const hasErrors = errors && errors.length > 0;

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 rounded-[20px] border border-white/8 bg-white/4 p-5 transition lg:grid-cols-[1.6fr_1fr_1fr_1fr]",
        hasErrors ? "border-danger/40 shadow-[0_0_0_1px_rgba(255,107,107,0.35)]" : "hover:border-iris-500/30",
      )}
    >
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-lg font-semibold text-foreground/90">{item.site}</p>
          <Badge className="rounded-full border border-white/10 bg-iris-500/15 text-iris-300">{item.sku}</Badge>
        </div>
        <p className="text-xs text-muted-foreground/75">
          Cost Δ {formatDelta(item.costDelta, "%")} · Tail Δ {formatDelta(item.tailDelta, "%")}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge className="rounded-full border border-white/10 bg-resilience/15 text-resilience">Dual sourcing</Badge>
          <Badge
            className={cn(
              "rounded-full border border-white/10",
              item.inclusiveBackup ? "bg-inclusion/15 text-inclusion" : "bg-danger/15 text-danger",
            )}
          >
            {item.inclusiveBackup ? "Inclusive-ready" : "Backup gap"}
          </Badge>
        </div>
        {hasErrors ? (
          <div className="flex flex-wrap items-center gap-2 text-xs text-danger">
            <AlertCircle className="h-4 w-4" />
            {errors?.map((error) => (
              <Badge key={error} className="rounded-full border border-danger/40 bg-danger/15 text-danger">
                {error}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
      <div className="space-y-3">
        <label className="flex items-center justify-between text-sm text-muted-foreground/90">
          <span>Primary award</span>
          <Switch checked={enabled.primary} onCheckedChange={(checked) => onChange({ primary: checked })} />
        </label>
        <label className="flex items-center justify-between text-sm text-muted-foreground/90">
          <span>Backup award</span>
          <Switch checked={enabled.backup} onCheckedChange={(checked) => onChange({ backup: checked })} />
        </label>
        <p className="text-xs text-muted-foreground/70">
          Inclusive backup required. {item.inclusiveBackup ? "Eligible" : "Needs inclusive pairing"}.
        </p>
      </div>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">Variant</p>
        <Select value={activeVariant.id} onValueChange={(value) => onChange({ variant: value })}>
          <SelectTrigger className="rounded-xl border-white/10 bg-white/6 text-sm">
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-panel-strong text-sm">
            {variants.map((variant) => (
              <SelectItem key={variant.id} value={variant.id} className="text-sm">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{variant.label}</span>
                  <span className="text-xs text-muted-foreground">
                    Duty {variant.duty.toFixed(1)}% · Reclass {variant.reclassRisk}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground/70">
          <Badge className="rounded-full border border-white/10 bg-white/6">HS {activeVariant.hs}</Badge>
          <Badge className="rounded-full border border-white/10 bg-resilience/15 text-resilience">
            Duty {activeVariant.duty.toFixed(1)}%
          </Badge>
          <Badge className="rounded-full border border-white/10 bg-white/6">Reclass {activeVariant.reclassRisk}</Badge>
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-xl border border-white/8 bg-white/6 p-3">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground/70">Primary supplier</p>
          <p className="mt-1 text-sm font-semibold text-foreground/90">{item.primary}</p>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/6 p-3">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground/70">Backup supplier</p>
          <p className="mt-1 text-sm font-semibold text-foreground/90">{item.backup}</p>
          <Badge
            className={cn(
              "mt-2 w-fit rounded-full border border-white/10",
              item.inclusiveBackup ? "bg-inclusion/15 text-inclusion" : "bg-danger/15 text-danger",
            )}
          >
            {item.inclusiveBackup ? "Inclusive" : "Gap"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
