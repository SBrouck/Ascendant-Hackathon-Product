"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDelta } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";

export type TopActionRow = {
  rank: number;
  action: string;
  site: string;
  sku: string;
  primary: string;
  backup: string;
  inclusiveBackup: boolean;
  deltaTail: number;
  deltaCost: number;
  evidence: string[];
};

type TopActionsProps = {
  rows: TopActionRow[];
  onSendToScenario?: (row: TopActionRow) => void;
  loading?: boolean;
  activeRank?: number;
  className?: string;
};

export function TopActions({ rows, onSendToScenario, loading, activeRank, className }: TopActionsProps) {
  const [selectedRow, setSelectedRow] = useState<TopActionRow | null>(null);

  if (loading) {
    return <TopActionsSkeleton className={className} />;
  }

  if (!rows.length) {
    return (
      <div
        className={cn(
          "flex h-full min-h-[260px] flex-col items-center justify-center rounded-[20px] border border-dashed border-white/12 bg-white/4 text-center text-sm text-muted-foreground",
          className,
        )}
      >
        <p>No actions match the current filters.</p>
        <Button variant="ghost" size="sm" className="mt-3 rounded-full border border-white/10 bg-white/8 text-xs">
          Reset filters
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[20px] border border-white/8 bg-white/4 shadow-soft backdrop-blur-xl sm:rounded-[24px]",
        className,
      )}
    >
      <div className="flex flex-col gap-2 border-b border-white/8 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground/70 sm:text-sm">
            Top ten tail reducers
          </h3>
          <p className="mt-1 text-xs text-muted-foreground/80 sm:text-sm">
            Inclusive-qualified moves ranked by risk tail relief.
          </p>
        </div>
        <Badge className="w-fit rounded-full border border-white/10 bg-iris-500/15 text-iris-300 text-[10px] px-2 py-0.5 sm:text-xs sm:px-2.5">Syncs with selection</Badge>
      </div>
      <ScrollArea className="h-[320px] sm:h-[380px]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/8 text-[10px] uppercase tracking-[0.24em] text-muted-foreground/60 sm:text-[11px]">
                <TableHead className="w-12 sm:w-14">Rank</TableHead>
                <TableHead className="min-w-[120px]">Action</TableHead>
                <TableHead className="min-w-[80px]">Site</TableHead>
                <TableHead className="min-w-[80px]">SKU</TableHead>
                <TableHead className="min-w-[100px]">Primary</TableHead>
                <TableHead className="min-w-[120px]">Backup</TableHead>
                <TableHead className="text-right min-w-[70px]">Tail Δ</TableHead>
                <TableHead className="text-right min-w-[70px]">Cost Δ</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.rank}
                data-active={row.rank === activeRank}
                className={cn(
                  "h-auto min-h-[56px] cursor-pointer border-white/6 transition sm:h-14",
                  "odd:bg-white/2 even:bg-white/[0.04] hover:bg-iris-500/10",
                  row.rank === activeRank ? "bg-iris-500/10 text-foreground shadow-[0_0_0_1px_rgba(108,93,211,0.35)]" : undefined,
                )}
                onClick={() => setSelectedRow(row)}
              >
                <TableCell className="align-middle py-2 sm:py-0">
                  <Badge className="rounded-full border border-white/10 bg-white/12 text-[10px] font-semibold text-muted-foreground/90 sm:text-[11px]">
                    #{row.rank}
                  </Badge>
                </TableCell>
                <TableCell className="align-middle py-2 sm:py-0">
                  <p className="font-medium text-foreground text-xs sm:text-sm">{row.action}</p>
                  <p className="text-[10px] text-muted-foreground/70 sm:text-[11px]">{row.evidence[0]}</p>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground/80 sm:text-sm">{row.site}</TableCell>
                <TableCell className="text-xs text-muted-foreground/80 sm:text-sm">{row.sku}</TableCell>
                <TableCell className="text-xs text-muted-foreground/90 sm:text-sm">{row.primary}</TableCell>
                <TableCell className="flex flex-col gap-1 py-2 text-xs text-muted-foreground/90 sm:flex-row sm:items-center sm:gap-2 sm:py-0 sm:text-sm">
                  <span>{row.backup}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "w-fit rounded-full border-white/12 text-[10px] px-2 py-0.5 sm:text-xs",
                      row.inclusiveBackup ? "bg-inclusion/15 text-inclusion" : "bg-danger/15 text-danger",
                    )}
                  >
                    {row.inclusiveBackup ? "Inclusive" : "Primary only"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-numeric text-xs text-resilience sm:text-sm">
                  {formatDelta(row.deltaTail, "%")}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-numeric text-xs sm:text-sm",
                    row.deltaCost <= 0 ? "text-resilience" : "text-danger",
                  )}
                >
                  {formatDelta(row.deltaCost, "%")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </div>
      </ScrollArea>

      <Sheet open={!!selectedRow} onOpenChange={(open) => !open && setSelectedRow(null)}>
        <SheetContent side="right" className="w-full border-l border-white/10 bg-panel/98 backdrop-blur-xl sm:w-[420px]">
          {selectedRow ? (
            <div className="flex h-full flex-col">
              <SheetHeader className="pb-4">
                <SheetTitle className="text-lg font-semibold text-foreground leading-snug">
                  {selectedRow.action}
                </SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground">
                  Tail delta {formatDelta(selectedRow.deltaTail, "%")} · Cost delta {formatDelta(selectedRow.deltaCost, "%")}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 overflow-y-auto pr-3">
                <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground/90">
                  <InfoBlock label="Site" value={selectedRow.site} />
                  <InfoBlock label="SKU" value={selectedRow.sku} />
                  <InfoBlock label="Primary" value={selectedRow.primary} />
                  <InfoBlock
                    label="Backup"
                    value={selectedRow.backup}
                    badge={selectedRow.inclusiveBackup ? { label: "Inclusive", tone: "positive" } : { label: "Gap", tone: "negative" }}
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">Evidence & rationale</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {selectedRow.evidence.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-iris-500/60" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <SheetFooter className="mt-auto pt-4">
                <div className="flex w-full gap-2">
                  <SheetClose asChild>
                    <Button variant="ghost" className="flex-1 rounded-full border border-white/10 bg-white/6">
                      Close
                    </Button>
                  </SheetClose>
                  <Button
                    className="flex-1 rounded-full bg-iris-500 text-white shadow-soft hover:bg-iris-500/90"
                    onClick={() => {
                      if (selectedRow) {
                        onSendToScenario?.(selectedRow);
                      }
                    }}
                  >
                    <Send className="mr-2 h-4 w-4" /> Apply to Scenario Lab
                  </Button>
                </div>
              </SheetFooter>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function TopActionsSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-[24px] border border-white/8 bg-white/6 p-6 shadow-soft backdrop-blur-xl",
        className,
      )}
    >
      <Skeleton className="h-4 w-48 bg-white/10" />
      <Skeleton className="h-3 w-64 bg-white/10" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-2xl bg-white/8" />
        ))}
      </div>
    </div>
  );
}

type InfoBlockProps = {
  label: string;
  value: string;
  badge?: { label: string; tone: "positive" | "negative" };
};

function InfoBlock({ label, value, badge }: InfoBlockProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/6 p-3">
      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground/70">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
      {badge ? (
        <Badge
          className={cn(
            "mt-2 w-fit rounded-full border border-white/10",
            badge.tone === "positive" ? "bg-inclusion/15 text-inclusion" : "bg-danger/15 text-danger",
          )}
        >
          {badge.label}
        </Badge>
      ) : null}
    </div>
  );
}
