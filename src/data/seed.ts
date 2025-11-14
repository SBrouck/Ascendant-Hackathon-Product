export const scoreboard = {
  tailP95: { base: 28.5, scen: 22.4 },
  cvar95: { base: 33.1, scen: 27.9 },
  dualPct: { base: 42, scen: 63 },
  hhi: { base: 0.72, scen: 0.58 },
  clic: { base: 32, scen: 60 },
  indepth: { base: 0.7, scen: 1.6 },
  costDelta: { base: 0, scen: 0.9 },
  co2Delta: { base: 0, scen: -1.2 },
} as const;

const paretoAdjectives = [
  "Arc",
  "Beacon",
  "Cipher",
  "Delta",
  "Echo",
  "Flux",
  "Gamma",
  "Helix",
] as const;

const paretoNouns = ["Spire", "Array", "Vector", "Harbor", "Nexus"] as const;

export const paretoPoints = paretoNouns.flatMap((noun, row) =>
  paretoAdjectives.map((adj, col) => {
    const cost = Math.min(2, -0.9 + col * 0.32 + row * 0.35);
    const cvar = 22 + col * 1.25 + row * 2.6;
    const clic = 24 + col * 6 + row * 7;
    const indepth = 0.6 + col * 0.08 + row * 0.22;
    return {
      name: `${adj} ${noun}`,
      costDelta: Number(cost.toFixed(2)),
      cvar: Number(cvar.toFixed(1)),
      clic,
      indepth: Number(indepth.toFixed(1)),
    };
  }),
).slice(0, 40);

export const topActions = [
  {
    rank: 1,
    action: "Shift Lyon outbound to inclusive co-pack",
    site: "Lyon 02",
    sku: "Relay-18",
    primary: "Helios Forge",
    backup: "IntraNova",
    inclusiveBackup: true,
    deltaTail: -6.8,
    deltaCost: -1.4,
    evidence: ["Improved redundancy on inclusive pair", "Matches tariff ceiling scenario"],
  },
  {
    rank: 2,
    action: "Reassign bonded inventory to North ports",
    site: "Dunkirk",
    sku: "Fiber-42",
    primary: "Marquant",
    backup: "Cobalt Reach",
    inclusiveBackup: false,
    deltaTail: -5.3,
    deltaCost: 0.6,
    evidence: ["Maintains HHI < 0.6", "Verified duties under HS 5402"],
  },
  {
    rank: 3,
    action: "Add inclusive temp labor bench",
    site: "Seine Hub",
    sku: "Chassis-19",
    primary: "Axion",
    backup: "Blue Meridian",
    inclusiveBackup: true,
    deltaTail: -4.8,
    deltaCost: 0.3,
    evidence: ["Inclusive supplier verified", "Absorbs Shock B demand"],
  },
  {
    rank: 4,
    action: "Move HS 8501 rotor finishing to Basque cluster",
    site: "Bayonne",
    sku: "Rotor-22",
    primary: "Ferroline",
    backup: "Solenne",
    inclusiveBackup: true,
    deltaTail: -4.2,
    deltaCost: -0.5,
    evidence: ["Duty relief through HS variant", "CVaR tail shrinks 9%"],
  },
  {
    rank: 5,
    action: "Activate shared cold-chain consolidation",
    site: "Rouen",
    sku: "Cryo-07",
    primary: "Polar Loop",
    backup: "Marisette",
    inclusiveBackup: false,
    deltaTail: -3.9,
    deltaCost: 1.1,
    evidence: ["Scenario Optimized covers T+5", "Requires carbon offset toggle"],
  },
  {
    rank: 6,
    action: "Shift inclusive machining to Nantes MakerSpace",
    site: "Nantes",
    sku: "Armature-16",
    primary: "Combinet",
    backup: "Oriel Works",
    inclusiveBackup: true,
    deltaTail: -3.4,
    deltaCost: -0.9,
    evidence: ["Maintains inclusion >1.5", "Validated against Tariff optimizer"],
  },
  {
    rank: 7,
    action: "Leverage OCC micro-fulfilment for Île-de-France",
    site: "Paris 11",
    sku: "Parcel-03",
    primary: "Loopline",
    backup: "Modulr",
    inclusiveBackup: true,
    deltaTail: -3.2,
    deltaCost: 0.4,
    evidence: ["Twin run reduces P95 by 9%", "Inclusive SLA validated"],
  },
  {
    rank: 8,
    action: "Run additive spare program for maritime valves",
    site: "Le Havre",
    sku: "Valve-31",
    primary: "Saint Clair",
    backup: "OmniForge",
    inclusiveBackup: false,
    deltaTail: -3,
    deltaCost: -0.7,
    evidence: ["Shock A resilience holds", "Needs carbon allowance"]
  },
  {
    rank: 9,
    action: "Double-stack inclusive ground lifts",
    site: "Toulouse",
    sku: "Lift-21",
    primary: "Cartera",
    backup: "Velion",
    inclusiveBackup: true,
    deltaTail: -2.7,
    deltaCost: -0.2,
    evidence: ["Improves dual sourcing by 11%", "Low tariff variance"],
  },
  {
    rank: 10,
    action: "Pre-book Antwerp pier slots",
    site: "Antwerp",
    sku: "Bulk-05",
    primary: "Portwave",
    backup: "Inland Arc",
    inclusiveBackup: false,
    deltaTail: -2.5,
    deltaCost: 0.8,
    evidence: ["Creates resilience buffer", "Aligns with Shock B recovery"],
  },
];

