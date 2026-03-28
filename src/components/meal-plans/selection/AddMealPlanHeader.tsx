"use client";
import React from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddMealPlanHeaderProps {
  dayName: string;
  mealTypeLabel: string;
  colors: { accent: string; pill: string };
}

export default function AddMealPlanHeader({
  dayName,
  mealTypeLabel,
  colors,
}: AddMealPlanHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-8">
        {/* Top title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-5">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all duration-300 group w-fit hover:-translate-x-1"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span className="text-xs font-bold uppercase tracking-widest">
                Back to Schedule
              </span>
            </button>

            <div className="space-y-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 
            rounded-full border text-xs font-black uppercase tracking-widest ${colors.pill}`}
              >
                <Sparkles size={11} />
                {mealTypeLabel}
              </span>

              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
                Add to{" "}
                <span
                  className={`${colors.accent} transition-colors duration-1000`}
                >
                  {dayName}
                </span>
              </h1>

              <p className="text-zinc-500 text-lg max-w-xl leading-relaxed">
                Pick a recipe for your {mealTypeLabel.toLowerCase()} slot
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
