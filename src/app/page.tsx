"use client";

import React, { useState, useEffect } from "react";
import { recipes as recipeApi } from "@/libs/api";
import { dashboard } from "@/libs/api";
import RecipeSection from "../components/recipes/base/RecipeSection";
import type { RecipeSummary, TrendingRecipe } from "@/libs/interfaceDTO";
import { Star, TrendingUp } from "lucide-react";
import { useLocalization } from "@/libs/localization";

export default function Home() {
  const { L } = useLocalization();
  const [topRated, setTopRated] = useState<RecipeSummary[]>([]);
  const [trending, setTrending] = useState<TrendingRecipe[]>([]);
  const [loading, setLoading] = useState({ topRated: true, trending: true });

  useEffect(() => {
    async function fetchTopRated() {
      try {
        const res = await recipeApi.getTopRated(8);
        setTopRated(res.data.items ?? []);
      } catch {
        setTopRated([]);
      } finally {
        setLoading((p) => ({ ...p, topRated: false }));
      }
    }
    fetchTopRated();
  }, []);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await dashboard.getTrending();
        setTrending(res.data.items ?? []);
      } catch {
        setTrending([]);
      } finally {
        setLoading((p) => ({ ...p, trending: false }));
      }
    }
    fetchTrending();
  }, []);

  return (
    <div className="w-full max-w-1600px mx-auto px-4 sm:px-6 pt-24 pb-16 min-h-screen animate-page-in">
      {/* Hero Welcome */}
      <div className="mb-12 rounded-2xl border border-zinc-200 bg-linear-to-b from-white to-zinc-50/50 p-8 shadow-sm dark:border-zinc-800 dark:from-zinc-900/50 dark:to-zinc-950/50">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {L("MealPlannerAPI", "WelcomeToMealPlanner")}
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          {L("MealPlannerAPI", "AppIntroduction")}
        </p>
      </div>

      <RecipeSection
        title={L("MealPlannerAPI", "TopRated")}
        icon={<Star className="w-5 h-5 fill-amber-400 text-amber-400" />}
        recipes={topRated}
        loading={loading.topRated}
        emptyMessage={L("MealPlannerAPI", "NoTopRatedRecipes")}
      />

      <RecipeSection
        title={L("MealPlannerAPI", "Trending")}
        icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        recipes={trending}
        loading={loading.trending}
        emptyMessage={L("MealPlannerAPI", "NoTrendingRecipes")}
        variant="trending"
      />
    </div>
  );
}
