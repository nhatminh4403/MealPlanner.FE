import React from "react";
import { CalendarDays } from "lucide-react";

interface MealPlanEmptyStateProps {
  onGenerate?: () => void;
}

export function MealPlanEmptyState({ onGenerate }: MealPlanEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-4xl bg-zinc-50/30 dark:bg-zinc-800/10 py-24 transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
      <div className="w-20 h-20 mb-6 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
        <CalendarDays size={40} />
      </div>
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
        Start Your Journey
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-8 leading-relaxed">
        Your meal plan is currently empty. Design your perfect week of eating
        with our auto-generator or by adding your favorite recipes.
      </p>
      <button
        onClick={onGenerate}
        className="px-8 py-3.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-xl dark:shadow-zinc-900/20"
      >
        Generate Weekly Plan
      </button>
    </div>
  );
}
