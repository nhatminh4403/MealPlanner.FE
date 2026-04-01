"use client";

import React from "react";
import RecipeCard from "./RecipeCard";
import type { RecipeSummary, TrendingRecipe } from "@/libs/interfaceDTO";

interface RecipeSectionProps {
  title: string;
  icon: React.ReactNode;
  recipes: (RecipeSummary | TrendingRecipe)[];
  loading: boolean;
  emptyMessage: string;
  variant?: "default" | "trending" | "compact";
}

export default function RecipeSection({
  title,
  icon,
  recipes,
  loading,
  emptyMessage,
  variant = "default",
}: RecipeSectionProps) {
  return (
    <section className="mb-16 min-h-420px">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center justify-center">{icon}</div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div
        className={`transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} variant={variant} />
          ))}
          {!loading && recipes.length === 0 && (
            <p className="col-span-full text-zinc-500 dark:text-zinc-400 py-12 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
              {emptyMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
