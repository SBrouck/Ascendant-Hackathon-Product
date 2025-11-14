"use client";

import { create } from "zustand";
import { ParetoPoint } from "@/components/ParetoChart";
import { TopActionRow } from "@/components/TopActions";

export type ScenarioKey = "Baseline" | "Optimized" | "Shock A" | "Shock B";

export type AppState = {
  dateRange: string;
  scenario: ScenarioKey;
  inclusion: number;
  carbonAware: boolean;
  regimeStress: number;
  selectedPareto?: ParetoPoint;
  selectedAction?: TopActionRow;
  setDateRange: (value: string) => void;
  setScenario: (value: ScenarioKey) => void;
  setInclusion: (value: number) => void;
  setCarbonAware: (value: boolean) => void;
  setRegimeStress: (value: number) => void;
  setSelectedPareto: (value?: ParetoPoint) => void;
  setSelectedAction: (value?: TopActionRow) => void;
};

export const scenarioOptions: ScenarioKey[] = ["Baseline", "Optimized", "Shock A", "Shock B"];

export const useAppState = create<AppState>((set) => ({
  dateRange: "Jul – Nov 2025",
  scenario: "Optimized",
  inclusion: 68,
  carbonAware: true,
  regimeStress: 40,
  selectedPareto: undefined,
  selectedAction: undefined,
  setDateRange: (value) => set({ dateRange: value }),
  setScenario: (value) => set({ scenario: value }),
  setInclusion: (value) => set({ inclusion: value }),
  setCarbonAware: (value) => set({ carbonAware: value }),
  setRegimeStress: (value) => set({ regimeStress: value }),
  setSelectedPareto: (value) => set({ selectedPareto: value }),
  setSelectedAction: (value) => set({ selectedAction: value }),
}));
