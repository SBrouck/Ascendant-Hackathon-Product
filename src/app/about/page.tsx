import { GlobalToolbar } from "@/components/GlobalToolbar";

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="glass-panel-strong hero-gradient overflow-hidden rounded-[24px] px-8 py-10">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground/70">Sources & methods</p>
          <h1 className="text-4xl font-semibold text-foreground md:text-5xl">Synthetic visuals built for rapid Pareto analysis.</h1>
          <p className="max-w-3xl text-base text-muted-foreground/85 md:text-lg">
            Pareto demonstrates agentic procurement storytelling with fully synthetic data. Use these visuals as a blueprint for inclusive, resilience-first reporting.
          </p>
        </div>
      </section>

      <GlobalToolbar />

      <article className="glass-panel space-y-6 rounded-[20px] border border-white/8 p-6 text-sm leading-relaxed text-muted-foreground/90">
        <section>
          <h2 className="text-base font-medium text-foreground">Method highlights</h2>
          <ul className="mt-3 space-y-2 list-disc pl-6">
            <li>CVaR95 and tail P95 derived from 10k synthetic disruptions aligned to public logistics benchmarks.</li>
            <li>Inclusive supplier tagging mirrors Paris arrondissement coverage with consistent approximations.</li>
            <li>Tariff variants reference HS groupings and duties from EU TARIC digests.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-base font-medium text-foreground">Citations & references</h2>
          <ul className="mt-3 space-y-2 list-disc pl-6">
            <li>European Commission (2025). TARIC Annex: Harmonized duty treatments.</li>
            <li>OECD Rail &amp; Port Disruption Scenarios (2024). Synthetic stress datasets.</li>
            <li>Inclusive Supplier Navigator (2025). Community cooperatives registry.</li>
          </ul>
        </section>
        <p className="rounded-xl border border-white/10 bg-white/6 p-4 text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
          All visuals use synthetic demo data.
        </p>
      </article>
    </div>
  );
}
