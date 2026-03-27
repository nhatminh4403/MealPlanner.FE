import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealPlanEntry } from "@/libs/interfaceDTO";
import { Link, Plus, Trash2 } from "lucide-react";

const MEAL_SLOTS = [
  {
    type: 0,
    label: "Breakfast",
    filled:
      "bg-amber-100/80 dark:bg-amber-500/20 border-amber-200/60 dark:border-amber-500/30",
    text: "text-amber-700 dark:text-amber-400",
    badge:
      "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    label_color: "text-amber-600 dark:text-amber-500",
  },
  {
    type: 1,
    label: "Lunch",
    filled:
      "bg-teal-100/80 dark:bg-teal-500/20 border-teal-200/60 dark:border-teal-500/30",
    text: "text-teal-700 dark:text-teal-400",
    badge: "bg-teal-100 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400",
    label_color: "text-teal-600 dark:text-teal-500",
  },
  {
    type: 2,
    label: "Dinner",
    filled:
      "bg-rose-100/80 dark:bg-rose-500/20 border-rose-200/60 dark:border-rose-500/30",
    text: "text-rose-700 dark:text-rose-400",
    badge: "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
    label_color: "text-rose-600 dark:text-rose-500",
  },
  {
    type: 3,
    label: "Snack",
    filled:
      "bg-purple-100/80 dark:bg-purple-500/20 border-purple-200/60 dark:border-purple-500/30",
    text: "text-purple-700 dark:text-purple-400",
    badge:
      "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
    label_color: "text-purple-600 dark:text-purple-500",
  },
];

interface MealPlanDayCardProps {
  dayName: string;
  dayEntries: MealPlanEntry[];
  onDeleteEntry?: (entryId: string) => void;
}

export function MealPlanDayCard({
  dayName,
  dayEntries,
  onDeleteEntry,
}: MealPlanDayCardProps) {
  const getEntryForSlot = (mealType: number) =>
    dayEntries.find((e) => e.mealType === mealType);
  const filledCount = dayEntries.length;

  return (
    <Card
      className="border-none bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md shadow-xl rounded-3xl 
                overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all border
              border-zinc-100/50 dark:border-zinc-800/50 pt-0"
    >
      <div className="h-2 bg-emerald-500/80" />
      <CardHeader className="pb-4 pt-6">
        <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">
          {dayName}
        </CardTitle>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            {filledCount} / {MEAL_SLOTS.length} Meals
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-6 space-y-3">
        {MEAL_SLOTS.map((slot) => {
          const entry = getEntryForSlot(slot.type);

          if (entry) {
            const inner = (
              <div
                className={`group p-4 rounded-2xl border transition-all shadow-sm ${slot.filled}`}
              >
                <div className="flex items-stretch gap-0">
                  {" "}
                  {/* items-stretch so children fill full height */}
                  {/* Left: label + name */}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-[10px] uppercase tracking-widest font-black ${slot.label_color}`}
                    >
                      {slot.label}
                    </span>
                    <h4
                      className={`mt-1 font-bold line-clamp-2 leading-snug ${slot.text}`}
                    >
                      {entry.recipeName ?? entry.mealName}
                    </h4>
                  </div>
                  {/* Right: separator + centered trash */}
                  {onDeleteEntry && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onDeleteEntry(entry.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center self-stretch pl-3 ml-3 border-l border-current/20 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 shrink-0"
                      title="Remove meal"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            );

            return entry.recipeId ? (
              <Link key={slot.type} href={`/recipes/${entry.recipeId}`}>
                {inner}
              </Link>
            ) : (
              <div key={slot.type}>{inner}</div>
            );
          }

          // ── Empty slot — gradient hover from globals.css ──────────────────
          return (
            <button
              key={slot.type}
              className="relative w-full text-left p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/30 bg-zinc-50/40 dark:bg-zinc-800/20 group transition-all overflow-hidden"
            >
              {/* bg-active-gradient layer fades in on hover */}
              <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-active-gradient" />

              {/* gradient-border-persistent activates on hover */}
              <span className="gradient-border-persistent group-hover:active" />

              <span className="relative z-10 flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest font-black text-zinc-400 dark:text-zinc-500">
                  {slot.label}
                </span>
                <span className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-600 group-hover:text-primary transition-colors">
                  <Plus size={14} />
                  <span className="text-sm font-medium">Add meal</span>
                </span>
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
