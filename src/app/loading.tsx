import { TopActionsSkeleton } from "@/components/TopActions";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-[20px] border border-white/10 bg-panel/70 p-8 shadow-soft">
        <Skeleton className="h-6 w-48 bg-iris-500/15" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-2xl bg-iris-700/15" />
          ))}
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Skeleton className="h-[360px] rounded-[20px] bg-iris-700/15" />
        <TopActionsSkeleton />
      </section>
    </div>
  );
}
