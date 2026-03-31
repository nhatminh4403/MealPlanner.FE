import React from "react";
import { RefreshCw, Plus, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

export default function MealPlanDetailsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-24 pb-12">
      <div className="mb-8">
        <Link
          href="/meal-plans"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-500 transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Meal Plans
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Meal Plan Details
            </h1>
            <p className="mt-2 text-zinc-500">
              View and manage this plan&apos;s entries.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md active:scale-[0.98]">
            <Plus size={18} />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Glassmorphism Container */}
      <div className="relative bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 shadow-xl">
        <div className="absolute inset-0 bg-linear-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent rounded-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Plan Entries
            </h2>
            <button className="p-2 text-zinc-400 hover:text-emerald-500 transition-colors rounded-lg bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
              <RefreshCw size={18} />
            </button>
          </div>

          {/* TODO Section for API & Items */}
          <div className="space-y-4">
            {/* Example Empty State / Todo Container */}
            <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/20 py-16 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
              <div className="w-16 h-16 mb-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Calendar size={32} />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
                No Entries Here
              </h3>
              <p className="text-sm text-zinc-500 max-w-sm mb-6">
                TODO: Fetch meal plan details using `params.id`.
                <br />
                Map over entries and render daily schedules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