export const serviceCurves: {
  series: { day: number; baseline: number; scenario: number }[];
  ttrBuckets: { bucket: string; baseline: number; scenario: number }[];
} = {
  series: [
    { day: 0, baseline: 58, scenario: 58 },
    { day: 2, baseline: 54, scenario: 56 },
    { day: 4, baseline: 51, scenario: 55 },
    { day: 6, baseline: 48, scenario: 54 },
    { day: 8, baseline: 44, scenario: 52 },
    { day: 10, baseline: 40, scenario: 50 },
    { day: 12, baseline: 37, scenario: 48 },
    { day: 14, baseline: 34, scenario: 46 },
    { day: 16, baseline: 32, scenario: 44 },
    { day: 18, baseline: 31, scenario: 43 },
    { day: 20, baseline: 30, scenario: 42 },
  ],
  ttrBuckets: [
    { bucket: "<=24h", baseline: 6, scenario: 14 },
    { bucket: "2-3d", baseline: 18, scenario: 26 },
    { bucket: "4-5d", baseline: 34, scenario: 30 },
    { bucket: "6-7d", baseline: 24, scenario: 18 },
    { bucket: ">7d", baseline: 18, scenario: 12 },
  ],
};

const awardSites = [
  "Lyon 02",
  "Bayonne",
  "Rouen",
  "Seine Hub",
  "Dunkirk",
  "Nantes",
  "Paris 11",
  "Le Havre",
  "Toulouse",
  "Antwerp",
] as const;

const awardSkus = [
  "Relay-18",
  "Rotor-22",
  "Cryo-07",
  "Chassis-19",
  "Fiber-42",
  "Armature-16",
  "Parcel-03",
  "Valve-31",
  "Lift-21",
  "Bulk-05",
] as const;

const dutyVariants = [
  { hs: "8501.31", duty: 4.2, reclassRisk: "Low" },
  { hs: "7326.90", duty: 2.8, reclassRisk: "Moderate" },
  { hs: "8418.69", duty: 3.1, reclassRisk: "Low" },
  { hs: "7308.40", duty: 5.6, reclassRisk: "Elevated" },
] as const;

export const awards = Array.from({ length: 20 }, (_, idx) => {
  const site = awardSites[idx % awardSites.length];
  const sku = awardSkus[idx % awardSkus.length];
  const variant = dutyVariants[idx % dutyVariants.length];
  return {
    site,
    sku,
    primary: `${site} Prime`,
    backup: `${sku} Collective`,
    inclusiveBackup: idx % 3 !== 0,
    hs: variant.hs,
    duty: variant.duty,
    reclassRisk: variant.reclassRisk,
    costDelta: Number((-1.2 + (idx % 5) * 0.55 + Math.floor(idx / 5) * 0.25).toFixed(1)),
    tailDelta: Number((-3.8 + (idx % 4) * 0.9 + Math.floor(idx / 4) * 0.4).toFixed(1)),
  };
});

const regions = ["EU", "UK", "NA", "MEA"] as const;
const hhiBands = ["<0.5", "0.5-0.7", ">0.7"] as const;

export const suppliers = Array.from({ length: 50 }, (_, idx) => {
  const region = regions[idx % regions.length];
  const hhiBand = hhiBands[idx % hhiBands.length];
  const inclusive = idx % 2 === 0 || idx % 7 === 0;
  const base = 18 + (idx % 5) * 1.7 + Math.floor(idx / 10) * 0.9;
  return {
    name: `Supplier ${idx + 1}`,
    site: awardSites[idx % awardSites.length],
    sku: awardSkus[(idx + 3) % awardSkus.length],
    region,
    inclusive,
    hhiBand,
    p50: Number(base.toFixed(1)),
    p95: Number((base + 4.5).toFixed(1)),
    cvar95: Number((base + 7.2).toFixed(1)),
    capacity: 38 + (idx % 6) * 7,
    dutyExposure: Number((2.5 + (idx % 4) * 0.8).toFixed(1)),
    co2: Number((0.78 + (idx % 5) * 0.11).toFixed(2)),
  };
});
