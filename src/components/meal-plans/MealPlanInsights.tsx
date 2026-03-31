import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MealPlan } from "@/libs/interfaceDTO";

interface MealPlanInsightsProps {
  userMealPlans: MealPlan | null;
}

const MEAL_TYPE_LABELS: Record<number, string> = {
  0: "Breakfast",
  1: "Lunch",
  2: "Dinner",
  3: "Snack",
};

export function MealPlanInsights({ userMealPlans }: MealPlanInsightsProps) {
  // Safe access to days and meals
  const days = userMealPlans?.days ?? [];
  const allMeals = days.flatMap((d) => d.meals);

  // ── Core counts ──────────────────────────────────────────────────────────
  const totalSlots = 7 * 3; // 7 days × 3 default meal types (B/L/D)
  const filledSlots = allMeals.length;
  const completionPct = Math.round((filledSlots / totalSlots) * 100);

  const uniqueRecipes = new Set(allMeals.map((e) => e.recipeId).filter(Boolean))
    .size;

  const daysWithAtLeastOneMeal = days.filter((d) => d.meals.length > 0).length;

  // ── Breakdown by meal type ────────────────────────────────────────────────
  const byType = allMeals.reduce<Record<number, number>>((acc, e) => {
    acc[e.mealType] = (acc[e.mealType] ?? 0) + 1;
    return acc;
  }, {});

  const mostFrequentType = Object.entries(byType).sort(
    ([, a], [, b]) => b - a,
  )[0];

  // ── Plan status ───────────────────────────────────────────────────────────
  const planStatus =
    completionPct === 100
      ? "Complete ✓"
      : completionPct >= 50
        ? "In Progress"
        : "Just Started";

  // ── Week label ────────────────────────────────────────────────────────────
  const weekLabel = userMealPlans?.weekStartDate
    ? new Date(userMealPlans.weekStartDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "This Week";

  const stats = [
    {
      label: "Total Meals Planned",
      value: `${filledSlots} / ${totalSlots}`,
      sub: `${completionPct}% of the week filled`,
    },
    {
      label: "Unique Recipes",
      value: uniqueRecipes.toString(),
      sub:
        uniqueRecipes === filledSlots
          ? "All different!"
          : `across ${filledSlots} meals`,
    },
    {
      label: "Active Days",
      value: `${daysWithAtLeastOneMeal} / 7`,
      sub:
        daysWithAtLeastOneMeal === 7 ? "Full week covered" : "days have meals",
    },
    {
      label: "Most Planned",
      value: mostFrequentType
        ? MEAL_TYPE_LABELS[Number(mostFrequentType[0])]
        : "None",
      sub: mostFrequentType ? `${mostFrequentType[1]} entries` : "",
    },
    {
      label: "Completion",
      value: `${completionPct}%`,
      sub: planStatus,
    },
    {
      label: "Plan Status",
      value: planStatus,
      sub: `Week of ${weekLabel}`,
    },
  ];

  return (
    <Card className="mt-12 border pt-0 mb-5 border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] overflow-hidden transition-all duration-300">
      <CardHeader className="relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 to-teal-600 opacity-50" />
        <CardTitle className="text-2xl  mt-5 font-black text-zinc-900 dark:text-white tracking-tight">
          Plan Insights
        </CardTitle>
        <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium">
          Computed from your {filledSlots} planned meals this week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Completion bar */}
        <div className="mb-10 bg-zinc-100/50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-700/50">
          <div className="flex justify-between text-sm font-bold text-zinc-600 dark:text-zinc-300 mb-3">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Weekly Completion
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {completionPct}%
            </span>
          </div>
          <div className="w-full h-4 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-linear-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group bg-white/60 dark:bg-zinc-800/40 backdrop-blur-md rounded-2xl p-5 border border-zinc-200/50 dark:border-zinc-700/50 hover:border-emerald-500/30 transition-all shadow-sm"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2 group-hover:text-emerald-500 transition-colors">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100 leading-tight">
                {stat.value}
              </p>
              {stat.sub && (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  {stat.sub}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Meal type breakdown */}
        <div className="mt-8 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-3xl p-6 border border-zinc-100/50 dark:border-zinc-800/50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">
            Distribution by Category
          </p>
          <div className="space-y-4">
            {Object.entries(byType)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([type, count]) => (
                <div key={type} className="flex items-center gap-4 group">
                  <span className="text-xs font-bold w-20 shrink-0 text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-500 transition-colors">
                    {MEAL_TYPE_LABELS[Number(type)]}
                  </span>
                  <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500/60 dark:bg-emerald-400/40 rounded-full transition-all duration-700 group-hover:bg-emerald-500"
                      style={{ width: `${Math.round((count / 7) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-black w-8 text-right text-zinc-400 dark:text-zinc-500">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
