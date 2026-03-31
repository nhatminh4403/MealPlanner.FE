import React, { useState } from "react";
import { AutoGenerateMealPlanDto } from "@/libs/interfaceDTO";
import { X, Wand2, RefreshCw } from "lucide-react";
import { createPortal } from "react-dom";

export const AutoGenerateModal = ({
  isOpen,
  onClose,
  onGenerate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: AutoGenerateMealPlanDto) => Promise<void>;
}) => {
  const [preferences, setPreferences] = useState<AutoGenerateMealPlanDto>({
    cuisinePreferences: [],
    dietaryRestrictions: [],
    maxDifficulty: undefined,
    maxTotalTimeMinutes: undefined,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const cuisines = [
    "Italian",
    "Mexican",
    "Asian",
    "Indian",
    "American",
    "Mediterranean",
    "French",
  ];
  const diets = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Keto",
    "Paleo",
  ];

  const toggleSelection = (list: string[] | undefined, item: string) => {
    const current = list || [];
    if (current.includes(item)) {
      return current.filter((i) => i !== item);
    }
    return [...current, item];
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate(preferences);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
            <Wand2 className="text-indigo-500" size={28} />
            Auto Generate
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Cuisines */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Cuisine Preferences
            </label>
            <div className="flex flex-wrap gap-2">
              {cuisines.map((c) => (
                <button
                  key={c}
                  onClick={() =>
                    setPreferences((p) => ({
                      ...p,
                      cuisinePreferences: toggleSelection(
                        p.cuisinePreferences,
                        c,
                      ),
                    }))
                  }
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                    preferences.cuisinePreferences?.includes(c)
                      ? "bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                      : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Diets */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Dietary Restrictions
            </label>
            <div className="flex flex-wrap gap-2">
              {diets.map((d) => (
                <button
                  key={d}
                  onClick={() =>
                    setPreferences((p) => ({
                      ...p,
                      dietaryRestrictions: toggleSelection(
                        p.dietaryRestrictions,
                        d,
                      ),
                    }))
                  }
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                    preferences.dietaryRestrictions?.includes(d)
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500/50"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Max Difficulty
            </label>
            <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-2xl">
              {[
                { l: "Any", v: undefined },
                { l: "Easy", v: 0 },
                { l: "Medium", v: 1 },
                { l: "Hard", v: 2 },
              ].map((lvl) => (
                <button
                  key={lvl.l}
                  onClick={() =>
                    setPreferences((p) => ({ ...p, maxDifficulty: lvl.v }))
                  }
                  className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
                    preferences.maxDifficulty === lvl.v
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  {lvl.l}
                </button>
              ))}
            </div>
          </div>

          {/* Max Time */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex justify-between">
              <span>Max Time (Minutes)</span>
              <span className="text-indigo-500">
                {preferences.maxTotalTimeMinutes || "Any"}
              </span>
            </label>
            <input
              type="range"
              min="10"
              max="180"
              step="10"
              value={preferences.maxTotalTimeMinutes || 180}
              onChange={(e) =>
                setPreferences((p) => ({
                  ...p,
                  maxTotalTimeMinutes:
                    parseInt(e.target.value) === 180
                      ? undefined
                      : parseInt(e.target.value),
                }))
              }
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs font-bold text-zinc-400">
              <span>10m</span>
              <span>Any</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98] mt-2"
        >
          {isGenerating ? (
            <RefreshCw className="animate-spin" size={24} />
          ) : (
            <Wand2 size={24} />
          )}
          <span>
            {isGenerating ? "Generating Magic..." : "Generate Meal Plan"}
          </span>
        </button>
      </div>
    </div>,
    document.body,
  );
};
