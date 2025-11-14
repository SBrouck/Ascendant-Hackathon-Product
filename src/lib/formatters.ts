export const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

export const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

export const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatNumber(value: number | string, options?: { digits?: number }) {
  if (typeof value === "string") return value;
  if (Number.isNaN(value)) return "—";
  const digits = options?.digits ?? 1;
  return value.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits > 0 ? Math.min(1, digits) : 0,
  });
}

export function formatPercent(value: number, options?: { digits?: number }) {
  const digits = options?.digits ?? 1;
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

export function formatDelta(value: number, unit?: string) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}${unit ?? "%"}`;
}

export function formatCvar(value: number) {
  return `${value.toFixed(1)} hrs`;
}

export function formatCost(value: number) {
  return `${value.toFixed(1)}%`;
}
