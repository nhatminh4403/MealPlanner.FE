"use client";

import React, { useState, useEffect } from "react";
import { recipes as recipeApi, dashboard } from "@/libs/api";
import { isAuthenticated } from "@/libs/axios";
import HeroSection from "@/components/home/HeroSection";
import StatsStrip from "@/components/home/StatsStrip";
import FeatureHighlights from "@/components/home/FeatureHighlights";
import CTASection from "@/components/home/CTASection";
import RecipeSection from "@/components/recipes/base/RecipeSection";
import type {
  DashboardStats,
  RecipeSummary,
  TrendingRecipe,
} from "@/libs/interfaceDTO";
import { Star, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLocalization } from "@/libs/LocalizationProvider";

export default function Home() {
  const { L } = useLocalization();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [topRated, setTopRated] = useState<RecipeSummary[]>([]);
  const [topRatedLoading, setTopRatedLoading] = useState(true);
  const [trending, setTrending] = useState<TrendingRecipe[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  
  const authenticated = isAuthenticated();

  useEffect(() => {

    async function fetchAll() {
      const [statsResult, topRatedResult, trendingResult] =
        await Promise.allSettled([
          dashboard.getStats(),
          recipeApi.getTopRated(8),
          dashboard.getTrending(),
        ]);

      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value.data);
      }
      setStatsLoading(false);

      if (topRatedResult.status === "fulfilled") {
        setTopRated(topRatedResult.value.data.items ?? []);
      }
      setTopRatedLoading(false);

      if (trendingResult.status === "fulfilled") {
        setTrending(trendingResult.value.data.items ?? []);
      }
      setTrendingLoading(false);
    }

    fetchAll();
  }, []);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-24 pb-16 min-h-screen space-y-16">
      {/* 1. Hero Section */}
      <HeroSection isAuthenticated={authenticated} />

      {/* 2. Stats Strip */}
      <StatsStrip stats={stats} loading={statsLoading} />

      {/* 3. Feature Highlights */}
      <FeatureHighlights />

      {/* 4. Recipe Showcase — Top Rated */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Star
                className="w-4 h-4 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {L("MealPlannerAPI", "Recipes:TopRated")}
            </h2>
          </div>
          <Link
            href="/recipe"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded group"
          >
            {L("MealPlannerAPI", "Recipes:Browse")}
            <ArrowRight
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
        <RecipeSection
          title=""
          icon={<></>}
          recipes={topRated}
          loading={topRatedLoading}
          emptyMessage={L("MealPlannerAPI", "Recipes:NoTopRatedRecipes")}
        />
      </div>

      {/* 5. Recipe Showcase — Trending */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <TrendingUp
                className="w-4 h-4 text-emerald-500"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {L("MealPlannerAPI", "Recipes:Trending")}
            </h2>
          </div>
          <Link
            href="/recipe"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded group"
          >
            {L("MealPlannerAPI", "Recipes:Browse")}
            <ArrowRight
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
        <RecipeSection
          title=""
          icon={<></>}
          recipes={trending}
          loading={trendingLoading}
          emptyMessage={L("MealPlannerAPI", "Recipes:NoTrendingRecipes")}
          variant="trending"
        />
      </div>

      {/* 6. CTA Section — unauthenticated only */}
      {!authenticated && <CTASection />}
    </div>
  );
}
