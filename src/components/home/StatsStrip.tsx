"use client";

import { ChefHat, Users, Star, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalization } from "@/libs/LocalizationProvider";
import type { DashboardStats } from "@/libs/interfaceDTO";

export interface StatsStripProps {
  stats: DashboardStats | null;
  loading: boolean;
}

interface StatItem {
  key: keyof Pick<
    DashboardStats,
    "totalRecipes" | "totalFollowers" | "averageRating"
  >;
  labelKey: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  suffix?: string;
  trendKey?: string;
}

const STAT_ITEMS: StatItem[] = [
  {
    key: "totalRecipes",
    labelKey: "Recipes:TotalCount",
    icon: ChefHat,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 dark:bg-emerald-500/15",
    trendKey: "Home:StatsTrendRecipes",
  },
  {
    key: "totalFollowers",
    labelKey: "Dashboard:Overview",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 dark:bg-blue-500/15",
    trendKey: "Home:StatsTrendFollowers",
  },
  {
    key: "averageRating",
    labelKey: "Recipes:Rating",
    icon: Star,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 dark:bg-amber-500/15",
    suffix: "/ 5",
    trendKey: "Home:StatsTrendRating",
  },
];

function formatValue(
  key: StatItem["key"],
  stats: DashboardStats | null,
): string {
  if (stats === null) return "—";
  const raw = stats[key];
  if (key === "averageRating") return (raw as number).toFixed(1);
  if (typeof raw === "number" && raw >= 1000)
    return `${(raw / 1000).toFixed(1)}k`;
  return String(raw);
}

export default function StatsStrip({ stats, loading }: StatsStripProps) {
  const { L } = useLocalization();

  return (
    <section aria-label={L("MealPlannerAPI", "Dashboard:Overview")}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STAT_ITEMS.map((item, index) => {
          const Icon = item.icon;

          if (loading) {
            return (
              <div
                key={item.key}
                className="rounded-2xl border border-border bg-card p-6 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            );
          }

          return (
            <div
              key={item.key}
              className="animate-fade-in-up group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-brand-glow transition-all duration-300"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Subtle background icon */}
              <div
                className="pointer-events-none absolute -right-4 -bottom-4 opacity-[0.04] dark:opacity-[0.06]"
                aria-hidden="true"
              >
                <Icon className="w-28 h-28" />
              </div>

              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${item.bgColor}`}
                    aria-hidden="true"
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  {item.trendKey && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="w-2.5 h-2.5" aria-hidden="true" />
                      {L("MealPlannerAPI", item.trendKey)}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                    {formatValue(item.key, stats)}
                    {item.suffix && (
                      <span className="ml-1 text-base font-normal text-muted-foreground">
                        {item.suffix}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {L("MealPlannerAPI", item.labelKey)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
