"use client";

import { useMemo, useRef, useState } from "react";
import { Filter, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SupplierRow = {
  name: string;
  site: string;
  sku: string;
  region: string;
  inclusive: boolean;
  hhiBand: string;
  p50: number;
  p95: number;
  cvar95: number;
  capacity: number;
  dutyExposure: number;
  co2: number;
};

type SupplierTableProps = {
  data: SupplierRow[];
  className?: string;
};

export function SupplierTable({ data, className }: SupplierTableProps) {
  const [siteFilter, setSiteFilter] = useState<string>("all");
  const [skuFilter, setSkuFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [hhiFilter, setHhiFilter] = useState<string>("all");
  const [inclusiveOnly, setInclusiveOnly] = useState(false);
  const [activeSupplier, setActiveSupplier] = useState<SupplierRow | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const sites = useMemo(() => Array.from(new Set(data.map((row) => row.site))).sort(), [data]);
  const skus = useMemo(() => Array.from(new Set(data.map((row) => row.sku))).sort(), [data]);
  const regions = useMemo(() => Array.from(new Set(data.map((row) => row.region))).sort(), [data]);
  const hhiBands = useMemo(() => Array.from(new Set(data.map((row) => row.hhiBand))).sort(), [data]);

  const filteredRows = data.filter((row) => {
    if (siteFilter !== "all" && row.site !== siteFilter) return false;
    if (skuFilter !== "all" && row.sku !== skuFilter) return false;
    if (regionFilter !== "all" && row.region !== regionFilter) return false;
    if (hhiFilter !== "all" && row.hhiBand !== hhiFilter) return false;
    if (inclusiveOnly && !row.inclusive) return false;
    return true;
  });

  const resetFilters = () => {
    setSiteFilter("all");
    setSkuFilter("all");
    setRegionFilter("all");
    setHhiFilter("all");
    setInclusiveOnly(false);
  };

  return (
    <div
      className={cn(
        "rounded-[24px] border border-white/8 bg-white/4 p-6 shadow-soft backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground/70">Supplier explorer</h3>
          <p className="mt-1 text-sm text-muted-foreground/80">
            Filter critical suppliers by site, inclusion, and CVaR exposure.
          </p>
        </div>
        <Badge className="gap-2 rounded-full border border-white/10 bg-iris-500/15 text-iris-300">
          <Filter className="h-4 w-4" /> {filteredRows.length} of {data.length}
        </Badge>
      </div>
      <div
        ref={filterRef}
        className="mt-4 grid gap-3 md:grid-cols-5"
      >
        <FilterSelect
          label="Site"
          value={siteFilter}
          onChange={setSiteFilter}
          options={sites}
        />
        <FilterSelect
          label="SKU"
          value={skuFilter}
          onChange={setSkuFilter}
          options={skus}
        />
        <FilterSelect
          label="Region"
          value={regionFilter}
          onChange={setRegionFilter}
          options={regions}
        />
        <FilterSelect
          label="HHI band"
          value={hhiFilter}
          onChange={setHhiFilter}
          options={hhiBands}
        />
        <div className="rounded-xl border border-white/10 bg-white/6 p-3 text-sm text-muted-foreground/80">
          <div className="flex items-center justify-between">
            <span>Inclusive only</span>
            <Switch checked={inclusiveOnly} onCheckedChange={setInclusiveOnly} />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground/60">
            Restricts to suppliers flagged inclusive in the audit
          </p>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button variant="ghost" size="sm" className="gap-2 rounded-full border border-white/10 text-xs text-muted-foreground" onClick={resetFilters}>
          <RefreshCw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>
      <div className="mt-2 rounded-[16px] border border-white/8 bg-white/4">
        {filteredRows.length === 0 ? (
          <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
            No suppliers pass the current filters.
          </div>
        ) : (
          <ScrollArea className="h-[420px]">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 text-[11px] uppercase tracking-[0.24em] text-muted-foreground/60">
                  <TableHead className="sticky top-0 bg-white/6 backdrop-blur">Supplier</TableHead>
                  <TableHead className="sticky top-0 bg-white/6 backdrop-blur">Site</TableHead>
                  <TableHead className="sticky top-0 bg-white/6 backdrop-blur">SKU</TableHead>
                  <TableHead className="sticky top-0 bg-white/6 backdrop-blur">Region</TableHead>
                  <TableHead className="sticky top-0 bg-white/6 backdrop-blur">P50</TableHead>
                  <TableHead className="sticky top-0 bg-white/6 backdrop-blur">P95</TableHead>
                  <TableHead className="sticky top-0 bg-white/6 backdrop-blur">CVaR95</TableHead>
                  <TableHead className="sticky top-0 bg-white/6 backdrop-blur">Capacity</TableHead>
                  <TableHead className="sticky top-0 bg-white/6 backdrop-blur">Duty exp.</TableHead>
                  <TableHead className="sticky top-0 bg-white/6 backdrop-blur">CO₂</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow
                    key={`${row.name}-${row.sku}`}
                    className="h-14 cursor-pointer border-white/6 transition hover:bg-iris-500/10 odd:bg-white/3"
                    onClick={() => setActiveSupplier(row)}
                  >
                    <TableCell className="flex items-center gap-2">
                      <span className="font-medium text-foreground/90">{row.name}</span>
                      {row.inclusive ? (
                        <Badge className="rounded-full border border-white/10 bg-inclusion/15 text-inclusion">Inclusive</Badge>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground/80">{row.site}</TableCell>
                    <TableCell className="text-sm text-muted-foreground/80">{row.sku}</TableCell>
                    <TableCell className="text-sm text-muted-foreground/80">{row.region}</TableCell>
                    <TableCell className="font-numeric text-sm text-muted-foreground/90">{row.p50.toFixed(1)}%</TableCell>
                    <TableCell className="font-numeric text-sm text-muted-foreground/90">{row.p95.toFixed(1)}%</TableCell>
                    <TableCell className="font-numeric text-sm text-muted-foreground/90">{row.cvar95.toFixed(1)}%</TableCell>
                    <TableCell className="font-numeric text-sm text-muted-foreground/90">{row.capacity}</TableCell>
                    <TableCell className="font-numeric text-sm text-muted-foreground/90">{row.dutyExposure.toFixed(1)}%</TableCell>
                    <TableCell className="font-numeric text-sm text-muted-foreground/90">{row.co2.toFixed(2)} t</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
      <Dialog open={!!activeSupplier} onOpenChange={(open) => !open && setActiveSupplier(null)}>
        <DialogContent className="max-w-md border border-white/10 bg-panel-strong/95">
          {activeSupplier ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  {activeSupplier.name}
                  {activeSupplier.inclusive ? (
                    <Badge className="rounded-full border border-white/10 bg-inclusion/15 text-inclusion">Inclusive certified</Badge>
                  ) : null}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {activeSupplier.site} · {activeSupplier.sku} · {activeSupplier.region}
                </DialogDescription>
              </DialogHeader>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground/85">
                <li>Time-to-recovery P95: {activeSupplier.p95.toFixed(1)}%</li>
                <li>CVaR95 exposure: {activeSupplier.cvar95.toFixed(1)}%</li>
                <li>Available capacity: {activeSupplier.capacity} units</li>
                <li>Duty exposure: {activeSupplier.dutyExposure.toFixed(1)}%</li>
                <li>CO₂ intensity: {activeSupplier.co2.toFixed(2)} t/unit</li>
                <li>HHI band: {activeSupplier.hhiBand}</li>
              </ul>
              <p className="mt-4 rounded-lg border border-iris-300/20 bg-iris-500/10 p-3 text-xs text-muted-foreground/80">
                Synthetic log: /suppliers/{activeSupplier.region.toLowerCase()}/{activeSupplier.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}
              </p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
      <Button
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-iris-500 text-white shadow-soft md:hidden"
        onClick={() => filterRef.current?.scrollIntoView({ behavior: "smooth" })}
      >
        <Filter className="h-5 w-5" />
      </Button>
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/6 p-3 text-sm text-muted-foreground/80">
      <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground/70">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-2 rounded-xl border-white/10 bg-white/8 text-sm">
          <SelectValue placeholder={`Any ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-panel-strong text-sm">
          <SelectItem value="all">Any</SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
